export const GALLERY_CATEGORIES = ['Semua', 'Kegiatan', 'Pembelajaran', 'Prestasi', 'Ektrakulikuler', 'Acara Khusus'];

export const DEFAULT_GALLERY_IMAGE =
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800';

// API menyimpan kategori dengan label berbeda dari yang ditampilkan di UI,
// jadi perlu dipetakan: "Kegiatan Sekolah" -> "Kegiatan", "Ekstrakurikuler" -> "Pembelajaran"
export const mapApiGalleryCategory = (apiCategory: string): string => {
  if (apiCategory === 'Kegiatan Sekolah') return 'Kegiatan';
  if (apiCategory === 'Ekstrakurikuler') return 'Pembelajaran';
  return apiCategory;
};
