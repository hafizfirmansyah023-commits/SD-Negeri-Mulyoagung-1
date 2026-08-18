Tambahkan fitur **Manajemen Password** pada bagian **CMS User** dengan ketentuan sebagai berikut:

* **Password Admin saja** hanya dapat dilihat oleh **Admin**. Anggota **Tim** tidak dapat melihat password mereka secara langsung melalui sistem.
* Untuk melakukan **reset password**, anggota **Tim** harus menemui Admin secara langsung dan meminta Admin untuk melakukan reset password.
* Admin dapat melakukan reset password melalui sistem. Setelah proses reset dijalankan, sistem akan **secara otomatis menghasilkan password acak baru**.
* Password acak yang dihasilkan akan **ditampilkan kepada Admin** setelah proses reset berhasil, sehingga Admin dapat memberikan password baru tersebut kepada anggota Tim.
* Pada halaman **Pengaturan Akun**, tambahkan aksi baru berupa **"Reset Password"** atau **"Reset Akun"** yang dapat digunakan Admin untuk melakukan proses reset.
* Tambahkan **tombol Reset Password** pada halaman tersebut dan berikan konfirmasi sebelum proses reset dijalankan untuk mencegah kesalahan.
* Setelah reset berhasil, tampilkan **password baru yang dihasilkan sistem hanya kepada Admin**.
