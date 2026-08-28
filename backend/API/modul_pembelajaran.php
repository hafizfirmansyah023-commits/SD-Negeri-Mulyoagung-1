<?php
require_once '../config/koneksi.php';
require_once 'foto_helper.php';

header("Content-Type: application/json");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

// Ensure table exists
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS `modul_pembelajaran` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `judul` VARCHAR(255) NOT NULL,
        `deskripsi` TEXT NULL,
        `mata_pelajaran` VARCHAR(100) NOT NULL,
        `kelas` VARCHAR(50) NOT NULL,
        `semester` VARCHAR(20) NOT NULL,
        `tahun_ajaran` VARCHAR(20) NOT NULL,
        `kategori` VARCHAR(100) NOT NULL,
        `sumber_tipe` ENUM('upload', 'gdrive') NOT NULL,
        `file_pdf` VARCHAR(255) NULL,
        `link_gdrive` TEXT NULL,
        `foto_cover` VARCHAR(255) NULL,
        `foto_cover_crop` VARCHAR(255) NULL,
        `status` ENUM('Draft', 'Published') DEFAULT 'Published',
        `status_verifikasi` ENUM('Pending', 'Verified', 'Rejected') DEFAULT 'Verified',
        `uploaded_by` INT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;");

    // Ensure columns exist if table was previously created
    foto_ensure_column($conn, 'modul_pembelajaran', 'foto_cover', 'foto_cover_crop');
} catch (PDOException $e) {
    // Continue
}

$upload_cover_dir = '../uploads/modul/cover/';
$upload_pdf_dir = '../uploads/modul/pdf/';

