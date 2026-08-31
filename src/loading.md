Revisi loading screen sesuai ketentuan di bawah, diterapkan pada website. Loading screen lama dihapus.

> **Catatan integrasi (sesuaikan dengan struktur project):**
> Project sudah memiliki komponen loading di `src/components/LoadingScreen.tsx` yang dihubungkan melalui
> `src/context/LoadingContext.tsx`. Karena aturan project adalah *"gunakan file yang sudah ada, jangan buat
> struktur baru jika fungsi yang sama sudah tersedia"*, maka **jangan membuat file baru**
> (`src/components/LoadingScreen.tsx`), 
> agar sesuai ketentuan di bawah. Nama komponen `LoadingScreen` dipertahankan. Props lama
> `(isLoading, isSlowNetwork, message)` dipertahankan agar integrasi dengan `LoadingContext` tidak rusak,
> meskipun kebutuhan tampilan utama hanya memakai `isLoading`.

---

## 1. Konsep Utama

Perbarui komponen `src/components/LoadingScreen.tsx`.

Preloader tampil full-screen ketika website pertama kali dibuka (initial page load), bukan pada setiap navigasi antar halaman.

Tampilkan logo resmi SD Negeri 1 Mulyoagung tepat di tengah layar.

**PENTING:**
- Jangan mengubah logo.
- Jangan memotong logo.
- Jangan mengubah proporsi logo.
- Jangan memberikan efek filter yang mengubah warna atau membuat logo sulit dibaca.
- Gunakan file logo yang sudah tersedia: `src/assets/logo.png` (path yang sama dipakai `HeaderLogo.tsx`, `BrandInfo.tsx`, `PpdbModal.tsx`, dan `LoadingScreen.tsx`). Jangan membuat file logo baru.

## 2. Tampilan

Buat tampilan loading screen dengan konsep clean, modern, hijau, transparan, dan elegan, terinspirasi dari nuansa website institusi pendidikan modern.

Gunakan layout:

fixed
inset-0
z-[9999]
flex
items-center
justify-center

### Background

Gunakan warna hijau clean dan transparan, **bukan hijau solid pekat**.

Kombinasi:
- Base background: `#2F6B3C`
- Overlay transparan dengan efek `rgba(...)`
- Glassmorphism yang sangat halus
- Transparansi agar background terasa ringan dan modern
- Backdrop-blur tipis untuk kesan elegan

Konsep warna: hijau natural → transparan → clean → soft

**Hindari:**
- Background hijau gelap penuh (mis. `#092e2b/90` pada komponen lama)
- Gradient mencolok
- Efek neon
- Ornamen ramai
- Background dengan banyak bentuk dekoratif

### Area Logo

Letakkan logo sekolah tepat di tengah layar.

Buat area logo menggunakan container transparan dengan glassmorphism sangat subtle:
- Background putih transparan ± 10–15% (`bg-white/10`–`bg-white/15`)
- Border putih transparan ± 15–20% (`border-white/15`–`border-white/20`)
- Border radius lembut
- Shadow sangat ringan
- Kotak logo tidak terlalu besar

Logo harus:
- Tetap logo asli SD Negeri 1 Mulyoagung
- Tidak diubah bentuk, tidak dipotong
- `object-contain` agar tidak terpotong
- Ukuran responsif (lihat bagian 8)

### Teks

Di bawah logo tampilkan:

SD Negeri 1 Mulyoagung

Gunakan warna putih atau putih transparan dengan typography yang clean dan profesional.

Di bawah nama sekolah tampilkan:

Mewujudkan Generasi Cerdas, Berkarakter, dan Berprestasi

Gunakan ukuran font lebih kecil dengan warna putih yang sedikit transparan, misalnya opacity 80–90%.

Jarak antara logo, nama sekolah, dan tagline harus proporsional dan tidak terlalu rapat.

### Kesan Visual

Keseluruhan loading screen harus memberikan kesan:

Clean + Green + Transparent + Modern + Professional

Jangan membuat tampilan seperti halaman login atau dashboard. Loading screen harus terasa ringan dan hanya menjadi pembuka sebelum pengguna masuk ke halaman utama website.

Gunakan whitespace yang cukup sehingga logo menjadi fokus utama.

### Responsive

Pada mobile, tablet, dan desktop:

Logo tetap berada di tengah.
Nama sekolah tetap terbaca.
Tagline tidak keluar dari layar.
Ukuran teks menyesuaikan layar.
Tidak ada horizontal scrolling.
Glassmorphism tetap terlihat ringan pada layar kecil.

Pastikan hasil akhirnya minimalis, premium, natural, hijau transparan menyatu dengan identitas visual SD Negeri 1 Mulyoagung.

## 3. Animasi Logo

Gunakan CSS/Tailwind smooth (bukan library animasi).

Urutan:
1. Preloader muncul dengan opacity 0
2. Background fade-in
3. Logo muncul perlahan opacity 0 → 1
4. Logo scale ringan 0.95 → 1
5. Logo tetap di tengah selama loading
6. Pulse sangat lembut pada logo
7. **Jangan** rotasi/spin pada logo
8. Setelah halaman selesai dimuat, hentikan animasi
9. Preloader fade-out
10. Setelah fade-out selesai, preloader disembunyikan sehingga homepage normal

> Penggunaan `prefers-reduced-motion`: jika aktif, sederhanakan/lepaskan animasi berlebihan (lihat bagian 9).
> Keyframes tambahan dapat didefinisikan di `src/index.css` (Tailwind 4 bersifat CSS-first, tanpa `tailwind.config.js`).

Animasi premium dan elegan, bukan loading spinner aplikasi biasa.

## 4. Loading Indicator

