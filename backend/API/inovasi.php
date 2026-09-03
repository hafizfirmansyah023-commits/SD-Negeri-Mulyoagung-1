<?php
require_once '../config/koneksi.php';
require_once 'foto_helper.php';

header("Content-Type: application/json");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

// Ensure table exists
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS `inovasi` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `judul` VARCHAR(255) NOT NULL,
        `kategori` VARCHAR(100) NOT NULL,
        `inovator` VARCHAR(150) NULL,
        `deskripsi` TEXT NULL,
        `link_drive` TEXT NOT NULL,
        `foto_cover` VARCHAR(255) NULL,
        `foto_cover_crop` VARCHAR(255) NULL,
        `status` ENUM('Draft', 'Published') DEFAULT 'Published',
        `status_verifikasi` ENUM('Pending', 'Verified', 'Rejected') DEFAULT 'Verified',
        `uploaded_by` INT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;");

    // Ensure columns exist if table was previously created
    foto_ensure_column($conn, 'inovasi', 'foto_cover', 'foto_cover_crop');
} catch (PDOException $e) {
    // Continue
}

$upload_cover_dir = '../uploads/inovasi/cover/';

if (!file_exists($upload_cover_dir)) {
    mkdir($upload_cover_dir, 0777, true);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $status_filter = isset($_GET['status']) ? $_GET['status'] : 'verified_only';
    $single_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    try {
        if ($single_id > 0) {
            $stmt = $conn->prepare("SELECT i.*, u.nama_penanggung_jawab as uploader, u.role as uploader_role FROM inovasi i LEFT JOIN users u ON i.uploaded_by = u.id WHERE i.id = ? LIMIT 1");
            $stmt->execute([$single_id]);
            $item = $stmt->fetch();
            if ($item) {
                $item['foto'] = !empty($item['foto_cover_crop']) ? $item['foto_cover_crop'] : $item['foto_cover'];
                $item['foto_original'] = $item['foto_cover'];
                echo json_encode(["status" => "success", "data" => $item]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Inovasi tidak ditemukan."]);
            }
            exit();
        }

        if ($status_filter === 'all') {
            $stmt = $conn->query("SELECT i.*, u.nama_penanggung_jawab as uploader, u.role as uploader_role FROM inovasi i LEFT JOIN users u ON i.uploaded_by = u.id ORDER BY i.id DESC");
        } else {
            $stmt = $conn->query("SELECT i.*, u.nama_penanggung_jawab as uploader, u.role as uploader_role FROM inovasi i LEFT JOIN users u ON i.uploaded_by = u.id WHERE i.status_verifikasi = 'Verified' AND i.status = 'Published' ORDER BY i.id DESC");
        }
        $items = $stmt->fetchAll();

        foreach ($items as &$item) {
            $item['foto'] = !empty($item['foto_cover_crop']) ? $item['foto_cover_crop'] : $item['foto_cover'];
            $item['foto_original'] = $item['foto_cover'];
        }

        echo json_encode(["status" => "success", "data" => $items]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} 
elseif ($method === 'POST') {
    $action = isset($_POST['action']) ? $_POST['action'] : '';

    if ($action === 'create') {
        $judul = isset($_POST['judul']) ? trim($_POST['judul']) : '';
        $kategori = isset($_POST['kategori']) ? trim($_POST['kategori']) : '';
        $inovator = isset($_POST['inovator']) ? trim($_POST['inovator']) : null;
        $deskripsi = isset($_POST['deskripsi']) ? trim($_POST['deskripsi']) : null;
        $link_drive = isset($_POST['link_drive']) ? trim($_POST['link_drive']) : '';
        $status = isset($_POST['status']) && in_array(trim($_POST['status']), ['Draft', 'Published']) ? trim($_POST['status']) : 'Published';
        $uploaded_by = (isset($_POST['uploaded_by']) && intval($_POST['uploaded_by']) > 0) ? intval($_POST['uploaded_by']) : null;
        $role = isset($_POST['role']) ? trim($_POST['role']) : 'ADMIN';

        if (empty($judul) || empty($kategori) || empty($link_drive)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Harap lengkapi judul, kategori, dan link Google Drive inovasi."]);
            exit();
        }

        // Handle Cover Image
        [$foto_cover_path, $foto_cover_crop_path] = foto_handle_create($upload_cover_dir, 'backend/uploads/inovasi/cover/');

        // Verification status (Admin -> Verified, Non-Admin -> Pending)
        $status_verifikasi = ($role === 'ADMIN') ? 'Verified' : 'Pending';

        try {
            $stmt = $conn->prepare("INSERT INTO inovasi (judul, kategori, inovator, deskripsi, link_drive, foto_cover, foto_cover_crop, status, status_verifikasi, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $judul, $kategori, $inovator, $deskripsi, $link_drive,
                $foto_cover_path, $foto_cover_crop_path, $status, $status_verifikasi, $uploaded_by
            ]);
            echo json_encode([
                "status" => "success",
                "message" => "Inovasi berhasil ditambahkan" . ($status_verifikasi === 'Pending' ? " dan menunggu verifikasi admin." : ".")
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }
    elseif ($action === 'update') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $judul = isset($_POST['judul']) ? trim($_POST['judul']) : '';
        $kategori = isset($_POST['kategori']) ? trim($_POST['kategori']) : '';
        $inovator = isset($_POST['inovator']) ? trim($_POST['inovator']) : null;
        $deskripsi = isset($_POST['deskripsi']) ? trim($_POST['deskripsi']) : null;
        $link_drive = isset($_POST['link_drive']) ? trim($_POST['link_drive']) : '';
        $status = isset($_POST['status']) && in_array(trim($_POST['status']), ['Draft', 'Published']) ? trim($_POST['status']) : 'Published';
        $user_id = (isset($_POST['user_id']) && intval($_POST['user_id']) > 0) ? intval($_POST['user_id']) : ((isset($_POST['uploaded_by']) && intval($_POST['uploaded_by']) > 0) ? intval($_POST['uploaded_by']) : 0);
        $role = isset($_POST['role']) ? trim($_POST['role']) : 'ADMIN';

        if ($id === 0 || empty($judul) || empty($kategori) || empty($link_drive)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Data tidak lengkap untuk pembaruan inovasi."]);
            exit();
        }

        $stmt = $conn->prepare("SELECT * FROM inovasi WHERE id = ?");
        $stmt->execute([$id]);
        $item = $stmt->fetch();
        if (!$item) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Inovasi tidak ditemukan."]);
            exit();
        }

        // Ownership enforcement for non-admin
        if ($role !== 'ADMIN') {
            if ($item['uploaded_by'] && intval($item['uploaded_by']) !== $user_id) {
                http_response_code(403);
                echo json_encode(["status" => "error", "message" => "Anda tidak memiliki izin untuk mengedit inovasi ini."]);
                exit();
            }
        }

        // Handle cover photo update
        [$foto_cover_path, $foto_cover_crop_path] = foto_handle_update(
            $upload_cover_dir,
            'backend/uploads/inovasi/cover/',
            $item['foto_cover'],
            $item['foto_cover_crop'] ?? ''
        );

        $status_verifikasi = ($role === 'ADMIN') ? $item['status_verifikasi'] : 'Pending';

        try {
            $stmt = $conn->prepare("UPDATE inovasi SET judul = ?, kategori = ?, inovator = ?, deskripsi = ?, link_drive = ?, foto_cover = ?, foto_cover_crop = ?, status = ?, status_verifikasi = ? WHERE id = ?");
            $stmt->execute([
                $judul, $kategori, $inovator, $deskripsi, $link_drive,
                $foto_cover_path, $foto_cover_crop_path, $status, $status_verifikasi, $id
            ]);
            echo json_encode([
                "status" => "success",
                "message" => "Inovasi berhasil diperbarui" . ($status_verifikasi === 'Pending' ? " dan memerlukan verifikasi ulang oleh admin." : ".")
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }
    elseif ($action === 'delete') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $user_id = (isset($_POST['user_id']) && intval($_POST['user_id']) > 0) ? intval($_POST['user_id']) : ((isset($_POST['uploaded_by']) && intval($_POST['uploaded_by']) > 0) ? intval($_POST['uploaded_by']) : 0);
        $role = isset($_POST['role']) ? trim($_POST['role']) : 'ADMIN';

        if ($id === 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID inovasi tidak valid."]);
            exit();
        }

        try {
            $stmt = $conn->prepare("SELECT foto_cover, foto_cover_crop, uploaded_by FROM inovasi WHERE id = ?");
            $stmt->execute([$id]);
            $item = $stmt->fetch();

            if (!$item) {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Inovasi tidak ditemukan."]);
                exit();
            }

            if ($role !== 'ADMIN') {
                if ($item['uploaded_by'] && intval($item['uploaded_by']) !== $user_id) {
                    http_response_code(403);
                    echo json_encode(["status" => "error", "message" => "Anda tidak memiliki izin untuk menghapus inovasi ini."]);
                    exit();
                }
            }

            foto_unlink($item['foto_cover']);
            foto_unlink($item['foto_cover_crop'] ?? '');

            $stmt = $conn->prepare("DELETE FROM inovasi WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "success", "message" => "Inovasi berhasil dihapus."]);
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
            $stmt = $conn->prepare("UPDATE inovasi SET status_verifikasi = ? WHERE id = ?");
            $stmt->execute([$status_verifikasi, $id]);
            echo json_encode(["status" => "success", "message" => "Status verifikasi inovasi berhasil diperbarui menjadi $status_verifikasi."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }
    elseif ($action === 'toggle_status') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $status = isset($_POST['status']) && in_array(trim($_POST['status']), ['Draft', 'Published']) ? trim($_POST['status']) : 'Published';
        $user_id = (isset($_POST['user_id']) && intval($_POST['user_id']) > 0) ? intval($_POST['user_id']) : ((isset($_POST['uploaded_by']) && intval($_POST['uploaded_by']) > 0) ? intval($_POST['uploaded_by']) : 0);
        $role = isset($_POST['role']) ? trim($_POST['role']) : 'ADMIN';

        if ($id === 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID inovasi tidak valid."]);
            exit();
        }

        try {
            $stmt = $conn->prepare("SELECT uploaded_by FROM inovasi WHERE id = ?");
            $stmt->execute([$id]);
            $item = $stmt->fetch();

            if (!$item) {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Inovasi tidak ditemukan."]);
                exit();
            }

            if ($role !== 'ADMIN') {
                if ($item['uploaded_by'] && intval($item['uploaded_by']) !== $user_id) {
                    http_response_code(403);
                    echo json_encode(["status" => "error", "message" => "Anda tidak memiliki izin untuk mengubah status inovasi ini."]);
                    exit();
                }
            }

            $stmt = $conn->prepare("UPDATE inovasi SET status = ? WHERE id = ?");
            $stmt->execute([$status, $id]);
            echo json_encode(["status" => "success", "message" => "Status inovasi berhasil diubah menjadi $status."]);
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
