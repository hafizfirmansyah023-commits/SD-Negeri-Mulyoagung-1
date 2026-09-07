# Rencana Implementasi — Navigasi Dropdown Akademik

## Konteks / Masalah

- Navigasi `Akademik` saat ini adalah **tab datar** (`{ id: 'modul', label: 'Akademik' }` di `src/utils/headerData.ts:12`) yang membuka halaman `/modul` (`ModulPembelajaranSection`), bukan dropdown.
- Tidak ada menu akademik CRUD di CMS.
- Modul Ajar sudah ada (upload PDF + GDrive) tapi CMS-nya tidak fleksibel untuk menambah link GDrive sebagai item akademik.

## Keputusan (disepakati dengan user)

1. **Submenu sepenuhnya dinamis dari CMS** — admin menentukan daftar item menu akademik (label + link GDrive + urutan).
2. Public page = **judul + instruksi + tombol GDrive**.
3. **Modul Ajar & LKPD** existing dipertahankan; juga bisa menambahkan link GDrive via perbaikan CMS.
4. **Hanya ADMIN** yang CRUD menu akademik.
5. Routing `/akademik/:id` dengan **id numeric**.
6. Dropdown **teks saja** (tanpa ikon per item).
7. `/modul` lama → **redirect ke dropdown Akademik → item "Modul Ajar & LKPD"**.

---

## 1. Backend — tabel & API `akademik_menu.php`

Buat file baru `backend/API/akademik_menu.php` (CREATE TABLE IF NOT EXISTS, pola `modul_pembelajaran.php`):

```
id INT AUTO_INCREMENT PRIMARY KEY
label VARCHAR(100) NOT NULL          -- "KSP", "Bedah CP", dst.
deskripsi TEXT NULL                  -- instruksi halaman public
link_gdrive TEXT NOT NULL            -- link Google Drive
is_modul TINYINT DEFAULT 0           -- 1 = Modul Ajar & LKPD (render ModulPembelajaranSection)
urutan INT DEFAULT 0
aktif TINYINT DEFAULT 1
```

- `GET`: public → `WHERE aktif=1 ORDER BY urutan ASC`; CMS `?status=all` → semua.
- `POST`: `action=create|update|delete`, semua **harus role ADMIN** (403 selain admin).

## 2. Public — halaman `/akademik/:id`

- `src/types.ts`: ganti `NavTab 'modul'` → `'akademik'` (update pemakaian di header/footer).
- Komponen baru `src/components/AkademikSection.tsx`:
  - Fetch `/akademik_menu.php` → cari item by `id`.
  - Render judul + deskripsi + **tombol "Buka di Google Drive"** (`target="_blank"`).
  - Jika `is_modul===1` → render `ModulPembelajaranSection` yang sudah ada di bawah tombol.
- `src/App.tsx`:
  - Ubah `<Route path="/modul">` → `<Route path="/akademik/:id">` render `AkademikSection`.
  - Tambah `/akademik` index yang menampilkan grid semua item menu + tombol Modul Ajar.
  - Redirect: `<Route path="/modul" element={<Navigate to="/akademik" />} />`.

## 3. Navigasi dropdown dinamis

- `src/CMS/hooks/useAkademikData.ts` (baru, pola `useModulData`) — dipakai public & CMS.
- `src/components/Header.tsx`: fetch menu akademik + pass ke child.
- `src/components/header/DesktopNav.tsx`: item `akademik` render tombol + chevron → dropdown panel berisi submenu (teks) dari data; klik submenu → `navigate('/akademik/<id>')`.
- `src/components/header/MobileNavDrawer.tsx`: "Akademik" jadi accordion, sub-item di bawahnya.
- `src/utils/headerData.ts`: `{ id: 'akademik', label: 'Akademik' }`.
- `src/utils/footerData.ts`: `{ label: 'Akademik', tab: 'akademik' }`.

## 4. CMS — CRUD Akademik Menu (hanya ADMIN)

- `src/CMS/types.ts`: tambah `'akademik'` ke `CmsTab`.
- `src/CMS/components/CmsSidebar.tsx`: menu "Akademik Menu" (ADMIN only).
- `src/CMS/Dashboard.tsx`: render `AkademikCrud` saat `activeTab==='akademik'`, guarded role ADMIN.
- File baru: `src/CMS/AkademikCrud.tsx`, `src/CMS/akademik/AkademikFormModal.tsx`, `src/CMS/akademik/AkademikCard.tsx` (pola `ModulPembelajaranCrud`). Form: label, deskripsi, link_gdrive, `is_modul` (toggle), urutan, aktif.

## 5. Perbaikan CMS Modul — tambah link GDrive

- `src/CMS/modul/ModulFormModal.tsx` sudah punya `sumberTipe='gdrive'` + `linkGdrive`. Perbaikan: pastikan field link GDrive selalu mudah diakses/disimpan dan tampil konsisten di card/aksi. Saat implementasi: verifikasi alur `sumberTipe` → `link_gdrive` di `ModulPembelajaranCrud.handleSubmit` & `modul_pembelajaran.php`, perbaiki apa yang kurang agar admin bisa menambahkan link GDrive dengan mudah (mis. tetap via opsi "Google Drive").

## 6. Verifikasi

- `npm run lint` (tsc --noEmit).
- Uji manual: dropdown di desktop+mobile, halaman `/akademik/:id`, tombol GDrive buka tab baru, redirect `/modul`, dan CRUD di CMS sebagai ADMIN.

## Catatan

Item "Modul Ajar & LKPD" di dropdown akan punya `link_gdrive` (ke folder GDrive) sekaligus menampilkan grid modul dari halaman existing; `is_modul` flag mengontrol render `ModulPembelajaranSection`.
