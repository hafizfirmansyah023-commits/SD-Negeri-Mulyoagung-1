<?php
require_once '../config/koneksi.php';
require_once 'foto_helper.php';

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
        ]),
        'homepage_sections' => json_encode([
            ["key" => "hero", "judul" => "Hero", "subjudul" => "", "is_active" => true],
            ["key" => "stats", "judul" => "Statistik Sekolah", "subjudul" => "", "is_active" => true],
            ["key" => "sambutan", "judul" => "Sambutan Kepala Sekolah", "subjudul" => "", "is_active" => true],
            ["key" => "berita", "judul" => "Berita & Kegiatan Terbaru", "subjudul" => "Ikuti terus perkembangan informasi dan aktivitas menarik di sekolah kami.", "is_active" => true],
            ["key" => "profil", "judul" => "Profil Sekolah", "subjudul" => "Mengenal lebih dekat visi, misi, dan sejarah panjang SD Negeri 1 Mulyoagung.", "is_active" => true],
            ["key" => "video", "judul" => "Profil Video Sekolah", "subjudul" => "Tonton video profil sekolah kami untuk mengenal lingkungan belajar, fasilitas, dan kegiatan siswa secara visual.", "is_active" => true],
            ["key" => "kontak", "judul" => "Kontak Kami", "subjudul" => "Hubungi kami atau kunjungi lokasi sekolah dasar kami melalui detail kontak di bawah ini.", "is_active" => true]
        ]),
        'hero_title' => 'Unggul, Berkarakter, dan Berbudaya Lingkungan',
        'hero_subtitle' => 'Selamat Datang di SD Negeri 1 Mulyoagung. Kami berkomitmen menyelenggarakan pendidikan berkualitas untuk membentuk generasi cerdas, kreatif, berakhlak mulia, dan peduli lingkungan.',
        'hero_bg' => '',
        'video_url' => 'https://www.youtube.com/embed/5T2k922_Z8Q',
        'profil_visi' => 'Terwujudnya peserta didik yang unggul dalam prestasi, berkarakter mulia, cerdas, terampil, serta berwawasan lingkungan berlandaskan iman dan taqwa.',
        'profil_misi' => json_encode([
            "Menyelenggarakan proses pembelajaran yang efektif untuk mengoptimalkan potensi akademik dan non-akademik siswa.",
            "Membina karakter mulia, disiplin, dan budi pekerti luhur berlandaskan nilai-nilai iman dan taqwa.",
            "Mengembangkan keterampilan hidup, kreativitas, dan literasi teknologi informasi sejak dini.",
            "Menciptakan lingkungan sekolah yang bersih, sehat, rindang, dan ramah anak sebagai upaya pelestarian lingkungan.",
            "Menjalin kemitraan yang harmonis antara sekolah, komite, orang tua wali, dan masyarakat sekitar."
        ]),
        'profil_sejarah' => 'SD Negeri 1 Mulyoagung berdiri sejak tahun 1976 di wilayah Kecamatan Dau, Kabupaten Malang. Selama puluhan tahun, sekolah ini telah meluluskan ribuan alumni yang sukses dan terus berkontribusi di berbagai bidang. Dengan komitmen peningkatan mutu berkelanjutan, kami terus berbenah secara fasilitas maupun kurikulum untuk menghadirkan layanan pendidikan dasar terbaik bagi masyarakat.'
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

        $homepage_sections = [];
        if (isset($settings['homepage_sections'])) {
            $decoded = json_decode($settings['homepage_sections'], true);
            if (is_array($decoded)) {
                $homepage_sections = $decoded;
            }
        }

        $hero_title = isset($settings['hero_title']) ? $settings['hero_title'] : '';
        $hero_subtitle = isset($settings['hero_subtitle']) ? $settings['hero_subtitle'] : '';
        $hero_bg = isset($settings['hero_bg']) ? $settings['hero_bg'] : '';
        $video_url = isset($settings['video_url']) ? $settings['video_url'] : '';
        $profil_visi = isset($settings['profil_visi']) ? $settings['profil_visi'] : '';
        
        $profil_misi = [];
        if (isset($settings['profil_misi'])) {
            $decoded = json_decode($settings['profil_misi'], true);
            if (is_array($decoded)) {
                $profil_misi = $decoded;
            }
        }
        $profil_sejarah = isset($settings['profil_sejarah']) ? $settings['profil_sejarah'] : '';

        echo json_encode([
            "status" => "success",
            "tahun_ajaran" => $tahun_ajaran,
            "link_ppdb" => $link_ppdb,
            "email_sekolah" => $email_sekolah,
            "telepon_sekolah" => $telepon_sekolah,
            "whatsapp_sekolah" => $whatsapp_sekolah,
            "alamat_sekolah" => $alamat_sekolah,
            "medsos_links" => $medsos_links,
            "homepage_sections" => $homepage_sections,
            "hero_title" => $hero_title,
            "hero_subtitle" => $hero_subtitle,
            "hero_bg" => $hero_bg,
            "video_url" => $video_url,
            "profil_visi" => $profil_visi,
            "profil_misi" => $profil_misi,
            "profil_sejarah" => $profil_sejarah,
            "data" => $settings
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $keys_to_save = [
        'tahun_ajaran', 'link_ppdb', 'email_sekolah', 'telepon_sekolah', 
        'whatsapp_sekolah', 'alamat_sekolah', 'medsos_links',
        'homepage_sections', 'hero_title', 'hero_subtitle', 'video_url', 
        'profil_visi', 'profil_misi', 'profil_sejarah'
    ];

    try {
        $stmt = $conn->prepare("INSERT INTO pengaturan_sekolah (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?");
        
        foreach ($keys_to_save as $key) {
            if (isset($_POST[$key])) {
                $val = trim($_POST[$key]);
                $stmt->execute([$key, $val, $val]);
            }
        }

        // Handle upload hero background if present
        $upload_dir = '../uploads/hero/';
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        if (foto_has_upload('hero_bg')) {
            $stmtOld = $conn->prepare("SELECT setting_value FROM pengaturan_sekolah WHERE setting_key = 'hero_bg'");
            $stmtOld->execute();
            $old_bg = $stmtOld->fetchColumn();
            if ($old_bg) {
                foto_unlink($old_bg);
            }
            
            $new_bg = foto_save_file('hero_bg', $upload_dir, 'backend/uploads/hero/');
            if ($new_bg) {
                $stmt->execute(['hero_bg', $new_bg, $new_bg]);
            }
        }

        echo json_encode([
            "status" => "success",
            "message" => "Pengaturan halaman utama & kontak sekolah berhasil diperbarui."
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
