# Plan: Refactor `src/CMS/PengaturanSekolah.tsx`

## Masalah
File utama `PengaturanSekolah.tsx` sudah mencapai ~1373 baris dan menangani banyak tanggung jawab sekaligus:
- PPDB & tahun ajaran
- Kontak sekolah
- Medsos CRUD
- Hero carousel CRUD (upload + crop + drag-drop reorder)
- Struktur halaman utama (section order + visibility)
- Konten utama (hero title/subtitle, video URL, visi/misi/sejarah)
- Logika save-all dengan satu FormData
- Utilitas (getYoutubeId)

## Pendekatan
Refactor **murni struktural** (behavior-preserving) — pindahkan kode ke file/folder terpisah tanpa mengubah perilaku atau UX. Ikuti konvensi folder per-entity yang sudah ada (`src/CMS/statistik/`, `src/CMS/guru/`, `src/CMS/berita/`).

---

## Struktur file baru

```
src/CMS/pengaturan/
├── types.ts                                  # MedsosItem, HeroCarouselItem, HomepageSection, SettingsFilter
├── utils/
│   └── youtube.ts                            # getYoutubeId()
├── hooks/
│   └── usePengaturanData.ts                  # Semua state + fetch + saveAll + handler CRUD
├── Sections/
│   ├── PpdbSection.tsx                       # Tahun ajaran + link PPDB
│   ├── KontakSection.tsx                     # Email/telp/WA/alamat
│   ├── MedsosSection.tsx                     # Grid medsos + tombol tambah
│   ├── HeroCarouselSection.tsx               # Grid hero carousel + drag-drop
│   ├── StrukturHalamanUtamaSection.tsx       # Daftar section homepage (drag-drop + toggle + heading)
│   └── KontenUtamaSection.tsx                # Hero title/subtitle, video URL, visi/misi/sejarah
├── Modals/
│   ├── HeroCarouselModal.tsx                 # Modal tambah/edit foto hero (termasuk crop flow)
│   └── MedsosModal.tsx                       # Modal tambah/edit medsos
└── index.tsx                                 # PengaturanSekolah utama (~200-250 baris)
```

---

## Detail perubahan

### 1. `src/CMS/pengaturan/types.ts`

Pindahkan tipe dari `PengaturanSekolah.tsx`:
- `MedsosItem`
- `HeroCarouselItem`
- `SettingsFilter` (tetap ada: `'all' | 'ppdb' | 'hero' | 'contact' | 'medsos' | 'homepage' | 'konten'`)
- `HomepageSection` — `{ key: string; judul: string; subjudul: string; is_active: boolean }`

### 2. `src/CMS/pengaturan/utils/youtube.ts`

Pindahkan fungsi `getYoutubeId(url: string): string` dari dalam komponen. Perilaku identik — extract YouTube ID dari URL berbagai format.

### 3. `src/CMS/pengaturan/hooks/usePengaturanData.ts`

Hook sentral yang menampung seluruh state & logika. Karena tombol "Simpan Semua" mengirim semua key sekaligus ke `pengaturan.php`, state tetap terpusat di satu hook agar payload `FormData` mudah digabung.

**Yang masuk ke hook:**
- Semua state setter (tahunAjaran, linkPpdb, emailSekolah, teleponSekolah, whatsappSekolah, alamatSekolah, medsosList, heroSlides, homepageSections, heroTitle, heroSubtitle, heroBg, videoUrl, profilVisi, profilMisiInput, profilSejarah, heroBgFile, heroBgOriginalFile, heroBgPreview)
- `loading`, `saving`, `message` state
- `fetchSettings()` — fetch `pengaturan.php` + parse semua field
- `fetchHeroSlides()` — fetch `hero_carousel.php`
- `handleSaveAll()` — gabungkan semua field + heroBg file → POST ke `pengaturan.php`
- Handler medsos: `handleOpenAddModal`, `handleOpenEditModal`, `handleDeleteMedsos`, `handleSaveMedsosItem`, `handleSaveMedsosImmediate`
- Handler hero carousel: `handleOpenAddHero`, `handleOpenEditHero`, `handleDeleteHero`, `handleSaveHero`, drag-drop + save order
- Handler heroBg crop: `handleHeroBgFileChange`, `handleHeroBgCropConfirm`, `handleHeroBgCropCancel`
- Handler hero carousel crop: `handleHeroFileChange`, `handleHeroReCrop`, `handleHeroCropConfirm`, `handleHeroCropCancel`
- `updateSection`, `handleSectionDragStart/Over/Drop` (homepage sections)
- State modal: `modalOpen`, `modalMode` (add/edit), `heroModalOpen`, `heroCropOpen`, `heroBgCropOpen` + corresponding refs

