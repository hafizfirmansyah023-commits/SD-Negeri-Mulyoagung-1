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
  ShieldAlert,
  Megaphone,
  LayoutDashboard,
  Layers,
  Users,
  Settings,
  Sliders,
  Mail,
  Share2,
  BarChart3,
  History,
  CheckCircle2,
  Clock,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { getApiBaseUrl, getImageUrl } from '../../config/api';
import { UserSession, CmsTab } from '../types';

interface CmsGlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession;
  setActiveTab: (tab: CmsTab) => void;
}

type CmsSearchCategory =
  | 'all'
  | 'menu'
  | 'berita'
  | 'galeri'
  | 'modul'
  | 'inovasi'
  | 'guru'
  | 'akademik'
  | 'fasilitas'
  | 'users'
  | 'pengumuman';

interface CmsSearchResults {
  berita: Array<{ id: number | string; judul: string; kategori: string; tanggal: string; isi: string; foto?: string; status_verifikasi?: string }>;
  galeri: Array<{ id: number | string; judul: string; kategori: string; tanggal: string; deskripsi: string; foto?: string; status_verifikasi?: string }>;
  modul: Array<{ id: number; judul: string; deskripsi: string; mata_pelajaran: string; kelas: string; semester: string; kategori: string; foto?: string; uploader?: string; status?: string; status_verifikasi?: string }>;
  guru: Array<{ id: number | string; nama: string; jabatan: string; tugas: string; nip?: string; foto?: string; status?: string }>;
  inovasi: Array<{ id: number | string; judul: string; kategori: string; inovator?: string; deskripsi?: string; link_drive?: string; foto?: string; status?: string; status_verifikasi?: string }>;
  akademik: Array<{ id: number; label: string; deskripsi?: string; parent_id?: number | null; parent_label?: string; link_gdrive?: string; is_modul?: number; aktif?: number }>;
  fasilitas: Array<{ id: number; judul: string; deskripsi: string; foto?: string }>;
  users: Array<{ id: number; nama_penanggung_jawab: string; username: string; email: string; role: string; status?: string }>;
  pengumuman: Array<{ id: number; judul: string; isi: string; tanggal?: string; status?: string }>;
}

const initialResults: CmsSearchResults = {
  berita: [],
  galeri: [],
  modul: [],
  guru: [],
  inovasi: [],
  akademik: [],
  fasilitas: [],
  users: [],
  pengumuman: [],
};

interface CmsMenuItem {
  tab: CmsTab;
  title: string;
  description: string;
  icon: any;
  allowedRoles: string[];
  keywords: string[];
}

