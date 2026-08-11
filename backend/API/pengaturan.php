<?php
require_once '../config/koneksi.php';

header("Content-Type: application/json");

// Ensure settings table exists
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS `pengaturan_sekolah` (
        `setting_key` VARCHAR(100) NOT NULL PRIMARY KEY,
        `setting_value` TEXT NOT NULL,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;");

    // Insert default tahun ajaran if not exists
    $stmtCheck = $conn->prepare("SELECT COUNT(*) FROM pengaturan_sekolah WHERE setting_key = 'tahun_ajaran'");
    $stmtCheck->execute();
    if ($stmtCheck->fetchColumn() == 0) {
        $stmtInit = $conn->prepare("INSERT INTO pengaturan_sekolah (setting_key, setting_value) VALUES ('tahun_ajaran', '2025/2026')");
        $stmtInit->execute();
    }
} catch (PDOException $e) {
    // Continue even if table creation fails (assuming handled)
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $conn->query("SELECT setting_key, setting_value FROM pengaturan_sekolah");
        $settings = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }

        $tahun_ajaran = isset($settings['tahun_ajaran']) ? $settings['tahun_ajaran'] : '2025/2026';
        $link_ppdb = isset($settings['link_ppdb']) ? $settings['link_ppdb'] : '';

        echo json_encode([
            "status" => "success",
            "tahun_ajaran" => $tahun_ajaran,
            "link_ppdb" => $link_ppdb,
            "data" => $settings
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $tahun_ajaran = isset($_POST['tahun_ajaran']) ? trim($_POST['tahun_ajaran']) : '';
    $link_ppdb = isset($_POST['link_ppdb']) ? trim($_POST['link_ppdb']) : '';

    if (empty($tahun_ajaran)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Tahun ajaran tidak boleh kosong."]);
        exit();
    }

    try {
        // Save tahun_ajaran
        $stmt = $conn->prepare("INSERT INTO pengaturan_sekolah (setting_key, setting_value) VALUES ('tahun_ajaran', ?) ON DUPLICATE KEY UPDATE setting_value = ?");
        $stmt->execute([$tahun_ajaran, $tahun_ajaran]);

        // Save link_ppdb
        $stmtPpdb = $conn->prepare("INSERT INTO pengaturan_sekolah (setting_key, setting_value) VALUES ('link_ppdb', ?) ON DUPLICATE KEY UPDATE setting_value = ?");
        $stmtPpdb->execute([$link_ppdb, $link_ppdb]);

        echo json_encode([
            "status" => "success",
            "message" => "Pengaturan sekolah berhasil diperbarui.",
            "tahun_ajaran" => $tahun_ajaran,
            "link_ppdb" => $link_ppdb
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Metode request tidak diizinkan."]);
}
?>
