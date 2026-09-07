import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Building2,
  Search,
  RotateCcw,
  X,
  ArrowRight,
  Monitor,
  BookOpen,
  Activity,
  HeartPulse,
  Coffee,
  Trees,
  Sparkles,
  Layers,
} from 'lucide-react';
import { getApiBaseUrl, getImageUrl } from '../config/api';
import { Pagination } from './common/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import { SCHOOL_FACILITIES } from '../data/schoolData';

const ITEMS_PER_PAGE = 6;

export interface FasilitasItem {
  id: number | string;
  judul: string;
  deskripsi: string;
  foto?: string | null;
  foto_crop?: string | null;
  image?: string;
}

interface FasilitasSectionProps {
  onViewAllClick?: () => void;
  isHomepagePreview?: boolean;
}

export const FasilitasSection: React.FC<FasilitasSectionProps> = ({
  onViewAllClick,
  isHomepagePreview = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState<FasilitasItem[]>(() =>
    SCHOOL_FACILITIES.map((f) => ({
      id: f.id,
      judul: f.name,
      deskripsi: f.description,
      image: f.image,
    }))
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFacility, setSelectedFacility] = useState<FasilitasItem | null>(null);

  // Load facilities from backend API
  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${getApiBaseUrl()}/backend/API/fasilitas.php`);
        const json = await res.json();
        if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
          setFacilities(json.data);
        }
      } catch {
        // Fallback remains SCHOOL_FACILITIES
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedFacility) {
      const prevBody = document.body.style.overflow;
      const prevHtml = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevBody;
        document.documentElement.style.overflow = prevHtml;
      };
    }
  }, [selectedFacility]);

  // Handle direct navigation with location.state (e.g. from search)
  useEffect(() => {
    const state = location.state as { openFasilitas?: string | number } | null;
    if (state?.openFasilitas && facilities.length > 0) {
      const found = facilities.find((f) => String(f.id) === String(state.openFasilitas));
      if (found) {
        setSelectedFacility(found);
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [facilities, location, navigate]);

  const getFacilityIconByTitle = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('lab') || t.includes('komputer') || t.includes('tik') || t.includes('coding') || t.includes('multimedia')) {
      return <Monitor className="w-5 h-5 text-[#028C84]" />;
    }
    if (t.includes('pustaka') || t.includes('buku') || t.includes('baca') || t.includes('literasi')) {
      return <BookOpen className="w-5 h-5 text-[#028C84]" />;
    }
    if (t.includes('lapangan') || t.includes('olahraga') || t.includes('futsal') || t.includes('basket') || t.includes('senam') || t.includes('fisik')) {
      return <Activity className="w-5 h-5 text-[#028C84]" />;
    }
    if (t.includes('uks') || t.includes('sehat') || t.includes('kesehatan') || t.includes('poliklinik') || t.includes('medis')) {
      return <HeartPulse className="w-5 h-5 text-[#028C84]" />;
    }
    if (t.includes('kantin') || t.includes('makan') || t.includes('gizi') || t.includes('kuliner') || t.includes('minum')) {
      return <Coffee className="w-5 h-5 text-[#028C84]" />;
    }
    if (t.includes('taman') || t.includes('green') || t.includes('kebun') || t.includes('adiwiyata') || t.includes('pohon') || t.includes('hidroponik')) {
      return <Trees className="w-5 h-5 text-[#028C84]" />;
    }
    if (t.includes('musa') || t.includes('masjid') || t.includes('agama') || t.includes('ibadah')) {
      return <Sparkles className="w-5 h-5 text-[#028C84]" />;
    }
    return <Building2 className="w-5 h-5 text-[#028C84]" />;
  };

  const filteredFacilities = useMemo(() => {
    let result = facilities;

    if (debouncedSearch.trim() !== '') {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (f) =>
          (f.judul && f.judul.toLowerCase().includes(q)) ||
          (f.deskripsi && f.deskripsi.toLowerCase().includes(q))
      );
    }

    return result;
  }, [facilities, debouncedSearch]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Adjust page if current page exceeds max page
  useEffect(() => {
    const maxPage = Math.ceil(filteredFacilities.length / ITEMS_PER_PAGE) || 1;
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [filteredFacilities.length, currentPage]);

  const displayList = useMemo(() => {
    if (isHomepagePreview) {
      return filteredFacilities.slice(0, 3);
    }
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFacilities.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredFacilities, currentPage, isHomepagePreview]);

  const isFiltered = searchTerm.trim() !== '';

  const handleReset = () => {
    setSearchTerm('');
  };

  return (
    <section id="fasilitas-section" className="relative w-full py-14 sm:py-20 bg-gradient-to-b from-white via-teal-50/30 to-white overflow-hidden transition-colors">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[#028C84] font-bold text-xs uppercase tracking-wider bg-teal-50/80 border border-teal-200/80 px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-md">
              <Building2 className="w-4 h-4 text-[#028C84]" />
              Sarana &amp; Prasarana Pembelajaran
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Fasilitas SD Negeri 1 Mulyoagung
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Mendukung tumbuh kembang dan kreativitas peserta didik dengan fasilitas belajar yang lengkap, aman, dan nyaman.
            </p>
          </div>

          {isHomepagePreview && onViewAllClick && (
            <button
              onClick={onViewAllClick}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-900 transition-colors group self-start md:self-auto cursor-pointer"
            >
              <span>Lihat Semua Fasilitas</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Filter & Search Bar (Full Page Mode) */}
        {!isHomepagePreview && (
          <div className="bg-white/85 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari fasilitas sekolah, laboratorium, perpustakaan, lapangan..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-xs sm:text-sm text-slate-700 placeholder-slate-400 shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={handleReset}
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
                <RotateCcw size={14} /> Reset Pencarian
              </button>
            )}
          </div>
        )}

        {/* Facilities Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayList.map((fac) => {
              const imageSrc = fac.foto
                ? getImageUrl(fac.foto)
                : fac.image || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=600';

              return (
                <article
                  key={fac.id}
                  onClick={() => setSelectedFacility(fac)}
                  className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-200/80 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                >
                  <div>
                    {/* Image Area */}
                    <div className="relative h-44 sm:h-52 bg-slate-100 overflow-hidden">
                      <img
                        src={imageSrc}
                        alt={fac.judul}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-sm border border-white/80">
                        {getFacilityIconByTitle(fac.judul)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 space-y-2">
                      <h3 className="font-bold text-slate-800 text-base sm:text-lg leading-tight line-clamp-1 group-hover:text-[#028C84] transition-colors">
                        {fac.judul}
                      </h3>
                      <div
                        className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed break-words"
                        dangerouslySetInnerHTML={{ __html: fac.deskripsi }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[11px] font-medium text-slate-400">Fasilitas Resmi</span>
                    <div className="flex items-center gap-1 text-teal-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                      <span className="text-[11px] group-hover:underline">Lihat Detail</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </article>
              );
            })}

            {filteredFacilities.length === 0 && (
              <div className="col-span-full bg-white p-8 sm:p-12 rounded-3xl text-center border border-slate-100 space-y-2 shadow-sm">
                <Building2 size={48} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-700 font-bold text-base">Tidak ada fasilitas yang ditemukan</p>
                <p className="text-slate-400 text-xs sm:text-sm">Coba gunakan kata kunci pencarian yang lain.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination (Full Page Mode) */}
        {!isHomepagePreview && (
          <Pagination
            currentPage={currentPage}
            totalItems={filteredFacilities.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={(page) => {
              setCurrentPage(page);
              const el = document.getElementById('fasilitas-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          />
        )}
      </div>

      {/* Modal Detail Fasilitas */}
      {selectedFacility &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto overscroll-contain animate-fade-in"
            onClick={() => setSelectedFacility(null)}
          >
            <div
              className="relative w-full max-w-3xl lg:max-w-4xl max-h-[90vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedFacility(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 sm:p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors border border-white/20 shadow-md cursor-pointer"
                aria-label="Tutup Detail"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Image Area */}
              <div className="w-full h-56 sm:h-80 md:h-96 overflow-hidden flex items-center justify-center bg-slate-100 relative shrink-0">
                <img
                  src={
                    selectedFacility.foto
                      ? getImageUrl(selectedFacility.foto)
                      : selectedFacility.image ||
                        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=600'
                  }
                  alt={selectedFacility.judul}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-2.5 sm:p-3.5 rounded-2xl shadow-lg border border-white/80">
                  {getFacilityIconByTitle(selectedFacility.judul)}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 sm:p-8 space-y-4 overflow-y-auto flex-1">
                <div className="space-y-1 border-b border-slate-100 pb-3">
                  <div className="inline-flex items-center gap-1.5 text-[#028C84] text-xs font-bold uppercase tracking-wider">
                    <Layers size={14} /> Fasilitas &amp; Sarana Sekolah
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                    {selectedFacility.judul}
                  </h3>
                </div>

                <div
                  className="prose max-w-none text-slate-700 text-xs sm:text-base leading-relaxed break-words"
                  dangerouslySetInnerHTML={{ __html: selectedFacility.deskripsi }}
                />
              </div>

              {/* Modal Footer */}
              <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-6">
                <span>SD Negeri 1 Mulyoagung</span>
                <button
                  onClick={() => setSelectedFacility(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold cursor-pointer transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};
