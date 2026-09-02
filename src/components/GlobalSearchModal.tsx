import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, FileText, Image as ImageIcon, BookOpen, User, Sparkles, Loader2 } from 'lucide-react';
import { getApiBaseUrl, getImageUrl } from '../config/api';
import { Article, Teacher, GalleryItem } from '../types';
import { ModulItem } from '../CMS/hooks/useModulData';
import { NewsDetailModal } from './NewsDetailModal';
import { PhotoLightboxModal } from './gallery/PhotoLightboxModal';
import { TeacherProfileModal } from './directory/TeacherProfileModal';
import { ModulPreviewModal } from '../CMS/modul/ModulPreviewModal';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchCategory = 'all' | 'berita' | 'galeri' | 'modul' | 'guru';

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [activeTab, setActiveTab] = useState<SearchCategory>('all');
  const [loading, setLoading] = useState(false);

  // Data states
  const [news, setNews] = useState<Article[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [modules, setModules] = useState<ModulItem[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // Modals for detail preview
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);
  const [activeTeacher, setActiveTeacher] = useState<Teacher | null>(null);
  const [activeModule, setActiveModule] = useState<ModulItem | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search: tunggu user selesai mengetik 300ms
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
    }
  }, [isOpen]);

  // Load all public data once
  useEffect(() => {
    if (!isOpen) return;

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [resNews, resGal, resMod, resGuru] = await Promise.allSettled([
          fetch(`${getApiBaseUrl()}/backend/API/newsAPI.php`),
          fetch(`${getApiBaseUrl()}/backend/API/galeri.php`),
          fetch(`${getApiBaseUrl()}/backend/API/modul_pembelajaran.php`),
          fetch(`${getApiBaseUrl()}/backend/API/guru.php`),
        ]);

        if (resNews.status === 'fulfilled' && resNews.value.ok) {
          const json = await resNews.value.json();
          if (json.status === 'success' && Array.isArray(json.data)) {
            setNews(
              json.data.map((art: any) => ({
                id: art.id.toString(),
                title: art.judul,
                category: art.kategori,
                date: art.tanggal,
                summary: art.isi,
                content: art.isi,
                image: art.foto ? getImageUrl(art.foto) : '',
                imageAlt: art.judul,
                author: art.uploader || 'Admin',
                readTime: '3 menit',
              }))
            );
          }
        }

        if (resGal.status === 'fulfilled' && resGal.value.ok) {
          const json = await resGal.value.json();
          if (json.status === 'success' && Array.isArray(json.data)) {
            setGallery(
              json.data.map((g: any) => ({
                id: g.id.toString(),
                title: g.judul,
                category: g.kategori,
                date: g.tanggal,
                image: g.foto ? getImageUrl(g.foto) : '',
                description: g.deskripsi || '',
              }))
            );
          }
        }

        if (resMod.status === 'fulfilled' && resMod.value.ok) {
          const json = await resMod.value.json();
          if (json.status === 'success' && Array.isArray(json.data)) {
            setModules(json.data);
          }
        }

        if (resGuru.status === 'fulfilled' && resGuru.value.ok) {
          const json = await resGuru.value.json();
          if (json.status === 'success' && Array.isArray(json.data)) {
            setTeachers(
              json.data.map((t: any) => ({
                id: t.id.toString(),
                name: t.nama,
                title: t.jabatan,
                role: t.tugas,
                nip: t.nip && t.nip !== 'null' ? t.nip : '-',
                subject: t.tugas,
                image: t.foto ? getImageUrl(t.foto) : '',
                education: t.riwayat_pendidikan,
                quote: t.motto,
                gender: t.jenis_kelamin,
                status: t.status,
              }))
            );
          }
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [isOpen]);

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

  // Filter items based on debounced query
  const searchResults = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    if (!q) return { news: [], gallery: [], modules: [], teachers: [], total: 0 };

    const filteredNews = news.filter(
      (n) => n.title.toLowerCase().includes(q) || (n.summary && n.summary.toLowerCase().includes(q))
    );

    const filteredGallery = gallery.filter(
      (g) => g.title.toLowerCase().includes(q) || (g.description && g.description.toLowerCase().includes(q))
    );

    const filteredModules = modules.filter(
      (m) =>
        (m.judul && m.judul.toLowerCase().includes(q)) ||
        (m.deskripsi && m.deskripsi.toLowerCase().includes(q)) ||
        (m.mata_pelajaran && m.mata_pelajaran.toLowerCase().includes(q)) ||
        (m.kelas && m.kelas.toLowerCase().includes(q)) ||
        (m.kategori && m.kategori.toLowerCase().includes(q)) ||
        (m.uploader && m.uploader.toLowerCase().includes(q))
    );

    const filteredTeachers = teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.role.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.nip.toLowerCase().includes(q)
    );

    const total =
      filteredNews.length + filteredGallery.length + filteredModules.length + filteredTeachers.length;

    return {
      news: filteredNews,
      gallery: filteredGallery,
      modules: filteredModules,
      teachers: filteredTeachers,
      total,
    };
  }, [debouncedQuery, news, gallery, modules, teachers]);

  const handleClear = () => {
    setSearchTerm('');
    setDebouncedQuery('');
    setIsDebouncing(false);
    inputRef.current?.focus();
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
              placeholder="Cari berita, galeri foto, modul pembelajaran, atau guru..."
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
            <div className="px-4 sm:px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto">
              {[
                { key: 'all', label: 'Semua Hasil', count: searchResults.total },
                { key: 'berita', label: 'Berita', count: searchResults.news.length, icon: FileText },
                { key: 'galeri', label: 'Galeri Foto', count: searchResults.gallery.length, icon: ImageIcon },
                { key: 'modul', label: 'Modul Belajar', count: searchResults.modules.length, icon: BookOpen },
                { key: 'guru', label: 'Guru & Tendik', count: searchResults.teachers.length, icon: User },
              ].map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as SearchCategory)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${isActive
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
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
                  Ketik kata kunci untuk mencari materi modul, kabar sekolah, dokumentasi kegiatan, atau guru.
                </p>
              </div>
            ) : isDebouncing ? (
              <div className="py-12 text-center text-slate-400 space-y-3">
                <Loader2 size={36} className="mx-auto text-teal-600 animate-spin" />
                <p className="text-sm font-medium text-slate-600">Sedang mencari...</p>
              </div>
            ) : searchResults.total === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Search size={36} className="mx-auto text-slate-300" />
                <p className="text-sm font-semibold text-slate-700">Tidak ada hasil untuk &quot;{debouncedQuery}&quot;</p>
                <p className="text-xs text-slate-400">Coba gunakan kata kunci lain yang lebih umum.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 1. Berita */}
                {(activeTab === 'all' || activeTab === 'berita') && searchResults.news.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <FileText size={14} className="text-teal-600" />
                      <span>Berita &amp; Informasi ({searchResults.news.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {searchResults.news.map((art) => (
                        <div
                          key={`n-${art.id}`}
                          onClick={() => setActiveArticle(art)}
                          className="p-3 bg-slate-50 hover:bg-teal-50/50 border border-slate-100 hover:border-teal-200 rounded-2xl transition-all cursor-pointer flex gap-3 items-center group"
                        >
                          {art.image && (
                            <img
                              src={art.image}
                              alt={art.title}
                              className="w-14 h-14 rounded-xl object-cover shrink-0"
                            />
                          )}
                          <div className="overflow-hidden min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                              {art.category}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate mt-1 group-hover:text-teal-700">
                              {art.title}
                            </h4>
                            <p className="text-[11px] text-slate-400">{art.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Modul Pembelajaran */}
                {(activeTab === 'all' || activeTab === 'modul') && searchResults.modules.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <BookOpen size={14} className="text-blue-600" />
                      <span>Modul Pembelajaran ({searchResults.modules.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {searchResults.modules.map((mod) => (
                        <div
                          key={`m-${mod.id}`}
                          onClick={() => setActiveModule(mod)}
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
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Guru & Tendik */}
                {(activeTab === 'all' || activeTab === 'guru') && searchResults.teachers.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <User size={14} className="text-emerald-600" />
                      <span>Guru &amp; Tenaga Pendidik ({searchResults.teachers.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {searchResults.teachers.map((teach) => (
                        <div
                          key={`t-${teach.id}`}
                          onClick={() => setActiveTeacher(teach)}
                          className="p-3 bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 hover:border-emerald-200 rounded-2xl transition-all cursor-pointer flex gap-3 items-center group"
                        >
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                            {teach.image ? (
                              <img src={teach.image} alt={teach.name} className="w-full h-full object-cover" />
                            ) : (
                              <User size={24} className="text-slate-400 m-auto" />
                            )}
                          </div>
                          <div className="overflow-hidden min-w-0 flex-1">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-emerald-700">
                              {teach.name}
                            </h4>
                            <p className="text-[11px] text-teal-600 font-semibold truncate">{teach.role}</p>
                            <p className="text-[10px] text-slate-400 truncate">NIP: {teach.nip}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Galeri Foto */}
                {(activeTab === 'all' || activeTab === 'galeri') && searchResults.gallery.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <ImageIcon size={14} className="text-amber-600" />
                      <span>Galeri Kegiatan ({searchResults.gallery.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {searchResults.gallery.map((item) => (
                        <div
                          key={`g-${item.id}`}
                          onClick={() => setActivePhoto(item)}
                          className="p-3 bg-slate-50 hover:bg-amber-50/50 border border-slate-100 hover:border-amber-200 rounded-2xl transition-all cursor-pointer flex gap-3 items-center group"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-14 h-14 rounded-xl object-cover shrink-0"
                            />
                          )}
                          <div className="overflow-hidden min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                              {item.category}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate mt-1 group-hover:text-amber-700">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-slate-400">{item.date}</p>
                          </div>
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
            <span>Pencarian Cepat Berita, Galeri, Modul Ajar, dan Guru</span>
          </div>
        </div>
      </div>

      {/* Embedded Detail Modals */}
      <NewsDetailModal article={activeArticle} onClose={() => setActiveArticle(null)} />
      <PhotoLightboxModal photo={activePhoto} onClose={() => setActivePhoto(null)} />
      <TeacherProfileModal teacher={activeTeacher} onClose={() => setActiveTeacher(null)} />
      <ModulPreviewModal module={activeModule} onClose={() => setActiveModule(null)} />
    </>,
    document.body
  );
};
