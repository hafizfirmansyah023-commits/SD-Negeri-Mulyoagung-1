### Prompt: Pagination Galeri, Akademik, Berita, dan CMS

Tambahkan fitur **pagination** pada halaman **Galeri, Akademik, Berita**, serta seluruh halaman terkait di **CMS Admin**.

Ketentuan yang harus diterapkan:

1. **Batas Data per Halaman**

   * Tampilkan maksimal **6 card/data** pada setiap halaman.
   * Data ke-7 dan seterusnya otomatis masuk ke halaman berikutnya.
   * Jangan menampilkan seluruh data sekaligus.

2. **Pagination Frontend**

   * Terapkan pagination pada:

     * Halaman Galeri
     * Halaman Akademik
     * Halaman Berita
   * Setiap halaman hanya menampilkan **6 card**.
   * Sediakan navigasi:

     * `‹ Sebelumnya`
     * Nomor halaman `1, 2, 3, ...`
     * `Berikutnya ›`
   * Tombol `Sebelumnya` dinonaktifkan pada halaman pertama.
   * Tombol `Berikutnya` dinonaktifkan pada halaman terakhir.
   * Nomor halaman harus menyesuaikan jumlah data secara otomatis.

3. **Pagination CMS Admin**
   Terapkan pagination juga pada halaman pengelolaan:

   * Data Berita
   * Data Galeri
   * Data Akademik
   * Jika terdapat tabel/card data lainnya dengan jumlah record banyak, gunakan pola pagination yang sama.

   Setiap halaman CMS menampilkan maksimal **6 data** sebelum berpindah ke halaman berikutnya.

4. **Perilaku Pagination**

   * Pagination harus mengambil data sesuai halaman yang sedang dibuka.
   * Jangan hanya menyembunyikan card menggunakan CSS; gunakan pagination pada proses pengambilan/rendering data.
   * Saat berpindah halaman, data harus diperbarui tanpa mengganggu layout.
   * Pertahankan filter, pencarian, kategori, dan status yang sedang digunakan.
   * Jika filter atau pencarian berubah, pagination otomatis kembali ke **halaman 1**.
   * Jika data dihapus sehingga halaman aktif tidak lagi memiliki data, arahkan otomatis ke halaman terakhir yang masih tersedia.

5. **Tampilan Responsif**

   * Pagination harus tampil rapi pada desktop, tablet, dan HP.
   * Pada layar HP, nomor halaman dapat dibuat lebih ringkas agar tidak memenuhi layar.
   * Card tetap menggunakan layout yang sudah ada dan tidak mengubah desain utama website.

6. **Konsistensi**

   * Gunakan desain pagination yang sama pada Galeri, Akademik, Berita, dan CMS.
   * Jangan mengubah struktur card, warna utama, font, spacing, atau komponen lain yang sudah ada kecuali diperlukan untuk mendukung pagination.
   * Pastikan pagination mengikuti tema visual website.

7. **Validasi**

   * Pastikan 1–6 data muncul di halaman pertama.
   * Data ke-7 masuk halaman kedua.
   * Data ke-13 masuk halaman ketiga, dan seterusnya.
   * Pastikan tidak ada data yang terduplikasi atau terlewat saat berpindah halaman.
   * Pastikan pagination tetap berjalan setelah melakukan pencarian, filter, tambah data, edit data, dan hapus data.

**Target akhir:**
Galeri, Akademik, Berita, dan CMS tidak lagi menampilkan seluruh data sekaligus. Setiap halaman hanya menampilkan **6 card/data**, kemudian data berikutnya ditampilkan pada halaman selanjutnya melalui pagination yang konsisten dan responsif.
