import React, { useState } from 'react';
import { GALLERY_ITEMS } from '../data/schoolData';
import { Image, X, Calendar, Maximize2 } from 'lucide-react';
import { GalleryItem } from '../types';

export const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = ['Semua', 'Kegiatan', 'Pembelajaran', 'Prestasi', 'Fasilitas'];

  const filteredGallery =
    selectedCategory === 'Semua'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

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

        {/* Category Pill Filters */}
        <div className="flex justify-center">
          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-teal-50/60 border border-teal-100/80 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#028C84] to-[#156B63] text-white shadow-md shadow-teal-700/20 scale-[1.02]'
                    : 'text-slate-600 hover:text-[#028C84] hover:bg-white/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Image Grid Liquid Glass Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group relative h-64 sm:h-72 rounded-3xl overflow-hidden cursor-pointer shadow-[0_8px_25px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(2,140,132,0.18)] hover:border-teal-300/80 transition-all duration-300 border border-white/80 flex flex-col justify-end"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

              <div className="absolute top-4 right-4 bg-white/25 backdrop-blur-md text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg border border-white/30 transform translate-y-1 group-hover:translate-y-0">
                <Maximize2 className="w-4 h-4" />
              </div>

              <div className="relative z-10 p-5 text-white space-y-2">
                <span className="bg-[#028C84] text-white text-[10px] font-bold px-3 py-0.5 rounded-full inline-block shadow-sm">
                  {item.category}
                </span>
                <h3 className="text-base font-bold leading-snug line-clamp-1 group-hover:text-teal-200 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-950/80 hover:bg-slate-950 text-white transition-colors border border-white/20 cursor-pointer"
              aria-label="Tutup Foto"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[75vh] w-full overflow-hidden flex items-center justify-center bg-black">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 bg-slate-900 text-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="bg-[#028C84] text-white text-xs font-bold px-3 py-1 rounded-full">
                  {activePhoto.category}
                </span>
                <span className="text-xs text-slate-400">{activePhoto.date}</span>
              </div>
              <h3 className="text-xl font-bold">{activePhoto.title}</h3>
              <p className="text-sm text-slate-300">{activePhoto.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
