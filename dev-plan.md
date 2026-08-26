
## 1. Pagination Berita & Galeri

Tambahkan pagination pada halaman Utama Berita dan Galeri agar data tidak ditampilkan sekaligus.

Fitur:
- 10 atau 12 data per halaman.
- Navigasi: Sebelumnya | 1 | 2 | 3 | Berikutnya.
- Informasi jumlah data, misalnya: Menampilkan 1–10 dari 47 data.
- Pagination tetap bekerja setelah pencarian, filter (status, kategori, tanggal), dan perubahan status.
- Tambahkan pencarian.
- Tambahkan filter kategori.
- Tambahkan filter status.
- Tambahkan pengurutan berdasarkan terbaru/terlama.

## 2. Pemisahan Status Berita & Galeri

Gunakan navigasi/tab berdasarkan status pada CMS.

### Berita
- Diterbitkan
- Ditolak

### Galeri
- Diterbitkan
- Ditolak

### Status Ditolak

Konten yang ditolak harus menampilkan:
- Judul berita/foto.
- Pengunggah.
- Tanggal pengajuan.
- Status Ditolak.
- Tombol Edit & Ajukan Ulang.
- Tombol Hapus.

## 3. Modul Pembelajaran

Buat modul pembelajaran pada CMS dan halaman publik website.

### Form Tambah Materi Pembelajaran

Field:
- Judul materi.
- Deskripsi.
- Mata pelajaran.
- Kelas.
- Semester.
- Tahun ajaran.
- Kategori materi.
- File PDF atau link Google Drive.
- Thumbnail/cover PDF.
- Status: Draft atau Published.

### Sumber Materi

Gunakan logika OR antara:
1. Upload file PDF langsung.
2. Link Google Drive PDF.

Sebaiknya kedua sumber tidak dapat digunakan bersamaan.

Pilihan:
- Upload PDF
- Google Drive

Jika Upload PDF dipilih, file PDF wajib diisi dan link Google Drive tidak digunakan.

Jika Google Drive dipilih, link wajib diisi dan file PDF tidak digunakan.

Jika keduanya kosong, tampilkan validasi.

### Logika Sumber PDF

```text
Jika sumber = upload:
    gunakan file PDF yang diunggah

Jika sumber = Google Drive:
    gunakan link Google Drive

Jika tidak ada sumber:
    tampilkan validasi

FILTERING BERDASARKAN KATEGORI, KELAS, SEMESTER, TAHUN AJARAN, MATA PELAJARAN

TAMBAHKAN ROLE GURU YANG MEMPUNYAI AKSES UPLOAD MODUL PEMBELAJARAN YANG AKAN DI VERIFIKASI OLEH ADMIN SEPERTI BERITA DAN GALERI

### Search di halaman utama (global search)
Berita, Galeri, Modul pembelajaran, Nama Guru