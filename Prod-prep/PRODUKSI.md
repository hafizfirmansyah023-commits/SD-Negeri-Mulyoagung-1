# 🚀 Panduan Deployment Produksi
## SD Negeri 1 Mulyoagung — React + PHP/MySQL

> Dokumen ini berisi langkah-langkah yang **WAJIB** dilakukan sebelum website dijalankan di server publik.

---

## 1. Build Frontend React

```bash
npm run build
```

Hasilnya ada di folder `dist/`. Upload isi folder `dist/` ke **root public** server.

> [!IMPORTANT]
> Jangan upload folder `src/`, `node_modules/`, atau `vite.config.ts` ke server produksi.

---

## 2. Database MySQL

1. Buat database baru di server: `db_sdn1mulyoagung`
2. Import file SQL via phpMyAdmin:
   ```
   backend/db_sdn1mulyoagung.sql
   ```
3. Setelah berhasil diimport, **hapus file `.sql` dari server**.

---

## 3. Konfigurasi CORS — `backend/config/koneksi.php`

Buka file `backend/config/koneksi.php` dan **aktifkan domain produksi**, hapus semua localhost:

```php
// SESUDAH (produksi):
$allowedOrigins = [
    'https://sdn1mulyoagung.sch.id',
    // hapus semua entry http://localhost
];
```

> [!WARNING]
> Jangan biarkan `http://localhost` ada di `$allowedOrigins` saat produksi.

---

## 4. Konfigurasi API URL — `src/config/api.ts`

File ini sudah otomatis mendeteksi domain `*.sch.id`. Tidak perlu diubah jika domain menggunakan `sch.id`.

Alternatif — buat file `.env.production`:
```env
VITE_API_BASE_URL=https://sdn1mulyoagung.sch.id
```

---

## 5. Pembatasan IP API — `backend/API/.htaccess`

Saat ini API dibatasi ke localhost saja. Di produksi ganti menjadi:

```apache
# Ganti bagian <RequireAny>...</RequireAny> dengan:
Require all granted
```

> [!NOTE]
> Di produksi, proteksi utama adalah **CORS + Sec-Fetch-Mode** di `koneksi.php`. Pengguna umum perlu bisa load data berita, galeri, dll.

---

## 6. Variabel Database

Atur di **cPanel → Environment Variables** atau file `.env` di server:

```env
DB_HOST=localhost
DB_USER=nama_user_db
DB_PASS=password_db_yang_kuat
DB_NAME=db_sdn1mulyoagung
```

> [!CAUTION]
> File `.env` sudah ada di `.gitignore` — jangan pernah commit ke Git.

---

## 7. HTTPS / SSL

Di cPanel:
- Aktifkan **Let's Encrypt SSL** (gratis)
- Aktifkan **Force HTTPS Redirect**

Pastikan `$allowedOrigins` di `koneksi.php` menggunakan `https://`:
```php
'https://sdn1mulyoagung.sch.id'  // bukan http://
```

---

## 8. File yang Harus Dihapus / Tidak Diupload

| File/Folder | Tindakan |
|---|---|
| `backend/db_sdn1mulyoagung.sql` | **Hapus** setelah import |
| `node_modules/` | **Jangan upload** |
| `src/` | **Jangan upload** (upload `dist/` saja) |
| `.env*` | **Jangan upload** |
| `scratch_check.ps1` | **Hapus** dari server |
| `PRODUKSI.md` | Opsional dihapus setelah dibaca |

---

## 9. Root `.htaccess` untuk React Router

Karena React menggunakan client-side routing, buat `.htaccess` di **root server**:

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]
```

Ini agar route seperti `/cms`, `/berita`, `/galeri` tidak 404 saat di-refresh.

---

## 10. Checklist Akhir Sebelum Live

- [ ] `npm run build` berhasil tanpa error
- [ ] Database sudah diimport dan koneksi berhasil
- [ ] `koneksi.php` — domain produksi aktif, localhost dihapus dari daftar
- [ ] `backend/API/.htaccess` — `Require all granted` sudah dipasang
- [ ] HTTPS/SSL aktif dan Force HTTPS diaktifkan
- [ ] File `.sql`, `.env`, `node_modules/`, `src/` tidak ada di server
- [ ] Root `.htaccess` untuk React Router sudah terpasang
- [ ] Test login CMS di domain produksi
- [ ] Test upload foto (berita, galeri, fasilitas, guru)
- [ ] Test halaman publik (beranda, berita, galeri, kontak)
- [ ] Buka DevTools → Network — pastikan tidak ada request ke `localhost`

---

*Terakhir diperbarui: 2026-08-20*