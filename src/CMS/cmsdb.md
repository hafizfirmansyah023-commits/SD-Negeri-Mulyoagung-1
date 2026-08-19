tambahkan **Dashboard Admin CMS** agar informasi yang ditampilkan lebih lengkap, informatif, dan sesuai dengan hak akses masing-masing role. Jangan mengubah fungsi yang sudah berjalan. Fokus pada penambahan data, integrasi dengan API/database yang sudah tersedia, serta penyusunan layout dashboard agar lebih rapi dan mudah dipahami.

### 1. Kartu Statistik Utama

Buat **4–6 kartu statistik** pada baris paling atas dashboard yang menampilkan:

* **Total Guru & Tendik Aktif** — ambil data dari `guru.php` dan hanya hitung data dengan `status = Aktif`.
* **Total Berita** — tampilkan jumlah berita dengan perbandingan/status **Published** dan **Draft**.
* **Total Foto Galeri** — tampilkan jumlah seluruh foto galeri.
* **Pengumuman Aktif** — ambil dari `pengumuman.php` dengan kondisi `is_active = 1`.
* **Total User CMS** — hitung seluruh user dengan role `ADMIN` dan `TIM`.

Gunakan desain card yang modern, responsif, dan konsisten dengan tampilan CMS yang sudah ada.

### 2. Panel "Perlu Ditindaklanjuti"

Buat panel khusus **"Perlu Ditindaklanjuti"** karena bagian ini menjadi informasi penting bagi admin.

Tampilkan:

* **Jumlah Berita Pending Verifikasi**

  * Ambil data dari `newsAPI.php?status=all`.
  * Filter data dengan status `Pending`.
* **Jumlah Galeri Pending Verifikasi**

  * Ambil data dari `galeri.php?status=all`.
  * Filter data dengan status `Pending`.
* Tambahkan tombol **"Lihat Verifikasi"** yang ketika diklik langsung mengarahkan admin ke halaman/tab verifikasi terkait.

Jika jumlah pending lebih dari 0, gunakan indikator visual/badge agar admin dapat langsung mengetahui bahwa terdapat konten yang perlu diperiksa.

### 3. Aktivitas Terbaru

Buat bagian **"Aktivitas Terbaru"** yang menampilkan:

**5 berita terakhir yang diupload**, dengan informasi:

* Judul berita
* Tanggal upload
* Status
* Nama uploader

**5 foto galeri terakhir yang diupload**, dengan informasi:

* Thumbnail foto
* Judul/keterangan
* Tanggal upload
* Status
* Nama uploader

Urutkan data dari aktivitas terbaru ke aktivitas yang lebih lama.

### 4. Ringkasan Pengaturan Homepage

Bagian ini **hanya ditampilkan untuk role ADMIN**.

Tampilkan ringkasan konfigurasi homepage yang sedang aktif:

* **Jumlah Slide Hero Carousel Aktif**

  * Ambil data dari `hero_carousel.php`.
* **Tahun Ajaran Aktif**

  * Ambil data dari `pengaturan.php`.
* **Status/Link PPDB**

  * Tampilkan informasi apakah link PPDB sudah tersedia/aktif.
* **Statistik Sekolah yang tampil di Homepage**

  * Ambil data dari `statistik.php`, meliputi:

    * Jumlah Siswa
    * Jumlah Alumni
    * Akreditasi

Berikan shortcut agar ADMIN dapat langsung menuju halaman pengaturan terkait.

### 5. Manajemen User

Bagian ini **hanya ditampilkan untuk role ADMIN**.

Tampilkan:

* Jumlah user dengan role **ADMIN**.
* Jumlah user dengan role **TIM**.
* Tombol shortcut **"Tambah User"** yang mengarah langsung ke halaman/form tambah user.

### 6. Dashboard Berdasarkan Role

Dashboard harus menggunakan **role-based access** sehingga informasi dan fitur yang tampil berbeda sesuai dengan hak akses pengguna.

**ADMIN**

* Dapat melihat seluruh panel dashboard:

  * Statistik utama
  * Perlu Ditindaklanjuti
  * Aktivitas Terbaru
  * Pengaturan Homepage
  * Manajemen User
* Dapat melihat data seluruh pengguna dan seluruh aktivitas CMS sesuai hak akses ADMIN.

**TIM**

* Dashboard dibuat lebih sederhana.
* Hanya tampilkan ringkasan aktivitas yang berkaitan dengan akun TIM tersebut:

  * Jumlah berita yang diupload sendiri.
  * Jumlah galeri yang diupload sendiri.
  * Status berita/galeri miliknya yang masih **Pending**.
  * Aktivitas upload terbaru miliknya.
* Jangan tampilkan panel **Pengaturan Homepage** dan **Manajemen User**.
* Jangan tampilkan data atau statistik internal yang hanya boleh diakses oleh ADMIN.

### Ketentuan Teknis

* Gunakan data **real-time dari API/database yang sudah tersedia**, bukan data dummy atau angka statis.
* Sesuaikan dengan struktur API dan database yang sudah digunakan pada project.
* Jangan mengubah endpoint atau fungsi existing jika tidak diperlukan.
* Pastikan setiap request API memiliki **loading state**, **error handling**, dan kondisi ketika data kosong.
* Pastikan dashboard tetap berjalan meskipun salah satu endpoint API gagal dimuat.
* Terapkan **responsive design** untuk desktop, tablet, dan mobile.
* Pertahankan style, warna, typography, sidebar, navbar, dan komponen CMS yang sudah ada.
* Gunakan komponen yang reusable agar kode dashboard tetap rapi dan mudah dikembangkan.
* Pastikan pengecekan role dilakukan dengan benar sehingga **TIM tidak dapat mengakses data/panel ADMIN hanya dengan memanipulasi tampilan frontend**.
* Jangan menghapus fitur yang sudah ada.
* Setelah selesai, berikan **kode lengkap file yang diubah** dan jelaskan bagian mana saja yang diperbaiki.
