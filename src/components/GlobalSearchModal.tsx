import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  FileText,
  Image as ImageIcon,
  BookOpen,
  User,
  Lightbulb,
  GraduationCap,
  Building2,
  Sparkles,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { getApiBaseUrl, getImageUrl } from '../config/api';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchCategory = 'all' | 'berita' | 'galeri' | 'modul' | 'guru' | 'inovasi' | 'akademik' | 'fasilitas';

interface SearchResultsState {
  berita: Array<{ id: number | string; judul: string; kategori: string; tanggal: string; isi: string; foto?: string }>;
  galeri: Array<{ id: number | string; judul: string; kategori: string; tanggal: string; deskripsi: string; foto?: string }>;
  modul: Array<{ id: number; judul: string; deskripsi: string; mata_pelajaran: string; kelas: string; semester: string; kategori: string; foto?: string; uploader?: string }>;
  guru: Array<{ id: number | string; nama: string; jabatan: string; tugas: string; nip?: string; foto?: string }>;
  inovasi: Array<{ id: number | string; judul: string; kategori: string; inovator?: string; deskripsi?: string; link_drive?: string; foto?: string }>;
  akademik: Array<{ id: number; label: string; deskripsi?: string; parent_id?: number | null; parent_label?: string; link_gdrive?: string; is_modul?: number }>;
  fasilitas: Array<{ id: number; judul: string; deskripsi: string; foto?: string }>;
}

