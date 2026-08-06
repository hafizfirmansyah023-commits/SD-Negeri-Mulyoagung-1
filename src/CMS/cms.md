Dashboard CMS
--CRUD Direktori guru dan Tendik
    Jabatan (Kepala Sekolah, Guru Wali Kelas, Guru Mata Pelajaran)
    Nama, NIP, Tugas(Guru Kelas I, Pendidikan Agama Islam, dll)
    Foto, Riwayat Pendidikan, Jenis Kelamin, Status
--CRUD Foto/Galeri
    Judul Foto, Deskripsi, Foto
    Kategori (Kegiatan Sekolah, Ekstrakurikuler,dll), Tanggal
--CRUD Berita
    Judul Berita, Isi Berita, Foto
    Kategori (Kegiatan Sekolah, Ekstrakurikuler,Prestasi, Pengumuman,dll), Tanggal, USER yg Upload berita (Tim Kesiswaan)
--CRUD User
    Username, Password, Role, Nama penanggung jawab, foto, ganti username, ganti password (ADMIN/TIM Kesiswaan dll(Jika tim hanya mempunyai akses upload berita dan foto yang akan di verifikasi ADMIN))
--Halaman verifikasi
    Halaman untuk admin verifikasi berita dan galery

Fitur
--Login
--Daftar Akun (ADMIN/TIM Kesiswaan dll(Jika tim hanya mempunyai akses upload berita dan foto yang akan di verifikasi ADMIN))
--Upload Foto/Video Galeri
--Upload Berita
--Upload Direktori Guru dan Tendik

Role
--Admin mempunyai akses untuk crud semua data
--Tim hanya akses upload berita dan galery yg akan di verifikasi oleh admin

Database
--Nama Database : db_sdn1mulyoagung
--Koneksi   : koneksi.php
--API       : php native