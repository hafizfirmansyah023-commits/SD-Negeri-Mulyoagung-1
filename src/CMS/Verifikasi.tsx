import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { getApiBaseUrl } from '../config/api';
import { useCmsFilter } from './hooks/useCmsFilter';
import CmsFilterBar from './components/CmsFilterBar';
import { getUniqueValues } from './utils/cmsHelpers';
import { VerifikasiCard } from './verifikasi/VerifikasiCard';
import { Pagination } from '../components/common/Pagination';

interface GalleryItem {
  id: number;
  judul: string;
  deskripsi: string;
  foto: string;
  kategori: string;
  tanggal: string;
  status_verifikasi: 'Pending' | 'Verified' | 'Rejected';
  uploader: string;
}

interface NewsArticle {
  id: number;
  judul: string;
  isi: string;
  foto: string;
  kategori: string;
  tanggal: string;
  status_verifikasi: 'Pending' | 'Verified' | 'Rejected';
  uploader: string;
}

interface ModulItem {
  id: number;
  judul: string;
  deskripsi: string;
  foto?: string;
  foto_cover?: string;
  kategori: string;
  mata_pelajaran: string;
  kelas: string;
  tahun_ajaran: string;
  status?: 'Draft' | 'Published';
  status_verifikasi: 'Pending' | 'Verified' | 'Rejected';
  uploader: string;
}

const API_BASE = getApiBaseUrl();
const ITEMS_PER_PAGE = 6;

