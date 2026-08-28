import React, { useState, useMemo, useEffect } from 'react';
import { Image, Search, ArrowUpDown, X } from 'lucide-react';
import { GalleryItem } from '../types';
import { useGalleryData } from '../hooks/useGalleryData';
import { GalleryCategoryFilter } from './gallery/GalleryCategoryFilter';
import { GalleryGrid } from './gallery/GalleryGrid';
import { PhotoLightboxModal } from './gallery/PhotoLightboxModal';
import { Pagination } from './common/Pagination';

const ITEMS_PER_PAGE = 6;

export const GallerySection: React.FC = () => {
  const galleryItems = useGalleryData();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'terbaru' | 'terlama'>('terbaru');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(galleryItems.map((item) => item.category).filter(Boolean)));
    return ['Semua', ...unique];
  }, [galleryItems]);

  const filteredAndSortedGallery = useMemo(() => {
    let result = galleryItems;

    // Filter Kategori
    if (selectedCategory !== 'Semua') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Filter Pencarian
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q))
      );
    }

    // Pengurutan Tanggal & ID
    return [...result].sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      if (sortOrder === 'terlama') {
        return dateA - dateB;
      }
      return dateB - dateA;
    });
  }, [galleryItems, selectedCategory, searchTerm, sortOrder]);

  // Reset pagination on filter / search / sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortOrder]);

  // Adjust page if current page exceeds max page
  useEffect(() => {
    const maxPage = Math.ceil(filteredAndSortedGallery.length / ITEMS_PER_PAGE) || 1;
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [filteredAndSortedGallery.length, currentPage]);

  // Paginated slice
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedGallery.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedGallery, currentPage]);

  return (
    <section id="gallery-section" className="relative w-full py-16 sm:py-24 bg-gradient-to-b from-white via-teal-50/30 to-white overflow-hidden transition-colors">
      {/* Decorative subtle ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-[#028C84] font-bold text-xs uppercase tracking-wider bg-teal-50/80 border border-teal-200/80 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-md">
            <Image className="w-4 h-4 text-[#028C84]" />
            Dokumentasi Sekolah
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[black] tracking-tight">
            Galeri Kegiatan &amp; Fasilitas
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Potret momen kebersamaan, ragam aktivitas siswa, dan suasana lingkungan di SD Negeri 1 Mulyoagung
          </p>
        </div>

        {/* Toolbar: Search, Filter, and Sort */}
        <div className="bg-white/80 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari foto atau kegiatan..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-xs sm:text-sm text-slate-700 placeholder-slate-400 shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                title="Hapus pencarian"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort Order Selector */}
          <div className="flex items-center gap-2 self-end md:self-center">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <ArrowUpDown size={14} className="text-teal-600" />
              <span>Urutan:</span>
            </div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'terbaru' | 'terlama')}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer shadow-sm"
            >
              <option value="terbaru">Terbaru Dahulu</option>
              <option value="terlama">Terlama Dahulu</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <GalleryCategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Grid & Empty state */}
        {filteredAndSortedGallery.length > 0 ? (
          <GalleryGrid items={paginatedItems} onSelectPhoto={setActivePhoto} />
        ) : (
          <div className="bg-white p-8 sm:p-12 rounded-3xl text-center border border-slate-100 space-y-2 shadow-sm">
            <p className="text-slate-600 font-semibold text-base">Tidak ada dokumentasi foto yang ditemukan</p>
            <p className="text-slate-400 text-xs sm:text-sm">Coba sesuaikan kata kunci pencarian atau kategori filter.</p>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredAndSortedGallery.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={(page) => {
            setCurrentPage(page);
            const el = document.getElementById('gallery-section');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        />
      </div>

      <PhotoLightboxModal photo={activePhoto} onClose={() => setActivePhoto(null)} />
    </section>
  );
};

