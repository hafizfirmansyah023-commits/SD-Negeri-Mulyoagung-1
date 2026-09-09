Tambahkan menu baru bernama **“Panduan”** pada halaman **Akun Guru** di website/CMS SD Negeri 1 Mulyoagung.

### 1. Menu Panduan pada Akun Guru

Tambahkan menu **Panduan** yang dapat diakses oleh akun dengan role **Guru**.

Menu ini berfungsi sebagai pusat informasi mengenai panduan dan tata cara pengumpulan dokumen pembelajaran/administrasi guru.

Tampilan harus:

* Konsisten dengan desain halaman akun Guru yang sudah ada.
* Responsif pada desktop, tablet, dan HP.
* Menggunakan card/list yang rapi dan mudah dipahami.
* Gunakan icon yang relevan untuk setiap jenis dokumen.
* Berikan hover effect dan animasi ringan tanpa berlebihan.
* Gunakan warna dan komponen UI yang sudah digunakan pada website agar tetap konsisten.

### 2. Daftar Panduan Pengumpulan

Di dalam menu Panduan, tampilkan daftar kategori berikut:

1. **MODUL AJAR & LKPD**
2. **PANDUAN KURIKULUM**
3. **ANALISIS HARI EFEKTIF**
4. **BEDAH CP**
5. **PROGRAM TAHUNAN**
6. **PROGRAM SEMESTER**
7. **MPLS & ASESMEN**

Setiap item dibuat dalam bentuk card/menu yang dapat diklik.

Contoh tampilan:

**📚 MODUL AJAR & LKPD**
Panduan pengumpulan Modul Ajar dan LKPD.

**📖 PANDUAN KURIKULUM**
Panduan pengumpulan dokumen Panduan Kurikulum.

Dan seterusnya untuk seluruh kategori.

### 3. Detail Panduan

Ketika Guru memilih salah satu kategori, tampilkan halaman/modal detail yang berisi:

* Nama dokumen
* Penjelasan singkat mengenai dokumen yang harus dikumpulkan
* Ketentuan file
* Format file yang diperbolehkan
* Contoh penamaan file
* Informasi tambahan jika diperlukan
* Tombol **“Kirim Pengumpulan via WhatsApp”**

Contoh:

**MODUL AJAR & LKPD**

“Silakan kumpulkan Modul Ajar dan LKPD sesuai dengan ketentuan yang telah ditetapkan. Pastikan dokumen sudah diperiksa sebelum dikirim.”

**Format nama file:**
`NamaGuru_ModulAjar_Kelas_MataPelajaran`

Kemudian tampilkan tombol:

**[ 💬 KIRIM PENGUMPULAN VIA WHATSAPP ]**

### 4. Integrasi WhatsApp

Ketika tombol **“Kirim Pengumpulan via WhatsApp”** diklik, sistem otomatis membuka WhatsApp menuju nomor admin/penerima yang telah ditentukan.

Gunakan format pesan WhatsApp otomatis sesuai kategori yang dipilih.

Contoh untuk **MODUL AJAR & LKPD**:

“Assalamu’alaikum, saya ingin mengumpulkan dokumen.

Nama Guru: [Nama Guru]
Kategori: MODUL AJAR & LKPD
Kelas: [Kelas]
Mata Pelajaran: [Mata Pelajaran]
Nama File: [Nama File]

Dokumen akan saya kirimkan melalui WhatsApp ini.

Terima kasih.”

### 5. Form Sebelum Mengirim WhatsApp

Sebelum diarahkan ke WhatsApp, tampilkan form sederhana agar data yang dikirim lebih terstruktur.

Field yang dapat diisi:

* Nama Guru → otomatis mengambil nama akun yang sedang login
* Kategori → otomatis berdasarkan panduan yang dipilih
* Kelas
* Mata Pelajaran
* Nama File/Dokumen
* Keterangan tambahan (opsional)

Setelah Guru menekan tombol **“Kirim ke WhatsApp”**, sistem membuat pesan WhatsApp secara otomatis menggunakan data tersebut.

### 6. Format Pesan Berdasarkan Kategori

Buat format pesan otomatis yang menyesuaikan kategori:

**MODUL AJAR & LKPD**

* Nama Guru
* Kelas
* Mata Pelajaran
* Nama Dokumen
* Keterangan

**PANDUAN KURIKULUM**

* Nama Guru
* Dokumen
* Keterangan

**ANALISIS HARI EFEKTIF**

* Nama Guru
* Tahun Pelajaran
* Kelas
* Nama Dokumen

**BEDAH CP**

* Nama Guru
* Mata Pelajaran
* Fase/Kelas
* Nama Dokumen

**PROGRAM TAHUNAN**

* Nama Guru
* Tahun Pelajaran
* Kelas
* Mata Pelajaran
* Nama Dokumen

**PROGRAM SEMESTER**

* Nama Guru
* Tahun Pelajaran
* Semester
* Kelas
* Mata Pelajaran
* Nama Dokumen

**MPLS & ASESMEN**

* Nama Guru
* Jenis Dokumen
* Kelas/Fase
* Nama Dokumen
* Keterangan

### 7. Link WhatsApp

Gunakan format WhatsApp Click-to-Chat dengan nomor admin yang dapat dikonfigurasi dari sistem.

Jangan hardcode nomor WhatsApp langsung di banyak komponen. Buat satu konfigurasi/constant agar nomor admin dapat diubah dengan mudah.

Pesan harus menggunakan URL encoding agar:

* Spasi tidak rusak
* Baris baru tetap terbaca
* Karakter khusus tidak menyebabkan error

### 8. UX dan Responsiveness

Pastikan menu Panduan:

* Nyaman digunakan di HP.
* Card tidak terpotong.
* Tombol WhatsApp mudah ditekan pada layar kecil.
* Modal/form tidak keluar dari layar.
* Tidak menyebabkan horizontal scrolling.
* Tetap rapi pada zoom browser 100%.
* 
### 9. Hak Akses

Menu **Panduan** hanya perlu ditampilkan pada akun Guru jika memang fitur ini khusus untuk pengumpulan administrasi Guru.

Jangan mengubah hak akses atau fitur menu Admin/CMS yang sudah berjalan.

### 10. Prinsip Implementasi

Pertahankan seluruh fitur yang sudah ada.

Jangan mengubah struktur halaman atau komponen lain yang tidak berkaitan dengan fitur Panduan.

Gunakan komponen, warna, typography, spacing, button, card, icon, dan sistem responsive yang sudah digunakan pada website agar fitur baru terasa sebagai bagian dari sistem yang sama.

Pastikan tidak ada error pada navigasi, routing, form, dan integrasi WhatsApp.

Tambahkan di Role admin pada bagian Kontak Resmi untuk whastaap admin agar bisa di ubah nomornya. pastikan terintegrasi untuk link whatsapp di panduan di role guru