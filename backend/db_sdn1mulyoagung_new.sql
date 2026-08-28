-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 28, 2026 at 03:21 AM
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
(9, 'Festival Lomba seni dan sastra', '<div style=\"text-align: justify;\">Seni dan sastra bukan sekadar kompetisi, melainkan ruang ekspresi dan apresiasi. Melalui Festival Lomba Seni dan Sastra, generasi muda diajak untuk merayakan keberagaman budaya dan menyuarakan gagasan lewat karya. Baca selengkapnya ulasan mendalam mengenai perjalanan para peserta dan keindahan karya yang tercipta di panggung FLS2N.</div>', 'backend/uploads/berita/1787538849_f4f2ba33_20260414_141705.jpg', 'Prestasi', '2026-08-24', 'Verified', 1, 'backend/uploads/berita/1787538849_f6d48ddf_20260414_141705.png'),
(11, 'test', 'p', 'backend/uploads/berita/1787717203_ddd12988_p.jpe', 'Pengumuman', '2026-08-26', 'Verified', 1, 'backend/uploads/berita/1787717203_45a1b772_p.png');

-- --------------------------------------------------------

--
-- Table structure for table `fasilitas`
--

CREATE TABLE `fasilitas` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `foto_crop` varchar(255) DEFAULT NULL,
  `status_verifikasi` varchar(50) DEFAULT 'Verified',
  `uploaded_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fasilitas`
--