**Return type:**
```ts
{
  // State (values)
  tahunAjaran, setTahunAjaran, linkPpdb, setLinkPpdb, emailSekolah, setEmailSekolah,
  teleponSekolah, setTeleponSekolah, whatsappSekolah, setWhatsappSekolah,
  alamatSekolah, setAlamatSekolah, medsosList,
  heroSlides, homepageSections, setHomepageSections,
  heroTitle, setHeroTitle, heroSubtitle, setHeroSubtitle,
  heroBg, heroBgPreview, videoUrl, setVideoUrl,
  profilVisi, setProfilVisi, profilMisiInput, setProfilMisiInput,
  profilSejarah, setProfilSejarah,
  loading, saving, message, setMessage,
  // Medsos modal
  medsosModalOpen, medsosEditingItem, medsosFormData,
  handleMedsosFormChange, handleOpenAddMedsos, handleOpenEditMedsos,
  handleDeleteMedsos, handleSaveMedsosItem, setMedsosModalOpen,
  // Hero carousel modal
  heroModalOpen, heroEditing, heroCaption, heroTag, heroUrutan,
  heroPreview, heroCropOpen, heroCropSrc,
  setHeroCaption, setHeroTag, setHeroUrutan,
  handleHeroFileChange, handleHeroReCrop, handleHeroCropConfirm, handleHeroCropCancel,
  handleOpenAddHero, handleOpenEditHero, handleDeleteHero, handleSaveHero,
  setHeroModalOpen,
  // Hero BG crop
  heroBgCropOpen, heroBgCropSrc,
  handleHeroBgFileChange, handleHeroBgCropConfirm, handleHeroBgCropCancel,
  // Section reorder
  handleSectionDragStart, handleSectionDragOver, handleSectionDrop, updateSection,
  // Hero carousel drag-drop
  handleHeroDragStart, handleHeroDragOver, handleHeroDrop, draggedHeroIndex,
  // Save
  handleSaveAll,
}
```

### 4. `src/CMS/pengaturan/Sections/PpdbSection.tsx`
- Props: `tahunAjaran | setTahunAjaran | linkPpdb | setLinkPpdb`
- Render: grid 2 kolom — input tahun ajaran + input link PPDB
- JSX dipotong dari baris ~821-879 file asli

### 5. `src/CMS/pengaturan/Sections/KontakSection.tsx`
- Props: `emailSekolah | setEmailSekolah | teleponSekolah | setTeleponSekolah | whatsappSekolah | setWhatsappSekolah | alamatSekolah | setAlamatSekolah`
- JSX dipotong dari baris ~983-1051

### 6. `src/CMS/pengaturan/Sections/MedsosSection.tsx`
- Props: `medsosList | onAdd | onEdit | onDelete`
- Render: grid medsos + tombol "Tambah Media Sosial"
- JSX dipotong dari baris ~1053-1131

### 7. `src/CMS/pengaturan/Sections/HeroCarouselSection.tsx`
- Props: `heroSlides | onAdd | onEdit | onDelete | onDragStart | onDragOver | onDrop | draggedIndex`
- Render: grid foto hero + tombol "Tambah Foto Hero" + drag-drop indicator
- JSX dipotong dari baris ~881-980

### 8. `src/CMS/pengaturan/Sections/StrukturHalamanUtamaSection.tsx`
- Props: `homepageSections | onReorder | onUpdate | onDragStart | onDragOver | onDrop | draggedIndex`
- Render: daftar section dengan toggle aktif + input judul/subjudul + drag handle
- JSX dipotong dari baris ~612-678

### 9. `src/CMS/pengaturan/Sections/KontenUtamaSection.tsx`
- Props: `heroTitle | setHeroTitle | heroSubtitle | setHeroSubtitle | videoUrl | setVideoUrl | profilVisi | setProfilVisi | profilMisiInput | setProfilMisiInput | profilSejarah | setProfilSejarah`
- Render: 2 kolom — bagian Hero (title/subtitle) + bagian Video & Profil (URL, visi, misi, sejarah) + YouTube preview
- JSX dipotong dari baris ~680-807
- `getYoutubeId` di-import dari `../utils/youtube`