export default function Verifikasi() {
  const [pendingGallery, setPendingGallery] = useState<GalleryItem[]>([]);
  const [pendingNews, setPendingNews] = useState<NewsArticle[]>([]);
  const [pendingModules, setPendingModules] = useState<ModulItem[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'berita' | 'galeri' | 'modul'>('berita');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  const fetchPendingData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch news
      const resNews = await fetch(`${API_BASE}/backend/API/newsAPI.php?status=all`);
      const newsResult = await resNews.json();
      if (newsResult.status === 'success') {
        const pendingArticles = newsResult.data.filter((item: NewsArticle) => item.status_verifikasi === 'Pending');
        setPendingNews(pendingArticles);
      }

      // Fetch gallery
      const resGallery = await fetch(`${API_BASE}/backend/API/galeri.php?status=all`);
      const galResult = await resGallery.json();
      if (galResult.status === 'success') {
        const pendingItems = galResult.data.filter((item: GalleryItem) => item.status_verifikasi === 'Pending');
        setPendingGallery(pendingItems);
      }

      // Fetch modules
      const resModul = await fetch(`${API_BASE}/backend/API/modul_pembelajaran.php?status=all`);
      const modResult = await resModul.json();
      if (modResult.status === 'success') {
        const pendingMods = modResult.data.filter((item: ModulItem) => item.status_verifikasi === 'Pending');
        setPendingModules(pendingMods);
      }
    } catch {
      setError('Gagal memuat data verifikasi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingData();
  }, [fetchPendingData]);

  // Filters for News
  const newsFilter = useCmsFilter<NewsArticle>({
    items: pendingNews,
    searchFields: ['judul', 'isi', 'uploader'],
    initialFilters: { kategori: 'ALL' },
  });

  // Filters for Gallery
  const galleryFilter = useCmsFilter<GalleryItem>({
    items: pendingGallery,
    searchFields: ['judul', 'deskripsi', 'uploader'],
    initialFilters: { kategori: 'ALL' },
  });

  // Filters for Modules
  const modulFilter = useCmsFilter<ModulItem>({
    items: pendingModules,
    searchFields: ['judul', 'deskripsi', 'mata_pelajaran', 'uploader'],
    initialFilters: { kategori: 'ALL' },
  });

  const activeFilter =
    activeSubTab === 'berita'
      ? newsFilter
      : activeSubTab === 'galeri'
      ? galleryFilter
      : modulFilter;

  // Reset page when tab or search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSubTab, activeFilter.searchTerm, activeFilter.filters]);

  // Adjust page if data is removed and current page exceeds max page
  useEffect(() => {
    const maxPage = Math.ceil(activeFilter.filteredItems.length / ITEMS_PER_PAGE) || 1;
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [activeFilter.filteredItems.length, currentPage]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return activeFilter.filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [activeFilter.filteredItems, currentPage]);

  const availableCategories =
    activeSubTab === 'berita'
      ? getUniqueValues(pendingNews, 'kategori')
      : activeSubTab === 'galeri'
      ? getUniqueValues(pendingGallery, 'kategori')
      : getUniqueValues(pendingModules, 'kategori');

  const handleVerifyNews = async (id: number, decision: 'Verified' | 'Rejected') => {
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('action', 'verify');
    formData.append('id', id.toString());
    formData.append('status_verifikasi', decision);

    try {
      const response = await fetch(`${API_BASE}/backend/API/newsAPI.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message);
        fetchPendingData();
      } else {
        setError(result.message);
      }
    } catch {
      setError('Gagal memproses verifikasi berita.');
    }
  };

  const handleVerifyGallery = async (id: number, decision: 'Verified' | 'Rejected') => {
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('action', 'verify');
    formData.append('id', id.toString());
    formData.append('status_verifikasi', decision);

    try {
      const response = await fetch(`${API_BASE}/backend/API/galeri.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message);
        fetchPendingData();
      } else {
        setError(result.message);
      }
    } catch {
      setError('Gagal memproses verifikasi galeri.');
    }
  };

  const handleVerifyModule = async (id: number, decision: 'Verified' | 'Rejected') => {
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('action', 'verify');
    formData.append('id', id.toString());
    formData.append('status_verifikasi', decision);

    try {
      const response = await fetch(`${API_BASE}/backend/API/modul_pembelajaran.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message);
        fetchPendingData();
      } else {
        setError(result.message);
      }
    } catch {
      setError('Gagal memproses verifikasi modul.');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ShieldAlert className="text-teal-600 shrink-0" /> Pusat Verifikasi Konten
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
          Verifikasi berita, foto galeri, dan modul pembelajaran yang diunggah oleh Tim &amp; Guru.
        </p>

        {/* Sub Navigation Tabs */}
        <div className="flex gap-4 mt-4 sm:mt-6 border-b border-slate-100 pb-px overflow-x-auto">
          <button
            onClick={() => {
              setActiveSubTab('berita');
              activeFilter.resetFilter();
            }}
            className={`pb-3 font-semibold text-xs sm:text-sm transition-all relative cursor-pointer whitespace-nowrap ${
              activeSubTab === 'berita' ? 'text-teal-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Antrean Berita ({pendingNews.length})
            {activeSubTab === 'berita' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveSubTab('galeri');
              activeFilter.resetFilter();
            }}
            className={`pb-3 font-semibold text-xs sm:text-sm transition-all relative cursor-pointer whitespace-nowrap ${
              activeSubTab === 'galeri' ? 'text-teal-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Antrean Galeri ({pendingGallery.length})
            {activeSubTab === 'galeri' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveSubTab('modul');
              activeFilter.resetFilter();
            }}
            className={`pb-3 font-semibold text-xs sm:text-sm transition-all relative cursor-pointer whitespace-nowrap ${
              activeSubTab === 'modul' ? 'text-teal-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Antrean Modul ({pendingModules.length})
            {activeSubTab === 'modul' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <CmsFilterBar
        searchTerm={activeFilter.searchTerm}
        onSearchChange={activeFilter.setSearchTerm}
        searchPlaceholder="Cari judul, pengirim..."
        isFiltered={activeFilter.isFiltered}
        onReset={activeFilter.resetFilter}
        selectFilters={[
          {
            key: 'kategori',
            value: activeFilter.filters.kategori || 'ALL',
            onChange: (val) => activeFilter.setFilter('kategori', val),
            options: [
              { value: 'ALL', label: 'Semua Kategori' },
              ...availableCategories.map((c) => ({ value: c, label: c })),
            ],
          },
        ]}
      />

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
      {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">{success}</div>}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* News Verification Queue */}
          {activeSubTab === 'berita' && (
            <div className="space-y-4">
              {(paginatedItems as NewsArticle[]).map((art) => (
                <VerifikasiCard
                  key={art.id}
                  id={art.id}
                  judul={art.judul}
                  deskripsiAtauIsi={art.isi}
                  foto={art.foto}
                  kategori={art.kategori}
                  fallbackLabel={art.kategori}
                  tanggal={art.tanggal}
                  uploader={art.uploader}
                  onVerify={handleVerifyNews}
                />
              ))}

              {newsFilter.filteredItems.length === 0 && (
                <div className="bg-white p-8 sm:p-12 rounded-2xl text-center border border-slate-100">
                  <CheckCircle2 size={48} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 font-medium text-sm">
                    {newsFilter.isFiltered ? 'Tidak ada antrean berita yang sesuai dengan filter.' : 'Tidak ada antrean verifikasi berita.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Gallery Verification Queue */}
          {activeSubTab === 'galeri' && (
            <div className="space-y-4">
              {(paginatedItems as GalleryItem[]).map((item) => (
                <VerifikasiCard
                  key={item.id}
                  id={item.id}
                  judul={item.judul}
                  deskripsiAtauIsi={item.deskripsi}
                  foto={item.foto}
                  kategori={item.kategori}
                  fallbackLabel={item.kategori}
                  tanggal={item.tanggal}
                  uploader={item.uploader}
                  onVerify={handleVerifyGallery}
                />
              ))}

              {galleryFilter.filteredItems.length === 0 && (
                <div className="bg-white p-8 sm:p-12 rounded-2xl text-center border border-slate-100">
                  <CheckCircle2 size={48} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 font-medium text-sm">
                    {galleryFilter.isFiltered ? 'Tidak ada antrean galeri yang sesuai dengan filter.' : 'Tidak ada antrean verifikasi galeri.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Modules Verification Queue */}
          {activeSubTab === 'modul' && (
            <div className="space-y-4">
              {(paginatedItems as ModulItem[]).map((mod) => (
                <VerifikasiCard
                  key={mod.id}
                  id={mod.id}
                  judul={mod.judul}
                  deskripsiAtauIsi={`${mod.mata_pelajaran} • ${mod.kelas} • ${mod.deskripsi || ''}`}
                  foto={mod.foto || mod.foto_cover || ''}
                  kategori={mod.kategori}
                  fallbackLabel={mod.mata_pelajaran}
                  isModule={true}
                  tanggal={mod.tahun_ajaran}
                  uploader={mod.uploader || 'Guru'}
                  statusBadge={
                    mod.status === 'Draft' ? (
                      <span className="bg-slate-800 text-amber-300 border border-amber-400/40 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        Draft
                      </span>
                    ) : (
                      <span className="bg-teal-600 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                        Published
                      </span>
                    )
                  }
                  onVerify={handleVerifyModule}
                />
              ))}

              {modulFilter.filteredItems.length === 0 && (
                <div className="bg-white p-8 sm:p-12 rounded-2xl text-center border border-slate-100">
                  <CheckCircle2 size={48} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 font-medium text-sm">
                    {modulFilter.isFiltered ? 'Tidak ada antrean modul yang sesuai dengan filter.' : 'Tidak ada antrean verifikasi modul pembelajaran.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={activeFilter.filteredItems.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}
    </div>
  );
}

