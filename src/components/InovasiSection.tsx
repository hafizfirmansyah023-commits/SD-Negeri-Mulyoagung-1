import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lightbulb, Search, RotateCcw, X, ArrowRight } from 'lucide-react';
import { useInovasiData } from '../hooks/useInovasiData';
import { InovasiCard } from './inovasi/InovasiCard';
import { Pagination } from './common/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import { InovasiItem } from '../types';

const ITEMS_PER_PAGE = 6;

interface InovasiSectionProps {
  onViewAllClick?: () => void;
  isHomepagePreview?: boolean;
}

export const InovasiSection: React.FC<InovasiSectionProps> = ({
  onViewAllClick,
  isHomepagePreview = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { inovasiList, loading } = useInovasiData();
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);

  // Handle direct navigation from search
  useEffect(() => {
    const state = location.state as { openInovasi?: string | number } | null;
    if (state?.openInovasi && inovasiList.length > 0) {
      const found = inovasiList.find((i) => String(i.id) === String(state.openInovasi));
      if (found) {
        setSearchTerm(found.judul);
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [inovasiList, location, navigate]);

  const availableKategori = useMemo(
    () => ['Semua', ...Array.from(new Set(inovasiList.map((i: InovasiItem) => i.kategori).filter(Boolean)))],
    [inovasiList]
  );

  const filteredInovasi = useMemo(() => {
    let result = inovasiList;

    if (selectedKategori !== 'Semua') {
      result = result.filter((i: InovasiItem) => i.kategori === selectedKategori);
    }

    if (debouncedSearch.trim() !== '') {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (i: InovasiItem) =>
          (i.judul && i.judul.toLowerCase().includes(q)) ||
          (i.deskripsi && i.deskripsi.toLowerCase().includes(q)) ||
          (i.kategori && i.kategori.toLowerCase().includes(q)) ||
          (i.inovator && i.inovator.toLowerCase().includes(q)) ||
          (i.uploader && i.uploader.toLowerCase().includes(q))
      );
    }

    return result;
  }, [inovasiList, selectedKategori, debouncedSearch]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedKategori, debouncedSearch]);

  // Adjust page if current page exceeds max page
  useEffect(() => {
    const maxPage = Math.ceil(filteredInovasi.length / ITEMS_PER_PAGE) || 1;
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [filteredInovasi.length, currentPage]);

  const displayList = useMemo(() => {
    if (isHomepagePreview) {
      return filteredInovasi.slice(0, 3);
    }
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredInovasi.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredInovasi, currentPage, isHomepagePreview]);

  const isFiltered = selectedKategori !== 'Semua' || searchTerm.trim() !== '';

  const handleReset = () => {
    setSelectedKategori('Semua');
    setSearchTerm('');
  };

  return (
    <section id="inovasi-section" className="relative w-full py-14 sm:py-20 bg-gradient-to-b from-white via-teal-50/30 to-white overflow-hidden transition-colors">
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-[#028C84] font-bold text-xs uppercase tracking-wider bg-teal-50/80 border border-teal-200/80 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-md">
            <Lightbulb className="w-4 h-4 text-[#028C84]" />
            Ruang Kreativitas &amp; Inovasi
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Inovasi SDN 1 Mulyoagung
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm sm:text-base leading-relaxed">
            Eksplorasi karya inovatif, media pembelajaran digital, dan program unggulan sekolah.
          </p>

          {isHomepagePreview && onViewAllClick && (
            <div className="pt-2">
              <button
                onClick={onViewAllClick}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-teal-50 hover:bg-teal-100/80 text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-900 border border-teal-200/80 transition-all group cursor-pointer shadow-xs"
              >
                <span>Lihat Semua Inovasi</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform text-teal-600" />
              </button>
            </div>
          )}
        </div>

        {/* Filter & Search Bar (Full Page Mode) */}
        {!isHomepagePreview && (
          <div className="bg-white/85 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            {/* Search Row */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari inovasi, topik, inovator, atau pelaksana..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-xs sm:text-sm text-slate-700 placeholder-slate-400 shadow-inner"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {isFiltered && (
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  <RotateCcw size={14} /> Reset Filter
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar touch-pan-x">
              {availableKategori.map((kategori: string) => {
                const isActive = selectedKategori === kategori;
                return (
                  <button
                    key={kategori}
                    onClick={() => setSelectedKategori(kategori)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {kategori}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Inovasi Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayList.map((item: InovasiItem) => (
              <InovasiCard key={item.id} item={item} />
            ))}

            {filteredInovasi.length === 0 && (
              <div className="col-span-full bg-white p-8 sm:p-12 rounded-2xl text-center border border-slate-100 space-y-2 shadow-sm">
                <Lightbulb size={48} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-700 font-bold text-base">Tidak ada inovasi yang ditemukan</p>
                <p className="text-slate-400 text-xs sm:text-sm">Silakan sesuaikan kriteria filter atau ubah kata kunci pencarian Anda.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination (Only for full page mode) */}
        {!isHomepagePreview && (
          <Pagination
            currentPage={currentPage}
            totalItems={filteredInovasi.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={(page: number) => {
              setCurrentPage(page);
              const el = document.getElementById('inovasi-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          />
        )}
      </div>
    </section>
  );
};