const initialResults: SearchResultsState = {
  berita: [],
  galeri: [],
  modul: [],
  guru: [],
  inovasi: [],
  akademik: [],
  fasilitas: [],
};

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [activeTab, setActiveTab] = useState<SearchCategory>('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResultsState>(initialResults);

  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search: 1000ms
  useEffect(() => {
    if (!searchTerm.trim()) {
      setDebouncedQuery('');
      setIsDebouncing(false);
      return;
    }

    setIsDebouncing(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(searchTerm.trim());
      setIsDebouncing(false);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Focus on input when opened and reset on close
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchTerm('');
      setDebouncedQuery('');
      setIsDebouncing(false);
      setActiveTab('all');
      setResults(initialResults);
    }
  }, [isOpen]);

  // Server-side search API call
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(initialResults);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchSearch = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${getApiBaseUrl()}/backend/API/search.php?q=${encodeURIComponent(debouncedQuery.trim())}`);
        const json = await res.json();
        if (isMounted && json.status === 'success' && json.data) {
          setResults({
            berita: json.data.berita || [],
            galeri: json.data.galeri || [],
            modul: json.data.modul || [],
            guru: json.data.guru || [],
            inovasi: json.data.inovasi || [],
            akademik: json.data.akademik || [],
            fasilitas: json.data.fasilitas || [],
          });
        }
      } catch {
        // Ignore network errors
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSearch();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  // Lock body and html scroll when search modal is open
  useEffect(() => {
    if (isOpen) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [isOpen]);

  // Escape key listener to close modal reliably
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const totalResults = useMemo(() => {
    return (
      results.berita.length +
      results.galeri.length +
      results.modul.length +
      results.guru.length +
      results.inovasi.length +
      results.akademik.length +
      results.fasilitas.length
    );
  }, [results]);

  const handleClear = () => {
    setSearchTerm('');
    setDebouncedQuery('');
    setIsDebouncing(false);
    setResults(initialResults);
    inputRef.current?.focus();
  };

  const handleNavigateNews = (id: string | number) => {
    navigate('/news', { state: { openArticle: String(id) } });
    onClose();
  };

  const handleNavigateGallery = (id: string | number) => {
    navigate('/gallery', { state: { openPhoto: String(id) } });
    onClose();
  };

  const handleNavigateModul = (id: number) => {
    navigate('/akademik', { state: { openModul: id } });
    onClose();
  };

  const handleNavigateTeacher = (id: string | number) => {
    navigate('/directory', { state: { openTeacher: String(id) } });
    onClose();
  };

  const handleNavigateInovasi = (id: string | number) => {
    navigate(`/inovasi/${id}`);
    onClose();
  };

  const handleNavigateAkademik = (id: number) => {
    navigate(`/akademik/${id}`);
    onClose();
  };

  const handleNavigateFasilitas = (id?: number | string) => {
    navigate('/fasilitas', { state: { openFasilitas: id ? String(id) : undefined } });
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center p-3 sm:p-6 sm:pt-16 overflow-y-auto overscroll-contain">
        {/* Backdrop overlay */}
        <div
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
          onClick={onClose}
        />

        {/* Modal Dialog */}
        <div
          className="relative bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto sm:my-0 max-h-[85vh] animate-in fade-in zoom-in-95 duration-200 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Header Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            {isDebouncing || loading ? (
              <Loader2 className="text-[#028C84] shrink-0 animate-spin" size={22} />
            ) : (
              <Search className="text-[#028C84] shrink-0" size={22} />
            )}
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berita, galeri, modul, guru, inovasi, akademik, fasilitas..."
              className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
            />
            {searchTerm && (
              <button
                onClick={handleClear}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Hapus input"
              >
                <X size={18} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors text-xs font-semibold px-3 cursor-pointer shrink-0"
              title="Tutup Pencarian (Esc)"
            >
              Tutup
            </button>
          </div>

          {/* Category Tabs */}
          {debouncedQuery && (
            <div className="px-4 sm:px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { key: 'all', label: 'Semua Hasil', count: totalResults },
                { key: 'berita', label: 'Berita', count: results.berita.length, icon: FileText },
                { key: 'galeri', label: 'Galeri', count: results.galeri.length, icon: ImageIcon },
                { key: 'modul', label: 'Modul', count: results.modul.length, icon: BookOpen },
                { key: 'guru', label: 'Guru & Tendik', count: results.guru.length, icon: User },
                { key: 'inovasi', label: 'Inovasi', count: results.inovasi.length, icon: Lightbulb },
                { key: 'akademik', label: 'Akademik', count: results.akademik.length, icon: GraduationCap },
                { key: 'fasilitas', label: 'Fasilitas', count: results.fasilitas.length, icon: Building2 },
              ].map((tab) => {
                const isActive = activeTab === tab.key;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as SearchCategory)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    {Icon && <Icon size={13} className="shrink-0" />}
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Results List */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
            {!searchTerm.trim() ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Sparkles size={36} className="mx-auto text-teal-500/50" />
                <p className="text-sm font-medium text-slate-600">Pencarian Cepat SDN 1 Mulyoagung</p>
                <p className="text-xs text-slate-400">
                  Ketik kata kunci untuk mencari berita, galeri, modul belajar, guru, inovasi, akademik, atau fasilitas sekolah.
                </p>
              </div>
            ) : isDebouncing || loading ? (
              <div className="py-12 text-center text-slate-400 space-y-3">
                <Loader2 size={36} className="mx-auto text-teal-600 animate-spin" />
                <p className="text-sm font-medium text-slate-600">Sedang mencari...</p>
              </div>
            ) : totalResults === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Search size={36} className="mx-auto text-slate-300" />
                <p className="text-sm font-semibold text-slate-700">Tidak ada hasil untuk &quot;{debouncedQuery}&quot;</p>
                <p className="text-xs text-slate-400">Coba gunakan kata kunci lain yang lebih umum.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 1. Berita */}
                {(activeTab === 'all' || activeTab === 'berita') && results.berita.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <FileText size={14} className="text-teal-600" />
                      <span>Berita &amp; Informasi ({results.berita.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.berita.map((art) => (
                        <div
                          key={`n-${art.id}`}
                          onClick={() => handleNavigateNews(art.id)}
                          className="p-3 bg-slate-50 hover:bg-teal-50/50 border border-slate-100 hover:border-teal-200 rounded-2xl transition-all cursor-pointer flex gap-3 items-center group"
                        >
                          {art.foto && (
                            <img
                              src={getImageUrl(art.foto)}
                              alt={art.judul}
                              className="w-14 h-14 rounded-xl object-cover shrink-0"
                            />
                          )}
                          <div className="overflow-hidden min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                              {art.kategori}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate mt-1 group-hover:text-teal-700">
                              {art.judul}
                            </h4>
                            <p className="text-[11px] text-slate-400">{art.tanggal}</p>
                          </div>
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-teal-600 shrink-0 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Modul Pembelajaran */}
                {(activeTab === 'all' || activeTab === 'modul') && results.modul.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <BookOpen size={14} className="text-blue-600" />
                      <span>Modul Pembelajaran ({results.modul.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.modul.map((mod) => (
                        <div
                          key={`m-${mod.id}`}
                          onClick={() => handleNavigateModul(mod.id)}
                          className="p-3 bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 rounded-2xl transition-all cursor-pointer flex gap-3 items-center group"
                        >
                          <div className="w-14 h-14 rounded-xl bg-teal-800 flex items-center justify-center text-white shrink-0 overflow-hidden">
                            {mod.foto ? (
                              <img src={getImageUrl(mod.foto)} alt={mod.judul} className="w-full h-full object-cover" />
                            ) : (
                              <BookOpen size={24} className="text-teal-200" />
                            )}
                          </div>
                          <div className="overflow-hidden min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                                {mod.kelas}
                              </span>
                              <span className="text-[10px] text-slate-400">{mod.mata_pelajaran}</span>
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate mt-1 group-hover:text-blue-700">
                              {mod.judul}
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate">Oleh: {mod.uploader || 'Guru'}</p>
                          </div>
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600 shrink-0 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Guru & Tendik */}
                {(activeTab === 'all' || activeTab === 'guru') && results.guru.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <User size={14} className="text-emerald-600" />
                      <span>Guru &amp; Tenaga Pendidik ({results.guru.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.guru.map((teach) => (
                        <div
                          key={`t-${teach.id}`}
                          onClick={() => handleNavigateTeacher(teach.id)}
                          className="p-3 bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 hover:border-emerald-200 rounded-2xl transition-all cursor-pointer flex gap-3 items-center group"
                        >
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                            {teach.foto ? (
                              <img src={getImageUrl(teach.foto)} alt={teach.nama} className="w-full h-full object-cover" />
                            ) : (
                              <User size={24} className="text-slate-400 m-auto" />
                            )}
                          </div>
                          <div className="overflow-hidden min-w-0 flex-1">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-emerald-700">
                              {teach.nama}
                            </h4>
                            <p className="text-[11px] text-teal-600 font-semibold truncate">{teach.tugas || teach.jabatan}</p>
                            <p className="text-[10px] text-slate-400 truncate">NIP: {teach.nip && teach.nip !== 'null' ? teach.nip : '-'}</p>
                          </div>
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-600 shrink-0 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Galeri Foto */}
                {(activeTab === 'all' || activeTab === 'galeri') && results.galeri.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <ImageIcon size={14} className="text-amber-600" />
                      <span>Galeri Kegiatan ({results.galeri.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.galeri.map((item) => (
                        <div
                          key={`g-${item.id}`}
                          onClick={() => handleNavigateGallery(item.id)}
                          className="p-3 bg-slate-50 hover:bg-amber-50/50 border border-slate-100 hover:border-amber-200 rounded-2xl transition-all cursor-pointer flex gap-3 items-center group"
                        >
                          {item.foto && (
                            <img
                              src={getImageUrl(item.foto)}
                              alt={item.judul}
                              className="w-14 h-14 rounded-xl object-cover shrink-0"
                            />
                          )}
                          <div className="overflow-hidden min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                              {item.kategori}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate mt-1 group-hover:text-amber-700">
                              {item.judul}
                            </h4>
                            <p className="text-[11px] text-slate-400">{item.tanggal}</p>
                          </div>
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-amber-600 shrink-0 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Inovasi */}
                {(activeTab === 'all' || activeTab === 'inovasi') && results.inovasi.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <Lightbulb size={14} className="text-amber-500" />
                      <span>Inovasi Sekolah ({results.inovasi.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.inovasi.map((inov) => (
                        <div
                          key={`i-${inov.id}`}
                          onClick={() => handleNavigateInovasi(inov.id)}
                          className="p-3 bg-slate-50 hover:bg-amber-50/50 border border-slate-100 hover:border-amber-200 rounded-2xl transition-all cursor-pointer flex gap-3 items-center group"
                        >
                          <div className="w-14 h-14 rounded-xl bg-amber-600 flex items-center justify-center text-white shrink-0 overflow-hidden">
                            {inov.foto ? (
                              <img src={getImageUrl(inov.foto)} alt={inov.judul} className="w-full h-full object-cover" />
                            ) : (
                              <Lightbulb size={24} className="text-amber-200" />
                            )}
                          </div>
                          <div className="overflow-hidden min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                              {inov.kategori}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate mt-1 group-hover:text-amber-700">
                              {inov.judul}
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate">Oleh: {inov.inovator || 'SDN 1 Mulyoagung'}</p>
                          </div>
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-amber-600 shrink-0 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Akademik Menu */}
                {(activeTab === 'all' || activeTab === 'akademik') && results.akademik.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <GraduationCap size={14} className="text-indigo-600" />
                      <span>Dokumen Akademik ({results.akademik.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.akademik.map((akd) => (
                        <div
                          key={`a-${akd.id}`}
                          onClick={() => handleNavigateAkademik(akd.id)}
                          className="p-3 bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-200 rounded-2xl transition-all cursor-pointer flex gap-3 items-center group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <GraduationCap size={22} />
                          </div>
                          <div className="overflow-hidden min-w-0 flex-1">
                            {akd.parent_label && (
                              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                                {akd.parent_label}
                              </span>
                            )}
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate mt-0.5 group-hover:text-indigo-700">
                              {akd.label}
                            </h4>
                            {akd.deskripsi && <p className="text-[11px] text-slate-400 truncate">{akd.deskripsi}</p>}
                          </div>
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-600 shrink-0 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. Fasilitas */}
                {(activeTab === 'all' || activeTab === 'fasilitas') && results.fasilitas.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <Building2 size={14} className="text-rose-600" />
                      <span>Fasilitas Sekolah ({results.fasilitas.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.fasilitas.map((fas) => (
                        <div
                          key={`f-${fas.id}`}
                          onClick={() => handleNavigateFasilitas(fas.id)}
                          className="p-3 bg-slate-50 hover:bg-rose-50/50 border border-slate-100 hover:border-rose-200 rounded-2xl transition-all cursor-pointer flex gap-3 items-center group"
                        >
                          {fas.foto ? (
                            <img
                              src={getImageUrl(fas.foto)}
                              alt={fas.judul}
                              className="w-14 h-14 rounded-xl object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                              <Building2 size={24} />
                            </div>
                          )}
                          <div className="overflow-hidden min-w-0 flex-1">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-rose-700">
                              {fas.judul}
                            </h4>
                            <p className="text-[11px] text-slate-400 line-clamp-2">{fas.deskripsi}</p>
                          </div>
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-rose-600 shrink-0 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <span>SD Negeri 1 Mulyoagung</span>
            <span>•</span>
            <span>Pencarian Cepat Seluruh Informasi Sekolah</span>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};
