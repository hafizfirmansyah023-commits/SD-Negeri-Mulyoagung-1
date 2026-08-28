<?php
require_once __DIR__ . '/../config/koneksi.php';

header("Content-Type: application/json");

$response = [
    "status" => "success",
    "message" => "Database berhasil diperbaiki dan dimigrasikan secara lengkap.",
    "tables_created_or_verified" => [],
    "columns_added_or_verified" => []
];

try {
    // 1. Tabel users
    $conn->exec("CREATE TABLE IF NOT EXISTS `users` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `username` VARCHAR(100) NOT NULL UNIQUE,
        `password` VARCHAR(255) NOT NULL,
        `role` VARCHAR(20) DEFAULT 'TIM',
        `nama_penanggung_jawab` VARCHAR(255) NOT NULL,
        `foto` VARCHAR(255) NULL,
        `foto_crop` VARCHAR(255) NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    $response["tables_created_or_verified"][] = "users";

    // 2. Tabel berita
    $conn->exec("CREATE TABLE IF NOT EXISTS `berita` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `judul` VARCHAR(255) NOT NULL,
        `isi` TEXT NOT NULL,
        `foto` VARCHAR(255) NULL,
        `foto_crop` VARCHAR(255) NULL,
        `kategori` VARCHAR(100) NOT NULL,
        `tanggal` DATE NOT NULL,
        `status_verifikasi` VARCHAR(50) DEFAULT 'Verified',
        `uploaded_by` INT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    $response["tables_created_or_verified"][] = "berita";

    // 3. Tabel galeri
    $conn->exec("CREATE TABLE IF NOT EXISTS `galeri` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `judul` VARCHAR(255) NOT NULL,
        `deskripsi` TEXT NULL,
        `foto` VARCHAR(255) NULL,
        `foto_crop` VARCHAR(255) NULL,
        `kategori` VARCHAR(100) NOT NULL,
        `tanggal` DATE NOT NULL,
        `status_verifikasi` VARCHAR(50) DEFAULT 'Verified',
        `uploaded_by` INT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    $response["tables_created_or_verified"][] = "galeri";

    // 4. Tabel guru_tendik
    $conn->exec("CREATE TABLE IF NOT EXISTS `guru_tendik` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `nama` VARCHAR(255) NOT NULL,
        `nip` VARCHAR(100) NULL,
        `jabatan` VARCHAR(100) NOT NULL,
        `tugas` VARCHAR(255) NOT NULL,
        `foto` VARCHAR(255) NULL,
        `foto_crop` VARCHAR(255) NULL,
        `riwayat_pendidikan` VARCHAR(255) NOT NULL,
        `jenis_kelamin` VARCHAR(20) NOT NULL,
        `status` VARCHAR(50) DEFAULT 'Aktif',
        `motto` TEXT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    $response["tables_created_or_verified"][] = "guru_tendik";

    // 5. Tabel pengumuman
    $conn->exec("CREATE TABLE IF NOT EXISTS `pengumuman` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `judul` VARCHAR(255) NOT NULL,
        `isi` TEXT NOT NULL,
        `tanggal` DATE NOT NULL,
        `kategori` VARCHAR(100) NOT NULL,
        `foto` VARCHAR(255) NULL,
        `foto_crop` VARCHAR(255) NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    $response["tables_created_or_verified"][] = "pengumuman";

    // 6. Tabel fasilitas
    $conn->exec("CREATE TABLE IF NOT EXISTS `fasilitas` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `nama` VARCHAR(255) NOT NULL,
        `deskripsi` TEXT NOT NULL,
        `foto` VARCHAR(255) NULL,
        `foto_crop` VARCHAR(255) NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    $response["tables_created_or_verified"][] = "fasilitas";

    // 7. Tabel hero_carousel
    $conn->exec("CREATE TABLE IF NOT EXISTS `hero_carousel` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `judul` VARCHAR(255) NULL,
        `subjudul` TEXT NULL,
        `foto` VARCHAR(255) NOT NULL,
        `foto_crop` VARCHAR(255) NULL,
        `urutan` INT DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    $response["tables_created_or_verified"][] = "hero_carousel";

    // 8. Tabel pengaturan_sekolah
    $conn->exec("CREATE TABLE IF NOT EXISTS `pengaturan_sekolah` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `tahun_ajaran` VARCHAR(50) DEFAULT '2025/2026',
        `link_ppdb` TEXT NULL,
        `email_sekolah` VARCHAR(255) NULL,
        `telepon_sekolah` VARCHAR(100) NULL,
        `whatsapp_sekolah` VARCHAR(100) NULL,
        `alamat_sekolah` TEXT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    $response["tables_created_or_verified"][] = "pengaturan_sekolah";

    // 9. Tabel statistik
    $conn->exec("CREATE TABLE IF NOT EXISTS `statistik` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `judul` VARCHAR(255) NOT NULL,
        `jumlah` VARCHAR(100) NOT NULL,
        `label` VARCHAR(255) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    $response["tables_created_or_verified"][] = "statistik";

    // 10. Tabel sambutan
    $conn->exec("CREATE TABLE IF NOT EXISTS `sambutan` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `nama_kepsek` VARCHAR(255) NOT NULL,
        `sambutan` TEXT NOT NULL,
        `foto` VARCHAR(255) NULL,
        `foto_crop` VARCHAR(255) NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    $response["tables_created_or_verified"][] = "sambutan";

    // 11. Tabel login_attempts
    $conn->exec("CREATE TABLE IF NOT EXISTS `login_attempts` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `ip_address` VARCHAR(45) NOT NULL,
        `attempts` INT DEFAULT 0,
        `last_attempt` INT DEFAULT 0,
        `blocked_until` INT DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    $response["tables_created_or_verified"][] = "login_attempts";

    // Pastikan kolom-kolom opsional/terbaru ada di setiap tabel (SAFE ALTER)
    $safe_alters = [
        ["users", "foto_crop", "VARCHAR(255) NULL"],
        ["users", "role", "VARCHAR(20) DEFAULT 'TIM'"],
        ["berita", "foto_crop", "VARCHAR(255) NULL"],
        ["berita", "status_verifikasi", "VARCHAR(50) DEFAULT 'Verified'"],
        ["berita", "uploaded_by", "INT NULL"],
        ["galeri", "foto_crop", "VARCHAR(255) NULL"],
        ["galeri", "status_verifikasi", "VARCHAR(50) DEFAULT 'Verified'"],
        ["galeri", "uploaded_by", "INT NULL"],
        ["guru_tendik", "foto_crop", "VARCHAR(255) NULL"],
        ["guru_tendik", "nip", "VARCHAR(100) NULL"],
        ["guru_tendik", "motto", "TEXT NULL"],
        ["pengumuman", "foto_crop", "VARCHAR(255) NULL"],
        ["fasilitas", "foto_crop", "VARCHAR(255) NULL"],
        ["hero_carousel", "foto_crop", "VARCHAR(255) NULL"],
        ["pengaturan_sekolah", "email_sekolah", "VARCHAR(255) NULL"],
        ["pengaturan_sekolah", "telepon_sekolah", "VARCHAR(100) NULL"],
        ["pengaturan_sekolah", "whatsapp_sekolah", "VARCHAR(100) NULL"],
        ["pengaturan_sekolah", "alamat_sekolah", "TEXT NULL"],
    ];

    foreach ($safe_alters as $alt) {
        [$tbl, $col, $def] = $alt;
        try {
            $conn->exec("ALTER TABLE `$tbl` ADD COLUMN `$col` $def");
            $response["columns_added_or_verified"][] = "$tbl.$col";
        } catch (Exception $e) {
            // Kolom sudah ada
        }
    }

    // Pastikan data awal di tabel pengaturan_sekolah jika kosong
    $stmt = $conn->query("SELECT COUNT(*) FROM `pengaturan_sekolah`");
    if ($stmt->fetchColumn() == 0) {
        $conn->exec("INSERT INTO `pengaturan_sekolah` (tahun_ajaran, link_ppdb, email_sekolah, telepon_sekolah, whatsapp_sekolah, alamat_sekolah) VALUES (
            '2025/2026',
            '',
            'sdnmulyoagung01@gmail.com',
            '(0341) 466-730',
            '08123456789',
            'JL. RAYA MULYOAGUNG NO.121 RT. 1 RW. 10 DUSUN MULYOAGUNG , Kec. Dau, Kab. Malang, Prov. Jawa Timur'
        )");
    }

    // Pastikan ada default admin jika tabel users kosong
    $stmt = $conn->query("SELECT COUNT(*) FROM `users`");
    if ($stmt->fetchColumn() == 0) {
        $defaultPassword = password_hash('admin', PASSWORD_DEFAULT);
        $conn->exec("INSERT INTO `users` (username, password, role, nama_penanggung_jawab) VALUES ('admin', '$defaultPassword', 'ADMIN', 'Administrator Utama')");
        $response["default_admin_created"] = true;
    }

    echo json_encode($response, JSON_PRETTY_PRINT);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Gagal memperbaiki database: " . $e->getMessage()]);
}
?>