if (!file_exists($upload_cover_dir)) {
    mkdir($upload_cover_dir, 0777, true);
}
if (!file_exists($upload_pdf_dir)) {
    mkdir($upload_pdf_dir, 0777, true);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $status_filter = isset($_GET['status']) ? $_GET['status'] : 'verified_only';

    try {
        if ($status_filter === 'all') {
            $stmt = $conn->query("SELECT m.*, u.nama_penanggung_jawab as uploader, u.role as uploader_role FROM modul_pembelajaran m LEFT JOIN users u ON m.uploaded_by = u.id ORDER BY m.id DESC");
        } else {
            $stmt = $conn->query("SELECT m.*, u.nama_penanggung_jawab as uploader, u.role as uploader_role FROM modul_pembelajaran m LEFT JOIN users u ON m.uploaded_by = u.id WHERE m.status_verifikasi = 'Verified' AND m.status = 'Published' ORDER BY m.id DESC");
        }
        $modules = $stmt->fetchAll();

        foreach ($modules as &$mod) {
            $mod['foto'] = !empty($mod['foto_cover_crop']) ? $mod['foto_cover_crop'] : $mod['foto_cover'];
            $mod['foto_original'] = $mod['foto_cover'];
        }

        echo json_encode(["status" => "success", "data" => $modules]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} 
elseif ($method === 'POST') {
    $action = isset($_POST['action']) ? $_POST['action'] : '';

    if ($action === 'create') {
        $judul = isset($_POST['judul']) ? trim($_POST['judul']) : '';
        $deskripsi = isset($_POST['deskripsi']) ? trim($_POST['deskripsi']) : '';
        $mata_pelajaran = isset($_POST['mata_pelajaran']) ? trim($_POST['mata_pelajaran']) : '';
        $kelas = isset($_POST['kelas']) ? trim($_POST['kelas']) : '';
        $semester = isset($_POST['semester']) ? trim($_POST['semester']) : '';
        $tahun_ajaran = isset($_POST['tahun_ajaran']) ? trim($_POST['tahun_ajaran']) : '';
        $kategori = isset($_POST['kategori']) ? trim($_POST['kategori']) : '';
        $sumber_tipe = isset($_POST['sumber_tipe']) ? trim($_POST['sumber_tipe']) : 'upload';
        $link_gdrive = isset($_POST['link_gdrive']) ? trim($_POST['link_gdrive']) : '';
        $status = isset($_POST['status']) ? trim($_POST['status']) : 'Published';
        $uploaded_by = (isset($_POST['uploaded_by']) && intval($_POST['uploaded_by']) > 0) ? intval($_POST['uploaded_by']) : null;
        $role = isset($_POST['role']) ? trim($_POST['role']) : 'GURU';

        if (empty($judul) || empty($mata_pelajaran) || empty($kelas) || empty($semester) || empty($tahun_ajaran) || empty($kategori)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Harap lengkapi semua field wajib modul."]);
            exit();
        }

        // Sumber validation
        $file_pdf_path = null;
        if ($sumber_tipe === 'upload') {
            if (!isset($_FILES['file_pdf']) || $_FILES['file_pdf']['error'] !== UPLOAD_ERR_OK) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "File PDF materi wajib diunggah untuk sumber upload."]);
                exit();
            }
            
            $file_info = pathinfo($_FILES['file_pdf']['name']);
            $ext = strtolower($file_info['extension'] ?? '');
            if ($ext !== 'pdf') {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Format file wajib berupa PDF."]);
                exit();
            }

            $pdf_name = 'modul_' . time() . '_' . bin2hex(random_bytes(4)) . '.pdf';
            if (move_uploaded_file($_FILES['file_pdf']['tmp_name'], $upload_pdf_dir . $pdf_name)) {
                $file_pdf_path = 'backend/uploads/modul/pdf/' . $pdf_name;
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Gagal menyimpan file PDF."]);
                exit();
            }
            $link_gdrive = null;
        } elseif ($sumber_tipe === 'gdrive') {
            if (empty($link_gdrive)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Link Google Drive wajib diisi untuk sumber Google Drive."]);
                exit();
            }
            $file_pdf_path = null;
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Pilihan sumber materi tidak valid."]);
            exit();
        }

        // Handle Cover Image
        [$foto_cover_path, $foto_cover_crop_path] = foto_handle_create($upload_cover_dir, 'backend/uploads/modul/cover/');

        // Verification status (Admin -> Verified, Guru / TIM -> Pending)
        $status_verifikasi = ($role === 'ADMIN') ? 'Verified' : 'Pending';

        try {
            $stmt = $conn->prepare("INSERT INTO modul_pembelajaran (judul, deskripsi, mata_pelajaran, kelas, semester, tahun_ajaran, kategori, sumber_tipe, file_pdf, link_gdrive, foto_cover, foto_cover_crop, status, status_verifikasi, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $judul, $deskripsi, $mata_pelajaran, $kelas, $semester, $tahun_ajaran, $kategori,
                $sumber_tipe, $file_pdf_path, $link_gdrive, $foto_cover_path, $foto_cover_crop_path,
                $status, $status_verifikasi, $uploaded_by
            ]);
            echo json_encode([
                "status" => "success",
                "message" => "Modul pembelajaran berhasil ditambahkan" . ($status_verifikasi === 'Pending' ? " dan menunggu verifikasi admin." : ".")
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }
    elseif ($action === 'update') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $judul = isset($_POST['judul']) ? trim($_POST['judul']) : '';
        $deskripsi = isset($_POST['deskripsi']) ? trim($_POST['deskripsi']) : '';
        $mata_pelajaran = isset($_POST['mata_pelajaran']) ? trim($_POST['mata_pelajaran']) : '';
        $kelas = isset($_POST['kelas']) ? trim($_POST['kelas']) : '';
        $semester = isset($_POST['semester']) ? trim($_POST['semester']) : '';
        $tahun_ajaran = isset($_POST['tahun_ajaran']) ? trim($_POST['tahun_ajaran']) : '';
        $kategori = isset($_POST['kategori']) ? trim($_POST['kategori']) : '';
        $sumber_tipe = isset($_POST['sumber_tipe']) ? trim($_POST['sumber_tipe']) : 'upload';
        $link_gdrive = isset($_POST['link_gdrive']) ? trim($_POST['link_gdrive']) : '';
        $status = isset($_POST['status']) ? trim($_POST['status']) : 'Published';
        $role = isset($_POST['role']) ? trim($_POST['role']) : 'GURU';

        if ($id === 0 || empty($judul) || empty($mata_pelajaran) || empty($kelas) || empty($semester) || empty($tahun_ajaran) || empty($kategori)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Data tidak lengkap untuk pembaruan modul."]);
            exit();
        }

        $stmt = $conn->prepare("SELECT * FROM modul_pembelajaran WHERE id = ?");
        $stmt->execute([$id]);
        $module = $stmt->fetch();
        if (!$module) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Modul pembelajaran tidak ditemukan."]);
            exit();
        }

        $file_pdf_path = $module['file_pdf'];
        if ($sumber_tipe === 'upload') {
            if (isset($_FILES['file_pdf']) && $_FILES['file_pdf']['error'] === UPLOAD_ERR_OK) {
                // Delete old PDF if exists
                if (!empty($module['file_pdf']) && file_exists('../' . str_replace('backend/', '', $module['file_pdf']))) {
                    unlink('../' . str_replace('backend/', '', $module['file_pdf']));
                }
                $pdf_name = 'modul_' . time() . '_' . bin2hex(random_bytes(4)) . '.pdf';
                if (move_uploaded_file($_FILES['file_pdf']['tmp_name'], $upload_pdf_dir . $pdf_name)) {
                    $file_pdf_path = 'backend/uploads/modul/pdf/' . $pdf_name;
                }
            }
            if (empty($file_pdf_path)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "File PDF wajib diunggah untuk sumber upload."]);
                exit();
            }
            $link_gdrive = null;
        } elseif ($sumber_tipe === 'gdrive') {
            if (empty($link_gdrive)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Link Google Drive wajib diisi untuk sumber Google Drive."]);
                exit();
            }
            // Delete old PDF if switching to gdrive
            if (!empty($module['file_pdf']) && file_exists('../' . str_replace('backend/', '', $module['file_pdf']))) {
                unlink('../' . str_replace('backend/', '', $module['file_pdf']));
            }
            $file_pdf_path = null;
        }

        // Handle cover photo update
        [$foto_cover_path, $foto_cover_crop_path] = foto_handle_update(
            $upload_cover_dir,
            'backend/uploads/modul/cover/',
            $module['foto_cover'],
            $module['foto_cover_crop'] ?? ''
        );

        // If updated by GURU / TIM, reset status to Pending
        $status_verifikasi = ($role === 'ADMIN') ? $module['status_verifikasi'] : 'Pending';

        try {
            $stmt = $conn->prepare("UPDATE modul_pembelajaran SET judul = ?, deskripsi = ?, mata_pelajaran = ?, kelas = ?, semester = ?, tahun_ajaran = ?, kategori = ?, sumber_tipe = ?, file_pdf = ?, link_gdrive = ?, foto_cover = ?, foto_cover_crop = ?, status = ?, status_verifikasi = ? WHERE id = ?");
            $stmt->execute([
                $judul, $deskripsi, $mata_pelajaran, $kelas, $semester, $tahun_ajaran, $kategori,
                $sumber_tipe, $file_pdf_path, $link_gdrive, $foto_cover_path, $foto_cover_crop_path,
                $status, $status_verifikasi, $id
            ]);
            echo json_encode([
                "status" => "success",
                "message" => "Modul pembelajaran berhasil diperbarui" . ($status_verifikasi === 'Pending' ? " dan menunggu verifikasi admin." : ".")
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }
    elseif ($action === 'delete') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;

        if ($id === 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID modul tidak valid."]);
            exit();
        }

        try {
            $stmt = $conn->prepare("SELECT file_pdf, foto_cover, foto_cover_crop FROM modul_pembelajaran WHERE id = ?");
            $stmt->execute([$id]);
            $mod = $stmt->fetch();
            if ($mod) {
                if (!empty($mod['file_pdf']) && file_exists('../' . str_replace('backend/', '', $mod['file_pdf']))) {
                    unlink('../' . str_replace('backend/', '', $mod['file_pdf']));
                }
                foto_unlink($mod['foto_cover']);
                foto_unlink($mod['foto_cover_crop'] ?? '');
            }

            $stmt = $conn->prepare("DELETE FROM modul_pembelajaran WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "success", "message" => "Modul pembelajaran berhasil dihapus."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }
    elseif ($action === 'verify') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $status_verifikasi = isset($_POST['status_verifikasi']) ? trim($_POST['status_verifikasi']) : '';

        if ($id === 0 || !in_array($status_verifikasi, ['Verified', 'Rejected'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Input verifikasi tidak valid."]);
            exit();
        }

        try {
            $stmt = $conn->prepare("UPDATE modul_pembelajaran SET status_verifikasi = ? WHERE id = ?");
            $stmt->execute([$status_verifikasi, $id]);
            echo json_encode(["status" => "success", "message" => "Status verifikasi modul berhasil diperbarui menjadi $status_verifikasi."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Aksi tidak dikenal."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Metode request tidak diizinkan."]);
}
?>
