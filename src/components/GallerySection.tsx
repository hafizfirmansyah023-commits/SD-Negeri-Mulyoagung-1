import React, { useState } from 'react';
import { GALLERY_ITEMS } from '../data/schoolData';
import { Image, X, Calendar, Tag, Maximize2 } from 'lucide-react';
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
    <section className="w-full py-16 sm:py-20 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-[#028C84] dark:text-teal-400 font-bold text-xs uppercase tracking-wider bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
            <Image className="w-4 h-4" />
            Dokumentasi Sekolah
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A8A] dark:text-blue-300">
            Galeri Kegiatan & Fasilitas
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Potret momen kebersamaan, ragam aktivitas siswa, dan suasana lingkungan di SD Negeri Mulyoagung 1
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1E3A8A] text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group relative h-64 sm:h-72 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
                <span className="bg-[#028C84] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block">
                  {item.category}
                </span>
                <h3 className="text-base font-bold leading-snug line-clamp-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-slate-300">
                  <Calendar className="w-3 h-3 text-teal-400" />
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
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-950/80 hover:bg-slate-950 text-white transition-colors border border-white/20"
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
