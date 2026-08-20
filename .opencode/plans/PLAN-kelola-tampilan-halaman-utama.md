# Plan: Kelola Tampilan Halaman Utama via CMS (Pengaturan Website)

## Tujuan
Admin (khusus ADMIN, konsisten dengan `RoleAccess.md`) bisa mengubah komposisi & konten utama halaman utama lewat tab di halaman **Pengaturan Website**. Yang baru bisa diubah:
- Urutan & tampil/sembunyi section homepage
- Heading (judul/subjudul) tiap section
- Judul & subjudul Hero
- Background Hero (upload gambar)
- URL video profil
- Teks Visi, Misi, Sejarah

---

## Desain Penyimpanan

Tidak ada tabel baru. Memanfaatkan tabel key-value `pengaturan_sekolah` + endpoint `backend/API/pengaturan.php` yang sudah ada.

### Key baru di `pengaturan_sekolah`

| Key | Tipe | Keterangan |
|---|---|---|
| `homepage_sections` | JSON | Array `[{"key":"hero","judul":"...","subjudul":"...","is_active":true}]` — urutan array = urutan tampil |
| `hero_title` | String | Judul Hero (default: "Selamat Datang di SD Negeri 1 Mulyoagung") |
| `hero_subtitle` | String | Paragraf subtitle Hero |
| `hero_bg` | String (path) | Path foto background Hero (opsional; fallback ke `heroImg1`) |
| `video_url` | String | URL YouTube embed |
| `profil_visi` | String | Teks Visi sekolah |
| `profil_misi` | String | Teks Misi sekolah (satu baris per butir) |
| `profil_sejarah` | String | Teks Sejarah sekolah |

Section keys yang tersedia untuk diatur:
```
hero → stats → sambutan → berita → profil → video → kontak
```

---

## Perubahan Backend

### `backend/API/pengaturan.php`

1. Tambahkan `require_once 'foto_helper.php'` (untuk penanganan upload `hero_bg`).

2. **GET**: tambahkan semua key baru di response.
   - Parse `homepage_sections` dari JSON → array.
   - Kembalikan field terpisah: `hero_title`, `hero_subtitle`, `hero_bg`, `video_url`, `profil_visi`, `profil_misi`, `profil_sejarah`.

3. **POST**: tambahkan key baru ke array `$keys_to_save`:
   ```php
   $keys_to_save = [
     // ... existing keys ...
     'homepage_sections', 'hero_title', 'hero_subtitle', 'hero_bg',
     'video_url', 'profil_visi', 'profil_misi', 'profil_sejarah'
   ];
   ```

4. **Upload `hero_bg`**: tambahkan penanganan upload single file (sudah ada di pattern `foto_helper`):
   - Hapus file lama saat replace.
   - Simpan ke `backend/uploads/hero/` (reuse folder yang sudah ada).
   - Simpan path relatif (`backend/uploads/hero/filename.jpg`) ke DB.

5. **Default values**: tambahkan key default baru di blok inisialisasi tabel (`INSERT ... WHERE NOT EXISTS`) agar instalasi baru otomatis punya nilai awal.

---

## Perubahan Frontend

### 1. `src/CMS/PengaturanSekolah.tsx`

#### Filter tab baru
Perluas `SettingsFilter` dengan dua tab baru:
- `homepage` → **🏠 Struktur Halaman Utama**
- `konten` → **✍️ Konten Utama**

#### Tab "🏠 Struktur Halaman Utama"
- Daftar 7 section dengan **drag-and-drop** urutan (gaya serupa carousel hero yang sudah ada).
- Toggle **aktif/nonaktif** per section.
- Input **judul** & **subjudul** per section (hanya untuk section yang memiliki heading).

#### Tab "✍️ Konten Utama"
- Input `hero_title` (text input).
- Textarea `hero_subtitle`.
- Upload background hero (dengan preview + `ImageCropModal` yang sudah ada).
- Input `video_url` (text/url input).
- Textarea `profil_visi`.
- Textarea `profil_misi` (satu baris = satu butir).
- Textarea `profil_sejarah`.

#### Extend `handleSaveAll`
Kirim semua key baru via `FormData`, termasuk file `hero_bg` bila ada yang diunggah.

