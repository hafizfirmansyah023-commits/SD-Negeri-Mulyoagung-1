Perbarui Fitur Menu Akademik – Drag & Drop

Perbarui bagian Menu Akademik pada CMS agar pengelolaan item menjadi lebih fleksibel menggunakan fitur Drag & Drop.

1. Drag & Drop Item Mandiri

Tambahkan kemampuan untuk mengatur urutan Item Mandiri dengan cara drag & drop.

Setiap item mandiri dapat digeser ke atas atau ke bawah.
Perubahan posisi harus langsung memperbarui urutan item.
Urutan yang sudah diatur harus tersimpan ke database.
Setelah halaman di-refresh, urutan tetap sesuai dengan hasil drag & drop.
Tampilkan indikator visual saat item sedang dipindahkan agar pengguna mengetahui posisi tujuan.
2. Drag & Drop Antar Kategori

Buat sistem drag & drop yang memungkinkan item dipindahkan lintas kategori.

Contoh:

Item dari kategori Modul Pembelajaran dapat dipindahkan ke Item Mandiri.
Item dari Item Mandiri dapat dipindahkan kembali ke kategori tertentu.
Item dari Kategori A dapat dipindahkan ke Kategori B.
Item tetap mempertahankan seluruh data dan hanya mengubah kategori/posisinya.

Saat item dilepas pada kategori tujuan:

Update kategori item.
Update posisi/urutan item.
Simpan perubahan ke database.
Perbarui tampilan tanpa perlu reload halaman jika memungkinkan.
3. Struktur Menu

Pastikan struktur Menu Akademik tetap mudah dipahami, misalnya:

Menu Akademik

Kategori A
Item 1
Item 2
Item 3
Kategori B
Item 4
Item 5
Item Mandiri
Item 6
Item 7

Item dapat dipindahkan secara bebas:
Kategori A → Kategori B → Item Mandiri → Kategori A

4. Visual Drag & Drop

Gunakan UX yang jelas dan modern:

Cursor berubah ketika item dapat digeser.
Item yang sedang di-drag memiliki efek visual.
Tampilkan garis/placeholder pada posisi yang akan ditempati.
Kategori tujuan mendapatkan highlight ketika item diarahkan ke area tersebut.
Hindari layout bergeser atau rusak ketika proses drag & drop.
Pastikan tetap responsif pada desktop dan mobile.

Validasi

Sebelum menyimpan perubahan, pastikan item memiliki kategori/tujuan yang valid.

Jika proses penyimpanan gagal:

tampilkan notifikasi error,
kembalikan item ke posisi sebelumnya,
jangan menghapus data item.

Jika berhasil:

tampilkan notifikasi seperti "Urutan menu berhasil diperbarui" atau "Item berhasil dipindahkan".
7. Pertahankan Fitur yang Sudah Ada

Jangan menghilangkan atau merusak fitur Menu Akademik yang sudah berjalan seperti:

tambah kategori,
edit kategori,
hapus kategori,
tambah item,
edit item,
hapus item,
pencarian,
status aktif/nonaktif,
dan fitur lainnya yang sudah tersedia.

Fokus perubahan hanya pada penambahan sistem Drag & Drop dan pengelolaan urutan/kategori item.