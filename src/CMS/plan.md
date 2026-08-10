# Rencana Implementasi: Refaktorisasi Modular CMS seperti ContactSection.tsx (Tanpa Pemisahan Header)

Merefaktorisasi antarmuka CMS SD Negeri Mulyoagung 1 agar mengikuti pola desain modular seperti **`ContactSection.tsx`**, di mana komponen utama berukuran ringkas (~30-50 baris) dan bertindak sebagai *orchestrator*, sedangkan komponen UI terpisah (Card, Form Modal, Table/Grid, Delete Confirmation Modal) dipisah secara rapi ke dalam sub-folder khusus modul masing-masing tanpa memisahkan Header secara terpisah.

## Modular Component Structure

### 1. Modul Berita (`src/CMS/berita/`)
- **`BeritaCard.tsx`**: Kartu tampilan item berita dengan badge status verifikasi.
- **`BeritaFormModal.tsx`**: Modal dialog form input/edit berita.
- **[BeritaCrud.tsx](file:///c:/xampp/htdocs/sd-negeri-mulyoagung-1/src/CMS/BeritaCrud.tsx)** (Orchestrator utama ringkas seperti `ContactSection.tsx`).

### 2. Modul Galeri (`src/CMS/galeri/`)
- **`GaleriCard.tsx`**: Kartu tampilan foto galeri & detail kegiatan.
- **`GaleriFormModal.tsx`**: Modal dialog form unggah/edit foto galeri.
- **[GaleriCrud.tsx](file:///c:/xampp/htdocs/sd-negeri-mulyoagung-1/src/CMS/GaleriCrud.tsx)** (Orchestrator utama ringkas).

### 3. Modul Guru & Tendik (`src/CMS/guru/`)
- **`GuruCard.tsx`**: Kartu profil guru & staf kependidikan.
- **`GuruFormModal.tsx`**: Modal dialog form guru dengan Combobox Status Kepegawaian (`Aktif`, `Mutasi`, `Pensiun`).
- **[GuruCrud.tsx](file:///c:/xampp/htdocs/sd-negeri-mulyoagung-1/src/CMS/GuruCrud.tsx)** (Orchestrator utama ringkas).

### 4. Modul Fasilitas (`src/CMS/fasilitas/`)
- **`FasilitasCard.tsx`**: Kartu fasilitas sekolah dengan *auto-detected icon*.
- **`FasilitasFormModal.tsx`**: Modal dialog form input/edit fasilitas.
- **`FasilitasDeleteModal.tsx`**: Modal konfirmasi hapus data.
- **[FasilitasCrud.tsx](file:///c:/xampp/htdocs/sd-negeri-mulyoagung-1/src/CMS/FasilitasCrud.tsx)** (Orchestrator utama ringkas).

### 5. Modul User & Akun (`src/CMS/user/`)
- **`SelfProfileCard.tsx`**: Kartu form perbarui profil pengguna aktif.
- **`UserTable.tsx`**: Tabel daftar pengguna & hak akses (Admin View).
- **`UserFormModal.tsx`**: Modal dialog form tambah akun baru.
- **[UserCrud.tsx](file:///c:/xampp/htdocs/sd-negeri-mulyoagung-1/src/CMS/UserCrud.tsx)** (Orchestrator utama ringkas).

### 6. Modul Verifikasi (`src/CMS/verifikasi/`)
- **`VerifikasiCard.tsx`**: Kartu antrean verifikasi berita/galeri dengan tombol Setujui/Tolak.
- **[Verifikasi.tsx](file:///c:/xampp/htdocs/sd-negeri-mulyoagung-1/src/CMS/Verifikasi.tsx)** (Orchestrator utama ringkas).

### 7. Modul Statistik (`src/CMS/statistik/`)
- **`StatistikCard.tsx`**: Kartu nilai statistik sekolah.
- **`StatistikFormModal.tsx`**: Modal dialog form input/edit statistik.
- **[Statistikcrud.tsx](file:///c:/xampp/htdocs/sd-negeri-mulyoagung-1/src/CMS/Statistikcrud.tsx)** (Orchestrator utama ringkas).

---

## Verification Plan

### Automated Tests
- Menjalankan `npx tsc --noEmit` untuk mengonfirmasi tidak ada kesalahan tipe TypeScript maupun impor modul.

### Manual Verification
- Memastikan seluruh fitur CRUD, pencarian, penyaringan, dan responsivitas seluler tetap berfungsi 100% sempurna dengan struktur baru yang lebih bersih dan modular.