### 2. `src/hooks/useHomepageConfig.ts` (Baru)

Hook tipe-konfigurasi dengan pola cache modular (mirip `useSchoolSettings`):
- Fetch `pengaturan.php` sekali (cached di module-level).
- Return objek bertipe `HomepageConfig`:
  ```ts
  interface HomepageConfig {
    sections: { key: string; judul: string; subjudul: string; is_active: boolean }[];
    heroTitle: string;
    heroSubtitle: string;
    heroBg: string;
    videoUrl: string;
    visi: string;
    misi: string[];
    sejarah: string;
  }
  ```
- **Fallback**: nilai default = konten hardcode saat ini, sehingga bila backend mati halaman tetap utuh.

### 3. `src/App.tsx`

Untuk route `/`:
- Ambil config dari `useHomepageConfig()`.
- Render section secara **dinamis**: filter `is_active === true`, ikuti urutan array.
- Bungkus setiap section dengan `data-aos` seperti sekarang.
- Fallback: render semua urutan lama bila config belum termuat / gagal fetch.

### 4. Komponen Public

| Komponen | Yang Diubah |
|---|---|
| `Hero.tsx` | Judul & subtitle dari config; background pakai `heroBg` (fallback `heroImg1`) |
| `SchoolProfileSection.tsx` | Teks Visi/Misi/Sejarah dari config (fallback hardcode); heading `profil` |
| `VideoProfileSection.tsx` | `videoUrl` + heading section `video`; fallback YouTube ID saat ini |
| `NewsSection.tsx` | Heading section `berita` dari config |

> Heading berlaku di section tersebut di mana pun dirender (homepage & halaman khususnya), agar konsisten.

---

## Aturan & Konvensi yang Dijaga

- Khusus **ADMIN** — menu "Pengaturan Website" sudah ADMIN-only, TIM tidak terpapar.
- Tidak ada perubahan autentikasi atau alur verifikasi.
- Teks UI tetap **Bahasa Indonesia**.
- Pakai `getApiBaseUrl()` & path relatif sesuai konvensi (`src/config/api.ts`).
- `src/data/schoolData.ts` tidak dihapus — dijadikan fallback default.
- Import relatif, tidak pakai alias `@/`.

---

## File yang Diubah / Ditambah

| File | Status |
|---|---|
| `backend/API/pengaturan.php` | Modifikasi — tambah key + upload hero_bg |
| `src/CMS/PengaturanSekolah.tsx` | Modifikasi — 2 tab baru + form + save payload |
| `src/hooks/useHomepageConfig.ts` | **Baru** — shared hook config homepage |
| `src/App.tsx` | Modifikasi — render dinamis section berdasarkan config |
| `src/components/Hero.tsx` | Modifikasi — config-based judul/subtitle/bg |
| `src/components/SchoolProfileSection.tsx` | Modifikasi — config-based visi/misi/sejarah |
| `src/components/VideoProfileSection.tsx` | Modifikasi — config-based video URL |
| `src/components/NewsSection.tsx` | Modifikasi — config-based heading |

---

## Verifikasi

1. `npm run lint` — pastikan typecheck lolos.
2. `npm run build` — pastikan build berhasil.
3. Uji manual via dev server (backend aktif):
   - Simpan urutan baru → homepage tampil sesuai urutan.
   - Matikan salah satu section → hilang dari homepage, tapi halaman khususnya tetap ada.
   - Ubah judul Hero, background, video URL → tampil di `/` dan `/profile`.
   - Cek fallback saat backend mati / tanpa isi DB (halaman tetap utuh).
4. Uji CMS:
   - Simpan & reload Pengaturan Website.
   - Pastikan filter "Semua Pengaturan" menampilkan section baru.
   - Pastikan drag-and-drop urutan berfungsi.
   - Pastikan upload background hero berhasil (preview + crop).

---

**Status:** Direncanakan, belum dieksekusi. Menunggu persetujuan untuk mulai implementasi.



# Rencana Implementasi: Kelola Tampilan Halaman Utama via CMS (Pengaturan Website)

