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
        `parent_id` INT NULL DEFAULT NULL,
        `link_gdrive` TEXT NULL,
        `is_modul` TINYINT(1) NOT NULL DEFAULT 0,
        `urutan` INT NOT NULL DEFAULT 0,
        `aktif` TINYINT(1) NOT NULL DEFAULT 1,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;");

    // Migrasi kolom parent_id (tabel lama tidak punya kolom ini)
    $checkParent = $conn->query("SHOW COLUMNS FROM `akademik_menu` LIKE 'parent_id'");
    if ($checkParent && $checkParent->rowCount() === 0) {
        $conn->exec("ALTER TABLE `akademik_menu` ADD COLUMN `parent_id` INT NULL DEFAULT NULL AFTER `deskripsi`");
    }
    // Kolom link_gdrive mungkin NOT NULL di tabel lama; buat nullable agar kategori bisa tanpa link
    try {
        $conn->exec("ALTER TABLE `akademik_menu` MODIFY COLUMN `link_gdrive` TEXT NULL");
    } catch (Exception $e) {
        // abaikan
    }

    $count = $conn->query("SELECT COUNT(*) FROM `akademik_menu`")->fetchColumn();
    if ($count == 0) {
        $seeds = [
            ['KSP', 'Kurikulum Satuan Pendidikan (KSP) SD Negeri 1 Mulyoagung.', null, 'https://drive.google.com/', 0, 1, 1],
            ['PANDUAN KURIKULUM', 'Panduan pelaksanaan dan pedoman kurikulum pembelajaran sekolah.', null, 'https://drive.google.com/', 0, 2, 1],
            ['ANALISIS HARI EFEKTIF', 'Analisis perhitungan alokasi waktu dan hari belajar efektif per semester.', null, 'https://drive.google.com/', 0, 3, 1],
            ['BEDAH CP', 'Bedah Capaian Pembelajaran (CP) dan Alur Tujuan Pembelajaran (ATP).', null, 'https://drive.google.com/', 0, 4, 1],
            ['PROGRAM TAHUNAN', 'Program Tahunan (Prota) rencana penetapan alokasi waktu 1 tahun ajaran.', null, 'https://drive.google.com/', 0, 5, 1],
            ['PROGRAM SEMESTER', 'Program Semester (Promes) penjabaran rencana pembelajaran per semester.', null, 'https://drive.google.com/', 0, 6, 1],
            ['MODUL AJAR & LKPD', 'Modul ajar, LKPD, dan materi Kurikulum Merdeka SD Negeri 1 Mulyoagung.', null, 'https://drive.google.com/', 1, 7, 1],
            ['MPLS & ASESMEN', 'Masa Pengenalan Lingkungan Sekolah (MPLS) serta instrumen asesmen pembelajaran.', null, 'https://drive.google.com/', 0, 8, 1],
        ];
        $insertStmt = $conn->prepare("INSERT INTO `akademik_menu` (`label`, `deskripsi`, `parent_id`, `link_gdrive`, `is_modul`, `urutan`, `aktif`) VALUES (?, ?, ?, ?, ?, ?, ?)");
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
        $selectSql = "SELECT m.*, p.label as parent_label FROM akademik_menu m LEFT JOIN akademik_menu p ON m.parent_id = p.id ";
        if ($status_filter === 'all') {
            $stmt = $conn->query($selectSql . "ORDER BY COALESCE(m.parent_id, 0), m.urutan ASC, m.id ASC");
        } else {
            $stmt = $conn->query($selectSql . "WHERE m.aktif = 1 ORDER BY COALESCE(m.parent_id, 0), m.urutan ASC, m.id ASC");
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
                // Validasi parent_id: kumpulkan kategori yang masih ada
                $existing = $conn->query("SELECT id FROM akademik_menu WHERE parent_id IS NULL")->fetchAll(PDO::FETCH_COLUMN);
                $existingMap = array_fill_keys(array_map('intval', $existing), true);

                // Normalisasi urutan per parent: kelompokkan items by parent
                $grouped = [];
                foreach ($items as $index => $item) {
                    if (!isset($item['id'])) continue;
                    $parent = isset($item['parent_id']) && intval($item['parent_id']) > 0 ? intval($item['parent_id']) : 0;
                    // Validasi: parent harus merujuk kategori yang masih ada
                    if ($parent !== 0 && !isset($existingMap[$parent])) {
                        http_response_code(400);
                        echo json_encode(["status" => "error", "message" => "Kategori induk tidak valid atau sudah dihapus."]);
                        exit();
                    }
                    $grouped[$parent][] = intval($item['id']);
                }

                // Assign urutan berurutan dalam masing-masing parent
                $stmt = $conn->prepare("UPDATE akademik_menu SET parent_id = ?, urutan = ? WHERE id = ?");
                foreach ($items as $index => $item) {
                    if (!isset($item['id'])) continue;
                    $id = intval($item['id']);
                    $parent = isset($item['parent_id']) && intval($item['parent_id']) > 0 ? intval($item['parent_id']) : null;
                    // Temukan posisi dalam kelompok parent-nya
                    $pos = array_search($id, $grouped[$parent === null ? 0 : $parent]) + 1;
                    $stmt->execute([$parent, $pos, $id]);
                }
                echo json_encode(["status" => "success", "message" => "Urutan & kategori menu akademik berhasil diperbarui."]);
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
        $parent_raw = isset($_POST['parent_id']) ? trim($_POST['parent_id']) : '';
        $parent_id = ($parent_raw !== '' && intval($parent_raw) > 0) ? intval($parent_raw) : null;
        $link_gdrive = isset($_POST['link_gdrive']) ? trim($_POST['link_gdrive']) : '';
        $is_modul = (isset($_POST['is_modul']) && ($_POST['is_modul'] === '1' || $_POST['is_modul'] === 'true')) ? 1 : 0;
        $urutan = isset($_POST['urutan']) ? intval($_POST['urutan']) : 0;
        $aktif = (isset($_POST['aktif']) && ($_POST['aktif'] === '0' || $_POST['aktif'] === 'false')) ? 0 : 1;

        if (empty($label)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Nama menu wajib diisi."]);
            exit();
        }

        // Item (parent dipilih) wajib memiliki link Google Drive
        if ($parent_id !== null && empty($link_gdrive)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Link Google Drive wajib diisi untuk item dalam kategori."]);
            exit();
        }

        try {
            $stmt = $conn->prepare("INSERT INTO akademik_menu (label, deskripsi, parent_id, link_gdrive, is_modul, urutan, aktif) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$label, $deskripsi, $parent_id, $link_gdrive, $is_modul, $urutan, $aktif]);
            echo json_encode(["status" => "success", "message" => $parent_id === null ? "Kategori akademik berhasil ditambahkan." : "Item akademik berhasil ditambahkan."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    } elseif ($action === 'update') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $label = isset($_POST['label']) ? trim($_POST['label']) : '';
        $deskripsi = isset($_POST['deskripsi']) ? trim($_POST['deskripsi']) : '';
        $parent_raw = isset($_POST['parent_id']) ? trim($_POST['parent_id']) : '';
        $parent_id = ($parent_raw !== '' && intval($parent_raw) > 0) ? intval($parent_raw) : null;
        $link_gdrive = isset($_POST['link_gdrive']) ? trim($_POST['link_gdrive']) : '';
        $is_modul = (isset($_POST['is_modul']) && ($_POST['is_modul'] === '1' || $_POST['is_modul'] === 'true')) ? 1 : 0;
        $urutan = isset($_POST['urutan']) ? intval($_POST['urutan']) : 0;
        $aktif = (isset($_POST['aktif']) && ($_POST['aktif'] === '0' || $_POST['aktif'] === 'false')) ? 0 : 1;

        if ($id === 0 || empty($label)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Data tidak lengkap untuk pembaruan menu akademik."]);
            exit();
        }

        // Cegah kategori dijadikan child dirinya sendiri / keturunan
        if ($parent_id !== null && $parent_id === $id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Kategori tidak dapat dijadikan induk bagi dirinya sendiri."]);
            exit();
        }

        try {
            $stmt = $conn->prepare("UPDATE akademik_menu SET label = ?, deskripsi = ?, parent_id = ?, link_gdrive = ?, is_modul = ?, urutan = ?, aktif = ? WHERE id = ?");
            $stmt->execute([$label, $deskripsi, $parent_id, $link_gdrive, $is_modul, $urutan, $aktif, $id]);
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
            // Cek apakah ini kategori yang masih punya item
            $childCount = $conn->query("SELECT COUNT(*) FROM akademik_menu WHERE parent_id = $id")->fetchColumn();
            if ($childCount > 0) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Kategori masih berisi $childCount item. Pindahkan atau hapus item terlebih dahulu."]);
                exit();
            }

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
