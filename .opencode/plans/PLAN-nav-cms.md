# Plan: Reorganisasi Navigasi CMS

## Struktur Navigasi Baru

### POST
- Pengumuman (tab: pengumuman) — ADMIN only
- Berita (tab: berita) — ADMIN + TIM
- Galeri (tab: galeri) — ADMIN + TIM

### Data Sekolah
- Sambutan Kepsek (tab: sambutan) — ADMIN only
- Visi & Misi (tab: visimisi) — ADMIN only
- Sejarah (tab: sejarah) — ADMIN only
- Direktori Guru (tab: guru) — ADMIN only
- Fasilitas (tab: fasilitas) — ADMIN only

### Pengaturan Website
- Hero / Slider (tab: hero) — ADMIN only
- Konten Utama (tab: kontenutama) — ADMIN only
- PPDB (tab: ppdb) — ADMIN only
- Kontak & Media Sosial (tab: kontak) — ADMIN only
- Pengguna (tab: user) — ADMIN + TIM

---

## Temuan Penting

Semua "tab baru" (Visi & Misi, Sejarah, Hero, Kontak, dll) sudah ada komponennya — mereka saat ini terkumpul di dalam satu halaman `pengaturan/index.tsx`. Rencana ini memecah halaman Pengaturan menjadi beberapa tab terpisah di sidebar.

---

## File yang Perlu Diubah

### 1. `src/CMS/types.ts`
Tambahkan tab baru ke type `CmsTab`:
```
'visimisi' | 'sejarah' | 'strukturorganisasi' | 'hero' | 'kontenutama' | 'ppdb' | 'kontak' | 'medsos'
```

### 2. `src/CMS/components/CmsSidebar.tsx`
Refactor total — ganti flat list `navItems` jadi grouped navigation dengan section headers (POST, Data Sekolah, Pengaturan Website). Role gating dipertahankan:
- **ADMIN**: semua tab
- **TIM**: hanya `berita`, `galeri`, `user`

### 3. `src/CMS/Dashboard.tsx`
- Tambah case rendering untuk setiap tab baru
- Arahkan ke komponen yang sudah ada di `pengaturan/Sections/`
- Update TIM role redirect (hanya boleh `berita`, `galeri`, `user`)

### 4. Buat page wrappers untuk tab-tab baru
Buat file-page wrapper baru yang meng-embed section components yang sudah ada:

| File Baru | Embed Section |
|-----------|---------------|
| `src/CMS/VisiMisiCrud.tsx` | `KontenUtamaSection.tsx` (visi fields) |
| `src/CMS/SejarahCrud.tsx` | Form untuk `profil_sejarah` field |
| `src/CMS/StrukturOrganisasiCrud.tsx` | Placeholder (StrukturHalamanUtamaSection atau org chart) |
| `src/CMS/HeroCrud.tsx` | `HeroCarouselSection.tsx` + `KontenUtamaSection.tsx` |
| `src/CMS/KontenUtamaCrud.tsx` | `KontenUtamaSection.tsx` |
| `src/CMS/PPDBCrud.tsx` | `PpdbSection.tsx` |
| `src/CMS/KontakCrud.tsx` | `KontakSection.tsx` + `MedsosSection.tsx` |

### 5. Hapus atau refactor `pengaturan/index.tsx`
Setelah semua section dipecah ke tab masing-masing, halaman `pengaturan` bisa dihapus atau dijadikan redirect ke tab pertama di Pengaturan Website.

---

## Backend (Sudah Ada)

| Backend File | Melayani |
|---|---|
| `backend/API/pengaturan.php` | Visi, Misi, Sejarah, Hero text, PPDB link, Kontak, Medsos, Homepage sections (key-value store) |
| `backend/API/hero_carousel.php` | Hero carousel images (tabel terpisah) |

---

## Catatan: Struktur Organisasi

Saat ini `StrukturHalamanUtamaSection.tsx` mengatur urutan section homepage, bukan struktur organisasi sekolah. Struktur organisasi (org chart) ada di public-side `OrgChartSection.tsx`. Perlu dipertimbangkan:
- Apakah tab ini untuk **struktur organisasi** (org chart guru)?
- Atau tetap untuk **struktur halaman utama** (homepage section ordering)?

---

## Status

- [ ] Update `src/CMS/types.ts`
- [ ] Refactor `src/CMS/components/CmsSidebar.tsx`
- [ ] Update `src/CMS/Dashboard.tsx`
- [ ] Buat `src/CMS/VisiMisiCrud.tsx`
- [ ] Buat `src/CMS/SejarahCrud.tsx`
- [ ] Buat `src/CMS/StrukturOrganisasiCrud.tsx`
- [ ] Buat `src/CMS/HeroCrud.tsx`
- [ ] Buat `src/CMS/KontenUtamaCrud.tsx`
- [ ] Buat `src/CMS/PPDBCrud.tsx`
- [ ] Buat `src/CMS/KontakCrud.tsx`
- [ ] Refactor/hapus `src/CMS/pengaturan/index.tsx`
- [ ] Typecheck (`npm run lint`)
