-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 31, 2026 at 07:58 AM
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
-- Table structure for table `akademik_menu`
--

CREATE TABLE `akademik_menu` (
  `id` int(11) NOT NULL,
  `label` varchar(100) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `link_gdrive` text NOT NULL,
  `is_modul` tinyint(1) NOT NULL DEFAULT 0,
  `urutan` int(11) NOT NULL DEFAULT 0,
  `aktif` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `akademik_menu`
--

INSERT INTO `akademik_menu` (`id`, `label`, `deskripsi`, `link_gdrive`, `is_modul`, `urutan`, `aktif`, `created_at`, `updated_at`) VALUES
(1, 'KSP', 'Kurikulum Satuan Pendidikan (KSP) SD Negeri 1 Mulyoagung.', 'https://drive.google.com/drive/folders/1NL8o09uGcDI_K5MlrMKbkG7bxsIbIoi6', 0, 2, 1, '2026-08-30 20:03:22', '2026-08-31 04:36:15'),
(2, 'PANDUAN KURIKULUM', 'Panduan pelaksanaan dan pedoman kurikulum pembelajaran sekolah.', 'https://drive.google.com/drive/folders/1smQ-s8WSt7veK1wgjjFoIO4PrNqKYgmW', 0, 2, 1, '2026-08-30 20:03:22', '2026-08-30 20:09:35'),
(3, 'ANALISIS HARI EFEKTIF', 'Analisis perhitungan alokasi waktu dan hari belajar efektif per semester.', 'https://drive.google.com/drive/folders/1a98UegN0lZClgSFjZbLVcjvD6VGUT8iv', 0, 3, 1, '2026-08-30 20:03:22', '2026-08-30 20:10:03'),
(4, 'BEDAH CP', 'Bedah Capaian Pembelajaran (CP) dan Alur Tujuan Pembelajaran (ATP).', 'https://drive.google.com/drive/folders/1GLWrUZfsK2E95I0lyyFuzJZ_N61kDkT1', 0, 4, 1, '2026-08-30 20:03:22', '2026-08-30 20:10:19'),
(5, 'PROGRAM TAHUNAN', 'Program Tahunan (Prota) rencana penetapan alokasi waktu 1 tahun ajaran.', 'https://drive.google.com/drive/folders/1IHmzyTjBHYrUmvzTe4PxPjeP7aBSpFx8', 0, 5, 1, '2026-08-30 20:03:22', '2026-08-30 20:11:02'),
(6, 'PROGRAM SEMESTER', 'Program Semester (Promes) penjabaran rencana pembelajaran per semester.', 'https://drive.google.com/drive/folders/1IHmzyTjBHYrUmvzTe4PxPjeP7aBSpFx8', 0, 6, 1, '2026-08-30 20:03:22', '2026-08-30 20:11:13'),
(7, 'MODUL AJAR & LKPD', 'Modul ajar, LKPD, dan materi Kurikulum Merdeka SD Negeri 1 Mulyoagung.', 'https://drive.google.com/drive/folders/1zSnI26VeU5DNTnHgkHx-syslDd_vzkZB', 1, 1, 1, '2026-08-30 20:03:22', '2026-08-31 04:35:55'),
(8, 'MPLS & ASESMEN', 'Masa Pengenalan Lingkungan Sekolah (MPLS) serta instrumen asesmen pembelajaran.', 'https://drive.google.com/drive/folders/14rrw2Z7lJMX-y3xoac9T8DYq0CxTDy8p', 0, 8, 1, '2026-08-30 20:03:22', '2026-08-30 20:11:46');

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
(9, 'Festival Lomba seni dan sastra', '<div style=\"text-align: justify;\">Seni dan sastra bukan sekadar kompetisi, melainkan ruang ekspresi dan apresiasi. Melalui Festival Lomba Seni dan Sastra, generasi muda diajak untuk merayakan keberagaman budaya dan menyuarakan gagasan lewat karya. Baca selengkapnya ulasan mendalam mengenai perjalanan para peserta dan keindahan karya yang tercipta di panggung FLS2N.</div>', 'backend/uploads/berita/1787538849_f4f2ba33_20260414_141705.jpg', 'Prestasi', '2026-08-24', 'Verified', 1, 'backend/uploads/berita/1787538849_f6d48ddf_20260414_141705.png');

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
(1, 'Menyatukan irama, menggemakan semangat di KARNAMUDA 2025.', '<div>Derap langkah dan dentuman irama kontingen Drumband SDN 1 Mulyoagung siap menguncang KARNAMUDA 2025!</div>', 'backend/uploads/galeri/1787278354_72fb565f_20251023_074756.webp', 'Ekstrakurikuler', '2025-10-22', 'Verified', 1, 'backend/uploads/galeri/1787278356_c883453b_20251023_074756.webp'),
(9, 'Karate', '<p>Kegiatan <strong>Karate</strong> merupakan salah satu kegiatan ekstrakurikuler yang melatih kedisiplinan, ketangkasan, keberanian, serta kemampuan bela diri siswa. Melalui latihan yang rutin dan terarah, siswa belajar membangun kepercayaan diri, sportivitas, dan semangat untuk terus berkembang.</p>', 'backend/uploads/galeri/1787881613_a1586dc8_20251023_090144.jpg', 'Ekstrakurikuler', '2026-08-28', 'Verified', 1, 'backend/uploads/galeri/1787881613_16335b01_20251023_090144.png'),
(10, 'Pramuka', '<p>Kegiatan Pramuka menjadi sarana bagi siswa untuk belajar kedisiplinan, kemandirian, kerja sama, dan tanggung jawab melalui berbagai aktivitas yang menyenangkan dan edukatif.</p>', 'backend/uploads/galeri/1787881667_9d3f111f_20251023_101114.jpg', 'Ekstrakurikuler', '2026-08-28', 'Verified', 1, 'backend/uploads/galeri/1787881668_f71b9904_20251023_101114.png'),
(11, 'Bimtek', '<p><strong>Bimbingan Teknis (BIMTEK)</strong> merupakan kegiatan peningkatan kompetensi dan wawasan guru melalui pembekalan, pelatihan, serta berbagi pengetahuan untuk mendukung peningkatan kualitas pembelajaran di sekolah.</p>', 'backend/uploads/galeri/1787881715_f7dcdf50_IMG-20250902-WA0003.jpg', 'Acara Khusus', '2026-08-28', 'Verified', 1, 'backend/uploads/galeri/1787881715_604538b8_IMG-20250902-WA0003.png'),
(12, 'Ujian ANBK', '<p><strong>Ujian ANBK</strong></p><p>Kegiatan pelaksanaan Asesmen Nasional Berbasis Komputer (ANBK) sebagai bagian dari evaluasi pendidikan untuk mengukur kemampuan literasi, numerasi, serta kualitas proses pembelajaran di sekolah.</p>', 'backend/uploads/galeri/1787881817_96608eee_20260513_075756.jpg', 'Kegiatan Sekolah', '2026-08-28', 'Verified', 1, 'backend/uploads/galeri/1787881817_227de6c9_20260513_075756.png'),
(13, 'Mengajar', '<p>Kegiatan mengajar merupakan proses pembelajaran yang dilakukan guru untuk membimbing dan membantu siswa dalam memahami materi. Melalui pembelajaran yang aktif dan menyenangkan, guru menciptakan suasana belajar yang mendukung perkembangan pengetahuan, keterampilan, dan karakter siswa.</p>', 'backend/uploads/galeri/1787881866_4af15859_img1.webp', 'Pembelajaran', '2026-08-28', 'Verified', 1, 'backend/uploads/galeri/1787881866_9a04b4bf_img1.png'),
(14, 'Imunisasi', '<p>Kegiatan imunisasi di sekolah sebagai upaya menjaga kesehatan dan meningkatkan kekebalan tubuh siswa. Kegiatan ini dilaksanakan dengan pendampingan tenaga kesehatan secara tertib dan aman.</p>', 'backend/uploads/galeri/1787881916_f22841aa_IMG-20250924-WA0059.jpg', 'Kegiatan Sekolah', '2026-08-28', 'Verified', 1, 'backend/uploads/galeri/1787881916_84b6db3a_IMG-20250924-WA0059.png');

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
(14, 'Siti Maisaroh, S.Ag., S.Pd.', '19770525 201408 2 003', 'Guru Wali Kelas', 'Guru Kelas 6B', '', 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'Perempuan', 'Aktif', '', NULL, 'Verified', NULL),
(15, 'Sri Hartatik, S.Pd.', '197501052021212004', 'Guru Wali Kelas', 'Guru Kelas 4B', '', 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'Perempuan', 'Aktif', '', NULL, 'Verified', NULL),
(16, 'Vivin Nohtahfiah, S.Pd.', '19790319 202221 2 006', 'Guru Wali Kelas', 'Guru Kelas 4A', '', 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'Perempuan', 'Aktif', '', NULL, 'Verified', NULL),
(17, 'Yulida Ariani, S.Pd.', '19810203 2023212011', 'Guru Wali Kelas', 'Guru Kelas 6A', '', 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'Perempuan', 'Aktif', '', NULL, 'Verified', NULL),
(18, 'YUNI TRI HARIANTI, S.IP., S.Pd.', '198206102022212038', 'Guru Wali Kelas', 'Guru Kelas 5B', '', 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'Perempuan', 'Aktif', '', NULL, 'Verified', NULL),
(19, 'YUNIA NUR AFIYAH, S.Pd.', NULL, 'Guru Wali Kelas', 'Guru Kelas 2B', '', 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'Perempuan', 'Aktif', '', NULL, 'Verified', NULL),
(20, 'Nur Aini Farida, S.Pd.', '198904292020122009', 'Guru Wali Kelas', 'Guru Kelas 5A', '', 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'Perempuan', 'Aktif', '', NULL, 'Verified', NULL),
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
(1, 'Bab 1-MA B indo Kls 1', 'Bab 1 – Bahasa Indonesia Kelas 1: Materi pembelajaran yang mengenalkan dasar-dasar Bahasa Indonesia kepada siswa melalui kegiatan membaca, menyimak, berbicara, dan menulis dengan cara yang sederhana dan menyenangkan.', 'Bahasa Indonesia', 'Kelas 1', 'Ganjil', '2025/2026', 'Modul Ajar', 'gdrive', NULL, 'https://drive.google.com/file/d/11nJbxU4IFxou5dFf7dd2MlaDtdcS0A-a/view?usp=drive_link', 'backend/uploads/modul/cover/1788151872_f0290733_Screenshot_2026-08-31_115103.png', 'backend/uploads/modul/cover/1788151872_9535e922_Screenshot_2026-08-31_115103.png', 'Published', 'Verified', 1, '2026-08-27 01:55:35', '2026-08-31 04:51:12', NULL),
(2, 'Modul Ajar Seni Rupa Kelas 1', 'Modul Ajar Seni Rupa Kelas 1 merupakan bahan pembelajaran yang membantu siswa mengenal dan mengembangkan kreativitas melalui kegiatan seni yang sederhana, menyenangkan, dan sesuai dengan tahap perkembangan siswa kelas 1.', 'Seni & Budaya', 'Kelas 1', 'Ganjil', '2025/2026', 'Modul Ajar', 'gdrive', NULL, 'https://drive.google.com/file/d/1fnvibK_08Q6E9sgyz0Yrgf5OL3DkqKgH/view?usp=drive_link', 'backend/uploads/modul/cover/1788151750_888fd40b_Screenshot_2026-08-31_114805.png', 'backend/uploads/modul/cover/1788151774_03891623_1788151750_888fd40b_Screenshot_2026-08-31_114805.png', 'Published', 'Verified', 5, '2026-08-27 02:39:23', '2026-08-31 05:21:18', NULL),
(9, 'Modul Ajar Bahasa Jawa Kelas 1', 'Modul Ajar Bahasa Jawa Kelas 1 merupakan bahan ajar yang disusun untuk membantu siswa mengenal dan memahami dasar-dasar Bahasa Jawa melalui kegiatan pembelajaran yang sederhana, menarik, dan sesuai dengan karakteristik siswa kelas 1. Materi mencakup pengenalan kosakata, unggah-ungguh basa, serta penggunaan Bahasa Jawa dalam kehidupan sehari-hari.', 'Bahasa Jawa / Muatan Lokal', 'Kelas 1', 'Ganjil', '2025/2026', 'Modul Ajar', 'gdrive', NULL, 'https://drive.google.com/file/d/1lGT08GBitqgNvUKESWi3msBlSEDt6vOE/view?usp=drive_link', 'backend/uploads/modul/cover/1788151982_be7264e2_Screenshot_2026-08-31_115200.png', 'backend/uploads/modul/cover/1788151982_3d7ef0ae_Screenshot_2026-08-31_115200.png', 'Published', 'Verified', 1, '2026-08-31 04:53:02', '2026-08-31 04:56:36', NULL),
(10, 'Modul Ajar Matematika Kelas 1', 'Modul Ajar Matematika Kelas 1 merupakan bahan pembelajaran yang disusun untuk membantu siswa memahami konsep dasar matematika secara sederhana, menarik, dan sesuai dengan tahap perkembangan mereka. Modul ini mencakup materi seperti bilangan, penjumlahan, pengurangan, bentuk, pola, serta pengukuran melalui kegiatan yang interaktif dan mudah dipahami.', 'Matematika', 'Kelas 1', 'Ganjil', '2026/2027', 'Modul Ajar', 'gdrive', NULL, 'https://drive.google.com/file/d/1FMhdH8ssuQqCc7LZGyMA9VRLk-CjX9CF/view?usp=drive_link', 'backend/uploads/modul/cover/1788152186_8d6875f9_Screenshot_2026-08-31_115545.png', 'backend/uploads/modul/cover/1788152186_2d262377_Screenshot_2026-08-31_115545.png', 'Published', 'Verified', 1, '2026-08-31 04:56:26', '2026-08-31 04:56:26', NULL),
(11, 'Modul Ajar Pendidikan Pancasila Kelas 1', 'Modul Ajar Pendidikan Pancasila Kelas 1 merupakan bahan ajar yang dirancang untuk membantu peserta didik mengenal dan memahami nilai-nilai Pancasila sejak dini. Modul ini memuat materi pembelajaran yang sederhana, menarik, dan sesuai dengan karakteristik peserta didik kelas 1 melalui kegiatan yang interaktif dan kontekstual.', 'Pendidikan Pancasila', 'Kelas 1', 'Ganjil', '2026/2027', 'Modul Ajar', 'gdrive', NULL, 'https://drive.google.com/file/d/1dQ18l3_RrH2ngfrTwXlVsjPe4WlSxEDU/view?usp=drive_link', 'backend/uploads/modul/cover/1788152347_f4547c2a_Screenshot_2026-08-31_115846.png', 'backend/uploads/modul/cover/1788152347_3f58ced1_Screenshot_2026-08-31_115846.png', 'Published', 'Verified', 1, '2026-08-31 04:58:38', '2026-08-31 04:59:07', NULL),
(12, 'LKPD Bahasa Jawa Kelas 2', 'LKPD Bahasa Jawa Kelas 2 merupakan lembar kerja peserta didik yang dirancang untuk membantu siswa memahami dan mempraktikkan materi Bahasa Jawa secara menyenangkan. Materi disajikan melalui berbagai kegiatan sederhana yang sesuai dengan tingkat perkembangan siswa kelas 2.', 'Bahasa Jawa / Muatan Lokal', 'Kelas 2', 'Ganjil', '2026/2027', 'Lembar Kerja Peserta Didik (LKPD)', 'gdrive', NULL, 'https://drive.google.com/file/d/1rf3YZA92OWeraMIn7JqIpXgEwy4Rpx_L/view?usp=sharing', 'backend/uploads/modul/cover/1788152427_3194b26a_Screenshot_2026-08-31_115934.png', 'backend/uploads/modul/cover/1788152427_1511d3ff_Screenshot_2026-08-31_115934.png', 'Published', 'Verified', 1, '2026-08-31 05:00:27', '2026-08-31 05:05:44', NULL),
(13, 'Modul Ajar Seni Budaya Kelas 2', 'Modul Ajar Seni Budaya Kelas 2 merupakan panduan pembelajaran yang dirancang untuk membantu siswa mengenal dan mengembangkan kreativitas melalui kegiatan seni. Materi disusun secara sederhana dan menyenangkan agar siswa dapat mengeksplorasi seni rupa, musik, gerak, serta berbagai bentuk ekspresi kreatif sesuai dengan tingkat perkembangan mereka.', 'Seni & Budaya', 'Kelas 2', 'Ganjil', '2025/2026', 'Modul Ajar', 'gdrive', NULL, 'https://drive.google.com/file/d/1PqORpuOxtEKjcIYdsWCn2HZM0LQJiA3F/view?usp=sharing', 'backend/uploads/modul/cover/1788152528_9ebd9d3f_Screenshot_2026-08-31_120055.png', 'backend/uploads/modul/cover/1788152528_3df5ee41_Screenshot_2026-08-31_120055.png', 'Published', 'Verified', 1, '2026-08-31 05:02:08', '2026-08-31 05:05:11', NULL),
(14, 'LKPD Pendidikan Pancasila Kelas 2', 'LKPD Pendidikan Pancasila Kelas 2 merupakan lembar kegiatan pembelajaran yang dirancang untuk membantu siswa memahami nilai-nilai Pancasila melalui aktivitas yang sederhana, menarik, dan sesuai dengan tingkat perkembangan siswa kelas 2. Materi disajikan dengan kegiatan interaktif untuk menumbuhkan sikap gotong royong, tanggung jawab, disiplin, dan cinta tanah air.', 'Pendidikan Pancasila', 'Kelas 2', 'Ganjil', '2026/2027', 'Lembar Kerja Peserta Didik (LKPD)', 'gdrive', NULL, 'https://drive.google.com/file/d/1DFvXTPg68AFwZZaQ5HvA_LU9jWADQvu8/view?usp=drive_link', 'backend/uploads/modul/cover/1788152642_3e9897c1_Screenshot_2026-08-31_120307.png', 'backend/uploads/modul/cover/1788152642_a3aac63e_Screenshot_2026-08-31_120307.png', 'Published', 'Verified', 1, '2026-08-31 05:04:02', '2026-08-31 05:04:30', NULL),
(15, 'Modul Ajar Matematika Kelas 2', 'Modul Ajar Matematika Kelas 2 merupakan bahan pembelajaran yang dirancang untuk membantu siswa memahami konsep dasar matematika secara menyenangkan dan mudah dipahami. Materi disusun sesuai dengan tingkat perkembangan siswa kelas 2 melalui kegiatan belajar yang interaktif, latihan soal, dan aktivitas sederhana.', 'Matematika', 'Kelas 2', 'Ganjil', '2025/2026', 'Modul Ajar', 'gdrive', NULL, 'https://drive.google.com/file/d/1V_L5YlhVJXr-Wq2Qf7k_yOSD4AknpsCv/view?usp=sharing', 'backend/uploads/modul/cover/1788152973_2f6c806a_Screenshot_2026-08-31_120847.png', 'backend/uploads/modul/cover/1788152973_b3c2fcc3_Screenshot_2026-08-31_120847.png', 'Published', 'Verified', 1, '2026-08-31 05:09:33', '2026-08-31 05:09:33', NULL),
(16, 'LKPD Bahasa Indonesia Kelas 2', 'LKPD Bahasa Indonesia Kelas 2 merupakan lembar kerja peserta didik yang dirancang untuk membantu siswa memahami materi Bahasa Indonesia melalui kegiatan membaca, menulis, menyimak, dan berbicara secara menyenangkan. Materi disajikan dengan aktivitas sederhana dan sesuai dengan tingkat perkembangan siswa kelas 2.', 'Bahasa Indonesia', 'Kelas 2', 'Ganjil', '2026/2027', 'Modul Ajar', 'gdrive', NULL, 'https://drive.google.com/file/d/1ugUMAl11ZXtODvcf_bGYfNEt93R-yIbu/view?usp=drive_link', 'backend/uploads/modul/cover/1788153080_f27e79d0_Screenshot_2026-08-31_121025.png', 'backend/uploads/modul/cover/1788153080_c1e16224_Screenshot_2026-08-31_121025.png', 'Published', 'Verified', 1, '2026-08-31 05:11:20', '2026-08-31 05:11:20', NULL),
(17, 'LKPD Matematika Kelas 3', 'LKPD Matematika Kelas 3 merupakan lembar kerja peserta didik yang dirancang untuk membantu siswa memahami konsep-konsep dasar matematika melalui latihan soal dan kegiatan pembelajaran yang menarik. Materi disusun secara sederhana dan sesuai dengan tingkat kemampuan siswa kelas 3 agar pembelajaran lebih aktif, terarah, dan menyenangkan.', 'Matematika', 'Kelas 3', 'Ganjil', '2025/2026', 'Lembar Kerja Peserta Didik (LKPD)', 'gdrive', NULL, 'https://drive.google.com/file/d/1d5PSfXG1MRFvvEcouMPs-WrAtr6QnpVp/view?usp=sharing', 'backend/uploads/modul/cover/1788153235_401fd93a_Screenshot_2026-08-31_121318.png', 'backend/uploads/modul/cover/1788153235_665ef949_Screenshot_2026-08-31_121318.png', 'Published', 'Verified', 1, '2026-08-31 05:13:55', '2026-08-31 05:13:55', NULL),
(18, 'LKPD IPAS Kelas 3', 'LKPD IPAS Kelas 3 merupakan lembar kerja peserta didik yang dirancang untuk membantu siswa memahami materi Ilmu Pengetahuan Alam dan Sosial (IPAS) melalui kegiatan belajar yang aktif, menarik, dan sesuai dengan tingkat perkembangan siswa kelas 3.', 'IPAS (Ilmu Pengetahuan Alam & Sosial)', 'Kelas 3', 'Ganjil', '2025/2026', 'Lembar Kerja Peserta Didik (LKPD)', 'gdrive', NULL, 'https://drive.google.com/file/d/1Kgf2ogXJu-kvDFcoVJumwOqLnIZVOl6L/view?usp=sharing', 'backend/uploads/modul/cover/1788153320_15efd589_Screenshot_2026-08-31_121444.png', 'backend/uploads/modul/cover/1788153320_b953f6fc_Screenshot_2026-08-31_121444.png', 'Published', 'Verified', 1, '2026-08-31 05:15:20', '2026-08-31 05:15:20', NULL),
(19, 'LKPD Bahasa Indonesia Kelas 3', 'LKPD Bahasa Indonesia Kelas 3 merupakan lembar kerja peserta didik yang dirancang untuk membantu siswa meningkatkan kemampuan membaca, menulis, memahami teks, serta mengembangkan keterampilan berbahasa melalui berbagai kegiatan yang menarik dan sesuai dengan tingkat perkembangan siswa.', 'Pendidikan Pancasila', 'Kelas 3', 'Ganjil', '2025/2026', 'Lembar Kerja Peserta Didik (LKPD)', 'gdrive', NULL, 'https://drive.google.com/file/d/1XC23G7krIR6SNFokcL_HeNYMqGvMHMm8/view?usp=sharing', 'backend/uploads/modul/cover/1788153468_08c469fa_Screenshot_2026-08-31_121645.png', 'backend/uploads/modul/cover/1788153468_fbb2017b_Screenshot_2026-08-31_121645.png', 'Published', 'Verified', 1, '2026-08-31 05:17:48', '2026-08-31 05:22:36', NULL),
(20, 'LKPD Seni Rupa Kelas 3', 'LKPD Seni Rupa Kelas 3 merupakan lembar kerja peserta didik yang dirancang untuk membantu siswa kelas 3 memahami dan mempraktikkan berbagai kegiatan seni rupa secara kreatif dan menyenangkan. Modul ini berisi aktivitas menggambar, mewarnai, mengenal bentuk, garis, warna, serta mengembangkan imajinasi dan keterampilan berkarya seni.', 'Seni & Budaya', 'Kelas 3', 'Ganjil', '2025/2026', 'Lembar Kerja Peserta Didik (LKPD)', 'gdrive', NULL, 'https://drive.google.com/file/d/14jD8xySLjddAiwsv_-J9Vf8yOqiZrXyH/view?usp=sharing', 'backend/uploads/modul/cover/1788153558_1d097d30_Screenshot_2026-08-31_121803.png', 'backend/uploads/modul/cover/1788153558_bcd04134_Screenshot_2026-08-31_121803.png', 'Published', 'Verified', 1, '2026-08-31 05:19:18', '2026-08-31 05:19:18', NULL),
(21, 'LKPD Pendidikan Pancasila Kelas 3', '**LKPD Pendidikan Pancasila Kelas 3** merupakan lembar kerja peserta didik yang dirancang untuk membantu siswa memahami nilai-nilai Pancasila melalui kegiatan pembelajaran yang menarik, sederhana, dan sesuai dengan tingkat perkembangan siswa kelas 3. Materi dilengkapi dengan berbagai aktivitas untuk melatih pemahaman, sikap, dan penerapan nilai Pancasila dalam kehidupan sehari-hari.', 'Pendidikan Pancasila', 'Kelas 3', 'Ganjil', '2025/2026', 'Lembar Kerja Peserta Didik (LKPD)', 'gdrive', NULL, 'https://drive.google.com/file/d/1piRytusglNGnvFlW_SbA1XjFDTrt0MOs/view?usp=sharing', 'backend/uploads/modul/cover/1788153743_f65317dc_Screenshot_2026-08-31_122138.png', 'backend/uploads/modul/cover/1788153743_2d7a67ae_Screenshot_2026-08-31_122138.png', 'Published', 'Verified', 1, '2026-08-31 05:22:23', '2026-08-31 05:22:40', NULL),
(22, 'LKPD Bahasa Indonesia Kelas 4', 'LKPD Bahasa Indonesia Kelas 4 merupakan lembar kerja peserta didik yang dirancang untuk membantu siswa memahami materi Bahasa Indonesia melalui berbagai kegiatan pembelajaran yang menarik dan interaktif. LKPD ini berisi latihan membaca, menulis, memahami teks, serta mengembangkan kemampuan berbahasa sesuai dengan tingkat kelas 4.', 'Bahasa Indonesia', 'Kelas 4', 'Ganjil', '2025/2026', 'Lembar Kerja Peserta Didik (LKPD)', 'gdrive', NULL, 'https://drive.google.com/file/d/1YHQnBD0PYniCCFiWixMo4KBUJjPZ5BGo/view?usp=drive_link', 'backend/uploads/modul/cover/1788153875_f783ff15_Screenshot_2026-08-31_122352.png', 'backend/uploads/modul/cover/1788153875_26290f29_Screenshot_2026-08-31_122352.png', 'Published', 'Verified', 1, '2026-08-31 05:24:35', '2026-08-31 05:24:35', NULL),
(23, 'LKPD Bahasa Inggris Kelas 4', 'LKPD Bahasa Inggris Kelas 4 berisi lembar kegiatan pembelajaran yang dirancang untuk membantu siswa memahami kosakata, ungkapan sederhana, serta kemampuan membaca dan menulis dalam Bahasa Inggris melalui aktivitas yang menarik dan interaktif.', 'Bahasa Inggris', 'Kelas 4', 'Ganjil', '2025/2026', 'Lembar Kerja Peserta Didik (LKPD)', 'gdrive', NULL, 'https://drive.google.com/file/d/1Em-qvWA-Fp_aTsYX7WPoBPl4MI6qTIUD/view?usp=sharing', 'backend/uploads/modul/cover/1788154047_68e810e9_Screenshot_2026-08-31_122629.png', 'backend/uploads/modul/cover/1788154047_83b5b0ed_Screenshot_2026-08-31_122629.png', 'Published', 'Verified', 1, '2026-08-31 05:27:27', '2026-08-31 05:27:27', NULL),
(24, 'LKPD Bahasa Jawa Kelas 4', 'LKPD Bahasa Jawa Kelas 4 merupakan lembar kerja peserta didik yang dirancang untuk membantu siswa memahami materi Bahasa Jawa melalui berbagai kegiatan yang menarik dan interaktif. Materi disajikan secara sederhana dengan latihan membaca, menulis, memahami kosakata, serta mengenal penggunaan Bahasa Jawa dalam kehidupan sehari-hari.', 'Bahasa Jawa / Muatan Lokal', 'Kelas 4', 'Ganjil', '2025/2026', 'Lembar Kerja Peserta Didik (LKPD)', 'gdrive', NULL, 'https://drive.google.com/file/d/1XoIFCSFLDo9Ms64Om66ES4DSaT051byg/view?usp=sharing', 'backend/uploads/modul/cover/1788154119_ce36311a_Screenshot_2026-08-31_122810.png', 'backend/uploads/modul/cover/1788154119_96de80bd_Screenshot_2026-08-31_122810.png', 'Published', 'Verified', 1, '2026-08-31 05:28:39', '2026-08-31 05:29:15', NULL),
(25, 'Bahan Ajar PAI Kelas 4 - BAB I-2', 'Bahan Ajar Pendidikan Agama Islam dan Budi Pekerti Kelas 4 yang disusun untuk membantu peserta didik memahami ajaran Islam, membentuk akhlak mulia, serta menerapkan nilai-nilai keagamaan dalam kehidupan sehari-hari. Materi disajikan secara sederhana, sistematis, dan sesuai dengan perkembangan peserta didik kelas 4.', 'Pendidikan Agama & Budi Pekerti', 'Kelas 4', 'Ganjil', '2025/2026', 'Bahan Ajar / Slide', 'gdrive', NULL, 'https://drive.google.com/file/d/1rHTZ-N5HVSoLcVrnRetTxKlUnWKiiMBm/view?usp=sharing', 'backend/uploads/modul/cover/1788154234_dd9714e6_Screenshot_2026-08-31_122931.png', 'backend/uploads/modul/cover/1788154234_3691ee21_Screenshot_2026-08-31_122931.png', 'Published', 'Verified', 1, '2026-08-31 05:30:34', '2026-08-31 05:32:48', NULL),
(26, 'Bahan Ajar PAI Kelas 4 - BAB 3', '', 'Pendidikan Agama & Budi Pekerti', 'Kelas 4', 'Ganjil', '2025/2026', 'Bahan Ajar / Slide', 'gdrive', NULL, 'https://drive.google.com/file/d/19q6iOrcUHG7MEoCC_zc6I0NRENiDBk6M/view?usp=sharing', 'backend/uploads/modul/cover/1788154455_d871fc9f_Screenshot_2026-08-31_123406.png', 'backend/uploads/modul/cover/1788154455_13d1f2f2_Screenshot_2026-08-31_123406.png', 'Published', 'Verified', 1, '2026-08-31 05:34:15', '2026-08-31 05:35:16', NULL),
(27, 'Bahan Ajar PAI Kelas 4 - BAB 4', '', 'Pendidikan Agama & Budi Pekerti', 'Kelas 4', 'Ganjil', '2025/2026', 'Bahan Ajar / Slide', 'gdrive', NULL, 'https://drive.google.com/file/d/1bgz9VbuZ4fSwmSo6JhX7XBKzmqP-DULh/view?usp=sharing', 'backend/uploads/modul/cover/1788154509_a8c054c3_Screenshot_2026-08-31_123445.png', 'backend/uploads/modul/cover/1788154509_24840fb4_Screenshot_2026-08-31_123445.png', 'Published', 'Verified', 1, '2026-08-31 05:35:09', '2026-08-31 05:35:09', NULL),
(28, 'Bahan Ajar PAI Kelas 4 - BAB 5', '', 'Pendidikan Agama & Budi Pekerti', 'Kelas 4', 'Ganjil', '2025/2026', 'Bahan Ajar / Slide', 'gdrive', NULL, 'https://drive.google.com/file/d/1Gto32zc_AWgtv3SYUBuDFKlYB4I6mTlw/view?usp=sharing', 'backend/uploads/modul/cover/1788154565_7e2593f5_Screenshot_2026-08-31_123557.png', 'backend/uploads/modul/cover/1788154565_a56e18e8_Screenshot_2026-08-31_123557.png', 'Published', 'Verified', 1, '2026-08-31 05:36:05', '2026-08-31 05:36:05', NULL),
(29, 'LKPD Pendidikan Pancasila Kelas 4', 'LKPD Pendidikan Pancasila Kelas 4 merupakan lembar kerja peserta didik yang dirancang untuk membantu siswa memahami nilai-nilai Pancasila melalui kegiatan pembelajaran yang interaktif, kontekstual, dan sesuai dengan kehidupan sehari-hari.', 'Pendidikan Pancasila', 'Kelas 4', 'Ganjil', '2025/2026', 'Lembar Kerja Peserta Didik (LKPD)', 'gdrive', NULL, 'https://drive.google.com/file/d/1z4MHBrPqQvonoMKUYwJrRZNGRRrXZE6g/view?usp=sharing', 'backend/uploads/modul/cover/1788154660_ab805fcf_Screenshot_2026-08-31_123653.png', 'backend/uploads/modul/cover/1788154660_8b702ebc_Screenshot_2026-08-31_123653.png', 'Published', 'Verified', 1, '2026-08-31 05:37:40', '2026-08-31 05:37:40', NULL),
(30, 'LKPD Matematika Kelas 4', 'LKPD Matematika Kelas 4 merupakan lembar kerja peserta didik yang dirancang untuk membantu siswa memahami konsep matematika melalui kegiatan latihan yang menarik dan terstruktur. Materi disajikan secara sederhana agar siswa dapat belajar, berlatih, dan mengembangkan kemampuan berpikir logis serta pemecahan masalah.', 'Matematika', 'Kelas 4', 'Ganjil', '2026/2027', 'Lembar Kerja Peserta Didik (LKPD)', 'gdrive', NULL, 'https://drive.google.com/file/d/16nUlr6BQV-C5UQ5i_JeHf9MQZNul1ckG/view?usp=sharing', 'backend/uploads/modul/cover/1788154820_707c21ac_Screenshot_2026-08-31_123906.png', 'backend/uploads/modul/cover/1788154820_e21fa1f9_Screenshot_2026-08-31_123906.png', 'Published', 'Verified', 1, '2026-08-31 05:40:20', '2026-08-31 05:40:20', NULL),
(31, 'LKPD Seni Rupa Kelas 4', 'LKPD Seni Rupa Kelas 4 merupakan lembar kerja peserta didik yang dirancang untuk membantu siswa memahami dan mempraktikkan berbagai konsep dasar seni rupa melalui kegiatan yang kreatif, menarik, dan sesuai dengan tingkat perkembangan siswa.', 'Seni & Budaya', 'Kelas 4', 'Ganjil', '2026/2027', 'Lembar Kerja Peserta Didik (LKPD)', 'gdrive', NULL, 'https://drive.google.com/file/d/1ob_zkrxjxI9itz4KTZKYUXhKTAGJxbVf/view?usp=sharing', 'backend/uploads/modul/cover/1788154920_24ce7279_Screenshot_2026-08-31_124033.png', 'backend/uploads/modul/cover/1788154920_5e0c4fb5_Screenshot_2026-08-31_124033.png', 'Published', 'Verified', 1, '2026-08-31 05:42:00', '2026-08-31 05:42:00', NULL),
(32, 'LKPD IPAS Kelas 4', 'LKPD IPAS Kelas 4 merupakan lembar kerja peserta didik yang dirancang untuk membantu siswa memahami materi Ilmu Pengetahuan Alam dan Sosial melalui kegiatan yang interaktif, sederhana, dan sesuai dengan tingkat perkembangan siswa kelas 4. LKPD ini berisi aktivitas pengamatan, latihan, diskusi, dan tugas yang mendorong siswa berpikir kritis serta aktif dalam proses pembelajaran.', 'IPAS (Ilmu Pengetahuan Alam & Sosial)', 'Kelas 4', 'Ganjil', '2026/2027', 'Lembar Kerja Peserta Didik (LKPD)', 'gdrive', NULL, 'https://drive.google.com/file/d/1uozg4diQFH5yZ0AxTjESNgiuiwNCI-Xl/view?usp=sharing', 'backend/uploads/modul/cover/1788155017_7506ea31_Screenshot_2026-08-31_124227.png', 'backend/uploads/modul/cover/1788155017_cb83f42f_Screenshot_2026-08-31_124227.png', 'Published', 'Verified', 1, '2026-08-31 05:43:37', '2026-08-31 05:43:37', NULL),
(33, 'Buku Pendamping Bahasa Indonesia Kelas 5', 'Buku Pendamping Bahasa Indonesia Kelas 5 merupakan bahan ajar pendukung yang membantu siswa memahami materi Bahasa Indonesia melalui berbagai contoh, latihan, dan kegiatan pembelajaran. Buku ini dirancang untuk meningkatkan kemampuan membaca, menulis, menyimak, berbicara, serta memahami berbagai jenis teks secara bertahap dan menyenangkan.', 'Bahasa Indonesia', 'Kelas 5', 'Ganjil', '2025/2026', 'Bahan Ajar / Slide', 'gdrive', NULL, 'https://drive.google.com/file/d/1EpJxWkRGfr3Hd7d-dUyiE7DamRv52F7s/view?usp=sharing', 'backend/uploads/modul/cover/1788155256_516cabc1_Screenshot_2026-08-31_124652.png', 'backend/uploads/modul/cover/1788155256_7b68b010_Screenshot_2026-08-31_124652.png', 'Published', 'Verified', 1, '2026-08-31 05:47:36', '2026-08-31 05:47:36', NULL),
(34, 'Buku Pendamping Bahasa Inggris Kelas 5', 'Buku Pendamping Bahasa Inggris Kelas 5 merupakan bahan ajar pendukung yang dirancang untuk membantu siswa memahami dan meningkatkan kemampuan berbahasa Inggris melalui materi yang sederhana, latihan, dan kegiatan pembelajaran yang sesuai dengan tingkat kelas 5.', 'Bahasa Inggris', 'Kelas 5', 'Ganjil', '2025/2026', 'Bahan Ajar / Slide', 'gdrive', NULL, 'https://drive.google.com/file/d/1zdAdXuCcA5UlLjLSnvhV8gj4NIIVg6S-/view?usp=sharing', 'backend/uploads/modul/cover/1788155338_ba4d030d_Screenshot_2026-08-31_124757.png', 'backend/uploads/modul/cover/1788155338_9536f59c_Screenshot_2026-08-31_124757.png', 'Published', 'Verified', 1, '2026-08-31 05:48:58', '2026-08-31 05:48:58', NULL),
(35, 'LKPD Matematika Kelas 5', 'LKPD Matematika Kelas 5 merupakan lembar kerja peserta didik yang dirancang untuk membantu siswa memahami konsep matematika melalui kegiatan latihan, pemecahan masalah, dan soal-soal yang sesuai dengan materi pembelajaran kelas 5.', 'Matematika', 'Kelas 5', 'Ganjil', '2025/2026', 'Lembar Kerja Peserta Didik (LKPD)', 'gdrive', NULL, 'https://drive.google.com/file/d/1xMrBAc0RCOzjHOTsehy76Lch7eUQ2baC/view?usp=sharing', 'backend/uploads/modul/cover/1788155439_2862db16_Screenshot_2026-08-31_124919.png', 'backend/uploads/modul/cover/1788155439_a10c6b10_Screenshot_2026-08-31_124919.png', 'Published', 'Verified', 1, '2026-08-31 05:50:39', '2026-08-31 05:50:39', NULL),
(36, 'Modul Ajar Bahasa Jawa Kelas 5', 'Modul Ajar Bahasa Jawa Kelas 5 berisi materi pembelajaran Bahasa Jawa yang disusun secara sistematis untuk membantu peserta didik memahami kosakata, unggah-ungguh basa, membaca, menulis, serta mengenal budaya Jawa. Modul ini dilengkapi kegiatan pembelajaran yang menarik dan sesuai dengan tingkat kemampuan siswa kelas 5.', 'Bahasa Jawa / Muatan Lokal', 'Kelas 5', 'Ganjil', '2025/2026', 'Modul Ajar', 'gdrive', NULL, 'https://drive.google.com/file/d/1hDJazW76UW5d_xXuI3soHJVmfU8UMjYd/view?usp=sharing', 'backend/uploads/modul/cover/1788155515_91644def_Screenshot_2026-08-31_125056.png', 'backend/uploads/modul/cover/1788155515_29fd5637_Screenshot_2026-08-31_125056.png', 'Published', 'Verified', 1, '2026-08-31 05:51:55', '2026-08-31 05:51:55', NULL),
(37, 'Modul Ajar IPAS Kelas 5', 'Modul Ajar IPAS Kelas 5 merupakan bahan ajar yang dirancang untuk membantu peserta didik memahami berbagai konsep Ilmu Pengetahuan Alam dan Sosial melalui kegiatan pembelajaran yang menarik, kontekstual, dan sesuai dengan tingkat perkembangan siswa.', 'IPAS (Ilmu Pengetahuan Alam & Sosial)', 'Kelas 5', 'Ganjil', '2025/2026', 'Modul Ajar', 'gdrive', NULL, 'https://drive.google.com/file/d/1trZ2Q3cNhfWow8aD_SArZ2fzOFKPA9T2/view?usp=sharing', 'backend/uploads/modul/cover/1788155593_343b44df_Screenshot_2026-08-31_125216.png', 'backend/uploads/modul/cover/1788155593_2bd225d6_Screenshot_2026-08-31_125216.png', 'Published', 'Verified', 1, '2026-08-31 05:53:13', '2026-08-31 05:53:13', NULL),
(38, 'Modul Ajar Pendidikan Pancasila', 'Modul Ajar Pendidikan Pancasila merupakan bahan pembelajaran yang dirancang untuk membantu peserta didik memahami nilai-nilai Pancasila, sikap kebangsaan, serta penerapannya dalam kehidupan sehari-hari. Modul ini memuat materi dan kegiatan pembelajaran yang mendorong peserta didik untuk mengembangkan karakter, tanggung jawab, gotong royong, dan sikap menghargai keberagaman.', 'Pendidikan Pancasila', 'Kelas 5', 'Ganjil', '2025/2026', 'Modul Ajar', 'gdrive', NULL, 'https://drive.google.com/file/d/1IHxvQdNMK1wmXvi-NR5gbm_Wz7VjRlnf/view?usp=sharing', 'backend/uploads/modul/cover/1788155665_1c474888_Screenshot_2026-08-31_125325.png', 'backend/uploads/modul/cover/1788155665_4e6a4c21_Screenshot_2026-08-31_125325.png', 'Published', 'Verified', 1, '2026-08-31 05:54:25', '2026-08-31 05:54:25', NULL),
(39, 'Modul Ajar Seni Rupa Kelas 5', 'Modul Ajar Seni Rupa Kelas 5 merupakan bahan ajar yang dirancang untuk membantu peserta didik mengenal, memahami, dan mengembangkan kreativitas dalam bidang seni rupa melalui kegiatan menggambar, mewarnai, membuat karya, serta mengapresiasi karya seni. Modul ini disusun sesuai dengan kebutuhan pembelajaran siswa kelas 5 dan mendorong siswa untuk berekspresi secara kreatif, aktif, dan menyenangkan.', 'Seni & Budaya', 'Kelas 5', 'Ganjil', '2025/2026', 'Modul Ajar', 'gdrive', NULL, 'https://drive.google.com/file/d/12u9q8GeVai33Wtn12915eLqGNP_mXvmu/view?usp=sharing', 'backend/uploads/modul/cover/1788155734_27faafb4_Screenshot_2026-08-31_125440.png', 'backend/uploads/modul/cover/1788155734_ae740d89_Screenshot_2026-08-31_125440.png', 'Published', 'Verified', 1, '2026-08-31 05:55:34', '2026-08-31 05:55:34', NULL);

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
('hero_subtitle', 'SD Negeri 1 Mulyoagung hadir sebagai tempat belajar dan tumbuh bagi generasi penerus bangsa. Dengan lingkungan pendidikan yang nyaman, pembelajaran yang berkualitas, serta pendampingan dari para pendidik yang berdedikasi, kami berkomitmen membentuk siswa yang cerdas, berkarakter, kreatif, mandiri, dan berprestasi. Bersama-sama, kita membangun generasi yang memiliki semangat belajar, percaya diri, serta siap menghadapi tantangan dan meraih masa depan yang lebih baik.', '2026-08-28 02:49:57'),
('hero_title', 'SD Negeri 1 Mulyoagung', '2026-08-28 03:27:11'),
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
(5, 'yulida', 'yulida123', 'GURU', 'Yulida', '', NULL, 'Verified', NULL),
(6, 'ilhamzainuri', 'ilham123', 'ADMIN', 'Ilham Zainuri', '', NULL, 'Verified', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `akademik_menu`
--
ALTER TABLE `akademik_menu`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT for table `akademik_menu`
--
ALTER TABLE `akademik_menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `berita`
--
ALTER TABLE `berita`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `fasilitas`
--
ALTER TABLE `fasilitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `galeri`
--
ALTER TABLE `galeri`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