INSERT INTO `fasilitas` (`id`, `judul`, `deskripsi`, `foto`, `foto_crop`, `status_verifikasi`, `uploaded_by`) VALUES
(3, 'Lapangan Olahraga & Upacara', 'Areal seluas 800m² dilapisi plester berkualitas untuk upacara bendera, senam bersama, bulutangkis, basket, dan futsal.', 'backend/uploads/fasilitas/1787716637_2b203328_lapangan.jpeg', 'backend/uploads/fasilitas/1787716637_a90de880_lapangan.png', 'Verified', NULL),
(4, 'Ruang UKS & Poliklinik Sekolah', 'Fasilitas pertolongan pertama kesehatan dengan tempat tidur bersih, pengukuran TB/BB rutin, dan kerja sama Puskesmas Dau.', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600', NULL, 'Verified', NULL),
(7, 'Perpustakaan SDN 1 Mulyoagung', '<p data-path-to-node=\"0\"><b data-path-to-node=\"0\" data-index-in-node=\"0\">Perpustakaan SDN 1 Mulyoagung</b> merupakan pusat belajar dan literasi bagi para siswa di kawasan Dau, Kabupaten Malang. Dirancang sebagai ruang yang ramah anak, nyaman, dan edukatif, perpustakaan ini menjadi tempat favorit bagi para murid untuk menjelajahi berbagai ilmu pengetahuan di luar kegiatan belajar mengajar di kelas.</p>', 'backend/uploads/fasilitas/1787278759_b15da8c0_WhatsApp_Image_2026-08-21_at_9.18.37_AM.webp', 'backend/uploads/fasilitas/1787278761_7d82fb5c_WhatsApp_Image_2026-08-21_at_91837_AM.webp', 'Verified', NULL);

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
(1, 'Menyatukan irama, menggemakan semangat di KARNAMUDA 2025.', '<div>Derap langkah dan dentuman irama kontingen Drumband SDN 1 Mulyoagung siap menguncang KARNAMUDA 2025!</div>', 'backend/uploads/galeri/1787278354_72fb565f_20251023_074756.webp', 'Ekstrakurikuler', '2025-10-22', 'Verified', 1, 'backend/uploads/galeri/1787278356_c883453b_20251023_074756.webp');

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
  `foto_crop` varchar(255) DEFAULT NULL,
  `status_verifikasi` varchar(50) DEFAULT 'Verified',
  `uploaded_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `guru_tendik`
--

INSERT INTO `guru_tendik` (`id`, `nama`, `nip`, `jabatan`, `tugas`, `foto`, `riwayat_pendidikan`, `jenis_kelamin`, `status`, `motto`, `foto_crop`, `status_verifikasi`, `uploaded_by`) VALUES
(1, 'Bpk. Soleh', NULL, 'Komite Sekolah', 'Komite Sekolah', '', '-', 'Laki-laki', 'Aktif', 'p', NULL, 'Verified', NULL),
(2, 'Amalia Dyah Erviana, S.Pd.', '198507172006042012', 'Kepala Sekolah', 'Kepala Sekolah', 'backend/uploads/guru/1787540662_308c43c6_Amalia_Dyah_Erviana.jpg', 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'Perempuan', 'Aktif', 'Mewujudkan sekolah unggul, berkarakter, dan berprestasi.', 'backend/uploads/guru/1787540662_bf4498b4_Amalia_Dyah_Erviana.png', 'Verified', NULL),
(4, 'ANISA CHOIRINA, S.Pd.', NULL, 'Tata Usaha', 'Unit Perpustakaan & Tata Usaha', '', 'S1', 'Perempuan', 'Aktif', '', NULL, 'Verified', NULL),
(5, 'Zainuri, M.Pd.', '1608080101930003', 'Guru Mata Pelajaran', 'Guru PAI', '', 'S2 PGMI (Pendidikan Guru Madrasah Ibtidaiyah)', 'Laki-laki', 'Aktif', '', NULL, 'Verified', NULL),
(8, 'Sunu Hayutama, S.Pd.', '198209042022212010', 'Guru Wali Kelas', 'Guru Kelas 1A', '', 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'Perempuan', 'Aktif', '', NULL, 'Verified', NULL),
(9, 'FANDI ARI WIJAYA, S.Or., Gr.', NULL, 'Guru Mata Pelajaran', 'Guru PJOK', '', 'S1 Sarjana OLahraga', 'Laki-laki', 'Aktif', '', NULL, 'Verified', NULL),
(10, 'WEGA BAGUS SETIAWAN, S.Or., M.Pd., Gr.', '199503302024211015', 'Guru Mata Pelajaran', 'Guru PJOK', '', 'S2 PJOK (Pendidikan Jasmani, Olahraga, dan Kesehatan)', 'Laki-laki', 'Aktif', '', NULL, 'Verified', NULL),
(11, 'Putri Anggun Liarta, S.Pd.', '199501162025212010', 'Guru Wali Kelas', 'Guru Kelas 1B', '', 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'Perempuan', 'Aktif', '', NULL, 'Verified', NULL),
(12, 'Ratna Yuliya Kirnawati S,Pd', '199201072023212033', 'Guru Wali Kelas', 'Guru Kelas 2A', '', 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'Perempuan', 'Aktif', '', NULL, 'Verified', NULL),
(13, 'Adi Kurniawan, S.Pd.', '198802282023211006', 'Guru Wali Kelas', 'Guru Kelas 3A & 3B', '', 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'Laki-laki', 'Aktif', '', NULL, 'Verified', NULL),
(14, 'Siti Maisaroh, S.Ag., S.Pd.', '19770525 201408 2 003', 'Guru Wali Kelas', 'Guru Kelas 5A', '', 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'Perempuan', 'Aktif', '', NULL, 'Verified', NULL),
(15, 'Sri Hartatik, S.Pd.', '197501052021212004', 'Guru Wali Kelas', 'Guru Kelas 4B', '', 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'Perempuan', 'Aktif', '', NULL, 'Verified', NULL),
(16, 'Vivin Nohtahfiah, S.Pd.', '19790319 202221 2 006', 'Guru Wali Kelas', 'Guru Kelas 6A', '', 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'Perempuan', 'Aktif', '', NULL, 'Verified', NULL),
(17, 'Yulida Ariani, S.Pd.', '19810203 2023212011', 'Guru Wali Kelas', 'Guru Kelas 6B', '', 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'Perempuan', 'Aktif', '', NULL, 'Verified', NULL),
(18, 'YUNI TRI HARIANTI, S.IP., S.Pd.', '198206102022212038', 'Guru Wali Kelas', 'Guru Kelas 5B', '', 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'Perempuan', 'Aktif', '', NULL, 'Verified', NULL),
(19, 'YUNIA NUR AFIYAH, S.Pd.', NULL, 'Guru Wali Kelas', 'Guru Kelas 2B', '', 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'Perempuan', 'Aktif', '', NULL, 'Verified', NULL),
(20, 'Nur Aini Farida, S.Pd.', '198904292020122009', 'Guru Wali Kelas', 'Guru Kelas 4A', '', 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'Perempuan', 'Aktif', '', NULL, 'Verified', NULL),
(21, 'Marsudi', NULL, 'Tenaga Kependidikan', 'Tenaga Kebersihan', '', 'SMA', 'Laki-laki', 'Aktif', '', NULL, 'Verified', NULL),
(22, 'Abdul Mujib', NULL, 'Tenaga Kependidikan', 'Penjaga', '', 'SMA', 'Laki-laki', 'Aktif', '', NULL, 'Verified', NULL),
(23, 'Agus Sukoco', NULL, 'Tenaga Kependidikan', 'Tenaga Keamanan', '', 'SMA', 'Laki-laki', 'Aktif', '', NULL, 'Verified', NULL);

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
  `foto_crop` varchar(255) DEFAULT NULL,
  `status_verifikasi` varchar(50) DEFAULT 'Verified',
  `uploaded_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hero_carousel`
--

INSERT INTO `hero_carousel` (`id`, `foto`, `caption`, `tag`, `urutan`, `is_active`, `created_at`, `foto_crop`, `status_verifikasi`, `uploaded_by`) VALUES
(1, 'backend/uploads/hero/1787279412_4e881e97_Dokumen_dari_Anisa_Choirina_3_.webp', 'MA ONE BERGELORAA!!!', 'Galeri Sekolah', 5, 1, '2026-08-21 02:30:14', 'backend/uploads/hero/1787279414_8b9138bc_Dokumen_dari_Anisa_Choirina3.webp', 'Verified', NULL),
(2, 'backend/uploads/hero/1787279439_d98ed81a_Dokumen_dari_Anisa_Choirina_7_.webp', 'MA ONE BERGELORAA!!!', 'Galeri Sekolah', 6, 1, '2026-08-21 02:30:41', 'backend/uploads/hero/1787279441_77dc847e_Dokumen_dari_Anisa_Choirina7.webp', 'Verified', NULL),
(3, 'backend/uploads/hero/1787279467_23ac3d40_Dokumen_dari_Anisa_Choirina_8_.webp', 'MA ONE BERGELORAA!!!', 'Galeri Sekolah', 7, 1, '2026-08-21 02:31:10', 'backend/uploads/hero/1787279470_5a22fbd8_Dokumen_dari_Anisa_Choirina8.webp', 'Verified', NULL),
(4, 'backend/uploads/hero/1787707851_7b83eac2_Dokumen_dari_Anisa_Choirina_4_.jpg', 'MA ONE BERGELORAA!!!', 'Kegiatan Utama', 3, 1, '2026-08-26 01:30:51', 'backend/uploads/hero/1787707851_b4fa6245_Dokumen_dari_Anisa_Choirina4.png', 'Verified', NULL),
(5, 'backend/uploads/hero/1787707884_820a18e6_Dokumen_dari_Anisa_Choirina_1_.jpg', 'MA ONE BERGELORAA!!!', 'Kegiatan Utama', 4, 1, '2026-08-26 01:31:24', 'backend/uploads/hero/1787707884_adece1fb_Dokumen_dari_Anisa_Choirina1.png', 'Verified', NULL),
(6, 'backend/uploads/hero/1787708027_a72b9c83_IMG_5490.JPG.jpeg', 'MA ONE BERGELORAA!!!', 'Kegiatan Utama', 1, 1, '2026-08-26 01:33:47', 'backend/uploads/hero/1787708027_7aee1c29_IMG_5490JPG.png', 'Verified', NULL),
(7, 'backend/uploads/hero/1787708044_9187a41c_lapangan.jpeg', 'MA ONE BERGELORAA!!!', 'Kegiatan Utama', 2, 1, '2026-08-26 01:34:04', 'backend/uploads/hero/1787708044_843dfce1_lapangan.png', 'Verified', NULL);

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
-- Table structure for table `modul_pembelajaran`
--

CREATE TABLE `modul_pembelajaran` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `mata_pelajaran` varchar(100) NOT NULL,
  `kelas` varchar(50) NOT NULL,
  `semester` varchar(20) NOT NULL,
  `tahun_ajaran` varchar(20) NOT NULL,
  `kategori` varchar(100) NOT NULL,
  `sumber_tipe` enum('upload','gdrive') NOT NULL,
  `file_pdf` varchar(255) DEFAULT NULL,
  `link_gdrive` text DEFAULT NULL,
  `foto_cover` varchar(255) DEFAULT NULL,
  `foto_cover_crop` varchar(255) DEFAULT NULL,
  `status` enum('Draft','Published') DEFAULT 'Published',
  `status_verifikasi` enum('Pending','Verified','Rejected') DEFAULT 'Verified',
  `uploaded_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `foto_crop` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `modul_pembelajaran`
--

INSERT INTO `modul_pembelajaran` (`id`, `judul`, `deskripsi`, `mata_pelajaran`, `kelas`, `semester`, `tahun_ajaran`, `kategori`, `sumber_tipe`, `file_pdf`, `link_gdrive`, `foto_cover`, `foto_cover_crop`, `status`, `status_verifikasi`, `uploaded_by`, `created_at`, `updated_at`, `foto_crop`) VALUES
(1, 'Bab 1-MA B indo Kls 1', 'Bab 1 – Bahasa Indonesia Kelas 1: Materi pembelajaran yang mengenalkan dasar-dasar Bahasa Indonesia kepada siswa melalui kegiatan membaca, menyimak, berbicara, dan menulis dengan cara yang sederhana dan menyenangkan.', 'Bahasa Indonesia', 'Kelas 1', 'Ganjil', '2025/2026', 'Modul Ajar', 'upload', 'backend/uploads/modul/pdf/modul_1787797578_e6dd8a7f.pdf', NULL, 'backend/uploads/modul/cover/1787796704_28dd6b0e_Screenshot_2026-08-27_091056.png', 'backend/uploads/modul/cover/1787796704_159861e5_Screenshot_2026-08-27_091056.png', 'Published', 'Verified', 1, '2026-08-27 01:55:35', '2026-08-27 03:00:06', NULL),
(2, 'Modul ajar seni budaya Kls 1', '**Modul Ajar Seni Budaya Kelas 1** merupakan bahan pembelajaran yang membantu siswa mengenal dan mengembangkan kreativitas melalui kegiatan seni yang sederhana, menyenangkan, dan sesuai dengan tahap perkembangan siswa kelas 1.', 'Seni & Budaya', 'Kelas 1', 'Ganjil', '2025/2026', 'Modul Ajar', 'upload', 'backend/uploads/modul/pdf/modul_1787798363_bb9e42b7.pdf', NULL, '', '', 'Published', 'Verified', 5, '2026-08-27 02:39:23', '2026-08-27 02:43:10', NULL);

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
('alamat_sekolah', 'JL. RAYA MULYOAGUNG NO.121 RT. 1 RW. 10 DUSUN MULYOAGUNG , Kec. Dau, Kab. Malang, Prov. Jawa Timur', '2026-08-26 01:54:50'),
('email_sekolah', 'sdnmulyoagung01@gmail.com', '2026-08-26 01:54:50'),
('hero_bg', '', '2026-08-21 01:47:25'),
('hero_subtitle', 'Selamat Datang di SD Negeri 1 Mulyoagung. Kami berkomitmen menyelenggarakan pendidikan berkualitas untuk membentuk generasi cerdas, kreatif, berakhlak mulia, dan peduli lingkungan.', '2026-08-26 01:34:57'),
('hero_title', 'SD Negeri 1 Mulyoagung', '2026-08-26 01:34:57'),
('homepage_sections', '[{\"key\":\"hero\",\"judul\":\"Hero\",\"subjudul\":\"\",\"is_active\":true},{\"key\":\"stats\",\"judul\":\"Statistik Sekolah\",\"subjudul\":\"\",\"is_active\":true},{\"key\":\"sambutan\",\"judul\":\"Sambutan Kepala Sekolah\",\"subjudul\":\"\",\"is_active\":true},{\"key\":\"profil\",\"judul\":\"Profil Sekolah\",\"subjudul\":\"Mengenal lebih dekat visi, misi, dan sejarah panjang SD Negeri 1 Mulyoagung.\",\"is_active\":true},{\"key\":\"video\",\"judul\":\"Profil Video Sekolah\",\"subjudul\":\"Tonton video profil sekolah kami untuk mengenal lingkungan belajar, fasilitas, dan kegiatan siswa secara visual.\",\"is_active\":true},{\"key\":\"berita\",\"judul\":\"Berita & Kegiatan Terbaru\",\"subjudul\":\"Ikuti terus perkembangan informasi dan aktivitas menarik di sekolah kami.\",\"is_active\":true},{\"key\":\"kontak\",\"judul\":\"Kontak Kami\",\"subjudul\":\"Hubungi kami atau kunjungi lokasi sekolah dasar kami melalui detail kontak di bawah ini.\",\"is_active\":true}]', '2026-08-26 04:24:01'),
('link_ppdb', 'https://sd-spmbmalangkab.id/', '2026-08-26 01:34:57'),
('medsos_links', '[{\"id\":\"1\",\"name\":\"YouTube\",\"url\":\"https://www.youtube.com/@mulyoagungsatu3851\",\"icon\":\"auto\"},{\"id\":\"2\",\"name\":\"Instagram\",\"url\":\"https://www.instagram.com/mulyoagung1_dau\",\"icon\":\"auto\"},{\"id\":\"3\",\"name\":\"Facebook\",\"url\":\"https://www.facebook.com/profile.php?id=100085140035121\",\"icon\":\"auto\"},{\"id\":\"4\",\"name\":\"TikTok\",\"url\":\"https://www.tiktok.com/@mulyoagung.1\",\"icon\":\"auto\"}]', '2026-08-26 01:34:57'),
('profil_misi', '[\"1.\\tMelaksanakan pembiasaan keagamaan serta menanamkan nilai-nilai keimanan, ketakwaan, dan akhlak mulia melalui kegiatan intrakurikuler, kokurikuler, dan ekstrakurikuler dalam kehidupan sehari-hari.\",\"2.\\tMenyelenggarakan pembelajaran yang berpusat pada murid melalui pendekatan berbasis masalah, proyek, dan pembelajaran mendalam (deep learning) untuk mengembangkan kemampuan bernalar kritis, berpikir reflektif, serta memecahkan masalah.\",\"3.\\tMenumbuhkan karakter mulia murid melalui pembiasaan budaya positif, penguatan disiplin, tanggung jawab, kepedulian, gotong royong, integritas, dan sikap saling menghormati sesuai nilai-nilai Profil Lulusan.\",\"4.\\tMewujudkan lingkungan sekolah yang sehat, aman, nyaman, dan ramah anak melalui pembiasaan hidup bersih dan sehat, kegiatan olahraga, serta pemanfaatan lingkungan sebagai sumber belajar untuk meningkatkan kesehatan jasmani.\",\"5.\\tMengembangkan budaya digital di lingkungan sekolah melalui pemanfaatan teknologi informasi dan komunikasi dalam pembelajaran, pengelolaan sekolah, serta penguatan literasi digital secara bijaksana, kreatif, dan bertanggung jawab dengan dukungan kemitraan berbagai pihak.\"]', '2026-08-26 01:34:57'),
('profil_sejarah', '<div style=\"text-align: justify;\">SD Negeri 1 Mulyoagung didirikan pada tahun <b>1970-an</b> di pusat Kecamatan Dau, Kabupaten Malang. Terletak di kawasan strategis yang dekat dengan wilayah wisata, industri, dan lembaga pemerintahan, sekolah ini hadir untuk memenuhi kebutuhan pendidikan masyarakat dengan latar belakang siswa yang beragam.\r\n\r\nPada bulan <b>Desember 2018</b>, sekolah mengalami babak penting dalam perjalanannya melalui proses <i>merger</i>(penggabungan) dua lembaga, yaitu SD Negeri 1 Mulyoagung dan SD Negeri 3 Mulyoagung.</div><div style=\"text-align: justify;\">&nbsp;</div><div style=\"text-align: justify;\">Penggabungan ini semakin memperkuat sinergi fasilitas, tenaga pendidik, dan manajemen sekolah dalam menghadirkan layanan pendidikan dasar yang makin berkualitas.\r\n\r\nCiri khas lain yang menjadi kebanggaan sekolah adalah keberadaan <b>Ikon Patung Semar </b>di area sekolah, yang menyimbolkan komitmen kuat SDN 1 Mulyoagung dalam melestarikan nilai-nilai budaya dan kearifan lokal Jawa.</div><div style=\"text-align: justify;\">&nbsp;</div><div style=\"text-align: justify;\">Kini, di bawah kepemimpinan yang berdedikasi serta didukung fasilitator dan Guru Penggerak, SD Negeri 1 Mulyoagung terus bertransformasi menerapkan Kurikulum Merdeka. Sekolah berkomitmen membentuk generasi unggul yang beriman dan bertakwa, berakhlak mulia, bernalar kritis, mandiri, kreatif, serta berkebinekaan global sesuai nilai-nilai Profil Pelajar Pancasila.</div>', '2026-08-26 01:34:57'),
('profil_visi', '<p class=\"MsoNormal\" style=\"margin-top:12.0pt;text-align:justify;text-indent:\r\n-1.35pt;line-height:150%;tab-stops:13.5pt 27.0pt\"><span lang=\"EN-ID\" style=\"font-size:12.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\nmso-fareast-font-family:Aptos;mso-ligatures:none\"><b><i>\"Terwujudnya murid yang\r\nberiman dan bertakwa, bernalar kritis, berkarakter mulia, sehat jasmani, dan\r\nunggul dalam digitalisasi.\"</i></b><o:p></o:p></span></p>', '2026-08-26 01:34:57'),
('tahun_ajaran', '2025/2026', '2026-08-26 01:34:57'),
('telepon_sekolah', '(0341) 466-730', '2026-08-26 01:54:50'),
('video_url', 'https://www.youtube.com/watch?v=-HU-Kg20g-M&t=1s', '2026-08-26 01:34:57'),
('whatsapp_sekolah', '089513301256', '2026-08-26 01:54:50');

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
  `foto_crop` varchar(255) DEFAULT NULL,
  `status_verifikasi` varchar(50) DEFAULT 'Verified',
  `uploaded_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengumuman_penting`
--

INSERT INTO `pengumuman_penting` (`id`, `judul`, `isi`, `running_text`, `show_popup`, `show_button`, `button_text`, `button_link`, `show_photo`, `foto`, `photo_link`, `is_active`, `tanggal_mulai`, `tanggal_selesai`, `foto_crop`, `status_verifikasi`, `uploaded_by`) VALUES
(1, 'Penerimaan Siswa Baru', '<div class=\"n6owBd awi2gc\" data-sfc-cp=\"\" jsaction=\"\" jscontroller=\"TDBkbc#Ml18Xb\" data-sfc-root=\"ep\" jsuid=\"dVy1le_15\" data-hveid=\"CAAICBAA\" data-processed=\"true\" data-complete=\"true\" data-copy-service-computed-style=\"font-family: &quot;Google Sans&quot;, Arial, sans-serif; font-size: 16px; font-weight: 400; margin: 12px 0px 16px; text-decoration: none; border-bottom: 0px rgb(230, 232, 240);\" style=\"font-family: &quot;Google Sans&quot;, Arial, sans-serif; font-size: 16px; margin: 12px 0px 16px; border-bottom: 0px rgb(230, 232, 240);\">Diberitahukan kepada seluruh masyarakat dan calon wali murid, bahwa SD Negeri Mulyoagung 1 resmi membuka pendaftaran bagi calon siswa-siswi baru kelas 1 untuk Tahun Ajaran 2026/2027.<!--TgQPHd|||[]--></div><div class=\"yhAwj\" data-sfc-cp=\"\" jsaction=\"rcuQ6b:&amp;dVy1le_1b|npT2md\" jscontroller=\"UTzWVc#U8DOt\" data-sfc-root=\"ep\" jsuid=\"dVy1le_1b\" data-processed=\"true\" data-complete=\"true\" data-sfc-inited=\"2\" data-copy-service-computed-style=\"font-family: &quot;Google Sans&quot;, Arial, sans-serif; font-size: 14px; font-weight: 400; margin: 0px; text-decoration: none; border-bottom: 0px rgb(230, 232, 240);\" style=\"font-family: &quot;Google Sans&quot;, Arial, sans-serif; border-bottom: 0px rgb(230, 232, 240);\"><!--TgQPHd|||[]--></div><div class=\"otQkpb\" aria-level=\"3\" role=\"heading\" data-animation-nesting=\"\" data-sfc-cp=\"\" jsaction=\"\" data-wiz-attrbind=\"aria-level=dVy1le_1c/fLk2Md\" jscontroller=\"a7qCn#ZxCkTb\" data-sfc-root=\"ep\" jsuid=\"dVy1le_1c\" data-processed=\"true\" data-sae=\"\" data-complete=\"true\" style=\"font-family: &quot;Google Sans&quot;, Arial, sans-serif; font-size: 20px; font-weight: 600; margin: 24px 0px 12px; border-bottom: 0px rgb(230, 232, 240);\" aria-owns=\"action-menu-parent-container\" data-copy-service-computed-style=\"font-family: &quot;Google Sans&quot;, Arial, sans-serif; font-size: 20px; font-weight: 600; margin: 24px 0px 12px; text-decoration: none; border-bottom: 0px rgb(230, 232, 240);\"></div>', '📢 PPDB SD Negeri 1 Mulyoagung telah dibuka! Segera daftarkan putra-putri Anda melalui jalur PPDB yang tersedia dan jangan lewatkan kesempatan menjadi bagian dari keluarga besar SD Negeri 1 Mulyoagung.', 1, 1, 'Daftar', 'https://sd-spmbmalangkab.id/', 1, 'backend/uploads/pengumuman/1787535239_be8b566c_hq720.jpg', 'https://sd-spmbmalangkab.id/', 1, '2026-08-21', '2026-08-28', 'backend/uploads/pengumuman/1787535239_d422bb83_hq720.png', 'Verified', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sambutan_kepsek`
--

CREATE TABLE `sambutan_kepsek` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `sambutan` text NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `foto_crop` varchar(255) DEFAULT NULL,
  `status_verifikasi` varchar(50) DEFAULT 'Verified',
  `uploaded_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sambutan_kepsek`
--

INSERT INTO `sambutan_kepsek` (`id`, `nama`, `sambutan`, `foto`, `foto_crop`, `status_verifikasi`, `uploaded_by`) VALUES
(1, 'Amalia Dyah Erviana, S.Pd.', '<p data-path-to-node=\"0\" style=\"text-align: justify;\"><b data-path-to-node=\"0\" data-index-in-node=\"0\">Selamat Datang di Website Resmi SD Negeri 1 Mulyoagung</b></p><p data-path-to-node=\"0\" style=\"text-align: justify;\"><b data-path-to-node=\"0\" data-index-in-node=\"0\"><br></b></p><p data-path-to-node=\"1\" style=\"text-align: justify;\"><i data-path-to-node=\"1\" data-index-in-node=\"0\">Assalamu’alaikum Warahmatullahi Wabarakatuh</i><i data-path-to-node=\"1\" data-index-in-node=\"0\">,</i></p><p data-path-to-node=\"1\" style=\"text-align: justify;\"><i data-path-to-node=\"1\" data-index-in-node=\"0\"><br></i></p><p data-path-to-node=\"2\" style=\"text-align: justify;\">Puji dan syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa. Selamat datang di <i data-path-to-node=\"2\" data-index-in-node=\"81\">website</i> resmi SD Negeri 1 Mulyoagung, wadah informasi dan media komunikasi digital bagi seluruh warga sekolah, orang tua siswa, dan masyarakat.</p><p data-path-to-node=\"2\" style=\"text-align: justify;\"><br></p><p data-path-to-node=\"3\" style=\"text-align: justify;\">SD Negeri 1 Mulyoagung berkomitmen untuk menghadirkan pendidikan dasar yang berkualitas menyeimbangkan prestasi akademik, pembentukan karakter, dan perkembangan potensi anak. Kami percaya bahwa pendidikan yang berhasil lahir dari sinergi yang kuat antara sekolah, orang tua, dan lingkungan.</p><p data-path-to-node=\"3\" style=\"text-align: justify;\"><br></p><p data-path-to-node=\"4\" style=\"text-align: justify;\">Terima kasih atas kepercayaan dan dukungan Bapak/Ibu sekalian dalam mendidik generasi penerus yang cerdas, berkarakter, dan berakhlak mulia. Selamat menjelajahi <i data-path-to-node=\"4\" data-index-in-node=\"161\">website</i> kami.</p><p data-path-to-node=\"4\" style=\"text-align: justify;\"><br></p><p data-path-to-node=\"5\" style=\"text-align: justify;\"><i data-path-to-node=\"5\" data-index-in-node=\"0\">Wassalamu’alaikum Warahmatullahi Wabarakatuh.</i></p><p data-path-to-node=\"5\" style=\"text-align: justify;\"><i data-path-to-node=\"5\" data-index-in-node=\"0\"><br></i></p><p data-path-to-node=\"6\" style=\"text-align: justify;\"><b data-path-to-node=\"6\" data-index-in-node=\"0\">Kepala SD Negeri 1 Mulyoagung</b></p><p data-path-to-node=\"7\" style=\"text-align: justify;\"><b data-path-to-node=\"7\" data-index-in-node=\"0\">Amalia Dyah Erviana, S.Pd.</b></p>', 'backend/uploads/sambutan/1787279072_89ecf9e7_Amalia_Dyah_Erviana.jpg', 'backend/uploads/sambutan/1787279072_f8520b37_Amalia_Dyah_Erviana.png', 'Verified', NULL);

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
  `role` enum('ADMIN','TIM','GURU') DEFAULT NULL,
  `nama_penanggung_jawab` varchar(255) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `foto_crop` varchar(255) DEFAULT NULL,
  `status_verifikasi` varchar(50) DEFAULT 'Verified',
  `uploaded_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `nama_penanggung_jawab`, `foto`, `foto_crop`, `status_verifikasi`, `uploaded_by`) VALUES
(1, 'hafiz', 'hafiz123', 'ADMIN', 'M HAFIZ F', 'backend/uploads/profile/1787536893_d68b1e43_19ae3379-8cec-409d-806f-c148c1811c2b.jpg', 'backend/uploads/profile/1787536893_ae701038_19ae3379-8cec-409d-806f-c148c1811c2b.png', 'Verified', NULL),
(2, 'pramukajaya', 'pramukajaya', 'TIM', 'Tim Pramuka', '', NULL, 'Verified', NULL),
(3, 'Drumband', 'Drumband', 'TIM', 'Drumband', '', NULL, 'Verified', NULL),
(5, 'yulida', 'yulida123', 'GURU', 'Yulida', '', NULL, 'Verified', NULL);

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
-- Indexes for table `modul_pembelajaran`
--
ALTER TABLE `modul_pembelajaran`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pengaturan_sekolah`
--
ALTER TABLE `pengaturan_sekolah`
  ADD PRIMARY KEY (`setting_key`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `fasilitas`
--
ALTER TABLE `fasilitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `galeri`
--
ALTER TABLE `galeri`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `guru_tendik`
--
ALTER TABLE `guru_tendik`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `hero_carousel`
--
ALTER TABLE `hero_carousel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `login_attempts`
--
ALTER TABLE `login_attempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `modul_pembelajaran`
--
ALTER TABLE `modul_pembelajaran`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
