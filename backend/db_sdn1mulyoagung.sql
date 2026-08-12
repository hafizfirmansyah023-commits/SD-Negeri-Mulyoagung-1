-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 11, 2026 at 07:48 AM
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
  `foto_crop` varchar(255) DEFAULT NULL,
  `kategori` varchar(100) NOT NULL,
  `tanggal` date NOT NULL,
  `status_verifikasi` enum('Pending','Verified','Rejected') NOT NULL DEFAULT 'Pending',
  `uploaded_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `berita`
--

INSERT INTO `berita` (`id`, `judul`, `isi`, `foto`, `kategori`, `tanggal`, `status_verifikasi`, `uploaded_by`) VALUES
(3, 'Innovative Government Award (IGA) dari Pemerintah Kabupaten Malang berkat program inovasi pendidikan unggulan mereka yang dikenal sebagai Inovasi HARAPAN.', 'Inovasi HARAPAN dari SD Negeri 1 Mulyoagung yang berfokus pada peningkatan mutu pelayanan dan sistem pembelajaran.', 'backend/uploads/berita/1785992845_Screenshot 2026-08-06 120707.png', 'Prestasi', '2026-08-06', 'Verified', 3);

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

INSERT INTO `fasilitas` (`id`, `judul`, `deskripsi`, `foto`) VALUES
(1, 'Laboratorium Komputer & TIK Interaktif', 'Dilengkapi 30 unit komputer terkini, jaringan Wi-Fi sekolah, dan Smart Display untuk pembelajaran coding dasar & literasi digital.', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'),
(2, 'Perpustakaan', 'Koleksi ribuan buku cerita, modul pembelajaran, koleksi literasi digital e-book, dan sudut baca ramah anak yang nyaman.', 'backend/uploads/fasilitas/1786413887_perpus1.jpeg'),
(3, 'Lapangan Olahraga & Upacara', 'Areal seluas 800m² dilapisi plester berkualitas untuk upacara bendera, senam bersama, bulutangkis, basket, dan futsal.', 'backend/uploads/fasilitas/1786416364_lapangan.jpeg'),
(4, 'Ruang UKS & Poliklinik Sekolah', 'Fasilitas pertolongan pertama kesehatan dengan tempat tidur bersih, pengukuran TB/BB rutin, dan kerja sama Puskesmas Dau.', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600'),
(5, 'Kantin Sehat Bergizi', 'Menyediakan makanan dan minuman sehat yang higienis, bebas bahan pengawet berbahaya, dan diawasi oleh tim gizi sekolah.', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600');

-- --------------------------------------------------------

--
-- Table structure for table `galeri`
--

CREATE TABLE `galeri` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `foto` varchar(255) NOT NULL,
  `foto_crop` varchar(255) DEFAULT NULL,
  `kategori` varchar(100) NOT NULL,
  `tanggal` date NOT NULL,
  `status_verifikasi` enum('Pending','Verified','Rejected') NOT NULL DEFAULT 'Pending',
  `uploaded_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `foto_crop` varchar(255) DEFAULT NULL,
  `riwayat_pendidikan` text NOT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') NOT NULL,
  `status` enum('Aktif','Mutasi','Pensiun','') NOT NULL,
  `motto` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `guru_tendik`
--