const ALL_CMS_MENUS: CmsMenuItem[] = [
  {
    tab: 'dashboard',
    title: 'Dashboard Utama',
    description: 'Statistik & ringkasan aktivitas konten',
    icon: LayoutDashboard,
    allowedRoles: ['ADMIN', 'GURU', 'TIM'],
    keywords: ['dashboard', 'overview', 'ringkasan', 'stat', 'home', 'beranda', 'admin'],
  },
  {
    tab: 'berita',
    title: 'Berita & Kegiatan',
    description: 'Kelola artikel berita dan kabar sekolah',
    icon: FileText,
    allowedRoles: ['ADMIN', 'TIM'],
    keywords: ['berita', 'news', 'article', 'articles', 'artikel', 'post', 'posting', 'kabar', 'kegiatan', 'event', 'publikasi'],
  },
  {
    tab: 'galeri',
    title: 'Galeri Foto',
    description: 'Dokumentasi foto kegiatan sekolah',
    icon: ImageIcon,
    allowedRoles: ['ADMIN', 'TIM'],
    keywords: ['galeri', 'gallery', 'photo', 'photos', 'foto', 'gambar', 'image', 'images', 'album', 'dokumentasi', 'documentation'],
  },
  {
    tab: 'modul',
    title: 'Modul Pembelajaran',
    description: 'Materi ajar digital, LKPD & panduan',
    icon: BookOpen,
    allowedRoles: ['ADMIN', 'GURU'],
    keywords: ['modul', 'module', 'modules', 'materi', 'learning', 'materials', 'lesson', 'lessons', 'pembelajaran', 'buku', 'book', 'lkpd', 'worksheet', 'bahan ajar', 'subject', 'kurikulum merdeka'],
  },
  {
    tab: 'inovasi',
    title: 'Inovasi Sekolah',
    description: 'Dokumentasi inovasi dan karya kreatif',
    icon: Lightbulb,
    allowedRoles: ['ADMIN', 'GURU'],
    keywords: ['inovasi', 'innovation', 'karya', 'creation', 'creativity', 'kreativitas', 'program', 'project', 'projek', 'inovatif', 'innovative', 'kabumiga', 'jumaga'],
  },
  {
    tab: 'panduan',
    title: 'Panduan Pengumpulan Dokumen Guru',
    description: 'Panduan format dan pengumpulan berkas via WhatsApp Admin',
    icon: HelpCircle,
    allowedRoles: ['GURU'],
    keywords: ['panduan', 'tata cara', 'pengumpulan', 'administrasi', 'guru', 'whatsapp', 'prota', 'promes', 'bedah cp', 'analisis hari efektif', 'mpls', 'asesmen', 'lkpd', 'modul ajar'],
  },
  {
    tab: 'guru',
    title: 'Direktori Guru & Tendik',
    description: 'Data profil tenaga pendidik & staf',
    icon: User,
    allowedRoles: ['ADMIN'],
    keywords: ['guru', 'teacher', 'teachers', 'tendik', 'staff', 'staf', 'pegawai', 'tenaga pendidik', 'educator', 'kepala sekolah', 'direktori', 'directory', 'profil guru'],
  },
  {
    tab: 'akademik',
    title: 'Menu Dokumen Akademik',
    description: 'Kelola dokumen akademik Google Drive',
    icon: Layers,
    allowedRoles: ['ADMIN'],
    keywords: ['akademik', 'academic', 'dokumen', 'documents', 'kurikulum', 'curriculum', 'kalender pendidikan', 'academic calendar', 'gdrive', 'google drive'],
  },
  {
    tab: 'pengumuman',
    title: 'Pengumuman Penting',
    description: 'Kelola teks pengumuman darurat / banner',
    icon: Megaphone,
    allowedRoles: ['ADMIN'],
    keywords: ['pengumuman', 'announcement', 'announcements', 'notice', 'banner', 'penting', 'urgent', 'alert', 'info', 'informasi'],
  },
  {
    tab: 'verifikasi',
    title: 'Pusat Verifikasi Konten',
    description: 'Review & persetujuan konten dari Tim/Guru',
    icon: ShieldAlert,
    allowedRoles: ['ADMIN'],
    keywords: ['verifikasi', 'verification', 'approval', 'approve', 'review', 'moderasi', 'pusat verifikasi', 'pending', 'rejected', 'status'],
  },
  {
    tab: 'fasilitas',
    title: 'Fasilitas Sekolah',
    description: 'Daftar sarana dan prasarana',
    icon: Building2,
    allowedRoles: ['ADMIN'],
    keywords: ['fasilitas', 'facility', 'facilities', 'sarana', 'prasarana', 'infrastructure', 'lab', 'perpus', 'ruang', 'gedung', 'laboratorium'],
  },
  {
    tab: 'statistik',
    title: 'Statistik Sekolah',
    description: 'Angka murid, guru, ruang kelas, prestasi',
    icon: BarChart3,
    allowedRoles: ['ADMIN'],
    keywords: ['statistik', 'statistic', 'statistics', 'data', 'angka', 'jumlah siswa', 'prestasi', 'metrics', 'stats'],
  },
  {
    tab: 'user',
    title: 'Manajemen Pengguna & Akun',
    description: 'Kelola akun Admin, Guru, dan Tim',
    icon: Users,
    allowedRoles: ['ADMIN', 'GURU', 'TIM'],
    keywords: ['user', 'users', 'pengguna', 'akun', 'account', 'accounts', 'admin', 'guru', 'tim', 'role', 'password', 'profil saya', 'profile'],
  },
  {
    tab: 'pengaturan',
    title: 'Struktur Halaman Utama',
    description: 'Urutan dan visibilitas section beranda',
    icon: Sliders,
    allowedRoles: ['ADMIN'],
    keywords: ['pengaturan', 'settings', 'struktur', 'halaman utama', 'layout', 'sections', 'urutan', 'beranda', 'homepage'],
  },
  {
    tab: 'visimisi',
    title: 'Visi & Misi',
    description: 'Visi, misi, dan tujuan sekolah',
    icon: CheckCircle2,
    allowedRoles: ['ADMIN'],
    keywords: ['visi misi', 'vision mission', 'vision', 'mission', 'visi', 'misi', 'tujuan', 'goals', 'objective'],
  },
  {
    tab: 'sejarah',
    title: 'Sejarah Sekolah',
    description: 'Sejarah berdirinya SDN 1 Mulyoagung',
    icon: History,
    allowedRoles: ['ADMIN'],
    keywords: ['sejarah', 'history', 'about', 'tentang', 'asal usul', 'pendirian'],
  },
  {
    tab: 'hero',
    title: 'Carousel Hero Banner',
    description: 'Banner slider gambar di beranda utama',
    icon: Sliders,
    allowedRoles: ['ADMIN'],
    keywords: ['hero', 'banner', 'slider', 'carousel', 'header', 'gambar depan', 'slide'],
  },
  {
    tab: 'kontenutama',
    title: 'Video Profil Sekolah',
    description: 'Embed video profil YouTube resmi',
    icon: Layers,
    allowedRoles: ['ADMIN'],
    keywords: ['video', 'video profil', 'youtube', 'embed', 'media', 'konten video', 'profile video'],
  },
  {
    tab: 'ppdb',
    title: 'Halaman PPDB',
    description: 'Pengaturan link pendaftaran siswa baru',
    icon: GraduationCap,
    allowedRoles: ['ADMIN'],
    keywords: ['ppdb', 'pendaftaran', 'admission', 'admissions', 'siswa baru', 'register', 'registration', 'link ppdb'],
  },
  {
    tab: 'kontak',
    title: 'Kontak Resmi',
    description: 'Alamat, nomor WhatsApp, email, peta',
    icon: Mail,
    allowedRoles: ['ADMIN'],
    keywords: ['kontak', 'contact', 'contact us', 'alamat', 'address', 'whatsapp', 'email', 'telepon', 'phone', 'maps', 'lokasi', 'location'],
  },
  {
    tab: 'medsos',
    title: 'Media Sosial',
    description: 'Link akun YouTube, Instagram, Facebook, TikTok',
    icon: Share2,
    allowedRoles: ['ADMIN'],
    keywords: ['medsos', 'media sosial', 'social media', 'instagram', 'youtube', 'tiktok', 'facebook', 'links'],
  },
];