Rencana ini bertujuan untuk memindahkan pengelolaan elemen penting Halaman Utama (urutan & status aktif section, heading, konten teks Visi/Misi/Sejarah, video profil, serta background Hero) ke CMS bagian **Pengaturan Website** yang hanya bisa diakses oleh **ADMIN**.

## Rincian Perubahan

---

### Backend (`backend/API/pengaturan.php`)
- Menambahkan import `foto_helper.php` untuk menangani upload gambar background Hero (`hero_bg`).
- Menambahkan default settings baru pada inisialisasi tabel:
  - `homepage_sections`: Default urutan dan nama section homepage (hero, stats, sambutan, berita, profil, video, kontak).
  - `hero_title`: "Selamat Datang di SD Negeri 1 Mulyoagung"
  - `hero_subtitle`: Deskripsi sekolah yang saat ini ter-hardcode.
  - `hero_bg`: string kosong.
  - `video_url`: URL YouTube Profil saat ini.
  - `profil_visi`: Visi saat ini.
  - `profil_misi`: Misi saat ini (JSON array/string baris baru).
  - `profil_sejarah`: Sejarah sekolah saat ini.
- **GET Request**: Mengembalikan semua data di atas baik yang ter-parse maupun orisinal.
- **POST Request**: Mendukung penyimpanan data teks baru dan penanganan upload file gambar `hero_bg` (memanfaatkan fungsi yang ada di `foto_helper.php` dengan direktori tujuan `backend/uploads/hero/`).

---

### Frontend Hooks (`src/hooks/useHomepageConfig.ts` [NEW])
- Membuat hook `useHomepageConfig` yang melakukan fetch data konfigurasi halaman utama dari `pengaturan.php`.
- Menggunakan fallback data statis dari `src/data/schoolData.ts` atau data hardcode saat ini agar halaman web tetap berfungsi normal jika backend mati.

---

### Frontend CMS Layout (`src/CMS/PengaturanSekolah.tsx`)
- Memperluas Settings Tab dengan 2 kategori baru:
  1. **🏠 Struktur Halaman Utama** (`homepage`): Menu drag-and-drop urutan baris halaman serta checkbox tampilkan/sembunyikan (is_active) per section (Hero, Stats, Sambutan, Berita, Profil, Video, Kontak) disertai input custom Judul/Subjudul section.
  2. **✍️ Konten Utama** (`konten`): Formulir input untuk mengubah isi Visi, Misi (textarea per baris), Sejarah, URL Video Profil, Judul Hero, Subjudul Hero, serta Upload foto background Hero dengan pemotong gambar (`ImageCropModal`).
- Memperluas fungsi simpan (`handleSaveAll`) agar mengirimkan data-data baru ini via `FormData`.

---

### Integrasi Tampilan Publik
- **`src/App.tsx`**: Mengubah urutan rendering section di landing page utama (`path="/"`) agar bersifat dinamis mengikuti konfigurasi yang diambil dari `useHomepageConfig()`.
- **`src/components/Hero.tsx`**: Menampilkan judul, subjudul, dan background image berdasarkan konfigurasi (fallback ke asset lokal).
- **`src/components/SchoolProfileSection.tsx`**: Menampilkan Judul/Subjudul Profil, Visi, Misi, Sejarah dinamis.
- **`src/components/VideoProfileSection.tsx`**: Menampilkan Video URL dinamis.
- **`src/components/NewsSection.tsx`**: Menampilkan Judul/Subjudul Berita dinamis.

---

## Rencana Verifikasi

### Otomatis
- Menjalankan `npm run lint` untuk memastikan kelulusan typecheck.
- Menjalankan `npm run build` untuk memvalidasi build sistem.

### Manual
- Membuka CMS Pengaturan Website sebagai ADMIN, melakukan drag-and-drop urutan, lalu me-refresh halaman utama untuk memastikan urutan bagian berubah.
- Menghapus/menyembunyikan section tertentu (misalnya Video) lalu memverifikasi bahwa section tersebut tidak lagi dirender di halaman utama.
- Mengunggah background Hero baru dan mengubah teks Visi/Misi/Sejarah lalu memastikan perubahan langsung tampil secara dinamis.

