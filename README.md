# SD Negeri 1 Mulyoagung — Website Resmi

Portal resmi SD Negeri 1 Mulyoagung, Kabupaten Malang. Website informasi sekolah: profil, PPDB Online, berita, galeri, direktori guru & tendik, modul pembelajaran, inovasi, dan kontak — dilengkapi CMS (Content Management System) untuk pengelolaan konten.

## Teknologi

| Bagian   | Stack                                                                 |
| -------- | --------------------------------------------------------------------- |
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS 4                         |
| Backend  | PHP + MySQL (PDO), dijalankan via XAMPP Apache                         |
| Database | `db_sdn1mulyoagung` (MySQL)                                            |

## Struktur

```
├─ src/            # Frontend React
│  ├─ components/  # Komponen halaman public (Hero, Berita, Galeri, dll.)
│  ├─ hooks/       # Data fetching untuk halaman public
│  ├─ CMS/         # Panel admin (guard: localStorage['cms_user'])
│  ├─ config/api.ts# Resolusi base URL API + getImageUrl()
│  └─ assets/      # Aset statis (gambar, logo)
├─ backend/        # Backend PHP
│  ├─ API/         # Endpoint REST (newsAPI.php, galeri.php, guru.php, dll.)
│  ├─ config/      # Koneksi DB (koneksi.php)
│  ├─ uploads/     # File foto ter upload (selalu WebP)
│  └─ db_sdn1mulyoagung.sql  # Dump DB (hapus dari server setelah import)
└─ index.html      # Entry point Vite
```

## Menjalankan Lokal

**Prasyarat:** Node.js, XAMPP (Apache + MySQL aktif).

1. **Database** — Import `backend/db_sdn1mulyoagung.sql` ke MySQL DB `db_sdn1mulyoagung` (mis. via phpMyAdmin).
2. **Environment** — Atur env vars `DB_HOST` / `DB_USER` / `DB_PASS` / `DB_NAME` (default: `localhost` / `root` / password kosong).
3. **Install & jalankan:**

   ```bash
   npm install
   npm run dev      # Vite dev server di port 3000
   ```

   - `.env.local`: atur `VITE_API_BASE_URL` untuk menimpa base URL API (opsional). Komentari jika ingin memakai default.
   - `localhost:3000` / `localhost:5173` → API di `http://localhost/sd-negeri-mulyoagung-1`.
   - Host `*.sch.id` → otomatis memakai `window.origin`.

## Perintah

```bash
npm run dev       # Dev server (membutuhkan XAMPP Apache + MySQL)
npm run build     # Build production → dist/ (gitignored)
npm run lint      # Typecheck (tsc --noEmit)
```

## Arsitektur API

- **Baca** — `GET` (CMS/admin menambah `?status=all` untuk baris unverified).
- **Tulis** — `POST` dengan `multipart/form-data` + field `action` (`create` / `update` / `delete` / `verify`).
- **Pengecualian** — `auth.php` dan `users.php` membaca JSON dari `php://input`.

## Penanganan Foto Upload

Semua upload foto di CMS **otomatis dikonversi ke WebP** dan di-resize ke maks `FOTO_MAX_DIM` (1920px sisi terpanjang), lalu file aslinya dihapus (lihat `backend/API/foto_helper.php` → `foto_convert_to_webp()`). Format yang didukung: PNG, JPG, JPEG, GIF, BMP, WBMP, WebP.

Model foto dua kolom: `foto` (asli) + `foto_crop` (hasil crop). API GET mengembalikan crop jika ada, jika tidak kembalikan asli. Catatan: `modul_pembelajaran` dan `inovasi` memakai `foto_cover` / `foto_cover_crop`.

## Kontrol Akses

- **ADMIN** — CRUD penuh semua entitas.
- **TIM** — Hanya boleh upload/edit berita & galeri, membutuhkan verifikasi admin.
- **Verifikasi** — `Pending` / `Verified` / `Rejected`; endpoint public hanya mengembalikan `Verified`; edit oleh TIM mereset status ke `Pending`.

## Keamanan API

- **CORS** — Dibatasi ke origin yang dikenal di `backend/config/koneksi.php` (`localhost` default).
- **Sec-Fetch-Mode** — Memblokir navigasi langsung dari browser.
- **IP restriction** — `backend/API/.htaccess` dibatasi ke localhost/192.168.x.x/10.x.x.x (perbarui untuk produksi).

## Catatan

- `.sql` dalam nilai `.gitignore` — pastikan dump DB tidak ikut naik ke server.
- `dist/` (hasil build) di-ignore git.
- Pengembangan memakai branch fitur (mis. `devhafiz`, `devp`) → PR ke `dev` → `main`.

## Lisensi

Penggunaan internal sekolah.