export const CmsGlobalSearchModal: React.FC<CmsGlobalSearchModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  setActiveTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CmsSearchCategory>('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CmsSearchResults>(initialResults);

  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce 400ms for CMS fast response
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
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Focus and reset
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchTerm('');
      setDebouncedQuery('');
      setIsDebouncing(false);
      setActiveCategory('all');
      setResults(initialResults);
    }
  }, [isOpen]);

  // Server-side search for CMS
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
        const res = await fetch(
          `${getApiBaseUrl()}/backend/API/search.php?q=${encodeURIComponent(debouncedQuery.trim())}&status=all&cms=1`
        );
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
            users: json.data.users || [],
            pengumuman: json.data.pengumuman || [],
          });
        }
      } catch {
        // Handle error silently
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSearch();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      const prevBody = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevBody;
      };
    }
  }, [isOpen]);

  // Escape key listener
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

  // Filter accessible CMS menus matching query (bilingual support)
  const matchedMenus = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    if (!q) return [];
    return ALL_CMS_MENUS.filter(
      (m) =>
        m.allowedRoles.includes(currentUser.role) &&
        (m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.tab.toLowerCase().includes(q) ||
          m.keywords.some((kw) => kw.includes(q) || q.includes(kw)))
    );
  }, [debouncedQuery, currentUser.role]);

  const totalResults = useMemo(() => {
    return (
      matchedMenus.length +
      results.berita.length +
      results.galeri.length +
      results.modul.length +
      results.guru.length +
      results.inovasi.length +
      results.akademik.length +
      results.fasilitas.length +
      results.users.length +
      results.pengumuman.length
    );
  }, [matchedMenus, results]);

  const navigate = useNavigate();

  const handleSelectTab = (tab: CmsTab, searchKeyword?: string) => {
    if (searchKeyword) {
      navigate(`/cms/${tab}`, { state: { cmsSearch: searchKeyword } });
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('cms-search-filter', { detail: { search: searchKeyword } }));
      }, 50);
    } else {
      setActiveTab(tab);
    }
    onClose();
  };

  const renderStatusBadge = (statusVerif?: string, statusDoc?: string) => {
    if (!statusVerif && !statusDoc) return null;
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        {statusVerif === 'Verified' && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
            <CheckCircle2 size={10} /> Verified
          </span>
        )}
        {statusVerif === 'Pending' && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
            <Clock size={10} /> Pending
          </span>
        )}
        {statusVerif === 'Rejected' && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full">
            <XCircle size={10} /> Rejected
          </span>
        )}
        {statusDoc && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              statusDoc === 'Published'
                ? 'bg-teal-100 text-teal-800'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {statusDoc}
          </span>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-start justify-center p-3 sm:p-6 sm:pt-14 overflow-y-auto overscroll-contain">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className="relative bg-slate-900 text-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col my-auto sm:my-0 max-h-[85vh] animate-in fade-in zoom-in-95 duration-200 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center gap-3 bg-slate-900/90">
          {isDebouncing || loading ? (
            <Loader2 className="text-teal-400 shrink-0 animate-spin" size={22} />
          ) : (
            <Search className="text-teal-400 shrink-0" size={22} />
          )}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari fitur CMS, data berita, galeri, modul, inovasi, guru, user..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full text-slate-500 hover:text-slate-300 cursor-pointer"
              title="Hapus"
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs font-semibold px-3 cursor-pointer shrink-0 border border-slate-700"
          >
            Esc
          </button>
        </div>

        {/* Category Filter Pills */}
        {debouncedQuery && (
          <div className="px-4 sm:px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { key: 'all', label: 'Semua', count: totalResults },
              { key: 'menu', label: 'Menu CMS', count: matchedMenus.length, icon: Sliders },
              { key: 'berita', label: 'Berita', count: results.berita.length, icon: FileText },
              { key: 'galeri', label: 'Galeri', count: results.galeri.length, icon: ImageIcon },
              { key: 'modul', label: 'Modul', count: results.modul.length, icon: BookOpen },
              { key: 'inovasi', label: 'Inovasi', count: results.inovasi.length, icon: Lightbulb },
              { key: 'guru', label: 'Guru', count: results.guru.length, icon: User },
              { key: 'akademik', label: 'Akademik', count: results.akademik.length, icon: Layers },
              { key: 'fasilitas', label: 'Fasilitas', count: results.fasilitas.length, icon: Building2 },
              ...(currentUser.role === 'ADMIN'
                ? [{ key: 'users', label: 'Users', count: results.users.length, icon: Users }]
                : []),
              { key: 'pengumuman', label: 'Pengumuman', count: results.pengumuman.length, icon: Megaphone },
            ].map((cat) => {
              const isActive = activeCategory === cat.key;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key as CmsSearchCategory)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {Icon && <Icon size={12} className="shrink-0" />}
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Results Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {!searchTerm.trim() ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Sparkles size={36} className="mx-auto text-teal-400/60" />
              <p className="text-sm font-semibold text-slate-300">Pencarian Cepat CMS SDN 1 Mulyoagung</p>
              <p className="text-xs text-slate-500">
                Ketik kata kunci untuk mencari menu admin, berita, galeri, modul, inovasi, guru, atau pengguna.
              </p>
            </div>
          ) : isDebouncing || loading ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <Loader2 size={36} className="mx-auto text-teal-400 animate-spin" />
              <p className="text-sm font-medium text-slate-400">Mencari data di database CMS...</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Search size={36} className="mx-auto text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">Tidak ada hasil untuk &quot;{debouncedQuery}&quot;</p>
              <p className="text-xs text-slate-500">Coba kata kunci lain atau periksa ejaan.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 1. Menu Navigasi CMS */}
              {(activeCategory === 'all' || activeCategory === 'menu') && matchedMenus.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Sliders size={14} className="text-teal-400" />
                    <span>Menu Navigasi CMS ({matchedMenus.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {matchedMenus.map((menu) => {
                      const Icon = menu.icon;
                      return (
                        <div
                          key={`menu-${menu.tab}`}
                          onClick={() => handleSelectTab(menu.tab)}
                          className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-teal-500/50 rounded-2xl transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-teal-900/60 text-teal-300 flex items-center justify-center shrink-0 border border-teal-700/40">
                              <Icon size={18} />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-200 truncate group-hover:text-teal-300">
                                {menu.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 truncate">{menu.description}</p>
                            </div>
                          </div>
                          <ArrowRight size={15} className="text-slate-500 group-hover:text-teal-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Berita & Postingan */}
              {(activeCategory === 'all' || activeCategory === 'berita') && results.berita.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <FileText size={14} className="text-teal-400" />
                    <span>Berita &amp; Artikel ({results.berita.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {results.berita.map((art) => (
                      <div
                        key={`b-${art.id}`}
                        onClick={() => handleSelectTab('berita', art.judul)}
                        className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-teal-500/50 rounded-2xl transition-all cursor-pointer flex items-center gap-3 group"
                      >
                        {art.foto && (
                          <img
                            src={getImageUrl(art.foto)}
                            alt={art.judul}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <span className="text-[10px] font-bold text-teal-300 bg-teal-900/60 px-2 py-0.2 rounded">
                              {art.kategori}
                            </span>
                            {renderStatusBadge(art.status_verifikasi)}
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-200 truncate group-hover:text-teal-300">
                            {art.judul}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">{art.tanggal}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Inovasi */}
              {(activeCategory === 'all' || activeCategory === 'inovasi') && results.inovasi.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Lightbulb size={14} className="text-amber-400" />
                    <span>Inovasi Sekolah ({results.inovasi.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {results.inovasi.map((inov) => (
                      <div
                        key={`i-${inov.id}`}
                        onClick={() => handleSelectTab('inovasi', inov.judul)}
                        className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/50 rounded-2xl transition-all cursor-pointer flex items-center gap-3 group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-amber-900/50 text-amber-300 flex items-center justify-center shrink-0 border border-amber-700/40">
                          <Lightbulb size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <span className="text-[10px] font-bold text-amber-300 bg-amber-900/60 px-2 py-0.2 rounded">
                              {inov.kategori}
                            </span>
                            {renderStatusBadge(inov.status_verifikasi, inov.status)}
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-200 truncate group-hover:text-amber-300">
                            {inov.judul}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">Oleh: {inov.inovator || 'Guru'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Modul Pembelajaran */}
              {(activeCategory === 'all' || activeCategory === 'modul') && results.modul.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <BookOpen size={14} className="text-blue-400" />
                    <span>Modul Pembelajaran ({results.modul.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {results.modul.map((mod) => (
                      <div
                        key={`m-${mod.id}`}
                        onClick={() => handleSelectTab('modul', mod.judul)}
                        className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/50 rounded-2xl transition-all cursor-pointer flex items-center gap-3 group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-blue-900/50 text-blue-300 flex items-center justify-center shrink-0 border border-blue-700/40">
                          <BookOpen size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <span className="text-[10px] font-bold text-blue-300 bg-blue-900/60 px-2 py-0.2 rounded">
                              {mod.kelas} • {mod.mata_pelajaran}
                            </span>
                            {renderStatusBadge(mod.status_verifikasi, mod.status)}
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-200 truncate group-hover:text-blue-300">
                            {mod.judul}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">Uploader: {mod.uploader || 'Guru'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Galeri */}
              {(activeCategory === 'all' || activeCategory === 'galeri') && results.galeri.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <ImageIcon size={14} className="text-amber-400" />
                    <span>Galeri Foto ({results.galeri.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {results.galeri.map((gal) => (
                      <div
                        key={`g-${gal.id}`}
                        onClick={() => handleSelectTab('galeri', gal.judul)}
                        className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/50 rounded-2xl transition-all cursor-pointer flex items-center gap-3 group"
                      >
                        {gal.foto && (
                          <img
                            src={getImageUrl(gal.foto)}
                            alt={gal.judul}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <span className="text-[10px] font-bold text-amber-300 bg-amber-900/60 px-2 py-0.2 rounded">
                              {gal.kategori}
                            </span>
                            {renderStatusBadge(gal.status_verifikasi)}
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-200 truncate group-hover:text-amber-300">
                            {gal.judul}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">{gal.tanggal}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Guru & Tendik */}
              {(activeCategory === 'all' || activeCategory === 'guru') && results.guru.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <User size={14} className="text-emerald-400" />
                    <span>Guru &amp; Tendik ({results.guru.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {results.guru.map((teach) => (
                      <div
                        key={`t-${teach.id}`}
                        onClick={() => handleSelectTab('guru', teach.nama)}
                        className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 rounded-2xl transition-all cursor-pointer flex items-center gap-3 group"
                      >
                        <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden shrink-0 border border-slate-600">
                          {teach.foto ? (
                            <img src={getImageUrl(teach.foto)} alt={teach.nama} className="w-full h-full object-cover" />
                          ) : (
                            <User size={18} className="text-slate-400 m-auto mt-2" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-200 truncate group-hover:text-emerald-300">
                            {teach.nama}
                          </h4>
                          <p className="text-[11px] text-teal-400 truncate">{teach.tugas || teach.jabatan}</p>
                          <p className="text-[10px] text-slate-500 truncate">NIP: {teach.nip || '-'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. Users / Pengguna (Admin only) */}
              {(activeCategory === 'all' || activeCategory === 'users') &&
                currentUser.role === 'ADMIN' &&
                results.users.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <Users size={14} className="text-purple-400" />
                      <span>Manajemen Pengguna ({results.users.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {results.users.map((usr) => (
                        <div
                          key={`u-${usr.id}`}
                          onClick={() => handleSelectTab('user', usr.nama_penanggung_jawab || usr.username)}
                          className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-purple-500/50 rounded-2xl transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-purple-900/60 text-purple-300 flex items-center justify-center shrink-0 border border-purple-700/40">
                              <Users size={16} />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <h4 className="text-xs sm:text-sm font-bold text-slate-200 truncate group-hover:text-purple-300">
                                  {usr.nama_penanggung_jawab}
                                </h4>
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-700 text-purple-300 border border-purple-800">
                                  {usr.role}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 truncate">@{usr.username} • {usr.email}</p>
                            </div>
                          </div>
                          <ArrowRight size={14} className="text-slate-500 group-hover:text-purple-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* 8. Menu Akademik */}
              {(activeCategory === 'all' || activeCategory === 'akademik') && results.akademik.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Layers size={14} className="text-indigo-400" />
                    <span>Dokumen Akademik ({results.akademik.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {results.akademik.map((akd) => (
                      <div
                        key={`ak-${akd.id}`}
                        onClick={() => handleSelectTab('akademik', akd.label)}
                        className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 rounded-2xl transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-indigo-900/60 text-indigo-300 flex items-center justify-center shrink-0">
                            <Layers size={16} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-200 truncate group-hover:text-indigo-300">
                              {akd.label}
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate">
                              {akd.parent_label ? `Kategori: ${akd.parent_label}` : 'Kategori Utama'}
                            </p>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-slate-500 group-hover:text-indigo-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 9. Fasilitas */}
              {(activeCategory === 'all' || activeCategory === 'fasilitas') && results.fasilitas.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Building2 size={14} className="text-rose-400" />
                    <span>Fasilitas Sekolah ({results.fasilitas.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {results.fasilitas.map((fas) => (
                      <div
                        key={`f-${fas.id}`}
                        onClick={() => handleSelectTab('fasilitas', fas.judul)}
                        className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-rose-500/50 rounded-2xl transition-all cursor-pointer flex items-center gap-3 group"
                      >
                        {fas.foto ? (
                          <img
                            src={getImageUrl(fas.foto)}
                            alt={fas.judul}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-rose-900/50 text-rose-300 flex items-center justify-center shrink-0">
                            <Building2 size={20} />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-200 truncate group-hover:text-rose-300">
                            {fas.judul}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">{fas.deskripsi}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 10. Pengumuman */}
              {(activeCategory === 'all' || activeCategory === 'pengumuman') && results.pengumuman.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Megaphone size={14} className="text-amber-400" />
                    <span>Pengumuman Sekolah ({results.pengumuman.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {results.pengumuman.map((peng) => (
                      <div
                        key={`p-${peng.id}`}
                        onClick={() => handleSelectTab('pengumuman', peng.judul)}
                        className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/50 rounded-2xl transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-200 truncate group-hover:text-amber-300">
                            {peng.judul}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate">{peng.isi}</p>
                        </div>
                        <ArrowRight size={14} className="text-slate-500 group-hover:text-amber-400 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-500 flex items-center justify-between px-5">
          <span>Tekan <strong>Esc</strong> untuk menutup</span>
          <span>CMS Global Search • SDN 1 Mulyoagung</span>
        </div>
      </div>
    </div>,
    document.body
  );
};
