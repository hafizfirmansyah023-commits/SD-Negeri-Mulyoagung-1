Perbaikan Tampilan Bagian Urutan – Menu Akademik

Perbaiki tampilan dan layout pada Menu Akademik → bagian Urutan agar benar-benar responsive dan nyaman digunakan pada semua ukuran layar, baik desktop, tablet, maupun HP.

1. Responsif Desktop

Pada ukuran desktop:

Tampilkan seluruh kategori dan item dengan layout yang rapi.
Area drag & drop memiliki ukuran yang proporsional.
Jangan sampai teks, tombol, ikon, atau item terpotong.
Hindari horizontal overflow atau munculnya scrollbar horizontal yang tidak diperlukan.
Gunakan spacing dan ukuran elemen yang konsisten.
Jika terdapat beberapa kolom, pastikan setiap kolom memiliki lebar yang fleksibel dan tidak menyebabkan layout keluar dari container.
Pastikan tampilan tetap baik pada browser dengan zoom 80%, 90%, 100%, hingga 125%.
2. Responsif Tablet

Pada ukuran tablet:

Sesuaikan lebar kategori dan item secara otomatis.
Gunakan layout yang dapat menyesuaikan ukuran layar.
Jika dua kolom tidak lagi cukup, ubah menjadi satu kolom secara otomatis.
Pastikan area drag & drop tetap mudah digunakan.
Jangan sampai tombol aksi, nama kategori, maupun item keluar dari card/container.
3. Responsif HP

Pada ukuran mobile/HP:

Gunakan single-column layout.
Setiap kategori ditampilkan dalam card/container yang memenuhi lebar layar secara proporsional.
Item tidak boleh terpotong atau keluar dari container.
Nama item yang panjang harus menggunakan wrapping, bukan memaksa layout melebar.
Tombol dan ikon tetap terlihat dan mudah ditekan.
Jangan menggunakan fixed width yang menyebabkan horizontal scrolling.
Pastikan padding dan margin disesuaikan untuk layar kecil.
Area drag & drop dibuat cukup besar agar nyaman digunakan pada layar sentuh.

Drag & Drop Tetap Berfungsi

Responsivitas tidak boleh menghilangkan fungsi drag & drop.

Pastikan:

Item dapat dipindahkan ke atas/bawah.
Item dapat dipindahkan antar kategori.
Item dapat dipindahkan ke Item Mandiri.
Item Mandiri dapat dipindahkan kembali ke kategori.
Tampilkan placeholder/indikator posisi ketika item sedang dipindahkan.
Pada perangkat touchscreen, drag & drop tetap nyaman digunakan.
Jangan sampai elemen drag handle terlalu kecil untuk disentuh.

Handling Teks Panjang

Jika nama kategori atau item panjang:

Teks harus otomatis turun ke baris berikutnya.
Jangan membuat container melebar.
Jangan memotong teks secara tidak sengaja.
Tombol aksi tetap berada pada area yang terlihat.
Gunakan truncate hanya jika memang diperlukan dan berikan tooltip untuk melihat teks lengkap.

Zoom Browser

Pastikan tampilan Menu Akademik tetap stabil pada:

Zoom 80%
Zoom 90%
Zoom 100%
Zoom 110%
Zoom 125%
Zoom 150%

Pada zoom 100%, seluruh bagian Urutan harus terlihat normal dan tidak terpotong.

Jangan Mengubah Fungsionalitas yang Sudah Ada

Jangan menghapus fitur yang sudah berjalan.

Pertahankan:

CRUD kategori,
CRUD item,
Item Mandiri,
Drag & Drop,
pemindahan antar kategori,
perubahan urutan,
penyimpanan urutan ke database,
status aktif/nonaktif,
serta fitur Menu Akademik lainnya.

Fokus utama perubahan adalah memperbaiki layout, responsivitas, spacing, wrapping, dan usability bagian Urutan.