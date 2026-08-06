<?php
require_once '../config/koneksi.php';

header("Content-Type: application/json");

// Ensure upload directory exists
$upload_dir = '../uploads/fasilitas/';
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

// Auto-create table if not exists
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS `fasilitas` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `judul` varchar(255) NOT NULL,
      `deskripsi` text NOT NULL,
      `foto` varchar(255) DEFAULT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;");

    // Seed initial data if table is empty
    $check_stmt = $conn->query("SELECT COUNT(*) as cnt FROM `fasilitas`");
    $row = $check_stmt->fetch();
    if ($row && intval($row['cnt']) === 0) {
        $seeds = [
            ['Laboratorium Komputer & TIK Interaktif', 'Dilengkapi 30 unit komputer terkini, jaringan Wi-Fi sekolah, dan Smart Display untuk pembelajaran coding dasar & literasi digital.', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'],
            ['Perpustakaan "Taman Ilmu"', 'Koleksi ribuan buku cerita, modul pembelajaran, koleksi literasi digital e-book, dan sudut baca ramah anak yang nyaman.', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=600'],
            ['Lapangan Olahraga & Upacara', 'Areal seluas 800m² dilapisi plester berkualitas untuk upacara bendera, senam bersama, bulutangkis, basket, dan futsal.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600'],
            ['Ruang UKS & Poliklinik Sekolah', 'Fasilitas pertolongan pertama kesehatan dengan tempat tidur bersih, pengukuran TB/BB rutin, dan kerja sama Puskesmas Dau.', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600'],
            ['Kantin Sehat Bergizi', 'Menyediakan makanan dan minuman sehat yang higienis, bebas bahan pengawet berbahaya, dan diawasi oleh tim gizi sekolah.', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600'],
            ['Taman Edukasi & Green House', 'Area hijau pemanfaatan hidroponik, tanaman toga, dan ruang pengolahan kompos sebagai wahana belajar Adiwiyata.', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600']
        ];

        $ins_stmt = $conn->prepare("INSERT INTO `fasilitas` (`judul`, `deskripsi`, `foto`) VALUES (?, ?, ?)");
        foreach ($seeds as $s) {
            $ins_stmt->execute($s);
        }
    }
} catch (PDOException $e) {
    // Continue even if table creation/check fails
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $conn->query("SELECT * FROM fasilitas ORDER BY id DESC");
        $data = $stmt->fetchAll();
        echo json_encode(["status" => "success", "data" => $data]);
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

        if (empty($judul) || empty($deskripsi)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Judul dan deskripsi fasilitas wajib diisi."]);
            exit();
        }

        $foto_path = '';
        if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
            $file_tmp = $_FILES['foto']['tmp_name'];
            $file_name = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', basename($_FILES['foto']['name']));
            $target_file = $upload_dir . $file_name;
            if (move_uploaded_file($file_tmp, $target_file)) {
                $foto_path = 'backend/uploads/fasilitas/' . $file_name;
            }
        } elseif (isset($_POST['foto_url']) && !empty($_POST['foto_url'])) {
            $foto_path = trim($_POST['foto_url']);
        }

        try {
            $stmt = $conn->prepare("INSERT INTO fasilitas (judul, deskripsi, foto) VALUES (?, ?, ?)");
            $stmt->execute([$judul, $deskripsi, $foto_path]);
            echo json_encode(["status" => "success", "message" => "Fasilitas berhasil ditambahkan."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }
    elseif ($action === 'update') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $judul = isset($_POST['judul']) ? trim($_POST['judul']) : '';
        $deskripsi = isset($_POST['deskripsi']) ? trim($_POST['deskripsi']) : '';

        if ($id === 0 || empty($judul) || empty($deskripsi)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Data tidak lengkap untuk pembaruan."]);
            exit();
        }

        $stmt = $conn->prepare("SELECT foto FROM fasilitas WHERE id = ?");
        $stmt->execute([$id]);
        $fac = $stmt->fetch();
        if (!$fac) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Fasilitas tidak ditemukan."]);
            exit();
        }

        $foto_path = $fac['foto'];
        if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
            if (!empty($foto_path) && strpos($foto_path, 'backend/uploads/') === 0) {
                $old_file = '../' . str_replace('backend/', '', $foto_path);
                if (file_exists($old_file)) {
                    @unlink($old_file);
                }
            }
            $file_tmp = $_FILES['foto']['tmp_name'];
            $file_name = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', basename($_FILES['foto']['name']));
            $target_file = $upload_dir . $file_name;
            if (move_uploaded_file($file_tmp, $target_file)) {
                $foto_path = 'backend/uploads/fasilitas/' . $file_name;
            }
        } elseif (isset($_POST['foto_url']) && !empty($_POST['foto_url'])) {
            $foto_path = trim($_POST['foto_url']);
        }

        try {
            $stmt = $conn->prepare("UPDATE fasilitas SET judul = ?, deskripsi = ?, foto = ? WHERE id = ?");
            $stmt->execute([$judul, $deskripsi, $foto_path, $id]);
            echo json_encode(["status" => "success", "message" => "Fasilitas berhasil diperbarui."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }
    elseif ($action === 'delete') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        if ($id === 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID tidak valid."]);
            exit();
        }

        $stmt = $conn->prepare("SELECT foto FROM fasilitas WHERE id = ?");
        $stmt->execute([$id]);
        $fac = $stmt->fetch();
        if ($fac && !empty($fac['foto']) && strpos($fac['foto'], 'backend/uploads/') === 0) {
            $old_file = '../' . str_replace('backend/', '', $fac['foto']);
            if (file_exists($old_file)) {
                @unlink($old_file);
            }
        }

        try {
            $stmt = $conn->prepare("DELETE FROM fasilitas WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "success", "message" => "Fasilitas berhasil dihapus."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }
    else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Aksi tidak dikenal."]);
    }
}
else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
?>
