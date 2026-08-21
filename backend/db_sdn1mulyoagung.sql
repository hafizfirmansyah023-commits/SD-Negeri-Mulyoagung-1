-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 21, 2026 at 05:51 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_sdn1mulyoagung`
--

-- --------------------------------------------------------

--
-- Table structure for table `berita`
--

CREATE TABLE `berita` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `isi` text NOT NULL,
  `foto` varchar(255) NOT NULL,
  `kategori` varchar(100) NOT NULL,
  `tanggal` date NOT NULL,
  `status_verifikasi` enum('Pending','Verified','Rejected') NOT NULL DEFAULT 'Pending',
  `uploaded_by` int(11) DEFAULT NULL,
  `foto_crop` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `berita`
--

INSERT INTO `berita` (`id`, `judul`, `isi`, `foto`, `kategori`, `tanggal`, `status_verifikasi`, `uploaded_by`, `foto_crop`) VALUES
(1, 'Kemeriahan \"KARNAMUDA\": SDN 1 Mulyoagung Unjuk Kreativitas di Karnaval Mulyoagung Satu Dau', '<p data-path-to-node=\"3\" style=\"text-align: justify;\"><b data-path-to-node=\"3\" data-index-in-node=\"0\">DAU, OKTOBER 2025</b> – Suasana Desa Mulyoagung mendadak riuh dan penuh warna saat puluhan siswa SDN 1 Mulyoagung turun ke jalan mengikuti gelaran \"KARNAMUDA\" (Karnaval Mulyoagung Satu Dau).</p><p data-path-to-node=\"3\" style=\"text-align: justify;\"><br></p><p data-path-to-node=\"4\" style=\"text-align: justify;\">Mengusung keberagaman budaya dan semangat kebersamaan, para siswa tampil memukau dengan balutan busana adat, kostum daur ulang, serta kreasi seni khas Nusantara. Rute karnaval yang melintasi kawasan Dau penuh sesak oleh masyarakat sekitar yang antusias menyaksikan aksi dan yel-yel kreatif dari setiap barisan.</p><p data-path-to-node=\"4\" style=\"text-align: justify;\"><br></p><p data-path-to-node=\"5\" style=\"text-align: justify;\">Kepala SDN 1 Mulyoagung menyampaikan bahwa KARNAMUDA bukan sekadar perayaan tahunan, melainkan wadah untuk mengasah rasa percaya diri, kreativitas, dan cinta budaya sejak dini bagi para siswa.</p>', 'backend/uploads/berita/1787278194_e44c01ed_20251023_073011.webp', 'Kegiatan Sekolah', '2025-10-25', 'Verified', 1, 'backend/uploads/berita/1787278196_bafba2ef_20251023_073011.webp'),
(2, 'test', 'tesst', 'backend/uploads/berita/1787282666_9e26c26a_20251023_074756.webp', 'Kegiatan Sekolah', '2026-08-21', 'Verified', 2, 'backend/uploads/berita/1787282667_79a19e44_20251023_074756.webp'),
(3, 'test', 'test', 'backend/uploads/berita/1787283031_e305ee46_LOGO_HIMSI-removebg-preview.webp', 'Kegiatan Sekolah', '2026-08-21', 'Rejected', 2, 'backend/uploads/berita/1787283031_04f01eba_LOGO_HIMSI-removebg-preview.webp');

-- --------------------------------------------------------

--
-- Table structure for table `fasilitas`
--

CREATE TABLE `fasilitas` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `foto_crop` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fasilitas`
--