INSERT INTO `guru_tendik` (`id`, `nama`, `nip`, `jabatan`, `tugas`, `foto`, `riwayat_pendidikan`, `jenis_kelamin`, `status`, `motto`) VALUES
(3, 'Soleh', NULL, 'Komite Sekolah', 'Komite Sekolah', 'backend/uploads/guru/1786069668_logoma.jpg', 'S1', 'Laki-laki', 'Aktif', '\"Bersama Maju, Bergandengan Tangan Menuju Sekolah Unggul.\"'),
(4, 'AMALIA DYAH ERVIANA, S.Pd.', '198507172006042012', 'Kepala Sekolah', 'Kepala Sekolah', 'backend/uploads/guru/1786426203_Amalia Dyah Erviana.jpg', 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'Perempuan', 'Aktif', 'Berani berinovasi untuk pendidikan yang lebih bermakna.'),
(5, 'ANISA CHOIRINA, S.Pd.', NULL, 'Tata Usaha', 'Tata Usaha & Unit Perpustakaan', 'backend/uploads/guru/1786070771_Screenshot 2026-08-07 094553.png', 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'Perempuan', 'Aktif', 'p'),
(6, 'ZAINURI, M.Pd.', NULL, 'Guru Mata Pelajaran', 'Pendidikan Agama Islam', 'backend/uploads/guru/1786071170_logoma.jpg', 'S2  (Pendidikan Guru Sekolah Dasar)', 'Laki-laki', 'Aktif', 'p'),
(7, 'WEGA BAGUS SETIAWAN, S.Or., M.Pd., Gr.', NULL, 'Guru Mata Pelajaran', 'Pendidikan Jasmani Dan Rohani', 'backend/uploads/guru/1786071266_logoma.jpg', 'S1 PJOK', 'Laki-laki', 'Aktif', 'p'),
(8, 'FANDI ARI WIJAYA, S.Or., Gr.', NULL, 'Guru Mata Pelajaran', 'Pendidikan Jasmani Dan Rohani', 'backend/uploads/guru/1786071327_logoma.jpg', 'S1 PJOK', 'Laki-laki', 'Aktif', 'p'),
(9, 'SUNU HAYUTAMA, S.Pd.', NULL, 'Guru Wali Kelas', 'Guru Kelas 1A', 'backend/uploads/guru/1786339856_Screenshot 2026-08-10 123039.png', 'S1  (Pendidikan Guru Sekolah Dasar)', 'Perempuan', 'Aktif', 'p'),
(10, 'PUTRI ANGGUN LIARTA, S.Pd.', NULL, 'Guru Wali Kelas', 'Guru Kelas 1B', 'backend/uploads/guru/1786339889_Screenshot 2026-08-10 123120.png', 'S1', 'Perempuan', 'Aktif', 'p'),
(11, 'RATNA YULIYA KIRNAWATI, S.Pd.', 'null', 'Guru Wali Kelas', 'Guru Kelas 2A', 'backend/uploads/guru/1786426504_bu_ratna.png', 'S1', 'Perempuan', 'Aktif', 'p'),
(12, 'YUNIA NUR AFIYAH, S.Pd.', NULL, 'Guru Wali Kelas', 'Guru Kelas 2B', 'backend/uploads/guru/1786071638_logoma.jpg', 'S1', 'Perempuan', 'Aktif', 'p'),
(13, 'ADI KURNIAWAN, S.Pd.', 'null', 'Guru Wali Kelas', 'Guru Kelas 3A & 3B', '', 'S1', 'Laki-laki', 'Aktif', 'p'),
(14, 'SOQIBATUL ISLAMIYAH, S.Pd.', 'null', 'Guru Wali Kelas', 'Guru Kelas 3B', '', 'S1', 'Perempuan', 'Mutasi', 'p'),
(15, 'NUR AINI FARIDA, S.Pd.', NULL, 'Guru Wali Kelas', 'Guru Kelas 4A', '', 'S1', 'Perempuan', 'Aktif', 'p'),
(16, 'SRI HARTATIK, S.Pd.', NULL, 'Guru Wali Kelas', 'Guru Kelas 4B', 'backend/uploads/guru/1786340232_Screenshot 2026-08-10 123645.png', 'S1', 'Perempuan', 'Aktif', 'p'),
(17, 'SITI MAISAROH, S.Pd.', 'null', 'Guru Wali Kelas', 'Guru Kelas 5A', 'backend/uploads/guru/1786426222_bu_siti.png', 'S1', 'Perempuan', 'Aktif', 'p'),
(18, 'YUNI TRI HARIANTI, S.IP., S.Pd.', NULL, 'Guru Wali Kelas', 'Guru Kelas 5B', '', 'S1', 'Perempuan', 'Aktif', 'p'),
(19, 'VIVIN NOHTAHFIAH, S.Pd.', NULL, 'Guru Wali Kelas', 'Guru Kelas 6A', 'backend/uploads/guru/1786340264_Screenshot 2026-08-10 123732.png', 'S1', 'Perempuan', 'Aktif', 'p'),
(20, 'Yulida Ariani, S.Pd.', NULL, 'Guru Wali Kelas', 'Guru Kelas 6B', '', 'S1', 'Perempuan', 'Aktif', 'p'),
(21, 'ABDUL MUJIB', NULL, 'Tenaga Kependidikan', 'Penjaga', '', 'S1', 'Laki-laki', 'Aktif', 'p'),
(22, 'MARSUDI', NULL, 'Tenaga Kependidikan', 'Tenaga Kebersihan', '', 'S1', 'Laki-laki', 'Aktif', 'p'),
(23, 'AGUS SUKOCO', NULL, 'Tenaga Kependidikan', 'Tenaga Keamanan', '', 'SD', 'Laki-laki', 'Aktif', 'p');

-- --------------------------------------------------------

--
-- Table structure for table `hero_carousel`
--

