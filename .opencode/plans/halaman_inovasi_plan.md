# Plan Implementasi Halaman Inovasi (Publik & CMS CRUD)

SD Negeri 1 Mulyoagung — Fitur Halaman Inovasi berbasis Google Drive (Folder/File Foto & Video), dilengkapi Manajemen CMS, Detail Page (\_blank), dan Mobile-First Responsive Design.

---

## 1. Ikhtisar & Arsitektur Fitur

- **Media Sumber**: Berasal dari tautan Google Drive (Folder atau File) yang berisi foto dan video dokumentasi inovasi.
- **Embedded Viewer**: Ditampilkan langsung di dalam halaman website via iframe responsif (`/embeddedfolderview` atau `/preview`) tanpa mewajibkan pengunjung keluar ke Google Drive.
- **Alur Pengunjung (Publik)**:
  1. Akses menu navigasi **"Inovasi"** (`/inovasi`).
  2. Menampilkan katalog inovasi dengan filter kategori, pencarian live, dan card responsif (1 kolom di mobile, 2 kolom tablet, 3 kolom desktop).
  3. Saat card inovasi diklik, membuka halaman detail inovasi (`/inovasi/:id`) di **tab baru (`target="_blank"`)**.
  4. Halaman detail memuat Google Drive Viewer interaktif layar penuh dan deskripsi detail.
- **CMS Admin/Guru/Tim**:
  - CRUD Inovasi lengkap (`/cms/inovasi`).
  - **Nama Inovator & Pelaksana**: Opsional.
  - **Foto Sampul & Crop Tool**: Opsional (otomatis fallback ke placeholder modern jika tidak ada foto sampul).
  - Alur verifikasi (`Pending`/`Verified`/`Rejected`) untuk non-admin.

---

## 2. Database & Backend API

### File: `backend/API/inovasi.php`

- **Tabel MySQL: `inovasi`**:
  - `id` INT AUTO_INCREMENT PRIMARY KEY
  - `judul` VARCHAR(255) NOT NULL
  - `kategori` VARCHAR(100) NOT NULL (contoh: _Inovasi Pembelajaran_, _Karya Siswa_, _Digitalisasi_, _Media Kreatif_)
  - `inovator` VARCHAR(150) NULL (_Opsional_)
  - `deskripsi` TEXT NULL (_Opsional_)
  - `link_drive` TEXT NOT NULL (_Link Folder / File Google Drive_)
  - `foto_cover` VARCHAR(255) NULL (_Opsional_)
  - `foto_cover_crop` VARCHAR(255) NULL (_Opsional_)
  - `status` ENUM('Draft', 'Published') DEFAULT 'Published'
  - `status_verifikasi` ENUM('Pending', 'Verified', 'Rejected') DEFAULT 'Verified'
  - `uploaded_by` INT NULL
  - `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  - `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

- **Endpoints & Actions**:
  - `GET`: Publik hanya menerima data `status_verifikasi = 'Verified'` & `status = 'Published'`. CMS menerima semua dengan `?status=all`. Mendukung `?id=X` untuk single detail query.
  - `POST action=create`: Simpan inovasi baru + foto cover opsional (via `foto_helper.php`).
  - `POST action=update`: Update inovasi + update foto cover opsional.
  - `POST action=delete`: Hapus data & unlink file foto terkait.
  - `POST action=verify`: Ubah `status_verifikasi` (`Verified` / `Rejected`).
  - `POST action=update_status`: Ubah `status` (`Draft` / `Published`).

---

## 3. Modul CMS (Admin, Guru, Tim)

### File & Komponen:

1. **Types (`src/CMS/types.ts`)**:
   - Tambahkan `'inovasi'` ke type `CmsTab`.
2. **Hook (`src/CMS/hooks/useInovasiData.ts`)**:
   - State fetching, delete, status toggle, dan verifikasi.
