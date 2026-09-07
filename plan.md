# Plan: Global Search Upgrade

> Status: **direncanakan, belum dieksekusi**

## Ringkasan

Upgrade `GlobalSearchModal.tsx` (sudah ada, mencari berita/galeri/modul/guru) dengan:

1. Tambah entitas baru: **inovasi, akademik, fasilitas**
2. Backend search endpoint server-side (`search.php`)
3. Klik hasil = **direct ke halaman list induk + auto buka modal detail** (bukan modal embedded di search)
4. Debounce tetap **1000ms** (tidak diubah)

## Keputusan dari user

- P1 → 1: direct ke halaman = buka halaman list induk + auto buka modal detail di halaman tsb
- P2 → 2: entitas baru = inovasi + akademik + fasilitas
- P4 → ya: backend search endpoint server-side

## File yang diubah / dibuat

| File | Perubahan |
|---|---|
| `backend/API/search.php` | **Baru** — endpoint search terpadu |
| `src/components/GlobalSearchModal.tsx` | Ganti fetch banyak → 1 hit `search.php`; tambah 3 kategori; klik item = navigate ke halaman list induk; hapus modal embedded |
| `src/components/NewsSection.tsx` | Baca `location.state?.openArticle` → buka modal |
| `src/components/DirectorySection.tsx` | Baca `location.state?.openTeacher` → buka modal |
| `src/components/GallerySection.tsx` | Baca `location.state?.openPhoto` → buka modal |
| `src/components/ModulPembelajaranSection.tsx` | Baca `location.state?.openModul` → buka modal |
| `src/App.tsx` | (verifikasi) pastikan `/profile` menampilkan fasilitas untuk direct fasilitas |

## 1. Backend: `backend/API/search.php` (file baru)

Endpooint GET `?q=<kata kunci>`, hanya data public/verified. Pola endpoint existing (`koneksi.php`, JSON `{status, data}`).

Response shape:

```json
{ "status": "success", "data": {
  "berita":    [{id, judul, kategori, tanggal, isi, foto}],
  "galeri":    [{id, judul, kategori, tanggal, deskripsi, foto}],
  "modul":     [{id, judul, deskripsi, mata_pelajaran, kelas, kategori, foto}],
  "guru":      [{id, nama, jabatan, tugas, nip, foto}],
  "inovasi":   [{id, judul, kategori, inovator, deskripsi, foto}],
  "akademik":  [{id, label, deskripsi, parent_label, link_gdrive, is_modul}],
  "fasilitas": [{id, judul, deskripsi, foto}]
}}
```

- `LIKE %q%` per kolom yang relevan di tiap tabel.
- Filter public: berita/galeri/inovasi/modul → `status_verifikasi='Verified'` (+ `status='Published'` untuk modul/inovasi); guru/fasilitas/akademik aktif → filter aktif.
- `q` kosong → return array kosong.
- `LIMIT` per entitas (mis. 10) agar respon tidak membesar.

## 2. Frontend: `GlobalSearchModal.tsx`

Ganti `fetchAllData` (`Promise.allSettled` 4 endpoint, ~lines 80-158) menjadi **satu fetch ke `search.php?q=<q>`** yang dipicu `debouncedQuery` (bukan `isOpen`).

- Hapus state `news/gallery/modules/teachers` + mapping manual; ganti satu state `results` dari `search.php`.
- Tambah `SearchCategory`: `'all' | 'berita' | 'galeri' | 'modul' | 'guru' | 'inovasi' | 'akademik' | 'fasilitas'`.
- Hilangkan `useMemo` filter in-memory (sudah difilter server).

## 3. Direct ke halaman list induk + auto buka modal

Klik item hasil → berhenti membuka modal embedded di search modal → `navigate` ke halaman list induk + kirim item via router `state`, lalu buka modal di section halaman.

Contoh di `GlobalSearchModal`:

```ts
import { useNavigate } from 'react-router-dom';
navigate('/news', { state: { openArticle: art.id } });
onClose();
```

Section target membaca `useLocation().state` dan membuka modal:

- `/news` → `NewsSection`: `location.state?.openArticle` → `setActiveArticle(found)`
- `/directory` → `DirectorySection`: `state?.openTeacher` → `setSelectedTeacherForModal`
- `/gallery` → `GallerySection`: `state?.openPhoto` → buka `PhotoLightboxModal`
- `/akademik` → `AkademikSection`: item menu → `/akademik/:id` (sudah punya);
  modul → `ModulPembelajaranSection` baca `state?.openModul` → `ModulPreviewModal`
- `/inovasi/:id` → sudah punya route detail; `navigate('/inovasi/' + id)` langsung (tanpa modal)
- **fasilitas** → tidak punya halaman sendiri → navigate `/profile` (tempat fasilitas tampil)

Catatan: di `App.tsx` `activeTab` sudah otomatis dihitung dari path (`App.tsx:84-91`), jadi tidak perlu panggil `setActiveTab` manual.

Hapus modal embedded di bagian bawah `GlobalSearchModal` (NewsDetailModal, PhotoLightboxModal, TeacherProfileModal, ModulPreviewModal) — sudah dikelola section halaman masing-masing.

## 4. Pertanyaan lanjutan sebelum eksekusi

- **Fasilitas**: fasilitas tampil di `/profile`, tidak ada modal detail. Direct cukup navigate `/profile`? (tidak ada tombol "Lihat Foto")
- **Akademik vs Modul**: asumsi — klik "menu akademik" → `/akademik/:id`; klik "modul" → `/akademik` + buka modal modul. Perlu konfirmasi.

## Catatan

- Ponytail: pendekatan `router state` adalah diff minimal (3-5 baris per section, tanpa menulis props baru).
- Debounce tetap 1000ms (sesuai permintaan, tidak diubah).
