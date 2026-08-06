CREATE DATABASE IF NOT EXISTS db_sdn1mulyoagung;
USE db_sdn1mulyoagung;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'TIM') NOT NULL DEFAULT 'TIM',
    nama_penanggung_jawab VARCHAR(255) NOT NULL,
    foto VARCHAR(255) NULL
);

-- Guru & Tendik Table
CREATE TABLE IF NOT EXISTS guru_tendik (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    nip VARCHAR(50) NOT NULL,
    jabatan VARCHAR(100) NOT NULL, -- Kepala Sekolah, Guru Wali Kelas, Guru Mata Pelajaran
    tugas VARCHAR(255) NOT NULL,   -- e.g. Guru Kelas I, Pendidikan Agama Islam
    foto VARCHAR(255) NULL,
    riwayat_pendidikan TEXT NOT NULL,
    jenis_kelamin ENUM('Laki-laki', 'Perempuan') NOT NULL,
    status VARCHAR(50) NOT NULL    -- e.g. PNS, Honorer
);

-- Galeri Table
CREATE TABLE IF NOT EXISTS galeri (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    foto VARCHAR(255) NOT NULL,
    kategori VARCHAR(100) NOT NULL, -- Kegiatan Sekolah, Ekstrakurikuler, dll
    tanggal DATE NOT NULL,
    status_verifikasi ENUM('Pending', 'Verified', 'Rejected') NOT NULL DEFAULT 'Pending',
    uploaded_by INT NULL,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Berita Table
CREATE TABLE IF NOT EXISTS berita (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    isi TEXT NOT NULL,
    foto VARCHAR(255) NOT NULL,
    kategori VARCHAR(100) NOT NULL, -- Kegiatan Sekolah, Ekstrakurikuler, Prestasi, Pengumuman, dll
    tanggal DATE NOT NULL,
    status_verifikasi ENUM('Pending', 'Verified', 'Rejected') NOT NULL DEFAULT 'Pending',
    uploaded_by INT NULL,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Default Admin User (username: admin, password: admin123)
-- Hash generated using password_hash('admin123', PASSWORD_DEFAULT)
INSERT INTO users (username, password, role, nama_penanggung_jawab, foto) 
VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', 'Administrator Sekolah', '')
ON DUPLICATE KEY UPDATE username=username;