Di bawah tagline, indikator minimalis, salah satu:
- **Utama:** progress line horizontal tipis, berjalan perlahan kiri ke kanan. (Di project sudah ada keyframe `loadingBarSweep` / class `animate-loading-bar` di `src/index.css` — gunakan itu.)
- Alternatif: tiga titik kecil dengan animasi `• • •`

Jangan spinner besar.

## 5. Durasi

Kombinasi:
- Minimum tampil ± 800–1200ms
- Fade-in ± 400–500ms
- Fade-out ± 500–700ms

- Jika website selesai cepat, tetap tampil minimal ± 1 detik agar tidak berkedip.
- Jika butuh lebih lama, tetap tampil sampai resource utama selesai.

(*Durasi minimum saat ini diatur di `src/context/LoadingContext.tsx` — 700ms initial, 450ms navigasi. Pastikan nilai minimum aplikasi sesuai spesifikasi ini jika memang perlu.*)

## 6. Integrasi React

Integrasi lewat mekanisme yang **sudah ada**: `src/context/LoadingContext.tsx` merender `LoadingScreen` dan menyediakan state `isLoading`. Pakai event `window.addEventListener("load", ...)` atau mekanisme React yang paling tepat untuk memastikan preloader hilang setelah resource utama selesai dimuat.

Jangan lakukan:
- Reload halaman
- Mengganggu React Router
- Mengganggu API request yang berjalan
- Mengubah struktur halaman kecuali untuk memasang preloader

**Catatan `LoadingContext` saat ini menampilkan loading pada setiap navigasi route dan untuk jaringan lambat.** Spesifikasi ini menekankan preloader idealnya hanya saat initial page load. Tinjau/sesuaikan logika `LoadingContext` (mis. hanya jalur `isLoading` saat load pertama) agar tidak muncul tiap pindah halaman, tanpa memutus mekanisme slow-network yang sudah ada.

## 7. Struktur Komponen

Struktur sederhana:

```
App/LoadingContext
  └── LoadingScreen
       ├── Logo
       ├── Nama Sekolah
       ├── Tagline
       └── Loading Indicator
```

Buat komponen mudah digunakan kembali. Props (pertahankan yang sudah ada di `LoadingScreen`, minimal):

```ts
interface LoadingScreenProps {
  isLoading: boolean;
  isSlowNetwork?: boolean;
  message?: string;
}
```

## 8. Responsiveness

Pastikan tampilan sempurna pada:

Desktop
Laptop
Tablet
Smartphone

Ukuran logo harus responsif.

Contoh:

Desktop: sekitar 120–160px
Tablet: sekitar 110–140px
Mobile: sekitar 90–120px

Tetapi jangan memaksakan ukuran jika rasio logo berbeda.

Gunakan `object-contain` agar logo tidak terpotong.

## 9. Accessibility

- `aria-label`
- `role="status"` bila diperlukan
- Teks loading yang dapat dipahami screen reader
- `prefers-reduced-motion` → animasi lebih sederhana atau tanpa animasi berlebihan

## 10. Performa

- Ringan; tanpa library animasi tambahan (tanpa Framer Motion / `motion` / GSAP untuk kebutuhan ini).
- Utamakan React + TypeScript + Tailwind + CSS transition/animation.
- Jangan menambah dependency baru hanya untuk preloader.
- Pastikan tidak menyebabkan: layout shift, scroll horizontal, scrollbar tambahan, halaman tidak bisa diklik, preloader tetap menutupi homepage setelah selesai.

## 11. Transisi ke Homepage

Buat transisi seperti:

Preloader
→ logo muncul
→ logo sedikit scale
→ loading indicator berjalan
→ halaman selesai dimuat
→ preloader fade-out
→ homepage muncul secara smooth.

Transisi harus terasa seperti website institusi pendidikan yang modern dan profesional.

## 12. Hal yang Tidak Boleh Dilakukan

Jangan:

Mengubah logo sekolah.
Membuat logo berputar.
Menggunakan spinner besar.
Menggunakan animasi berlebihan.
Membuat loading lebih dari beberapa detik tanpa alasan.
Mengubah desain homepage yang sudah ada.
Mengubah navbar, hero, footer, atau section lain.
Menambahkan library baru tanpa kebutuhan.
Membuat preloader muncul setiap kali user berpindah halaman jika menggunakan React Router.

Idealnya preloader hanya muncul saat initial page load, bukan setiap navigasi antar halaman.

## 13. Hasil yang Saya Inginkan

Seperti website sekolah/institusi modern:

Logo sekolah berada di tengah → nama sekolah → tagline → progress loading tipis → kemudian semuanya menghilang dengan fade-out yang elegan dan homepage tampil.

Gunakan gaya minimalis dan profesional yang terinspirasi dari pengalaman loading website ISI Yogyakarta, tetapi jangan menyalin desain, logo, aset, atau identitas visual ISI Yogyakarta.

Sebelum mengubah kode, periksa struktur project terlebih dahulu dan gunakan komponen, path logo, warna, serta sistem routing yang sudah tersedia. Jangan membuat struktur baru jika fungsi yang sama sudah tersedia.

---

## Ringkasan keterkaitan file (project saat ini)

| Kebutuhan | File/aset yang dipakai |
|---|---|
| Komponen preloader | `src/components/LoadingScreen.tsx` (jangan buat file baru) |
| Integrasi & state | `src/context/LoadingContext.tsx` |
| Logo | `src/assets/logo.png` (path yang sama di seluruh project) |
| Keyframe progress bar | `src/index.css` → `loadingBarSweep` / `animate-loading-bar` |
| Style system | Tailwind 4 CSS-first (`@import "tailwindcss"` di `src/index.css`) |