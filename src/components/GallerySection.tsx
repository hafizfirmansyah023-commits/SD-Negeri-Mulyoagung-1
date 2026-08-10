import React, { useState } from 'react';
import { Image } from 'lucide-react';
import { GalleryItem } from '../types';
import { useGalleryData } from '../hooks/useGalleryData';
import { GALLERY_CATEGORIES } from '../utils/galleryHelpers';
import { GalleryCategoryFilter } from './gallery/GalleryCategoryFilter';
import { GalleryGrid } from './gallery/GalleryGrid';
import { PhotoLightboxModal } from './gallery/PhotoLightboxModal';

export const GallerySection: React.FC = () => {
  const galleryItems = useGalleryData();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const filteredGallery =
    selectedCategory === 'Semua' ? galleryItems : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <section className="relative w-full py-16 sm:py-24 bg-gradient-to-b from-white via-teal-50/30 to-white overflow-hidden transition-colors">
      {/* Decorative subtle ambient glows matching DirectorySection */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-[#028C84] font-bold text-xs uppercase tracking-wider bg-teal-50/80 border border-teal-200/80 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-md">
            <Image className="w-4 h-4 text-[#028C84]" />
            Dokumentasi Sekolah
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[black] tracking-tight">
            Galeri Kegiatan & Fasilitas
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Potret momen kebersamaan, ragam aktivitas siswa, dan suasana lingkungan di SD Negeri 1 Mulyoagung
          </p>
        </div>

        <GalleryCategoryFilter
          categories={GALLERY_CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <GalleryGrid items={filteredGallery} onSelectPhoto={setActivePhoto} />
      </div>

      <PhotoLightboxModal photo={activePhoto} onClose={() => setActivePhoto(null)} />
    </section>
  );
};