INSERT INTO `fasilitas` (`id`, `judul`, `deskripsi`, `foto`, `foto_crop`) VALUES
(1, 'Laboratorium Komputer & TIK Interaktif', 'Dilengkapi 30 unit komputer terkini, jaringan Wi-Fi sekolah, dan Smart Display untuk pembelajaran coding dasar & literasi digital.', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600', NULL),
(2, 'Perpustakaan \"Taman Ilmu\"', 'Koleksi ribuan buku cerita, modul pembelajaran, koleksi literasi digital e-book, dan sudut baca ramah anak yang nyaman.', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=600', NULL),
(3, 'Lapangan Olahraga & Upacara', 'Areal seluas 800m² dilapisi plester berkualitas untuk upacara bendera, senam bersama, bulutangkis, basket, dan futsal.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600', NULL),
(4, 'Ruang UKS & Poliklinik Sekolah', 'Fasilitas pertolongan pertama kesehatan dengan tempat tidur bersih, pengukuran TB/BB rutin, dan kerja sama Puskesmas Dau.', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600', NULL),
(5, 'Kantin Sehat Bergizi', 'Menyediakan makanan dan minuman sehat yang higienis, bebas bahan pengawet berbahaya, dan diawasi oleh tim gizi sekolah.', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600', NULL),
(6, 'Taman Edukasi & Green House', 'Area hijau pemanfaatan hidroponik, tanaman toga, dan ruang pengolahan kompos sebagai wahana belajar Adiwiyata.', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600', NULL),
(7, 'Perpustakaan SDN 1 Mulyoagung', '<p data-path-to-node=\"0\"><b data-path-to-node=\"0\" data-index-in-node=\"0\">Perpustakaan SDN 1 Mulyoagung</b> merupakan pusat belajar dan literasi bagi para siswa di kawasan Dau, Kabupaten Malang. Dirancang sebagai ruang yang ramah anak, nyaman, dan edukatif, perpustakaan ini menjadi tempat favorit bagi para murid untuk menjelajahi berbagai ilmu pengetahuan di luar kegiatan belajar mengajar di kelas.</p>', 'backend/uploads/fasilitas/1787278759_b15da8c0_WhatsApp_Image_2026-08-21_at_9.18.37_AM.webp', 'backend/uploads/fasilitas/1787278761_7d82fb5c_WhatsApp_Image_2026-08-21_at_91837_AM.webp');

-- --------------------------------------------------------

--
-- Table structure for table `galeri`
--

CREATE TABLE `galeri` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `foto` varchar(255) NOT NULL,
  `kategori` varchar(100) NOT NULL,
  `tanggal` date NOT NULL,
  `status_verifikasi` enum('Pending','Verified','Rejected') NOT NULL DEFAULT 'Pending',
  `uploaded_by` int(11) DEFAULT NULL,
  `foto_crop` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `galeri`
--

INSERT INTO `galeri` (`id`, `judul`, `deskripsi`, `foto`, `kategori`, `tanggal`, `status_verifikasi`, `uploaded_by`, `foto_crop`) VALUES
(1, 'Menyatukan irama, menggemakan semangat di KARNAMUDA 2025.', '<div>Derap langkah dan dentuman irama kontingen Drumband SDN 1 Mulyoagung siap menguncang KARNAMUDA 2025!</div>', 'backend/uploads/galeri/1787278354_72fb565f_20251023_074756.webp', 'Ekstrakurikuler', '2025-10-22', 'Verified', 1, 'backend/uploads/galeri/1787278356_c883453b_20251023_074756.webp'),
(2, 'test', 'test', 'backend/uploads/galeri/1787282695_dcedb89b_LOGO_HIMSI-removebg-preview.webp', 'Kegiatan Sekolah', '2026-08-21', 'Pending', 2, 'backend/uploads/galeri/1787282695_017a87ca_LOGO_HIMSI-removebg-preview.webp');

-- --------------------------------------------------------

--
-- Table structure for table `guru_tendik`
--

CREATE TABLE `guru_tendik` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `nip` varchar(50) DEFAULT NULL,
  `jabatan` varchar(100) NOT NULL,
  `tugas` varchar(255) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `riwayat_pendidikan` text NOT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') NOT NULL,
  `status` enum('Aktif','Mutasi','Pensiun','') NOT NULL,
  `motto` text DEFAULT NULL,
  `foto_crop` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_carousel`
--

CREATE TABLE `hero_carousel` (
  `id` int(11) NOT NULL,
  `foto` varchar(255) NOT NULL,
  `caption` varchar(255) NOT NULL,
  `tag` varchar(100) DEFAULT 'Kegiatan Utama',
  `urutan` int(11) DEFAULT 0,
  `is_active` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `foto_crop` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hero_carousel`
--

INSERT INTO `hero_carousel` (`id`, `foto`, `caption`, `tag`, `urutan`, `is_active`, `created_at`, `foto_crop`) VALUES
(1, 'backend/uploads/hero/1787279412_4e881e97_Dokumen_dari_Anisa_Choirina_3_.webp', 'MA ONE!!!', 'Galeri Sekolah', 1, 1, '2026-08-21 02:30:14', 'backend/uploads/hero/1787279414_8b9138bc_Dokumen_dari_Anisa_Choirina3.webp'),
(2, 'backend/uploads/hero/1787279439_d98ed81a_Dokumen_dari_Anisa_Choirina_7_.webp', 'MA ONE!!!', 'Galeri Sekolah', 2, 1, '2026-08-21 02:30:41', 'backend/uploads/hero/1787279441_77dc847e_Dokumen_dari_Anisa_Choirina7.webp'),
(3, 'backend/uploads/hero/1787279467_23ac3d40_Dokumen_dari_Anisa_Choirina_8_.webp', 'MA ONE!!!', 'Galeri Sekolah', 3, 1, '2026-08-21 02:31:10', 'backend/uploads/hero/1787279470_5a22fbd8_Dokumen_dari_Anisa_Choirina8.webp');

-- --------------------------------------------------------

--
-- Table structure for table `login_attempts`
--

CREATE TABLE `login_attempts` (
  `id` int(11) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `username` varchar(100) NOT NULL DEFAULT '',
  `attempted_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pengaturan_sekolah`
--

CREATE TABLE `pengaturan_sekolah` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengaturan_sekolah`
--

INSERT INTO `pengaturan_sekolah` (`setting_key`, `setting_value`, `updated_at`) VALUES
('tahun_ajaran', '2025/2026', '2026-08-21 01:47:25'),
('link_ppdb', '', '2026-08-21 01:47:25'),
('email_sekolah', 'sdnmulyoagung01@gmail.com', '2026-08-21 01:47:25'),
('telepon_sekolah', '(0341) 466-730', '2026-08-21 01:47:25'),
('whatsapp_sekolah', '08123456789', '2026-08-21 01:47:25'),
('alamat_sekolah', 'JL. RAYA MULYOAGUNG NO.121 RT. 1 RW. 10 DUSUN MULYOAGUNG , Kec. Dau, Kab. Malang, Prov. Jawa Timur', '2026-08-21 01:47:25'),
('medsos_links', '[{\"id\":\"1\",\"name\":\"YouTube\",\"url\":\"https:\\/\\/www.youtube.com\\/@mulyoagungsatu3851\",\"icon\":\"auto\"},{\"id\":\"2\",\"name\":\"Instagram\",\"url\":\"https:\\/\\/www.instagram.com\\/mulyoagung1_dau\",\"icon\":\"auto\"},{\"id\":\"3\",\"name\":\"Facebook\",\"url\":\"https:\\/\\/www.facebook.com\\/profile.php?id=100085140035121\",\"icon\":\"auto\"},{\"id\":\"4\",\"name\":\"TikTok\",\"url\":\"https:\\/\\/www.tiktok.com\\/@mulyoagung.1\",\"icon\":\"auto\"}]', '2026-08-21 01:47:25'),
('homepage_sections', '[{\"key\":\"hero\",\"judul\":\"Hero\",\"subjudul\":\"\",\"is_active\":true},{\"key\":\"stats\",\"judul\":\"Statistik Sekolah\",\"subjudul\":\"\",\"is_active\":true},{\"key\":\"sambutan\",\"judul\":\"Sambutan Kepala Sekolah\",\"subjudul\":\"\",\"is_active\":true},{\"key\":\"berita\",\"judul\":\"Berita & Kegiatan Terbaru\",\"subjudul\":\"Ikuti terus perkembangan informasi dan aktivitas menarik di sekolah kami.\",\"is_active\":true},{\"key\":\"profil\",\"judul\":\"Profil Sekolah\",\"subjudul\":\"Mengenal lebih dekat visi, misi, dan sejarah panjang SD Negeri 1 Mulyoagung.\",\"is_active\":true},{\"key\":\"video\",\"judul\":\"Profil Video Sekolah\",\"subjudul\":\"Tonton video profil sekolah kami untuk mengenal lingkungan belajar, fasilitas, dan kegiatan siswa secara visual.\",\"is_active\":true},{\"key\":\"kontak\",\"judul\":\"Kontak Kami\",\"subjudul\":\"Hubungi kami atau kunjungi lokasi sekolah dasar kami melalui detail kontak di bawah ini.\",\"is_active\":true}]', '2026-08-21 01:47:25'),
('hero_title', 'Unggul, Berkarakter, dan Berbudaya Lingkungan', '2026-08-21 01:47:25'),
('hero_subtitle', 'Selamat Datang di SD Negeri 1 Mulyoagung. Kami berkomitmen menyelenggarakan pendidikan berkualitas untuk membentuk generasi cerdas, kreatif, berakhlak mulia, dan peduli lingkungan.', '2026-08-21 01:47:25'),
('hero_bg', '', '2026-08-21 01:47:25'),
('video_url', 'https://www.youtube.com/embed/5T2k922_Z8Q', '2026-08-21 01:47:25'),
('profil_visi', 'Terwujudnya peserta didik yang unggul dalam prestasi, berkarakter mulia, cerdas, terampil, serta berwawasan lingkungan berlandaskan iman dan taqwa.', '2026-08-21 01:47:25'),
('profil_misi', '[\"Menyelenggarakan proses pembelajaran yang efektif untuk mengoptimalkan potensi akademik dan non-akademik siswa.\",\"Membina karakter mulia, disiplin, dan budi pekerti luhur berlandaskan nilai-nilai iman dan taqwa.\",\"Mengembangkan keterampilan hidup, kreativitas, dan literasi teknologi informasi sejak dini.\",\"Menciptakan lingkungan sekolah yang bersih, sehat, rindang, dan ramah anak sebagai upaya pelestarian lingkungan.\",\"Menjalin kemitraan yang harmonis antara sekolah, komite, orang tua wali, dan masyarakat sekitar.\"]', '2026-08-21 01:47:25'),
('profil_sejarah', 'SD Negeri 1 Mulyoagung berdiri sejak tahun 1976 di wilayah Kecamatan Dau, Kabupaten Malang. Selama puluhan tahun, sekolah ini telah meluluskan ribuan alumni yang sukses dan terus berkontribusi di berbagai bidang. Dengan komitmen peningkatan mutu berkelanjutan, kami terus berbenah secara fasilitas maupun kurikulum untuk menghadirkan layanan pendidikan dasar terbaik bagi masyarakat.', '2026-08-21 01:47:25'),
('profil_visi', '<span lang=\"EN-ID\" style=\"font-size:12.0pt;line-height:\r\n107%;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:Aptos;mso-ligatures:\r\nnone;mso-ansi-language:EN-ID;mso-fareast-language:EN-US;mso-bidi-language:AR-SA\"><i>Terwujudnya murid yang beriman dan bertakwa, bernalar kritis, berkarakter mulia, sehat\r\njasmani, dan unggul dalam digitalisasi.</i></span>', '2026-08-21 02:14:18'),
('profil_misi', '[\"1.\\tMelaksanakan pembiasaan keagamaan serta menanamkan nilai-nilai keimanan, ketakwaan, dan akhlak mulia melalui kegiatan intrakurikuler, kokurikuler, dan ekstrakurikuler dalam kehidupan sehari-hari.\",\"2.\\tMenyelenggarakan pembelajaran yang berpusat pada murid melalui pendekatan berbasis masalah, proyek, dan pembelajaran mendalam (deep learning) untuk mengembangkan kemampuan bernalar kritis, berpikir reflektif, serta memecahkan masalah.\",\"3.\\tMenumbuhkan karakter mulia murid melalui pembiasaan budaya positif, penguatan disiplin, tanggung jawab, kepedulian, gotong royong, integritas, dan sikap saling menghormati sesuai nilai-nilai Profil Lulusan.\",\"4.\\tMewujudkan lingkungan sekolah yang sehat, aman, nyaman, dan ramah anak melalui pembiasaan hidup bersih dan sehat, kegiatan olahraga, serta pemanfaatan lingkungan sebagai sumber belajar untuk meningkatkan kesehatan jasmani.\",\"5.\\tMengembangkan budaya digital di lingkungan sekolah melalui pemanfaatan teknologi informasi dan komunikasi dalam pembelajaran, pengelolaan sekolah, serta penguatan literasi digital secara bijaksana, kreatif, dan bertanggung jawab dengan dukungan kemitraan berbagai pihak.\"]', '2026-08-21 02:14:18'),
('profil_sejarah', 'SD Negeri 1 Mulyoagung didirikan pada tahun 1970-an di pusat Kecamatan Dau, Kabupaten Malang. Terletak di kawasan strategis yang dekat dengan wilayah wisata, industri, dan lembaga pemerintahan, sekolah ini hadir untuk memenuhi kebutuhan pendidikan masyarakat dengan latar belakang siswa yang beragam.\r\n\r\nPada bulan <b>Desember 2018</b>, sekolah mengalami babak penting dalam perjalanannya melalui proses <i>merger</i>(penggabungan) dua lembaga, yaitu SD Negeri 1 Mulyoagung dan SD Negeri 3 Mulyoagung. Penggabungan ini semakin memperkuat sinergi fasilitas, tenaga pendidik, dan manajemen sekolah dalam menghadirkan layanan pendidikan dasar yang makin berkualitas.\r\n\r\nCiri khas lain yang menjadi kebanggaan sekolah adalah keberadaan <b>Ikon Patung Semar </b>di area sekolah, yang menyimbolkan komitmen kuat SDN 1 Mulyoagung dalam melestarikan nilai-nilai budaya dan kearifan lokal Jawa.\r\n\r\nKini, di bawah kepemimpinan yang berdedikasi serta didukung fasilitator dan Guru Penggerak, SD Negeri 1 Mulyoagung terus bertransformasi menerapkan Kurikulum Merdeka. Sekolah berkomitmen membentuk generasi unggul yang beriman dan bertakwa, berakhlak mulia, bernalar kritis, mandiri, kreatif, serta berkebinekaan global sesuai nilai-nilai Profil Pelajar Pancasila.', '2026-08-21 02:15:20'),
('video_url', 'https://www.youtube.com/watch?v=-HU-Kg20g-M&t=1s', '2026-08-21 02:27:44'),
('tahun_ajaran', '2025/2026', '2026-08-21 02:28:22'),
('link_ppdb', 'https://sd-spmbmalangkab.id/', '2026-08-21 02:28:22'),
('tahun_ajaran', '2025/2026', '2026-08-21 02:28:41'),
('link_ppdb', 'https://sd-spmbmalangkab.id/', '2026-08-21 02:28:41'),
('email_sekolah', 'sdnmulyoagung01@gmail.com', '2026-08-21 02:28:41'),
('telepon_sekolah', '(0341) 466-730', '2026-08-21 02:28:41'),
('whatsapp_sekolah', '08123456789', '2026-08-21 02:28:41'),
('alamat_sekolah', 'JL. RAYA MULYOAGUNG NO.121 RT. 1 RW. 10 DUSUN MULYOAGUNG , Kec. Dau, Kab. Malang, Prov. Jawa Timur', '2026-08-21 02:28:41'),
('medsos_links', '[{\"id\":\"1\",\"name\":\"YouTube\",\"url\":\"https://www.youtube.com/@mulyoagungsatu3851\",\"icon\":\"auto\"},{\"id\":\"2\",\"name\":\"Instagram\",\"url\":\"https://www.instagram.com/mulyoagung1_dau\",\"icon\":\"auto\"},{\"id\":\"3\",\"name\":\"Facebook\",\"url\":\"https://www.facebook.com/profile.php?id=100085140035121\",\"icon\":\"auto\"},{\"id\":\"4\",\"name\":\"TikTok\",\"url\":\"https://www.tiktok.com/@mulyoagung.1\",\"icon\":\"auto\"}]', '2026-08-21 02:28:41'),
('homepage_sections', '[{\"key\":\"hero\",\"judul\":\"Hero\",\"subjudul\":\"\",\"is_active\":true},{\"key\":\"stats\",\"judul\":\"Statistik Sekolah\",\"subjudul\":\"\",\"is_active\":true},{\"key\":\"sambutan\",\"judul\":\"Sambutan Kepala Sekolah\",\"subjudul\":\"\",\"is_active\":true},{\"key\":\"berita\",\"judul\":\"Berita & Kegiatan Terbaru\",\"subjudul\":\"Ikuti terus perkembangan informasi dan aktivitas menarik di sekolah kami.\",\"is_active\":true},{\"key\":\"profil\",\"judul\":\"Profil Sekolah\",\"subjudul\":\"Mengenal lebih dekat visi, misi, dan sejarah panjang SD Negeri 1 Mulyoagung.\",\"is_active\":true},{\"key\":\"video\",\"judul\":\"Profil Video Sekolah\",\"subjudul\":\"Tonton video profil sekolah kami untuk mengenal lingkungan belajar, fasilitas, dan kegiatan siswa secara visual.\",\"is_active\":true},{\"key\":\"kontak\",\"judul\":\"Kontak Kami\",\"subjudul\":\"Hubungi kami atau kunjungi lokasi sekolah dasar kami melalui detail kontak di bawah ini.\",\"is_active\":true}]', '2026-08-21 02:28:41'),
('hero_title', 'SD Negeri 1 Mulyoagung', '2026-08-21 02:28:41'),
('hero_subtitle', 'Selamat Datang di SD Negeri 1 Mulyoagung. Kami berkomitmen menyelenggarakan pendidikan berkualitas untuk membentuk generasi cerdas, kreatif, berakhlak mulia, dan peduli lingkungan.', '2026-08-21 02:28:41'),
('video_url', 'https://www.youtube.com/watch?v=-HU-Kg20g-M&t=1s', '2026-08-21 02:28:41'),
('profil_visi', '<span lang=\"EN-ID\" style=\"font-size:12.0pt;line-height:\r\n107%;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:Aptos;mso-ligatures:\r\nnone;mso-ansi-language:EN-ID;mso-fareast-language:EN-US;mso-bidi-language:AR-SA\"><i>Terwujudnya murid yang beriman dan bertakwa, bernalar kritis, berkarakter mulia, sehat\r\njasmani, dan unggul dalam digitalisasi.</i></span>', '2026-08-21 02:28:41'),
('profil_misi', '[\"1.\\tMelaksanakan pembiasaan keagamaan serta menanamkan nilai-nilai keimanan, ketakwaan, dan akhlak mulia melalui kegiatan intrakurikuler, kokurikuler, dan ekstrakurikuler dalam kehidupan sehari-hari.\",\"2.\\tMenyelenggarakan pembelajaran yang berpusat pada murid melalui pendekatan berbasis masalah, proyek, dan pembelajaran mendalam (deep learning) untuk mengembangkan kemampuan bernalar kritis, berpikir reflektif, serta memecahkan masalah.\",\"3.\\tMenumbuhkan karakter mulia murid melalui pembiasaan budaya positif, penguatan disiplin, tanggung jawab, kepedulian, gotong royong, integritas, dan sikap saling menghormati sesuai nilai-nilai Profil Lulusan.\",\"4.\\tMewujudkan lingkungan sekolah yang sehat, aman, nyaman, dan ramah anak melalui pembiasaan hidup bersih dan sehat, kegiatan olahraga, serta pemanfaatan lingkungan sebagai sumber belajar untuk meningkatkan kesehatan jasmani.\",\"5.\\tMengembangkan budaya digital di lingkungan sekolah melalui pemanfaatan teknologi informasi dan komunikasi dalam pembelajaran, pengelolaan sekolah, serta penguatan literasi digital secara bijaksana, kreatif, dan bertanggung jawab dengan dukungan kemitraan berbagai pihak.\"]', '2026-08-21 02:28:41'),
('profil_sejarah', 'SD Negeri 1 Mulyoagung didirikan pada tahun 1970-an di pusat Kecamatan Dau, Kabupaten Malang. Terletak di kawasan strategis yang dekat dengan wilayah wisata, industri, dan lembaga pemerintahan, sekolah ini hadir untuk memenuhi kebutuhan pendidikan masyarakat dengan latar belakang siswa yang beragam.\r\n\r\nPada bulan <b>Desember 2018</b>, sekolah mengalami babak penting dalam perjalanannya melalui proses <i>merger</i>(penggabungan) dua lembaga, yaitu SD Negeri 1 Mulyoagung dan SD Negeri 3 Mulyoagung. Penggabungan ini semakin memperkuat sinergi fasilitas, tenaga pendidik, dan manajemen sekolah dalam menghadirkan layanan pendidikan dasar yang makin berkualitas.\r\n\r\nCiri khas lain yang menjadi kebanggaan sekolah adalah keberadaan <b>Ikon Patung Semar </b>di area sekolah, yang menyimbolkan komitmen kuat SDN 1 Mulyoagung dalam melestarikan nilai-nilai budaya dan kearifan lokal Jawa.\r\n\r\nKini, di bawah kepemimpinan yang berdedikasi serta didukung fasilitator dan Guru Penggerak, SD Negeri 1 Mulyoagung terus bertransformasi menerapkan Kurikulum Merdeka. Sekolah berkomitmen membentuk generasi unggul yang beriman dan bertakwa, berakhlak mulia, bernalar kritis, mandiri, kreatif, serta berkebinekaan global sesuai nilai-nilai Profil Pelajar Pancasila.', '2026-08-21 02:28:41'),
('email_sekolah', 'sdnmulyoagung01@gmail.com', '2026-08-21 02:31:28'),
('telepon_sekolah', '(0341) 466-730', '2026-08-21 02:31:28'),
('whatsapp_sekolah', '08123456789(BLM ADA)', '2026-08-21 02:31:28'),
('alamat_sekolah', 'JL. RAYA MULYOAGUNG NO.121 RT. 1 RW. 10 DUSUN MULYOAGUNG , Kec. Dau, Kab. Malang, Prov. Jawa Timur', '2026-08-21 02:31:28'),
('medsos_links', '[{\"id\":\"1\",\"name\":\"YouTube\",\"url\":\"https://www.youtube.com/@mulyoagungsatu3851\",\"icon\":\"auto\"},{\"id\":\"2\",\"name\":\"Instagram\",\"url\":\"https://www.instagram.com/mulyoagung1_dau\",\"icon\":\"auto\"},{\"id\":\"3\",\"name\":\"Facebook\",\"url\":\"https://www.facebook.com/profile.php?id=100085140035121\",\"icon\":\"auto\"},{\"id\":\"4\",\"name\":\"TikTok\",\"url\":\"https://www.tiktok.com/@mulyoagung.1\",\"icon\":\"auto\"}]', '2026-08-21 02:31:39'),
('tahun_ajaran', '2025/2026', '2026-08-21 02:32:15'),
('link_ppdb', 'https://sd-spmbmalangkab.id/', '2026-08-21 02:32:15'),
('tahun_ajaran', '2025/2026', '2026-08-21 02:33:58'),
('link_ppdb', 'https://sd-spmbmalangkab.id/', '2026-08-21 02:33:58'),
('tahun_ajaran', '2025/2026', '2026-08-21 02:34:35'),
('link_ppdb', 'https://sd-spmbmalangkab.id/', '2026-08-21 02:34:35'),
('email_sekolah', 'sdnmulyoagung01@gmail.com', '2026-08-21 02:51:20'),
('telepon_sekolah', '(0341) 466-730', '2026-08-21 02:51:20'),
('whatsapp_sekolah', '08123456789(BLM ADA)', '2026-08-21 02:51:20'),
('alamat_sekolah', 'JL. RAYA MULYOAGUNG NO.121 RT. 1 RW. 10 DUSUN MULYOAGUNG , Kec. Dau, Kab. Malang, Prov. Jawa Timur', '2026-08-21 02:51:20'),
('email_sekolah', 'sdnmulyoagung01@gmail.com', '2026-08-21 02:51:24'),
('telepon_sekolah', '(0341) 466-730a', '2026-08-21 02:51:24'),
('whatsapp_sekolah', '08123456789(BLM ADA)', '2026-08-21 02:51:24'),
('alamat_sekolah', 'JL. RAYA MULYOAGUNG NO.121 RT. 1 RW. 10 DUSUN MULYOAGUNG , Kec. Dau, Kab. Malang, Prov. Jawa Timur', '2026-08-21 02:51:24'),
('email_sekolah', 'sdnmulyoagung01@gmail.com', '2026-08-21 02:51:55'),
('telepon_sekolah', '(0341) 466-730', '2026-08-21 02:51:55'),
('whatsapp_sekolah', '08123456789(BLM ADA)', '2026-08-21 02:51:55'),
('alamat_sekolah', 'JL. RAYA MULYOAGUNG NO.121 RT. 1 RW. 10 DUSUN MULYOAGUNG , Kec. Dau, Kab. Malang, Prov. Jawa Timur', '2026-08-21 02:51:55'),
('tahun_ajaran', '2025/2026', '2026-08-21 02:53:19'),
('link_ppdb', 'https://sd-spmbmalangkab.id/', '2026-08-21 02:53:19'),
('email_sekolah', 'sdnmulyoagung01@gmail.com', '2026-08-21 02:53:19'),
('telepon_sekolah', '(0341) 466-730', '2026-08-21 02:53:19'),
('whatsapp_sekolah', '08123456789(BLM ADA)', '2026-08-21 02:53:19'),
('alamat_sekolah', 'JL. RAYA MULYOAGUNG NO.121 RT. 1 RW. 10 DUSUN MULYOAGUNG , Kec. Dau, Kab. Malang, Prov. Jawa Timur', '2026-08-21 02:53:19'),
('medsos_links', '[{\"id\":\"1\",\"name\":\"YouTube\",\"url\":\"https://www.youtube.com/@mulyoagungsatu3851\",\"icon\":\"auto\"},{\"id\":\"2\",\"name\":\"Instagram\",\"url\":\"https://www.instagram.com/mulyoagung1_dau\",\"icon\":\"auto\"},{\"id\":\"3\",\"name\":\"Facebook\",\"url\":\"https://www.facebook.com/profile.php?id=100085140035121\",\"icon\":\"auto\"},{\"id\":\"4\",\"name\":\"TikTok\",\"url\":\"https://www.tiktok.com/@mulyoagung.1\",\"icon\":\"auto\"}]', '2026-08-21 02:53:19'),
('homepage_sections', '[{\"key\":\"hero\",\"judul\":\"Hero\",\"subjudul\":\"\",\"is_active\":true},{\"key\":\"stats\",\"judul\":\"Statistik Sekolah\",\"subjudul\":\"\",\"is_active\":true},{\"key\":\"sambutan\",\"judul\":\"Sambutan Kepala Sekolah\",\"subjudul\":\"\",\"is_active\":true},{\"key\":\"berita\",\"judul\":\"Berita & Kegiatan Terbaru\",\"subjudul\":\"Ikuti terus perkembangan informasi dan aktivitas menarik di sekolah kami.\",\"is_active\":true},{\"key\":\"profil\",\"judul\":\"Profil Sekolah\",\"subjudul\":\"Mengenal lebih dekat visi, misi, dan sejarah panjang SD Negeri 1 Mulyoagung.\",\"is_active\":true},{\"key\":\"video\",\"judul\":\"Profil Video Sekolah\",\"subjudul\":\"Tonton video profil sekolah kami untuk mengenal lingkungan belajar, fasilitas, dan kegiatan siswa secara visual.\",\"is_active\":true},{\"key\":\"kontak\",\"judul\":\"Kontak Kami\",\"subjudul\":\"Hubungi kami atau kunjungi lokasi sekolah dasar kami melalui detail kontak di bawah ini.\",\"is_active\":true}]', '2026-08-21 02:53:19'),
('hero_title', 'SD Negeri 1 Mulyoagung', '2026-08-21 02:53:19'),
('hero_subtitle', 'Selamat Datang di SD Negeri 1 Mulyoagung. Kami berkomitmen menyelenggarakan pendidikan berkualitas untuk membentuk generasi cerdas, kreatif, berakhlak mulia, dan peduli lingkungan.ppp', '2026-08-21 02:53:19'),
('video_url', 'https://www.youtube.com/watch?v=-HU-Kg20g-M&t=1s', '2026-08-21 02:53:19'),
('profil_visi', '<span lang=\"EN-ID\" style=\"font-size:12.0pt;line-height:\r\n107%;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:Aptos;mso-ligatures:\r\nnone;mso-ansi-language:EN-ID;mso-fareast-language:EN-US;mso-bidi-language:AR-SA\"><i>Terwujudnya murid yang beriman dan bertakwa, bernalar kritis, berkarakter mulia, sehat\r\njasmani, dan unggul dalam digitalisasi.</i></span>', '2026-08-21 02:53:19'),
('profil_misi', '[\"1.\\tMelaksanakan pembiasaan keagamaan serta menanamkan nilai-nilai keimanan, ketakwaan, dan akhlak mulia melalui kegiatan intrakurikuler, kokurikuler, dan ekstrakurikuler dalam kehidupan sehari-hari.\",\"2.\\tMenyelenggarakan pembelajaran yang berpusat pada murid melalui pendekatan berbasis masalah, proyek, dan pembelajaran mendalam (deep learning) untuk mengembangkan kemampuan bernalar kritis, berpikir reflektif, serta memecahkan masalah.\",\"3.\\tMenumbuhkan karakter mulia murid melalui pembiasaan budaya positif, penguatan disiplin, tanggung jawab, kepedulian, gotong royong, integritas, dan sikap saling menghormati sesuai nilai-nilai Profil Lulusan.\",\"4.\\tMewujudkan lingkungan sekolah yang sehat, aman, nyaman, dan ramah anak melalui pembiasaan hidup bersih dan sehat, kegiatan olahraga, serta pemanfaatan lingkungan sebagai sumber belajar untuk meningkatkan kesehatan jasmani.\",\"5.\\tMengembangkan budaya digital di lingkungan sekolah melalui pemanfaatan teknologi informasi dan komunikasi dalam pembelajaran, pengelolaan sekolah, serta penguatan literasi digital secara bijaksana, kreatif, dan bertanggung jawab dengan dukungan kemitraan berbagai pihak.\"]', '2026-08-21 02:53:19'),
('profil_sejarah', 'SD Negeri 1 Mulyoagung didirikan pada tahun 1970-an di pusat Kecamatan Dau, Kabupaten Malang. Terletak di kawasan strategis yang dekat dengan wilayah wisata, industri, dan lembaga pemerintahan, sekolah ini hadir untuk memenuhi kebutuhan pendidikan masyarakat dengan latar belakang siswa yang beragam.\r\n\r\nPada bulan <b>Desember 2018</b>, sekolah mengalami babak penting dalam perjalanannya melalui proses <i>merger</i>(penggabungan) dua lembaga, yaitu SD Negeri 1 Mulyoagung dan SD Negeri 3 Mulyoagung. Penggabungan ini semakin memperkuat sinergi fasilitas, tenaga pendidik, dan manajemen sekolah dalam menghadirkan layanan pendidikan dasar yang makin berkualitas.\r\n\r\nCiri khas lain yang menjadi kebanggaan sekolah adalah keberadaan <b>Ikon Patung Semar </b>di area sekolah, yang menyimbolkan komitmen kuat SDN 1 Mulyoagung dalam melestarikan nilai-nilai budaya dan kearifan lokal Jawa.\r\n\r\nKini, di bawah kepemimpinan yang berdedikasi serta didukung fasilitator dan Guru Penggerak, SD Negeri 1 Mulyoagung terus bertransformasi menerapkan Kurikulum Merdeka. Sekolah berkomitmen membentuk generasi unggul yang beriman dan bertakwa, berakhlak mulia, bernalar kritis, mandiri, kreatif, serta berkebinekaan global sesuai nilai-nilai Profil Pelajar Pancasila.', '2026-08-21 02:53:19'),
('tahun_ajaran', '2025/2026', '2026-08-21 02:53:44'),
('link_ppdb', 'https://sd-spmbmalangkab.id/', '2026-08-21 02:53:44'),
('email_sekolah', 'sdnmulyoagung01@gmail.com', '2026-08-21 02:53:44'),
('telepon_sekolah', '(0341) 466-730', '2026-08-21 02:53:44'),
('whatsapp_sekolah', '08123456789(BLM ADA)', '2026-08-21 02:53:44'),
('alamat_sekolah', 'JL. RAYA MULYOAGUNG NO.121 RT. 1 RW. 10 DUSUN MULYOAGUNG , Kec. Dau, Kab. Malang, Prov. Jawa Timur', '2026-08-21 02:53:44'),
('medsos_links', '[{\"id\":\"1\",\"name\":\"YouTube\",\"url\":\"https://www.youtube.com/@mulyoagungsatu3851\",\"icon\":\"auto\"},{\"id\":\"2\",\"name\":\"Instagram\",\"url\":\"https://www.instagram.com/mulyoagung1_dau\",\"icon\":\"auto\"},{\"id\":\"3\",\"name\":\"Facebook\",\"url\":\"https://www.facebook.com/profile.php?id=100085140035121\",\"icon\":\"auto\"},{\"id\":\"4\",\"name\":\"TikTok\",\"url\":\"https://www.tiktok.com/@mulyoagung.1\",\"icon\":\"auto\"}]', '2026-08-21 02:53:44'),
('homepage_sections', '[{\"key\":\"hero\",\"judul\":\"Hero\",\"subjudul\":\"\",\"is_active\":true},{\"key\":\"stats\",\"judul\":\"Statistik Sekolah\",\"subjudul\":\"\",\"is_active\":true},{\"key\":\"sambutan\",\"judul\":\"Sambutan Kepala Sekolah\",\"subjudul\":\"\",\"is_active\":true},{\"key\":\"berita\",\"judul\":\"Berita & Kegiatan Terbaru\",\"subjudul\":\"Ikuti terus perkembangan informasi dan aktivitas menarik di sekolah kami.\",\"is_active\":true},{\"key\":\"profil\",\"judul\":\"Profil Sekolah\",\"subjudul\":\"Mengenal lebih dekat visi, misi, dan sejarah panjang SD Negeri 1 Mulyoagung.\",\"is_active\":true},{\"key\":\"video\",\"judul\":\"Profil Video Sekolah\",\"subjudul\":\"Tonton video profil sekolah kami untuk mengenal lingkungan belajar, fasilitas, dan kegiatan siswa secara visual.\",\"is_active\":true},{\"key\":\"kontak\",\"judul\":\"Kontak Kami\",\"subjudul\":\"Hubungi kami atau kunjungi lokasi sekolah dasar kami melalui detail kontak di bawah ini.\",\"is_active\":true}]', '2026-08-21 02:53:44'),
('hero_title', 'SD Negeri 1 Mulyoagung', '2026-08-21 02:53:44'),
('hero_subtitle', 'Selamat Datang di SD Negeri 1 Mulyoagung. Kami berkomitmen menyelenggarakan pendidikan berkualitas untuk membentuk generasi cerdas, kreatif, berakhlak mulia, dan peduli lingkungan.', '2026-08-21 02:53:44'),
('video_url', 'https://www.youtube.com/watch?v=-HU-Kg20g-M&t=1s', '2026-08-21 02:53:44'),
('profil_visi', '<span lang=\"EN-ID\" style=\"font-size:12.0pt;line-height:\r\n107%;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:Aptos;mso-ligatures:\r\nnone;mso-ansi-language:EN-ID;mso-fareast-language:EN-US;mso-bidi-language:AR-SA\"><i>Terwujudnya murid yang beriman dan bertakwa, bernalar kritis, berkarakter mulia, sehat\r\njasmani, dan unggul dalam digitalisasi.</i></span>', '2026-08-21 02:53:45'),
('profil_misi', '[\"1.\\tMelaksanakan pembiasaan keagamaan serta menanamkan nilai-nilai keimanan, ketakwaan, dan akhlak mulia melalui kegiatan intrakurikuler, kokurikuler, dan ekstrakurikuler dalam kehidupan sehari-hari.\",\"2.\\tMenyelenggarakan pembelajaran yang berpusat pada murid melalui pendekatan berbasis masalah, proyek, dan pembelajaran mendalam (deep learning) untuk mengembangkan kemampuan bernalar kritis, berpikir reflektif, serta memecahkan masalah.\",\"3.\\tMenumbuhkan karakter mulia murid melalui pembiasaan budaya positif, penguatan disiplin, tanggung jawab, kepedulian, gotong royong, integritas, dan sikap saling menghormati sesuai nilai-nilai Profil Lulusan.\",\"4.\\tMewujudkan lingkungan sekolah yang sehat, aman, nyaman, dan ramah anak melalui pembiasaan hidup bersih dan sehat, kegiatan olahraga, serta pemanfaatan lingkungan sebagai sumber belajar untuk meningkatkan kesehatan jasmani.\",\"5.\\tMengembangkan budaya digital di lingkungan sekolah melalui pemanfaatan teknologi informasi dan komunikasi dalam pembelajaran, pengelolaan sekolah, serta penguatan literasi digital secara bijaksana, kreatif, dan bertanggung jawab dengan dukungan kemitraan berbagai pihak.\"]', '2026-08-21 02:53:45'),
('profil_sejarah', 'SD Negeri 1 Mulyoagung didirikan pada tahun 1970-an di pusat Kecamatan Dau, Kabupaten Malang. Terletak di kawasan strategis yang dekat dengan wilayah wisata, industri, dan lembaga pemerintahan, sekolah ini hadir untuk memenuhi kebutuhan pendidikan masyarakat dengan latar belakang siswa yang beragam.\r\n\r\nPada bulan <b>Desember 2018</b>, sekolah mengalami babak penting dalam perjalanannya melalui proses <i>merger</i>(penggabungan) dua lembaga, yaitu SD Negeri 1 Mulyoagung dan SD Negeri 3 Mulyoagung. Penggabungan ini semakin memperkuat sinergi fasilitas, tenaga pendidik, dan manajemen sekolah dalam menghadirkan layanan pendidikan dasar yang makin berkualitas.\r\n\r\nCiri khas lain yang menjadi kebanggaan sekolah adalah keberadaan <b>Ikon Patung Semar </b>di area sekolah, yang menyimbolkan komitmen kuat SDN 1 Mulyoagung dalam melestarikan nilai-nilai budaya dan kearifan lokal Jawa.\r\n\r\nKini, di bawah kepemimpinan yang berdedikasi serta didukung fasilitator dan Guru Penggerak, SD Negeri 1 Mulyoagung terus bertransformasi menerapkan Kurikulum Merdeka. Sekolah berkomitmen membentuk generasi unggul yang beriman dan bertakwa, berakhlak mulia, bernalar kritis, mandiri, kreatif, serta berkebinekaan global sesuai nilai-nilai Profil Pelajar Pancasila.', '2026-08-21 02:53:45'),
('email_sekolah', 'sdnmulyoagung01@gmail.com', '2026-08-21 02:55:48'),
('telepon_sekolah', '(0341) 466-730', '2026-08-21 02:55:48'),
('whatsapp_sekolah', '08123456789(BLM ADA)', '2026-08-21 02:55:48'),
('alamat_sekolah', 'JL. RAYA MULYOAGUNG NO.121 RT. 1 RW. 10 DUSUN MULYOAGUNG , Kec. Dau, Kab. Malang, Prov. Jawa Timur', '2026-08-21 02:55:48');

-- --------------------------------------------------------

--
-- Table structure for table `pengumuman_penting`
--

CREATE TABLE `pengumuman_penting` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `isi` text NOT NULL,
  `running_text` varchar(255) DEFAULT NULL,
  `show_popup` tinyint(1) NOT NULL DEFAULT 1,
  `show_button` tinyint(1) NOT NULL DEFAULT 0,
  `button_text` varchar(100) DEFAULT NULL,
  `button_link` varchar(255) DEFAULT NULL,
  `show_photo` tinyint(1) NOT NULL DEFAULT 0,
  `foto` varchar(255) DEFAULT NULL,
  `photo_link` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `tanggal_mulai` date DEFAULT NULL,
  `tanggal_selesai` date DEFAULT NULL,
  `foto_crop` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengumuman_penting`
--

INSERT INTO `pengumuman_penting` (`id`, `judul`, `isi`, `running_text`, `show_popup`, `show_button`, `button_text`, `button_link`, `show_photo`, `foto`, `photo_link`, `is_active`, `tanggal_mulai`, `tanggal_selesai`, `foto_crop`) VALUES
(1, 'Dirgahayu Indonesia', 'DIRGAHAYU INDONESIA', '', 1, 1, 'youtube.com', 'Merdeka', 1, 'backend/uploads/pengumuman/1787277384_688aef18_17_Agustus_2026.png', '', 1, '2026-08-21', '2026-08-28', 'backend/uploads/pengumuman/1787277384_679d16ed_17_Agustus_2026.png');

-- --------------------------------------------------------

--
-- Table structure for table `sambutan_kepsek`
--

CREATE TABLE `sambutan_kepsek` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `sambutan` text NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `foto_crop` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sambutan_kepsek`
--

INSERT INTO `sambutan_kepsek` (`id`, `nama`, `sambutan`, `foto`, `foto_crop`) VALUES
(1, 'Amalia Dyah Erviana, S.Pd.', '<b>Assalamualaikum Wr. Wb</b><div>Selamat datang di website resmi SD Negeri Mulyoagung 1. Kami berkomitmen memberikan pendidikan terbaik bagi putra-putri Anda, membimbing mereka menjadi generasi yang tidak hanya cerdas secara akademik, namun juga memiliki karakter dan budi pekerti yang luhur. \\r\\n\\r\\nMelalui semangat kebersamaan, inovasi pembelajaran berbasis digital, dan penguatan Profil Pelajar Pancasila, kami yakin dapat membentuk peserta didik yang siap menghadapi tantangan masa depan dengan tetap memegang teguh nilai-nilai keagamaan dan budaya bangsa. Melalui website ini, kami berharap dapat menjalin komunikasi yang lebih erat dengan seluruh masyarakat dan orang tua wali murid.\r\n<div><br></div></div>', 'backend/uploads/sambutan/1787279072_89ecf9e7_Amalia_Dyah_Erviana.jpg', 'backend/uploads/sambutan/1787279072_f8520b37_Amalia_Dyah_Erviana.png');

-- --------------------------------------------------------

--
-- Table structure for table `statistik_sekolah`
--

CREATE TABLE `statistik_sekolah` (
  `id` int(11) NOT NULL,
  `judul` varchar(50) NOT NULL,
  `jumlah` varchar(50) NOT NULL,
  `label` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `statistik_sekolah`
--

INSERT INTO `statistik_sekolah` (`id`, `judul`, `jumlah`, `label`) VALUES
(1, 'Siswa Aktif', '250 +', 'Siswa Aktif'),
(2, 'Alumni', '1000+', 'Alumni'),
(3, 'Akreditasi', 'A', 'Akreditasi');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','TIM') NOT NULL DEFAULT 'TIM',
  `nama_penanggung_jawab` varchar(255) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `foto_crop` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `nama_penanggung_jawab`, `foto`, `foto_crop`) VALUES
(1, 'ilhamzainuri', 'ilham123', 'ADMIN', 'Ilham Zainuri', 'backend/uploads/profile/1787279607_92fc7528_20260409233815_1.webp', 'backend/uploads/profile/1787279607_ef61477b_20260409233815_1.webp'),
(2, 'pramukajaya', 'pramukajaya', 'TIM', 'Tim Pramuka', '', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `berita`
--
ALTER TABLE `berita`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `fasilitas`
--
ALTER TABLE `fasilitas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `galeri`
--
ALTER TABLE `galeri`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `guru_tendik`
--
ALTER TABLE `guru_tendik`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hero_carousel`
--
ALTER TABLE `hero_carousel`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pengumuman_penting`
--
ALTER TABLE `pengumuman_penting`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sambutan_kepsek`
--
ALTER TABLE `sambutan_kepsek`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `statistik_sekolah`
--
ALTER TABLE `statistik_sekolah`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `berita`
--
ALTER TABLE `berita`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `fasilitas`
--
ALTER TABLE `fasilitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `galeri`
--
ALTER TABLE `galeri`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `guru_tendik`
--
ALTER TABLE `guru_tendik`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hero_carousel`
--
ALTER TABLE `hero_carousel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `login_attempts`
--
ALTER TABLE `login_attempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengumuman_penting`
--
ALTER TABLE `pengumuman_penting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sambutan_kepsek`
--
ALTER TABLE `sambutan_kepsek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `statistik_sekolah`
--
ALTER TABLE `statistik_sekolah`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