### 10. `src/CMS/pengaturan/Modals/HeroCarouselModal.tsx`
- Props: `open | editing | caption | tag | urutan | preview | onChangeCaption | onChangeTag | onChangeUrutan | onFileChange | onReCrop | onSave | onClose`
- Render: modal overlay + form upload foto + caption + tag + urutan
- JSX dipotong dari baris ~1134-1255

### 11. `src/CMS/pengaturan/Modals/MedsosModal.tsx`
- Props: `open | editing | formData | onChange | onSave | onClose`
- Render: modal overlay + form nama + url + icon select + preview icon
- JSX dipotong dari baris ~1269-1370

### 12. `src/CMS/pengaturan/index.tsx` (PengaturanSekolah utama)
~200-250 baris:
1. Import `usePengaturanData` + semua Section + Modals + `ImageCropModal`
2. Destructuring dari hook
3. `useEffect(() => { fetchSettings(); fetchHeroSlides(); }, [])`
4. Filter buttons + top header (Simpan Semua)
5. Conditional render per section berdasarkan `activeFilter`
6. Render `ImageCropModal` (hero crop + heroBg crop)
7. Render `HeroCarouselModal`
8. Render `MedsosModal`

---

## Yang tidak berubah (behavior-preserving)
- Satu tombol **"Simpan Semua"** → mengirim semua key + hero_bg file ke `pengaturan.php`
- Drag-and-drop urutan (hero carousel & homepage section)
- Flow crop `ImageCropModal` (16:9, 1920×1080) untuk hero & hero_bg
- `getYoutubeId` — nama & perilaku identik
- Tidak ada perubahan backend/PHP

---

## Konvensi yang dijaga
- Path relatif (`../../config/api`, `../../components/common/SocialMediaIcon`, dsb.) — tanpa alias `@/`
- Teks UI Bahasa Indonesia
- Nama/folder konsisten dengan `src/CMS/statistik/`, `src/CMS/guru/`, `src/CMS/berita/`
- Import modals & sections pakai path relatif

---

## File yang diubah/ditambah

| File | Status |
|---|---|
| `src/CMS/pengaturan/types.ts` | **Baru** |
| `src/CMS/pengaturan/utils/youtube.ts` | **Baru** |
| `src/CMS/pengaturan/hooks/usePengaturanData.ts` | **Baru** |
| `src/CMS/pengaturan/Sections/PpdbSection.tsx` | **Baru** |
| `src/CMS/pengaturan/Sections/KontakSection.tsx` | **Baru** |
| `src/CMS/pengaturan/Sections/MedsosSection.tsx` | **Baru** |
| `src/CMS/pengaturan/Sections/HeroCarouselSection.tsx` | **Baru** |
| `src/CMS/pengaturan/Sections/StrukturHalamanUtamaSection.tsx` | **Baru** |
| `src/CMS/pengaturan/Sections/KontenUtamaSection.tsx` | **Baru** |
| `src/CMS/pengaturan/Modals/HeroCarouselModal.tsx` | **Baru** |
| `src/CMS/pengaturan/Modals/MedsosModal.tsx` | **Baru** |
| `src/CMS/pengaturan/index.tsx` | **Baru** (pengganti `PengaturanSekolah.tsx` lama) |
| `src/CMS/Dashboard.tsx` | **Modifikasi** — import path berubah ke `./pengaturan` |
| `src/CMS/PengaturanSekolah.tsx` | **Dihapus** (digantikan `pengaturan/index.tsx`) |

---

## Verifikasi
1. `npm run lint` (tsc) — pastikan typecheck lolos.
2. `npm run build` — pastikan build berhasil.
3. Uji manual dev server:
   - Pindah-pindah tab filter → semua section tampil sesuai filter.
   - **Simpan Semua** → semua field berhasil tersimpan + reload tetap konsisten.
   - Tambah/edit/hapus medsos → otomatis tersimpan.
   - Upload + crop + reorder hero carousel → tersimpan.
   - Toggle/urut section homepage → tersimpan.
   - Edit konten utama (hero title, video, visi/misi/sejarah) → tersimpan.
   - Upload hero background → crop + preview berfungsi.
   - Identik dengan perilaku sebelum refactor.
