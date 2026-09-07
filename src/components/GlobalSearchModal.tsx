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
  Compass,
  Home,
  Globe,
  Mail,
  Layers,
} from 'lucide-react';
import { getApiBaseUrl, getImageUrl } from '../config/api';
import { NEWS_ARTICLES, GALLERY_ITEMS, TEACHERS_DIRECTORY, SCHOOL_FACILITIES } from '../data/schoolData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchCategory =
  | 'all'
  | 'halaman'
  | 'berita'
  | 'galeri'
  | 'modul'
  | 'guru'
  | 'inovasi'
  | 'akademik'
  | 'fasilitas';

interface SearchResultsState {
  berita: Array<{ id: number | string; judul: string; kategori: string; tanggal: string; isi: string; foto?: string; uploader?: string }>;
  galeri: Array<{ id: number | string; judul: string; kategori: string; tanggal: string; deskripsi: string; foto?: string; uploader?: string }>;
  modul: Array<{ id: number | string; judul: string; deskripsi: string; mata_pelajaran: string; kelas: string; semester: string; kategori: string; foto?: string; uploader?: string }>;
  guru: Array<{ id: number | string; nama: string; jabatan: string; tugas: string; nip?: string; foto?: string }>;
  inovasi: Array<{ id: number | string; judul: string; kategori: string; inovator?: string; deskripsi?: string; link_drive?: string; foto?: string }>;
  akademik: Array<{ id: number | string; label: string; deskripsi?: string; parent_id?: number | null; parent_label?: string; link_gdrive?: string; is_modul?: number }>;
  fasilitas: Array<{ id: number | string; judul: string; deskripsi: string; foto?: string }>;
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

interface PublicPageItem {
  id: string;
  title: string;
  path: string;
  description: string;
  category: string;
  icon: any;
  keywords: string[];
}

const PUBLIC_PAGES: PublicPageItem[] = [
  {
    id: 'page-home',
    title: 'Beranda Utama',
    path: '/',
    description: 'Halaman muka utama website SD Negeri 1 Mulyoagung',
    category: 'Navigasi',
    icon: Home,
    keywords: ['home', 'beranda', 'homepage', 'main', 'utama', 'muka', 'sdn 1 mulyoagung', 'sambutan', 'depan', 'visi'],
  },
  {
    id: 'page-profile',
    title: 'Profil Sekolah',
    path: '/profile',
    description: 'Visi, misi, sejarah pendirian, dan video profil sekolah',
    category: 'Navigasi',
    icon: Globe,
    keywords: ['profile', 'profil', 'school profile', 'sejarah', 'history', 'visi', 'misi', 'vision', 'mission', 'tentang', 'about', 'about us', 'video profil', 'tujuan', 'kepala sekolah', 'principal'],
  },
  {
    id: 'page-news',
    title: 'Berita & Kegiatan',
    path: '/news',
    description: 'Kabar terkini, pengumuman, dan liputan aktivitas siswa',
    category: 'Navigasi',
    icon: FileText,
    keywords: ['berita', 'news', 'article', 'articles', 'kabar', 'kegiatan', 'event', 'events', 'informasi', 'information', 'prestasi', 'achievement', 'pengumuman', 'announcement', 'acara', 'lomba', 'juara'],
  },
  {
    id: 'page-gallery',
    title: 'Galeri Foto Kegiatan',
    path: '/gallery',
    description: 'Dokumentasi foto kegiatan sekolah, ekstrakurikuler, dan acara',
    category: 'Navigasi',
    icon: ImageIcon,
    keywords: ['galeri', 'gallery', 'photo', 'photos', 'foto', 'dokumentasi', 'documentation', 'gambar', 'image', 'images', 'album', 'kegiatan', 'karate', 'pramuka', 'karnamuda'],
  },
  {
    id: 'page-directory',
    title: 'Direktori Guru & Tendik',
    path: '/directory',
    description: 'Daftar dan profil dewan guru serta staf kependidikan',
    category: 'Navigasi',
    icon: User,
    keywords: ['direktori', 'directory', 'guru', 'teacher', 'teachers', 'tendik', 'staff', 'staf', 'guru kelas', 'tenaga pendidik', 'educator', 'kepala sekolah', 'pengajar', 'struktur', 'bagan', 'org chart'],
  },
  {
    id: 'page-modul',
    title: 'Modul & Materi Pembelajaran',
    path: '/modul',
    description: 'Ruang belajar digital, materi Kurikulum Merdeka, dan LKPD',
    category: 'Navigasi',
    icon: BookOpen,
    keywords: ['modul', 'modul ajar', 'materi', 'learning', 'materials', 'lesson', 'lessons', 'pembelajaran', 'belajar', 'study', 'buku', 'book', 'books', 'lkpd', 'worksheet', 'bahan ajar', 'pelajaran', 'subject', 'matematika', 'math', 'mathematics', 'ipas', 'science', 'bahasa indonesia', 'indonesian', 'english', 'bahasa inggris', 'kurikulum merdeka', 'curriculum', 'kelas 1', 'kelas 2', 'kelas 3', 'kelas 4', 'kelas 5', 'kelas 6'],
  },
  {
    id: 'page-akademik',
    title: 'Dokumen Akademik',
    path: '/akademik',
    description: 'Dokumen kurikulum, kalender pendidikan, dan arsip pembelajaran',
    category: 'Navigasi',
    icon: Layers,
    keywords: ['akademik', 'academic', 'dokumen akademik', 'academic documents', 'kurikulum', 'curriculum', 'kalender pendidikan', 'academic calendar', 'perangkat pembelajaran', 'bedah cp', 'administrasi', 'administration', 'gdrive', 'google drive'],
  },
  {
    id: 'page-inovasi',
    title: 'Inovasi Sekolah',
    path: '/inovasi',
    description: 'Eksplorasi karya inovatif, media interaktif, dan program unggulan',
    category: 'Navigasi',
    icon: Lightbulb,
    keywords: ['inovasi', 'innovation', 'karya', 'creation', 'creativity', 'kreativitas', 'program', 'inovatif', 'innovative', 'kabumiga', 'jumaga', 'media', 'project', 'projek'],
  },
  {
    id: 'page-fasilitas',
    title: 'Fasilitas Sekolah',
    path: '/fasilitas',
    description: 'Laboratorium komputer, perpustakaan, lapangan, UKS, kantin',
    category: 'Navigasi',
    icon: Building2,
    keywords: ['fasilitas', 'facility', 'facilities', 'sarana', 'prasarana', 'infrastructure', 'lab', 'laboratory', 'laboratorium', 'komputer', 'computer', 'perpustakaan', 'library', 'lapangan', 'field', 'court', 'uks', 'clinic', 'kantin', 'canteen', 'cafeteria', 'taman', 'garden', 'green house'],
  },
  {
    id: 'page-contact',
    title: 'Kontak & Lokasi',
    path: '/contact',
    description: 'Alamat resmi, kontak WhatsApp, email, dan peta lokasi sekolah',
    category: 'Navigasi',
    icon: Mail,
    keywords: ['kontak', 'contact', 'contact us', 'hubungi', 'alamat', 'address', 'whatsapp', 'wa', 'telepon', 'phone', 'call', 'email', 'mail', 'lokasi', 'location', 'peta', 'map', 'maps', 'pengaduan', 'complaint'],
  },
];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [activeTab, setActiveTab] = useState<SearchCategory>('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResultsState>(initialResults);

  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search: 500ms
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
    }, 500);

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

  // Server-side + Local search API call
  useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q) {
      setResults(initialResults);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchSearch = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${getApiBaseUrl()}/backend/API/search.php?q=${encodeURIComponent(q)}`);
        const json = await res.json();
        if (isMounted && json.status === 'success' && json.data) {
          const apiData = json.data;
          
          // Filter local fallback data if API data for some entity is empty
          const lowerQ = q.toLowerCase();
          
          let beritaList = apiData.berita || [];
          if (beritaList.length === 0) {
            beritaList = NEWS_ARTICLES.filter(
              (a) =>
                a.title.toLowerCase().includes(lowerQ) ||
                a.summary.toLowerCase().includes(lowerQ) ||
                a.category.toLowerCase().includes(lowerQ)
            ).map((a) => ({
              id: a.id,
              judul: a.title,
              kategori: a.category,
              tanggal: a.date,
              isi: a.summary,
              foto: a.image,
              uploader: a.author,
            }));
          }

          let galeriList = apiData.galeri || [];
          if (galeriList.length === 0) {
            galeriList = GALLERY_ITEMS.filter(
              (g) =>
                g.title.toLowerCase().includes(lowerQ) ||
                g.description.toLowerCase().includes(lowerQ) ||
                g.category.toLowerCase().includes(lowerQ)
            ).map((g) => ({
              id: g.id,
              judul: g.title,
              kategori: g.category,
              tanggal: g.date,
              deskripsi: g.description,
              foto: g.image,
            }));
          }

          let guruList = apiData.guru || [];
          if (guruList.length === 0) {
            guruList = TEACHERS_DIRECTORY.filter(
              (t) =>
                t.name.toLowerCase().includes(lowerQ) ||
                t.title.toLowerCase().includes(lowerQ) ||
                t.role.toLowerCase().includes(lowerQ) ||
                t.nip.toLowerCase().includes(lowerQ) ||
                t.subject.toLowerCase().includes(lowerQ)
            ).map((t) => ({
              id: t.id,
              nama: t.name,
              jabatan: t.title,
              tugas: t.role,
              nip: t.nip,
              foto: t.image,
            }));
          }

          let fasilitasList = apiData.fasilitas || [];
          if (fasilitasList.length === 0) {
            fasilitasList = SCHOOL_FACILITIES.filter(
              (f) =>
                f.name.toLowerCase().includes(lowerQ) ||
                f.description.toLowerCase().includes(lowerQ)
            ).map((f) => ({
              id: f.id,
              judul: f.name,
              deskripsi: f.description,
              foto: f.image,
            }));
          }

          setResults({
            berita: beritaList,
            galeri: galeriList,
            modul: apiData.modul || [],
            guru: guruList,
            inovasi: apiData.inovasi || [],
            akademik: apiData.akademik || [],
            fasilitas: fasilitasList,
          });
        }
      } catch {
        // Fallback local search if network fails
        if (isMounted) {
          const lowerQ = q.toLowerCase();
          const localNews = NEWS_ARTICLES.filter(
            (a) =>
              a.title.toLowerCase().includes(lowerQ) ||
              a.summary.toLowerCase().includes(lowerQ) ||
              a.category.toLowerCase().includes(lowerQ)
          ).map((a) => ({
            id: a.id,
            judul: a.title,
            kategori: a.category,
            tanggal: a.date,
            isi: a.summary,
            foto: a.image,
            uploader: a.author,
          }));

          const localGal = GALLERY_ITEMS.filter(
            (g) =>
              g.title.toLowerCase().includes(lowerQ) ||
              g.description.toLowerCase().includes(lowerQ) ||
              g.category.toLowerCase().includes(lowerQ)
          ).map((g) => ({
            id: g.id,
            judul: g.title,
            kategori: g.category,
            tanggal: g.date,
            deskripsi: g.description,
            foto: g.image,
          }));

          const localTeachers = TEACHERS_DIRECTORY.filter(
            (t) =>
              t.name.toLowerCase().includes(lowerQ) ||
              t.title.toLowerCase().includes(lowerQ) ||
              t.role.toLowerCase().includes(lowerQ) ||
              t.nip.toLowerCase().includes(lowerQ)
          ).map((t) => ({
            id: t.id,
            nama: t.name,
            jabatan: t.title,
            tugas: t.role,
            nip: t.nip,
            foto: t.image,
          }));

          const localFac = SCHOOL_FACILITIES.filter(
            (f) =>
              f.name.toLowerCase().includes(lowerQ) ||
              f.description.toLowerCase().includes(lowerQ)
          ).map((f) => ({
            id: f.id,
            judul: f.name,
            deskripsi: f.description,
            foto: f.image,
          }));

          setResults({
            berita: localNews,
            galeri: localGal,
            modul: [],
            guru: localTeachers,
            inovasi: [],
            akademik: [],
            fasilitas: localFac,
          });
        }
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

  // Matched Public Navigation Pages
  const matchedPages = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    if (!q) return [];
    return PUBLIC_PAGES.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.path.toLowerCase().includes(q) ||
        p.keywords.some((kw) => kw.includes(q) || q.includes(kw))
    );
  }, [debouncedQuery]);

  const totalResults = useMemo(() => {
    return (
      matchedPages.length +
      results.berita.length +
      results.galeri.length +
      results.modul.length +
      results.guru.length +
      results.inovasi.length +
      results.akademik.length +
      results.fasilitas.length
    );
  }, [matchedPages, results]);

  const handleClear = () => {
    setSearchTerm('');
    setDebouncedQuery('');
    setIsDebouncing(false);
    setResults(initialResults);
    inputRef.current?.focus();
  };

  const handleNavigatePage = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleNavigateNews = (id: string | number) => {
    navigate('/news', { state: { openArticle: String(id) } });
    onClose();
  };

  const handleNavigateGallery = (id: string | number) => {
    navigate('/gallery', { state: { openPhoto: String(id) } });
    onClose();
  };

  const handleNavigateModul = (id: number | string) => {
    navigate('/modul', { state: { openModul: id } });
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

  const handleNavigateAkademik = (id: number | string) => {
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
              placeholder="Cari halaman, berita, galeri, modul pelajaran, guru, inovasi, fasilitas..."
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
                { key: 'halaman', label: 'Halaman Web', count: matchedPages.length, icon: Compass },
                { key: 'berita', label: 'Berita', count: results.berita.length, icon: FileText },
                { key: 'galeri', label: 'Galeri Foto', count: results.galeri.length, icon: ImageIcon },
                { key: 'modul', label: 'Modul Belajar', count: results.modul.length, icon: BookOpen },
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
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Ketik kata kunci seperti <strong>&quot;galeri&quot;</strong>, <strong>&quot;berita&quot;</strong>, <strong>&quot;profil&quot;</strong>, <strong>&quot;Matematika&quot;</strong>, <strong>&quot;IPAS&quot;</strong>, <strong>&quot;fasilitas&quot;</strong>, atau nama guru.
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
                <p className="text-xs text-slate-400">Coba gunakan kata kunci umum seperti nama pelajaran, guru, atau fitur website.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 1. Halaman Web / Menu Navigasi Utama */}
                {(activeTab === 'all' || activeTab === 'halaman') && matchedPages.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <Compass size={14} className="text-teal-600" />
                      <span>Halaman &amp; Navigasi Web ({matchedPages.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {matchedPages.map((page) => {
                        const Icon = page.icon;
                        return (
                          <div
                            key={page.id}
                            onClick={() => handleNavigatePage(page.path)}
                            className="p-3.5 bg-gradient-to-r from-teal-50/70 to-emerald-50/40 hover:from-teal-100/70 hover:to-emerald-100/60 border border-teal-200/80 rounded-2xl transition-all cursor-pointer flex items-center justify-between group shadow-sm"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                                <Icon size={20} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <span className="text-[10px] font-bold text-teal-700 bg-white/80 px-2 py-0.5 rounded border border-teal-200/60">
                                    Menu Utama
                                  </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-teal-700">
                                  {page.title}
                                </h4>
                                <p className="text-[11px] text-slate-500 truncate">{page.description}</p>
                              </div>
                            </div>
                            <ArrowRight size={16} className="text-teal-600 group-hover:translate-x-1 shrink-0 transition-transform ml-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Modul Pembelajaran */}
                {(activeTab === 'all' || activeTab === 'modul') && results.modul.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <BookOpen size={14} className="text-blue-600" />
                      <span>Modul &amp; Bahan Pembelajaran ({results.modul.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.modul.map((mod) => (
                        <div
                          key={`m-${mod.id}`}
                          onClick={() => handleNavigateModul(mod.id)}
                          className="p-3 bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 rounded-2xl transition-all cursor-pointer flex gap-3 items-center group"
                        >
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-700 to-blue-800 flex items-center justify-center text-white shrink-0 overflow-hidden shadow-xs">
                            {mod.foto ? (
                              <img src={getImageUrl(mod.foto)} alt={mod.judul} className="w-full h-full object-cover" />
                            ) : (
                              <BookOpen size={24} className="text-teal-200" />
                            )}
                          </div>
                          <div className="overflow-hidden min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                {mod.kelas}
                              </span>
                              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100 truncate">
                                {mod.mata_pelajaran}
                              </span>
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate mt-1 group-hover:text-blue-700">
                              {mod.judul}
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate">Oleh: {mod.uploader || 'Dewan Guru'}</p>
                          </div>
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600 shrink-0 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Berita & Informasi */}
                {(activeTab === 'all' || activeTab === 'berita') && results.berita.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <FileText size={14} className="text-teal-600" />
                      <span>Berita &amp; Kegiatan Sekolah ({results.berita.length})</span>
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
                            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
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

                {/* 4. Galeri Foto */}
                {(activeTab === 'all' || activeTab === 'galeri') && results.galeri.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <ImageIcon size={14} className="text-amber-600" />
                      <span>Galeri Foto ({results.galeri.length})</span>
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
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
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

                {/* 5. Guru & Tendik */}
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

                {/* 6. Inovasi */}
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
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
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
                            <div className="w-14 h-14 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
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

                {/* 8. Akademik */}
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
                          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                            <GraduationCap size={22} />
                          </div>
                          <div className="overflow-hidden min-w-0 flex-1">
                            {akd.parent_label && (
                              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
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
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400 flex items-center justify-between px-6">
            <span>SD Negeri 1 Mulyoagung</span>
            <span>Tekan <strong>Esc</strong> untuk menutup</span>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};