3. **Form Modal (`src/CMS/inovasi/InovasiFormModal.tsx`)**:
   - Judul & Kategori (Wajib).
   - Inovator / Pelaksana (Opsional).
   - Deskripsi (Opsional).
   - Link Google Drive (Wajib).
   - Cover Foto + Crop Tool (Opsional).
   - Status Draft / Published.
4. **Card CMS (`src/CMS/inovasi/InovasiCard.tsx`)**:
   - Badge verifikasi & status publish.
   - Tombol preview, edit, hapus, dan toggle status.
5. **Halaman CRUD Utama (`src/CMS/InovasiCrud.tsx`)**:
   - Toolbar filter kategori, search bar, tombol tambah inovasi, dan pagination.
6. **Integrasi Sidebar & Dashboard**:
   - `src/CMS/components/CmsSidebar.tsx`: Menu "Inovasi" (ikon `Lightbulb`).
   - `src/CMS/Dashboard.tsx`: Lazyload `InovasiCrud`.
   - `src/CMS/Verifikasi.tsx`: Tab verifikasi inovasi pending.

---

## 4. Halaman Publik & Mobile Responsiveness

### File & Komponen:

1. **Types & Helper**:
   - `src/types.ts`: Definisikan `InovasiItem` & tambahkan `'inovasi'` pada `NavTab`.
   - Helper parser URL Google Drive (konversi URL folder ke `/embeddedfolderview?id=...#grid` atau file ke `/preview`).
2. **Hook Publik (`src/hooks/useInovasiData.ts`)**:
   - Fetching list inovasi terverifikasi & single inovasi by ID.
3. **Halaman Katalog (`src/components/InovasiSection.tsx`)**:
   - Header hero banner bertema inovasi sekolah.
   - Filter bar kategori dengan scroll horizontal halus untuk mobile (`touch-pan-x`).
   - Live debounce search bar.
   - Grid kartu inovasi responsif: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
4. **Card Inovasi (`src/components/inovasi/InovasiCard.tsx`)**:
   - Thumbnail foto cover atau fallback placeholder ilustrasi gradien teal.
   - Badge kategori & inovator (jika diisi).
   - Cuplikan deskripsi (line-clamp).
   - Aksi klik: Membuka rute detail `/inovasi/:id` di tab baru (`target="_blank"`).
5. **Halaman Detail Inovasi (`src/components/inovasi/InovasiDetailPage.tsx` pada rute `/inovasi/:id`)**:
   - Header info inovasi (kategori, judul, inovator, tanggal, tombol share).
   - **Embedded Google Drive Viewer**: Iframe responsif (`h-[55vh] sm:h-[70vh] md:h-[80vh]`) untuk eksplorasi dan pemutaran video/foto langsung di layar HP/tablet/desktop.
   - Kotak deskripsi lengkap & tombol cadangan _"Buka di Google Drive"_.
6. **Navigasi Utama**:
   - `src/utils/headerData.ts`: Menambahkan item menu `{ id: 'inovasi', label: 'Inovasi' }`.
   - `src/components/Header.tsx`, `DesktopNav.tsx`, dan `MobileNavDrawer.tsx`: Penanganan rute dan visual active tab inovasi.
   - `src/App.tsx`: Daftarkan rute `/inovasi` dan `/inovasi/:id`.

---

## 5. Checklist Validasi & Pengujian

- [ ] API backend `inovasi.php` berjalan tanpa error dan membuat tabel otomatis.
- [ ] Form CMS dapat menyimpan data tanpa mengisi inovator dan tanpa upload foto cover.
- [ ] Form CMS dapat memotong (crop) dan menyimpan foto cover jika diunggah.
- [ ] Navigasi header desktop dan drawer mobile menampilkan tab Inovasi dengan benar.
- [ ] Klik card inovasi membuka halaman `/inovasi/:id` di tab baru (\_blank).
- [ ] Halaman `/inovasi/:id` berhasil menampilkan embedded foto/video dari Google Drive.
- [ ] Tampilan responsif di semua ukuran layar (Mobile 320px–480px, Tablet 768px, Desktop 1024px+).
- [ ] `npm run lint` (TypeScript check) lolos tanpa error.
