# Plan: Perbaikan RichTextEditor & Rendering HTML

## Masalah yang Ditemukan

### 1. `<b>` tag muncul di halaman utama (NewsSection)
**Penyebab:** `NewsSection.tsx:51` mengambil substring dari `art.isi` (HTML dari RichTextEditor) lalu di-render sebagai plain text di line 175. Jika berita ditulis dengan `<b>teks</b>`, summary akan menampilkan literal `<b>teks`.

Sama di `NewsDetailModal.tsx:75` — summary juga render plain text.

### 2. RichTextEditor belum ada di Fasilitas & Galeri
- `FasilitasFormModal.tsx:71` — textarea biasa untuk `deskripsi`
- `GaleriFormModal.tsx:108` — textarea biasa untuk `deskripsi`

### 3. Gallery description render plain text
- `GalleryCard.tsx:53` — `{item.description}`
- `PhotoLightboxModal.tsx:74` — `{photo.description}`

---

## Solusi

### A. Berita Summary — Strip HTML Tags

Buat helper function `stripHtml(html: string): string` untuk menghapus semua HTML tags dan mengembalikan teks polos. Fungsi ini digunakan untuk:
1. Summary card di `NewsSection.tsx`
2. Summary di `NewsDetailModal.tsx:75`

**Pendekatan:** Gunakan `DOMParser` untuk parse HTML, ambil `textContent`, lalu truncate.

```ts
function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}
```

Di `NewsSection.tsx`:
- Ubah mapping summary jadi `stripHtml(art.isi)`
- Render `{article.summary.substring(0, 120)}...` di card

Di `NewsDetailModal.tsx`:
- Render summary dengan `stripHtml(article.content)` atau tetap plain text

### B. Tambah RichTextEditor ke Fasilitas & Galeri

#### `src/CMS/fasilitas/FasilitasFormModal.tsx`
- Import `RichTextEditor`
- Ganti `<textarea>` deskripsi (line 71) jadi `<RichTextEditor value={deskripsi} onChange={setDeskripsi} />`

#### `src/CMS/galeri/GaleriFormModal.tsx`
- Import `RichTextEditor`
- Ganti `<textarea>` deskripsi (line 108) jadi `<RichTextEditor value={deskripsi} onChange={setDeskripsi} />`

### C. Render HTML di Public Side

#### `src/components/SchoolProfileSection.tsx`
- **Card** (line 243-244): Ganti `{fac.deskripsi}` jadi `<p dangerouslySetInnerHTML={{ __html: fac.deskripsi }} />`
- **Modal** (line 292-293): Ganti `{selectedFacility.deskripsi}` jadi `<div dangerouslySetInnerHTML={{ __html: selectedFacility.deskripsi }} />`

#### `src/components/gallery/GalleryCard.tsx`
- Line 52-53: Ganti `{item.description}` jadi `<p dangerouslySetInnerHTML={{ __html: item.description }} />`

#### `src/components/gallery/PhotoLightboxModal.tsx`
- Line 73-74: Ganti `{photo.description}` jadi `<div dangerouslySetInnerHTML={{ __html: photo.description }} />`
- Hapus class `whitespace-pre-line` (tidak perlu lagi untuk HTML)

---

## File yang Diubah

| # | File | Perubahan |
|---|------|-----------|
| 1 | `src/utils/helpers.ts` (NEW) | Buat function `stripHtml()` |
| 2 | `src/components/NewsSection.tsx` | Import `stripHtml`, render summary tanpa HTML tags |
| 3 | `src/components/NewsDetailModal.tsx` | Render summary dengan `stripHtml()` |
| 4 | `src/CMS/fasilitas/FasilitasFormModal.tsx` | Ganti textarea → RichTextEditor |
| 5 | `src/CMS/galeri/GaleriFormModal.tsx` | Ganti textarea → RichTextEditor |
| 6 | `src/components/SchoolProfileSection.tsx` | Render deskripsi fasilitas dengan `dangerouslySetInnerHTML` |
| 7 | `src/components/gallery/GalleryCard.tsx` | Render deskripsi galeri dengan `dangerouslySetInnerHTML` |
| 8 | `src/components/gallery/PhotoLightboxModal.tsx` | Render deskripsi galeri dengan `dangerouslySetInnerHTML` |

---

## Risk & Notes

- `dangerouslySetInnerHTML` aman karena konten ditulis oleh admin CMS sendiri (bukan user input publik).
- Data lama fasilitas/galeri yang masih plain text akan tetap render dengan benar (tanpa tag HTML = tampil sebagai teks biasa).
- RichTextEditor yang ada saat ini sudah cukup (bold, italic, underline, align, list, clear). Tidak perlu tambah library baru.

---

## Status

- [ ] Buat `src/utils/helpers.ts` dengan `stripHtml()`
- [ ] Fix `src/components/NewsSection.tsx` — strip HTML di summary
- [ ] Fix `src/components/NewsDetailModal.tsx` — strip HTML di summary
- [ ] Tambah RichTextEditor ke `src/CMS/fasilitas/FasilitasFormModal.tsx`
- [ ] Tambah RichTextEditor ke `src/CMS/galeri/GaleriFormModal.tsx`
- [ ] Fix `src/components/SchoolProfileSection.tsx` — dangerouslySetInnerHTML untuk deskripsi
- [ ] Fix `src/components/gallery/GalleryCard.tsx` — dangerouslySetInnerHTML untuk deskripsi
- [ ] Fix `src/components/gallery/PhotoLightboxModal.tsx` — dangerouslySetInnerHTML untuk deskripsi
- [ ] Typecheck (`npm run lint`)
