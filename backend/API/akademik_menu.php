<?php
require_once '../config/koneksi.php';

header("Content-Type: application/json");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

try {
    $conn->exec("CREATE TABLE IF NOT EXISTS `akademik_menu` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `label` VARCHAR(100) NOT NULL,
        `deskripsi` TEXT NULL,
        `link_gdrive` TEXT NOT NULL,
        `is_modul` TINYINT(1) NOT NULL DEFAULT 0,
        `urutan` INT NOT NULL DEFAULT 0,
        `aktif` TINYINT(1) NOT NULL DEFAULT 1,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;");

    $count = $conn->query("SELECT COUNT(*) FROM `akademik_menu`")->fetchColumn();
    if ($count == 0) {
        $seeds = [
            ['KSP', 'Kurikulum Satuan Pendidikan (KSP) SD Negeri 1 Mulyoagung.', 'https://drive.google.com/', 0, 1, 1],
            ['PANDUAN KURIKULUM', 'Panduan pelaksanaan dan pedoman kurikulum pembelajaran sekolah.', 'https://drive.google.com/', 0, 2, 1],
            ['ANALISIS HARI EFEKTIF', 'Analisis perhitungan alokasi waktu dan hari belajar efektif per semester.', 'https://drive.google.com/', 0, 3, 1],
            ['BEDAH CP', 'Bedah Capaian Pembelajaran (CP) dan Alur Tujuan Pembelajaran (ATP).', 'https://drive.google.com/', 0, 4, 1],
            ['PROGRAM TAHUNAN', 'Program Tahunan (Prota) rencana penetapan alokasi waktu 1 tahun ajaran.', 'https://drive.google.com/', 0, 5, 1],
            ['PROGRAM SEMESTER', 'Program Semester (Promes) penjabaran rencana pembelajaran per semester.', 'https://drive.google.com/', 0, 6, 1],
            ['MODUL AJAR & LKPD', 'Modul ajar, LKPD, dan materi Kurikulum Merdeka SD Negeri 1 Mulyoagung.', 'https://drive.google.com/', 1, 7, 1],
            ['MPLS & ASESMEN', 'Masa Pengenalan Lingkungan Sekolah (MPLS) serta instrumen asesmen pembelajaran.', 'https://drive.google.com/', 0, 8, 1],
        ];
        $insertStmt = $conn->prepare("INSERT INTO `akademik_menu` (`label`, `deskripsi`, `link_gdrive`, `is_modul`, `urutan`, `aktif`) VALUES (?, ?, ?, ?, ?, ?)");
        foreach ($seeds as $seed) {
            $insertStmt->execute($seed);
        }
    }
} catch (PDOException $e) {
    // Continue
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $status_filter = isset($_GET['status']) ? $_GET['status'] : 'active_only';
    try {
        if ($status_filter === 'all') {
            $stmt = $conn->query("SELECT * FROM akademik_menu ORDER BY urutan ASC, id ASC");
        } else {
            $stmt = $conn->query("SELECT * FROM akademik_menu WHERE aktif = 1 ORDER BY urutan ASC, id ASC");
        }
        $data = $stmt->fetchAll();
        echo json_encode(["status" => "success", "data" => $data]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $action = isset($_POST['action']) ? $_POST['action'] : '';
    $role = isset($_POST['role']) ? trim($_POST['role']) : '';

    if ($role !== 'ADMIN') {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Hanya role ADMIN yang memiliki izin mengelola menu akademik."]);
        exit();
    }

    if ($action === 'reorder') {
        $rawItems = isset($_POST['items']) ? $_POST['items'] : '';
        $items = json_decode($rawItems, true);
        if (is_array($items)) {
            try {
                $stmt = $conn->prepare("UPDATE akademik_menu SET urutan = ? WHERE id = ?");
                foreach ($items as $index => $item) {
                    if (isset($item['id'])) {
                        $newOrder = isset($item['urutan']) ? intval($item['urutan']) : ($index + 1);
                        $stmt->execute([$newOrder, intval($item['id'])]);
                    }
                }
                echo json_encode(["status" => "success", "message" => "Urutan menu akademik berhasil diperbarui."]);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => $e->getMessage()]);
            }
            exit();
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Format data urutan tidak valid."]);
            exit();
        }
    }

    if ($action === 'create') {
        $label = isset($_POST['label']) ? trim($_POST['label']) : '';
        $deskripsi = isset($_POST['deskripsi']) ? trim($_POST['deskripsi']) : '';
        $link_gdrive = isset($_POST['link_gdrive']) ? trim($_POST['link_gdrive']) : '';
        $is_modul = (isset($_POST['is_modul']) && ($_POST['is_modul'] === '1' || $_POST['is_modul'] === 'true')) ? 1 : 0;
        $urutan = isset($_POST['urutan']) ? intval($_POST['urutan']) : 0;
        $aktif = (isset($_POST['aktif']) && ($_POST['aktif'] === '0' || $_POST['aktif'] === 'false')) ? 0 : 1;

        if (empty($label) || empty($link_gdrive)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Nama menu dan link Google Drive wajib diisi."]);
            exit();
        }

        try {
            $stmt = $conn->prepare("INSERT INTO akademik_menu (label, deskripsi, link_gdrive, is_modul, urutan, aktif) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$label, $deskripsi, $link_gdrive, $is_modul, $urutan, $aktif]);
            echo json_encode(["status" => "success", "message" => "Menu akademik berhasil ditambahkan."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    } elseif ($action === 'update') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $label = isset($_POST['label']) ? trim($_POST['label']) : '';
        $deskripsi = isset($_POST['deskripsi']) ? trim($_POST['deskripsi']) : '';
        $link_gdrive = isset($_POST['link_gdrive']) ? trim($_POST['link_gdrive']) : '';
        $is_modul = (isset($_POST['is_modul']) && ($_POST['is_modul'] === '1' || $_POST['is_modul'] === 'true')) ? 1 : 0;
        $urutan = isset($_POST['urutan']) ? intval($_POST['urutan']) : 0;
        $aktif = (isset($_POST['aktif']) && ($_POST['aktif'] === '0' || $_POST['aktif'] === 'false')) ? 0 : 1;

        if ($id === 0 || empty($label) || empty($link_gdrive)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Data tidak lengkap untuk pembaruan menu akademik."]);
            exit();
        }

        try {
            $stmt = $conn->prepare("UPDATE akademik_menu SET label = ?, deskripsi = ?, link_gdrive = ?, is_modul = ?, urutan = ?, aktif = ? WHERE id = ?");
            $stmt->execute([$label, $deskripsi, $link_gdrive, $is_modul, $urutan, $aktif, $id]);
            echo json_encode(["status" => "success", "message" => "Menu akademik berhasil diperbarui."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    } elseif ($action === 'delete') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;

        if ($id === 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID menu tidak valid."]);
            exit();
        }

        try {
            $stmt = $conn->prepare("DELETE FROM akademik_menu WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "success", "message" => "Menu akademik berhasil dihapus."]);
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
