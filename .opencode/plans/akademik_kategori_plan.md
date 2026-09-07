# Plan Pengembangan Akademik: Kategori Bertingkat + Drag Lintas Kategori

## Keputusan Final
- **1 tabel** self-referencing (`parent_id`) di `akademik_menu`. Tanpa tabel kategori terpisah.
- **Tanpa field deskripsi** pada KATEGORI baru (kolom `deskripsi` tetap ada utk kompatibilitas item/data lama, tapi form kategori tidak menampilkannya).
- **Drag-and-drop LINTAS kategori**: admin bisa pindah item antar kategori & mengurutkan dalam satu kategori.
- **Klik kategori di dropdown publik: TIDAK BISA DIKLIK** — hanya berfungsi sebagai pembuka submenu item-item (bukan membuka halaman).

## 1. Database (`akademik_menu`) — Self-Referencing
```
akademik_menu
  id, label, parent_id INT NULL, link_gdrive, is_modul, urutan, aktif, created_at, updated_at
```
- `parent_id = NULL` -> Kategori (grup level-1).
- `parent_id = <id kategori>` -> Item dalam kategori.
- Migrasi otomatis di `akademik_menu.php`:
  `ALTER TABLE akademik_menu ADD COLUMN parent_id INT NULL DEFAULT NULL` (try/catch, abaikan jika ada).
- Data lama (semua NULL) otomatis jadi kategori level-1 -> tidak ada data hilang.
- GET mengembalikan `parent_id` + `parent_label` (left join ke dirinya sendiri).

## 2. Backend API (`akademik_menu.php`)
- GET: tambah `parent_id`, `parent_label`.
- create/update: tambah field `parent_id` (nullable, 0/kosong -> NULL).
  - Kategori (`parent_id` kosong): wajib `label`; link_gdrive/is_modul opsional.
  - Item (`parent_id` ada): wajib `label` + `link_gdrive`.
- delete:
  - Kategori (`parent_id NULL`) yang masih punya item -> TOLAK: "Kategori masih berisi item. Pindahkan/hapus item dahulu."
  - Item biasa -> hapus.
- reorder (DIUBAH, lintas kategori): terima payload `{ id, parent_id, urutan }`; update parent_id + urutan sekaligus; urutan per-parent; validasi parent_id merujuk kategori yang masih ada (hindari orphan).

## 3. Frontend — Tipe & Helper
- `src/types.ts`: tambah `parent_id?: number | null` pada `AkademikMenuItem`.
- Helper baru `src/utils/akademikHelpers.ts`:
  - `buildAkademikTree(items)` -> array { kategori, children[] } urut berdasarkan urutan per parent.
  - `getOrphanItems(items)` -> item parent kosong yang bukan kategori.

## 4. CMS Akademik
- `AkademikFormModal.tsx`: dropdown "Kategori Induk" (`— Buat Kategori Utama —` = null, atau daftar kategori lain). Mode KATEGORI: sembunyikan deskripsi/link/is_modul. Mode ITEM: tampilkan link/is_modul (deskripsi utk kompatibilitas).
- `AkademikCard.tsx`: badge "Kategori" vs "Item", badge parent_label untuk item.
- `AkademikCrud.tsx` List view dirombak:
  - Kategori = baris header bisa di-drag (urut antar kategori) + drop target (pindah item ke kategori tsb).
  - Item = bisa di-drag ke kategori lain atau posisi dalam kategori.
  - Tombol "Tambah Kategori" (parent null) & "Tambah Item".
  - Reorder lintas kategori: item di-drop ke kategori -> parent_id = kategori target.
- `useAkademikData.ts`: `reorderItems` kirim `{id, parent_id, urutan}` (bukan hanya urutan).

## 5. Public Header — Dropdown Bersarang (2 Level)
- `DesktopNav.tsx`: kategori = heading submenu yang membuka panel berisi item. Item tanpa kategori tampil langsung di level-1.
- `MobileNavDrawer.tsx`: accordion 2 level (Akademik -> kategori -> item). Kategori TIDAK menavigasi (tidak bisa diklik -> hanya expand).

## 6. Public Halaman / Rute
- Item: `/akademik/:id` -> viewer Google Drive (sudah ada).
- Kategori: tidak punya rute/halaman sendiri; tidak dapat diklik (membuka submenu saja).

## 7. Verifikasi / Testing
- [ ] Migrasi `parent_id` otomatis tanpa error; data lama jadi kategori root.
- [ ] CMS: tambah kategori, tambah item dlm kategori, edit, hapus (kategori berisi item -> tolak).
- [ ] Drag lintas kategori: item pindah dari kategori A ke B; parent_id & urutan benar.
- [ ] Dropdown desktop 2 level; drawer mobile expandable; kategori tidak navigasi.
- [ ] Item di-viewer Google Drive benar.
- [ ] `npm run lint` & `npm run build` lolos.
