-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 20, 2026 at 08:25 AM
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
(3, 'Innovative Government Award (IGA) dari Pemerintah Kabupaten Malang berkat program inovasi pendidikan unggulan mereka yang dikenal sebagai Inovasi HARAPAN.', 'Inovasi HARAPAN dari SD Negeri 1 Mulyoagung yang berfokus pada peningkatan mutu pelayanan dan sistem pembelajaran.', 'backend/uploads/berita/1785992845_Screenshot 2026-08-06 120707.png', 'Kegiatan Sekolah', '2026-08-06', 'Verified', NULL, ''),
(4, 'Lomba Seni dan Sastra', 'Dokumentasi kegiatan Lomba Seni dan Sastra yang menjadi wadah bagi siswa untuk menyalurkan kreativitas, mengembangkan bakat, serta mengekspresikan kemampuan dalam bidang seni dan sastra dengan penuh percaya diri.', 'backend/uploads/berita/1786508674_20260414_141705.jpg', 'Prestasi', '2026-08-12', 'Verified', 2, 'backend/uploads/berita/1786508674_20260414_141705.png'),
(5, 'Olimpiade Matematika', 'Prestasi membanggakan diraih oleh SD Negeri 1 Mulyoagung dalam ajang Olimpiade Matematika dengan berhasil meraih **Juara 2**. Pencapaian ini menjadi bukti semangat, kerja keras, dan kemampuan dalam bidang akademik yang patut diapresiasi.', 'backend/uploads/berita/1786597667_da587120_Screenshot_2026-08-13_120550.png', 'Prestasi', '2026-08-13', 'Verified', 2, 'backend/uploads/berita/1786597667_178bf5b9_Screenshot_2026-08-13_120550.png');

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
(2, 'Perpustakaan', 'Koleksi ribuan buku cerita, modul pembelajaran, koleksi literasi digital e-book, dan sudut baca ramah anak yang nyaman.', 'backend/uploads/fasilitas/1786413887_perpus1.jpeg', ''),
(3, 'Lapangan Olahraga & Upacara', 'Areal seluas 800m² dilapisi plester berkualitas untuk upacara bendera, senam bersama, bulutangkis, basket, dan <b>futsal.</b>', 'backend/uploads/fasilitas/1787113686_aa191515_20260329193210_1.jpg', 'backend/uploads/fasilitas/1787113686_88421805_20260329193210_1.png');

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
(4, 'Foto Bersama', 'Momen kebersamaan dan kekompakan para guru SD Negeri 1 Mulyoagung dalam suasana penuh keakraban dan kebahagiaan.', 'backend/uploads/galeri/1786498962_Dokumen dari Anisa Choirina(1).jpg', 'Kegiatan Sekolah', '2026-08-12', 'Verified', 2, ''),
(5, 'Foto Bersama', 'Momen kebersamaan dan kekompakan para guru SD Negeri 1 Mulyoagung dalam suasana penuh keakraban dan kebahagiaan.', 'backend/uploads/galeri/1786498988_Dokumen dari Anisa Choirina(4).jpg', 'Kegiatan Sekolah', '2026-08-12', 'Verified', 2, ''),
(6, 'Foto Bersama', 'Momen kebersamaan dan kekompakan para guru SD Negeri 1 Mulyoagung dalam suasana penuh keakraban dan kebahagiaan.', 'backend/uploads/galeri/1786499009_Dokumen dari Anisa Choirina(5).jpg', 'Kegiatan Sekolah', '2026-08-12', 'Verified', 2, ''),
(7, 'Pembelajaran', '### Pembelajaran\r\n\r\nDokumentasi berbagai kegiatan pembelajaran siswa yang berlangsung secara aktif, kreatif, dan menyenangkan sebagai bagian dari proses pengembangan pengetahuan, keterampilan, dan karakter.', 'backend/uploads/galeri/1786500329_20260513_075756.jpg', 'Pembelajaran', '2026-08-12', 'Verified', 2, ''),
(8, 'Pembelajaran', '### Pembelajaran\r\n\r\nDokumentasi berbagai kegiatan pembelajaran siswa yang berlangsung secara aktif, kreatif, dan menyenangkan sebagai bagian dari proses pengembangan pengetahuan, keterampilan, dan karakter.', 'backend/uploads/galeri/1786500381_20251025_082611.jpg', 'Pembelajaran', '2026-08-12', 'Verified', 2, ''),
(9, 'Acara Studi Tiru Inovasi Sekolah', 'Dokumentasi kegiatan \"Studi Tiru Inovasi Sekolah\" yang bertujuan untuk memperluas wawasan, berbagi pengalaman, serta mempelajari berbagai program dan inovasi pendidikan guna meningkatkan kualitas pembelajaran dan pengelolaan sekolah.', 'backend/uploads/galeri/1786501375_Screenshot 2026-08-06 120707.png', 'Acara Khusus', '2026-08-12', 'Verified', 2, ''),
(10, 'Pramuka', 'Dokumentasi kegiatan Pramuka yang menampilkan semangat, kedisiplinan, kerja sama, dan kreativitas siswa dalam berbagai aktivitas kepramukaan.', 'backend/uploads/galeri/1786504109_20251023_101114.jpg', 'Ekstrakurikuler', '2026-08-12', 'Verified', 2, ''),
(11, 'Karate', 'Menampilkan berbagai kegiatan ekstrakurikuler yang tersedia dan dapat diikuti oleh siswa sebagai bagian dari pengembangan bakat, minat, dan keterampilan.', 'backend/uploads/galeri/1786593452_88637573_20251023_090144.jpg', 'Ekstrakurikuler', '2026-08-12', 'Verified', 2, 'backend/uploads/galeri/1786593452_fd9da29e_20251023_090144.png'),
(12, 'Lomba Seni dan Sastra', 'Dokumenta<b>kegiatan </b>Lomba Seni dan Sastra yang menjadi wadah bagi siswa untuk menyalurkan kreativitdsas, mengembangkan bakat, serta mengekspresikan kemampuan dalam bidang seni dan sastra dengan penuh percaya diri.', 'backend/uploads/galeri/1786504127_20260414_141705.jpg', 'Prestasi', '2026-08-12', 'Verified', 2, '');

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

