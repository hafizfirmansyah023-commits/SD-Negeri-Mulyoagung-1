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

    // Insert default keys if not exist
    $defaults = [
        'tahun_ajaran' => '2025/2026',
        'link_ppdb' => '',
        'email_sekolah' => 'sdnmulyoagung01@gmail.com',
        'telepon_sekolah' => '(0341) 466-730',
        'whatsapp_sekolah' => '08123456789',
        'alamat_sekolah' => 'JL. RAYA MULYOAGUNG NO.121 RT. 1 RW. 10 DUSUN MULYOAGUNG , Kec. Dau, Kab. Malang, Prov. Jawa Timur',
        'medsos_links' => json_encode([
            ["id" => "1", "name" => "YouTube", "url" => "https://www.youtube.com/@mulyoagungsatu3851", "icon" => "auto"],
            ["id" => "2", "name" => "Instagram", "url" => "https://www.instagram.com/mulyoagung1_dau", "icon" => "auto"],
            ["id" => "3", "name" => "Facebook", "url" => "https://www.facebook.com/profile.php?id=100085140035121", "icon" => "auto"],
            ["id" => "4", "name" => "TikTok", "url" => "https://www.tiktok.com/@mulyoagung.1", "icon" => "auto"]
        ])
    ];

    foreach ($defaults as $key => $val) {
        $stmtCheck = $conn->prepare("SELECT COUNT(*) FROM pengaturan_sekolah WHERE setting_key = ?");
        $stmtCheck->execute([$key]);
        if ($stmtCheck->fetchColumn() == 0) {
            $stmtInit = $conn->prepare("INSERT INTO pengaturan_sekolah (setting_key, setting_value) VALUES (?, ?)");
            $stmtInit->execute([$key, $val]);
        }
    }
} catch (PDOException $e) {
    // Continue even if table creation fails
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
        $email_sekolah = isset($settings['email_sekolah']) ? $settings['email_sekolah'] : 'sdnmulyoagung01@gmail.com';
        $telepon_sekolah = isset($settings['telepon_sekolah']) ? $settings['telepon_sekolah'] : '(0341) 466-730';
        $whatsapp_sekolah = isset($settings['whatsapp_sekolah']) ? $settings['whatsapp_sekolah'] : '08123456789';
        $alamat_sekolah = isset($settings['alamat_sekolah']) ? $settings['alamat_sekolah'] : '';
        
        $medsos_links = [];
        if (isset($settings['medsos_links'])) {
            $decoded = json_decode($settings['medsos_links'], true);
            if (is_array($decoded)) {
                $medsos_links = $decoded;
            }
        }

        echo json_encode([
            "status" => "success",
            "tahun_ajaran" => $tahun_ajaran,
            "link_ppdb" => $link_ppdb,
            "email_sekolah" => $email_sekolah,
            "telepon_sekolah" => $telepon_sekolah,
            "whatsapp_sekolah" => $whatsapp_sekolah,
            "alamat_sekolah" => $alamat_sekolah,
            "medsos_links" => $medsos_links,
            "data" => $settings
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $keys_to_save = ['tahun_ajaran', 'link_ppdb', 'email_sekolah', 'telepon_sekolah', 'whatsapp_sekolah', 'alamat_sekolah', 'medsos_links'];

    try {
        $stmt = $conn->prepare("INSERT INTO pengaturan_sekolah (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?");
        
        foreach ($keys_to_save as $key) {
            if (isset($_POST[$key])) {
                $val = trim($_POST[$key]);
                $stmt->execute([$key, $val, $val]);
            }
        }

        echo json_encode([
            "status" => "success",
            "message" => "Pengaturan & Kontak sekolah berhasil diperbarui."
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