CREATE TABLE `hero_carousel` (
  `id` int(11) NOT NULL,
  `foto` varchar(255) NOT NULL,
  `foto_crop` varchar(255) DEFAULT NULL,
  `caption` varchar(255) NOT NULL,
  `tag` varchar(100) DEFAULT 'Kegiatan Utama',
  `urutan` int(11) DEFAULT 0,
  `is_active` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hero_carousel`
--

INSERT INTO `hero_carousel` (`id`, `foto`, `caption`, `tag`, `urutan`, `is_active`, `created_at`) VALUES
(1, 'backend/uploads/hero/1786422448_img2.webp', 'MA ONE BERGELORAA!!', 'Galeri Sekolah', 1, 1, '2026-08-11 04:27:28'),
(3, 'backend/uploads/hero/1786425334_Screenshot 2026-08-06 120707.png', 'MA ONE BERGELORA!!', 'Galeri Sekolah', 2, 1, '2026-08-11 05:15:34'),
(4, 'backend/uploads/hero/1786425871_lapangan.jpeg', 'MA ONE BERGELORA!!!', 'Fasilitas Sekolah', 3, 1, '2026-08-11 05:24:31');

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
('link_ppdb', 'https://sd-spmbmalangkab.id/', '2026-08-11 03:31:06'),
('medsos_links', '[{\"id\":\"1\",\"name\":\"YouTube\",\"url\":\"https:\\/\\/www.youtube.com\\/@mulyoagungsatu3851\",\"icon\":\"auto\"},{\"id\":\"2\",\"name\":\"Instagram\",\"url\":\"https:\\/\\/www.instagram.com\\/mulyoagung1_dau\",\"icon\":\"auto\"},{\"id\":\"3\",\"name\":\"Facebook\",\"url\":\"https:\\/\\/www.facebook.com\\/profile.php?id=100085140035121\",\"icon\":\"auto\"},{\"id\":\"4\",\"name\":\"TikTok\",\"url\":\"https:\\/\\/www.tiktok.com\\/@mulyoagung.1\",\"icon\":\"auto\"}]', '2026-08-11 03:54:01'),
('tahun_ajaran', '2026/2027', '2026-08-07 01:59:45'),
('telepon_sekolah', '(0341) 466-730', '2026-08-11 03:54:01'),
('whatsapp_sekolah', '08123456789', '2026-08-11 03:54:01');

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
  `foto_crop` varchar(255) DEFAULT NULL,
  `photo_link` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `tanggal_mulai` date DEFAULT NULL,
  `tanggal_selesai` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengumuman_penting`
--

INSERT INTO `pengumuman_penting` (`id`, `judul`, `isi`, `running_text`, `show_popup`, `show_button`, `button_text`, `button_link`, `show_photo`, `foto`, `photo_link`, `is_active`, `tanggal_mulai`, `tanggal_selesai`) VALUES
(1, 'Pengumuman Penting', 'Sistem Penerimaan Murid Baru (SPMB) Tahun Ajaran Baru telah dibuka! Jangan lewatkan kesempatan untuk bergabung dengan sekolah dasar terbaik di Kota Malang. Kuota terbatas untuk gelombang pertama.', 'Pendaftaran Siswa Baru (PPDB) Tahun Ajaran Baru Resmi Dibuka! Segera Daftarkan Putra-Putri Anda.', 1, 1, 'SPMB', 'https://sd-spmbmalangkab.id/', 1, 'backend/uploads/pengumuman/1786411305_Screenshot 2026-08-11 082132.png', '', 1, '2026-08-11', '2026-08-18');

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

INSERT INTO `sambutan_kepsek` (`id`, `nama`, `sambutan`, `foto`) VALUES
(1, 'Amalia Dyah Erviana, S.Pd.', 'Assalamualaikum Wr. Wb.\r\n\r\nSelamat datang di website resmi SD Negeri Mulyoagung 1. Kami berkomitmen memberikan pendidikan terbaik bagi putra-putri Anda, membimbing mereka menjadi generasi yang tidak hanya cerdas secara akademik, namun juga memiliki karakter dan budi pekerti yang luhur. \r\n\r\nMelalui semangat kebersamaan, inovasi pembelajaran berbasis digital, dan penguatan Profil Pelajar Pancasila, kami yakin dapat membentuk peserta didik yang siap menghadapi tantangan masa depan dengan tetap memegang teguh nilai-nilai keagamaan dan budaya bangsa. Melalui website ini, kami berharap dapat menjalin komunikasi yang lebih erat dengan seluruh masyarakat dan orang tua wali murid.', 'backend/uploads/sambutan/1786426193_Amalia Dyah Erviana.jpg');

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

INSERT INTO `users` (`id`, `username`, `password`, `role`, `nama_penanggung_jawab`, `foto`) VALUES
(2, 'admin1', '$2y$10$xMjWgEM8P/SySrAtWfpr8eC0PCOcqaz7Z1nnFJhvD5x1DP7NdDgAS', 'ADMIN', 'Ilham Zainuri', 'backend/uploads/profile/1785983881_20260417041002_1.jpg'),
(3, 'voli123', '$2y$10$GkRRznDjplBrZwG8ayLH/ugSRLJC2S94qxYJai8Hmnkc1G3Oqpm1i', 'TIM', 'hafiz', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `berita`
--
ALTER TABLE `berita`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uploaded_by` (`uploaded_by`);

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
  ADD KEY `uploaded_by` (`uploaded_by`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `fasilitas`
--
ALTER TABLE `fasilitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `galeri`
--
ALTER TABLE `galeri`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `guru_tendik`
--
ALTER TABLE `guru_tendik`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `hero_carousel`
--
ALTER TABLE `hero_carousel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