--
-- Dumping data for table `guru_tendik`
--

INSERT INTO `guru_tendik` (`id`, `nama`, `nip`, `jabatan`, `tugas`, `foto`, `riwayat_pendidikan`, `jenis_kelamin`, `status`, `motto`, `foto_crop`) VALUES
(3, 'Soleh', NULL, 'Komite Sekolah', 'Komite Sekolah', 'backend/uploads/guru/1786069668_logoma.jpg', 'S1', 'Laki-laki', 'Aktif', '\"Bersama Maju, Bergandengan Tangan Menuju Sekolah Unggul.\"', ''),
(4, 'AMALIA DYAH ERVIANA, S.Pd.', '198507172006042012', 'Kepala Sekolah', 'Kepala Sekolah', 'backend/uploads/guru/1786506232_Amalia_Dyah_Erviana.jpg', 'S1 (Sarjana Pendidikan)', 'Perempuan', 'Aktif', 'Berani berinovasi untuk pendidikan yang ledsasadbih bermakna.', 'backend/uploads/guru/1786506232_Amalia_Dyah_Erviana.png'),
(5, 'ANISA CHOIRINA, S.Pd.', '-', 'Tata Usaha', 'Tata Usaha & Unit Perpustakaan', 'backend/uploads/guru/1786583610_07be63f3_Screenshot_2026-08-07_094553.png', 'S1 (Sarjana Pendidikan)', 'Perempuan', 'Aktif', 'p', 'backend/uploads/guru/1786583620_06139f89_1786583610_07be63f3_Screenshot_2026-08-07_094553.png'),
(6, 'ZAINURI, M.Pd.', 'null', 'Guru Mata Pelajaran', 'Pendidikan Agama Islam', 'backend/uploads/guru/1786506315_zainuri.png', 'S2  (Magister Pendidikan)', 'Laki-laki', 'Aktif', 'p', ''),
(7, 'WEGA BAGUS SETIAWAN, S.Or., M.Pd., Gr.', '199503302024211015', 'Guru Mata Pelajaran', 'Pendidikan Jasmani Dan Rohani', 'backend/uploads/guru/1786506303_wega_bagus.png', 'S1 (Sarjana Olahraga), S2 (Magister Pendidikan), (Guru Profesional)', 'Laki-laki', 'Aktif', 'p', ''),
(8, 'FANDI ARI WIJAYA, S.Or., Gr.', 'null', 'Guru Mata Pelajaran', 'Pendidikan Jasmani Dan Rohani', 'backend/uploads/guru/1786071327_logoma.jpg', 'S1 (Sarjana Olahraga), (Guru Profesional)', 'Laki-laki', 'Aktif', 'p', ''),
(9, 'SUNU HAYUTAMA, S.Pd.', '198209042022212010', 'Guru Wali Kelas', 'Guru Kelas 1A', 'backend/uploads/guru/1786505693_sunu_hayutama.png', 'S1 (Sarjana Pendidikan)', 'Perempuan', 'Aktif', 'p', ''),
(10, 'PUTRI ANGGUN LIARTA, S.Pd.', '199501162025212010', 'Guru Wali Kelas', 'Guru Kelas 1B', 'backend/uploads/guru/1786505765_Putri_anggun_liarta.png', 'S1 (Sarjana Pendidikan)', 'Perempuan', 'Aktif', 'p', ''),
(11, 'RATNA YULIYA KIRNAWATI, S.Pd.', 'null', 'Guru Wali Kelas', 'Guru Kelas 2A', 'backend/uploads/guru/1786505777_bu_ratna.png', 'S1 (Sarjana Pendidikan)', 'Perempuan', 'Aktif', 'p', ''),
(12, 'YUNIA NUR AFIYAH, S.Pd.', 'null', 'Guru Wali Kelas', 'Guru Kelas 2B', 'backend/uploads/guru/1786583993_cc86a6b3_Yunia_Nur_Afiyah.png', 'S1 (Sarjana Pendidikan)', 'Perempuan', 'Aktif', 'p', 'backend/uploads/guru/1786583993_41f284ca_Yunia_Nur_Afiyah.png'),
(13, 'ADI KURNIAWAN, S.Pd.', 'null', 'Guru Wali Kelas', 'Guru Kelas 3A & 3B', 'backend/uploads/guru/1786505790_pk_Adi.png', 'S1 (Sarjana Pendidikan)', 'Laki-laki', 'Aktif', 'p', ''),
(15, 'NUR AINI FARIDA, S.Pd.', '198904292020122009', 'Guru Wali Kelas', 'Guru Kelas 4A', 'backend/uploads/guru/1786505804_nur_aini_farida.png', 'S1 (Sarjana Pendidikan)', 'Perempuan', 'Aktif', 'p', ''),
(16, 'SRI HARTATIK, S.Pd.', '197501052021212004', 'Guru Wali Kelas', 'Guru Kelas 4B', 'backend/uploads/guru/1786505829_Sri_Hartatik.png', 'S1 (Sarjana Pendidikan)', 'Perempuan', 'Aktif', 'p', ''),
(17, 'SITI MAISAROH, S.Pd.', 'null', 'Guru Wali Kelas', 'Guru Kelas 5A', 'backend/uploads/guru/1786505846_bu_siti.png', 'S1 (Sarjana Pendidikan)', 'Perempuan', 'Aktif', 'p', ''),
(18, 'YUNI TRI HARIANTI, S.IP., S.Pd.', '198206102022212038', 'Guru Wali Kelas', 'Guru Kelas 5B', '', 'S1 (Sarjana Ilmu Politik / Sarjana Ilmu Pemerintahan), S1 (Sarjana Pendidikan)', 'Perempuan', 'Aktif', 'p', NULL),
(19, 'VIVIN NOHTAHFIAH, S.Pd.', NULL, 'Guru Wali Kelas', 'Guru Kelas 6A', 'backend/uploads/guru/1786506270_bu_vivin.png', 'S1 (Sarjana Pendidikan)', 'Perempuan', 'Aktif', 'p', ''),
(20, 'Yulida Ariani, S.Pd.', '198102032023212011', 'Guru Wali Kelas', 'Guru Kelas 6B', 'backend/uploads/guru/1786506283_yulida.png', 'S1 (Sarjana Pendidikan)', 'Perempuan', 'Aktif', 'p', ''),
(21, 'ABDUL MUJIB', NULL, 'Tenaga Kependidikan', 'Penjaga', '', 'S1', 'Laki-laki', 'Aktif', 'p', NULL),
(22, 'MARSUDI', NULL, 'Tenaga Kependidikan', 'Tenaga Kebersihan', '', 'SD', 'Laki-laki', 'Aktif', 'p', NULL),
(23, 'AGUS SUKOCO', NULL, 'Tenaga Kependidikan', 'Tenaga Keamanan', '', 'SD', 'Laki-laki', 'Aktif', 'p', NULL);

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
(1, 'backend/uploads/hero/1786422448_img2.webp', 'MA ONE BERGELORAA!!', 'Galeri Sekolah', 2, 1, '2026-08-11 04:27:28', NULL),
(4, 'backend/uploads/hero/1786425871_lapangan.jpeg', 'MA ONE BERGELORA!!!1', 'Fasilitas Sekolah', 1, 1, '2026-08-11 05:24:31', ''),
(5, 'backend/uploads/hero/1786498698_Dokumen dari Anisa Choirina(1).jpg', 'MA ONE BERGELORA!!!', 'Kegiatan Utama', 3, 1, '2026-08-12 01:38:18', NULL),
(6, 'backend/uploads/hero/1786498779_Dokumen dari Anisa Choirina(4).jpg', 'MA ONE BERGELORA!!!', 'Kegiatan Utama', 4, 1, '2026-08-12 01:39:39', NULL),
(7, 'backend/uploads/hero/1786498788_Dokumen dari Anisa Choirina(5).jpg', 'MA ONE BERGELORA!!!', 'Kegiatan Utama', 5, 1, '2026-08-12 01:39:48', NULL),
(8, 'backend/uploads/hero/1786498798_Dokumen dari Anisa Choirina(6).jpg', 'MA ONE BERGELORA!!!', 'Kegiatan Utama', 6, 1, '2026-08-12 01:39:58', NULL),
(9, 'backend/uploads/hero/1786498817_Dokumen dari Anisa Choirina.jpg', 'MA ONE BERGELORA!!!', 'Kegiatan Utama', 7, 1, '2026-08-12 01:40:17', NULL),
(10, 'backend/uploads/hero/1786498825_Dokumen dari Anisa Choirina(3).jpg', 'MA ONE BERGELORA!!!', 'Kegiatan Utama', 8, 1, '2026-08-12 01:40:25', NULL),
(11, 'backend/uploads/hero/1786498834_Dokumen dari Anisa Choirina(7).jpg', 'MA ONE BERGELORA!!!', 'Kegiatan Utama', 9, 1, '2026-08-12 01:40:34', NULL),
(12, 'backend/uploads/hero/1786498842_Dokumen dari Anisa Choirina(8).jpg', 'MA ONE BERGELORA!!!', 'Kegiatan Utama', 10, 1, '2026-08-12 01:40:42', NULL);

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
('alamat_sekolah', 'JL. RAYA MULYOAGUNG NO.121 RT. 1 RW. 10 DUSUN MULYOAGUNG , Kec. Dau, Kab. Malang, Prov. Jawa Timur', '2026-08-11 03:54:01'),
('email_sekolah', 'sdnmulyoagung01@gmail.com', '2026-08-11 03:54:01'),
('hero_bg', '', '2026-08-18 05:16:54'),
('hero_subtitle', 'subjuduldsadas', '2026-08-19 02:04:57'),
('hero_title', 'djasdjashdhas dsahdjasjd aahdhashjd aj', '2026-08-19 02:32:31'),
('homepage_sections', '[{\"key\":\"hero\",\"judul\":\"Hero\",\"subjudul\":\"\",\"is_active\":true},{\"key\":\"stats\",\"judul\":\"Statistik Sekolah\",\"subjudul\":\"\",\"is_active\":true},{\"key\":\"sambutan\",\"judul\":\"Sambutan Kepala Sekolah\",\"subjudul\":\"\",\"is_active\":true},{\"key\":\"profil\",\"judul\":\"Profil Sekolahhhh\",\"subjudul\":\"Mengenal lebih dekat visi, misi, dan sejarah panjang SD Negeri 1 Mulyoagung.\",\"is_active\":true},{\"key\":\"video\",\"judul\":\"Profil Video Sekolahhh\",\"subjudul\":\"Tonton video profil sekolah kami untuk mengenal lingkungan belajar, fasilitas, dan kegiatan siswa secara visual.\",\"is_active\":true},{\"key\":\"berita\",\"judul\":\"Berita & Kegiatan Terbaruuuu\",\"subjudul\":\"Ikuti terus perkembangan informasi dan aktivitas menarik di sekolah kami.\",\"is_active\":true},{\"key\":\"kontak\",\"judul\":\"Kontak Kamiiii\",\"subjudul\":\"Hubungi kami atau kunjungi lokasi sekolah dasar kami melalui detail kontak di bawah ini.\",\"is_active\":true}]', '2026-08-18 05:58:49'),
('link_ppdb', 'https://sd-spmbmalangkab.id/', '2026-08-11 03:31:06'),
('medsos_links', '[{\"id\":\"1\",\"name\":\"YouTube\",\"url\":\"https://www.youtube.com/@mulyoagungsatu3851\",\"icon\":\"auto\"},{\"id\":\"2\",\"name\":\"Instagram\",\"url\":\"https://www.instagram.com/mulyoagung1_dau\",\"icon\":\"auto\"},{\"id\":\"3\",\"name\":\"Facebook\",\"url\":\"https://www.facebook.com/profile.php?id=100085140035121\",\"icon\":\"auto\"},{\"id\":\"4\",\"name\":\"TikTok\",\"url\":\"https://www.tiktok.com/@mulyoagung.1\",\"icon\":\"auto\"},{\"id\":\"medsos-1787195831314\",\"name\":\"Ilhamartar_\",\"url\":\"https://www.instagram.com/ilhamartar_\",\"icon\":\"Instagram\"}]', '2026-08-20 03:17:11'),
('profil_misi', '[\"ini misi\"]', '2026-08-18 05:32:51'),
('profil_sejarah', '<u>ini sejarahdsa d</u>', '2026-08-19 04:24:17'),
('profil_visi', '<b>ini visi dsajdasjdjasjdjasd dsadsa</b>', '2026-08-19 04:24:11'),
('tahun_ajaran', '2026/2027', '2026-08-19 01:40:41'),
('telepon_sekolah', '(0341) 466-730', '2026-08-11 03:54:01'),
('video_url', 'https://www.youtube.com/watch?v=-HU-Kg20g-M', '2026-08-18 05:43:38'),
('whatsapp_sekolah', '08123456789a', '2026-08-18 05:38:06');

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
(1, 'Pengumuman Penting', 'Sistem Penerimaan Murid Baru (SPMB) Tahun Ajaran Baru telah dibuka! Jangan lewatkan kesempatan untuk bergabung dengan sekolah dasar terbaik di Kota Malang. Kuota terbatas untuk gelombang pertama.', 'Pendaftaran Siswa Baru (PPDB) Tahun Ajaran Baru Resmi Dibuka! Segera Daftarkan Putra-Putri Anda.', 0, 0, 'SPMB', 'https://sd-spmbmalangkab.id/', 0, 'backend/uploads/pengumuman/1786411305_Screenshot 2026-08-11 082132.png', '', 1, '2026-08-11', '2026-09-10', '');

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
(1, 'Amalia Dyah Erviana, S.Pd.', '<u>Assalamualaikum Wr. Wb</u>.\r\n\r\nSelamat datang di website resmi SD Negeri Mulyoagung 1. Kami berkomitmen memberikan pendidikan terbaik bagi putra-putri Anda, membimbing mereka menjadi generasi yang tidak hanya cerdas secara akademik, namun juga memiliki karakter dan budi pekerti yang luhur. \r\n\r\nMelalui semangat kebersamaan, inovasi pembelajaran berbasis digital, dan penguatan Profil Pelajar Pancasila, kami yakin dapat membentuk peserta didik yang siap menghadapi tantangan masa depan dengan tetap memegang teguh nilai-nilai keagamaan dan budaya bangsa. Melalui website ini, kami berharap dapat menjalin komunikasi yang lebih erat dengan seluruh masyarakat dan orang tua wali murid.', 'backend/uploads/sambutan/1786426193_Amalia Dyah Erviana.jpg', 'backend/uploads/sambutan/1786509156_de5c5ca1_1786426193_Amalia_Dyah_Erviana.png');

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
(1, 'Siswa', '250+', 'Siswa Aktif'),
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
(2, 'admin1', 'admin123', 'ADMIN', 'Muhammad Hafiz F', 'backend/uploads/profile/1786509294_698c79dc_19ae3379-8cec-409d-806f-c148c1811c2b.jpg', 'backend/uploads/profile/1786509294_1b387f9d_19ae3379-8cec-409d-806f-c148c1811c2b.png'),
(13, 'ilhamzainuri', 'ilham123', 'ADMIN', 'Ilham Zainuri', 'backend/uploads/profile/1787114585_50fd7237_20260419172708_1.jpg', 'backend/uploads/profile/1787114602_e4b6a032_1787114585_50fd7237_20260419172708_1.png'),
(14, 'daniel', 'daniel123', 'TIM', 'Daniel', '', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `berita`
--
ALTER TABLE `berita`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uploaded_by` (`uploaded_by`),
  ADD KEY `idx_berita_status_tgl` (`status_verifikasi`,`tanggal`,`id`);

--
-- Indexes for table `fasilitas`
--
ALTER TABLE `fasilitas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `galeri`
--
ALTER TABLE `galeri`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uploaded_by` (`uploaded_by`),
  ADD KEY `idx_galeri_status_tgl` (`status_verifikasi`,`tanggal`,`id`);

--
-- Indexes for table `guru_tendik`
--
ALTER TABLE `guru_tendik`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_guru_nip` (`nip`);

--
-- Indexes for table `hero_carousel`
--
ALTER TABLE `hero_carousel`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ip_time` (`ip_address`,`attempted_at`);

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
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `galeri`
--
ALTER TABLE `galeri`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `guru_tendik`
--
ALTER TABLE `guru_tendik`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `hero_carousel`
--
ALTER TABLE `hero_carousel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `berita`
--
ALTER TABLE `berita`
  ADD CONSTRAINT `berita_ibfk_1` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `galeri`
--
ALTER TABLE `galeri`
  ADD CONSTRAINT `galeri_ibfk_1` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
