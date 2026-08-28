# 📋 Checklist Deployment Produksi
## SD Negeri 1 Mulyoagung

### Persiapan (Sebelum Upload)

- [ ] 1. Build frontend: `npm run build` — hasil di `dist/`
- [ ] 2. Database baru di server: `db_sdn1mulyoagung`
- [ ] 3. Import SQL: `backend/db_sdn1mulyoagung.sql`
- [ ] 4. Backup folder `backend/uploads/` dari lokal
- [ ] 5. Cek domain: `sdn1mulyoagung.sch.id` atau custom domain

---

### Server Configuration

- [ ] 6. CORS domain: `backend/config/koneksi.php` — aktifkan `https://sdn1mulyoagung.sch.id`
- [ ] 7. CORS domain: `backend/config/koneksi.php` — hapus semua `http://localhost`
- [ ] 8. Apache modules: `mod_filter`, `mod_deflate`, `mod_expires`, `mod_headers`
- [ ] 9. PHP extension: `extension=gd` aktif
- [ ] 10. DB index: `idx_berita_status_tgl`, `idx_galeri_status_tgl`, `idx_guru_nip`
- [ ] 11. `upload_max_filesize` ≥ 10M di php.ini
- [ ] 12. HTTPS/SSL aktif (Let's Encrypt)
- [ ] 13. Force HTTPS redirect aktif

---

### File Deployment

- [ ] 14. Upload `dist/` ke **root public** server
- [ ] 15. Upload `backend/` ke server (termasuk `config/`, `API/`, `uploads/`)
- [ ] 16. Upload `.htaccess` di root server (React Router)
- [ ] 17. Upload `.htaccess` di `backend/` (security headers)
- [ ] 18. File `.env` di server dengan `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`
- [ ] 19. Hapus `backend/db_sdn1mulyoagung.sql` dari server
- [ ] 20. Hapus `src/`, `node_modules/`, `vite.config.ts` dari server

---

### API Configuration

- [ ] 21. `backend/API/.htaccess` — `Require all granted` (izin semua origin)
- [ ] 22. `src/config/api.ts` — tidak perlu diubah untuk domain `.sch.id`

---

### Testing (Post-Deployment)

- [ ] 23. Homepage: `https://sdn1mulyoagung.sch.id` — load tanpa error
- [ ] 24. Berita: `https://sdn1mulyoagung.sch.id/news` — data muncul
- [ ] 25. Galeri: `https://sdn1mulyoagung.sch.id/gallery` — data muncul
- [ ] 26. Kontak: `https://sdn1mulyoagung.sch.id/contact` — form berfungsi
- [ ] 27. Login CMS: `https://sdn1mulyoagung.sch.id/cms` — bisa login
- [ ] 28. Upload foto (PNG/JPG): berita/galeri/fasilitas/guru
- [ ] 29. Cek hasil upload — file harus berekstensi `.webp` (PNG→WebP)
- [ ] 30. DevTools → Network tab — tidak ada request ke `localhost`
- [ ] 31. DevTools → Console — tidak ada error CORS/api failure

---

### Performance Check

- [ ] 32. Lighthouse score: Performance ≥ 80, SEO ≥ 90, Accessibility ≥ 90
- [ ] 33. Image lazy loading: browser menampilkan placeholder dulu
- [ ] 34. Cache headers: GET asset → `Cache-Control: max-age=2592000`
- [ ] 35. Bundle size: `dist/assets/index-*.js` ≤ 200 KB (gzip ≤ 50 KB)
- [ ] 36. Lazy CMS: `/cms` bundle tidak load di homepage

---

### Security

- [ ] 37. `.gitignore` — tidak ada file `.env*` yang di-commit
- [ ] 38. `backend/config/koneksi.php` — no hardcoded credentials
- [ ] 39. HTTPS semua traffic (tidak ada mixed content HTTP)
- [ ] 40. Server headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`

---

### Dokumentasi

- [ ] 41. Simpan kredensial database di tempat aman
- [ ] 42. Simpan login CMS (username/password) di password manager
- [ ] 43. Simpan URL admin: `https://sdn1mulyoagung.sch.id/cms`
- [ ] 44. Hapus `PRODUKSI.md` dan `CHECKLIST.md` dari server (opsional)

---

*Last updated: 2026-08-20*

## Catatan
- Kerjakan checklist **secara berurutan**
- Jangan skip security checks (CORS, HTTPS, .env)
- Test di browser incognito untuk clean cache
- screenshot hasil test bila perlu