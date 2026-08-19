import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  Image as ImageIcon,
  Megaphone,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sliders,
  GraduationCap,
  BarChart3,
  RefreshCw,
  Eye,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { getApiBaseUrl, getImageUrl } from '../config/api';
import { UserSession, CmsTab } from './types';

interface CmsOverviewDashboardProps {
  currentUser: UserSession;
  setActiveTab: (tab: CmsTab) => void;
}

interface GuruItem {
  id: number;
  nama: string;
  status: string;
}

interface BeritaItem {
  id: number;
  judul: string;
  tanggal: string;
  status_verifikasi: 'Pending' | 'Verified' | 'Rejected';
  uploaded_by?: number;
  uploader?: string;
  foto?: string;
  foto_crop?: string;
}

interface GaleriItem {
  id: number;
  judul: string;
  tanggal: string;
  status_verifikasi: 'Pending' | 'Verified' | 'Rejected';
  uploaded_by?: number;
  uploader?: string;
  foto?: string;
  foto_crop?: string;
  deskripsi?: string;
}


interface UserItem {
  id: number;
  username: string;
  role: 'ADMIN' | 'TIM';
  nama_penanggung_jawab: string;
}

interface HeroSlide {
  id: number;
  judul?: string;
}

interface StatItem {
  id: number;
  judul: string;
  jumlah: string;
  label: string;
}

const API_BASE = getApiBaseUrl();

export const CmsOverviewDashboard: React.FC<CmsOverviewDashboardProps> = ({
  currentUser,
  setActiveTab,
}) => {
  const isAdmin = currentUser.role === 'ADMIN';

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Data states
  const [guruList, setGuruList] = useState<GuruItem[]>([]);
  const [beritaList, setBeritaList] = useState<BeritaItem[]>([]);
  const [galeriList, setGaleriList] = useState<GaleriItem[]>([]);
  const [userList, setUserList] = useState<UserItem[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [tahunAjaran, setTahunAjaran] = useState<string>('2025/2026');
  const [linkPpdb, setLinkPpdb] = useState<string>('');
  const [statistikSekolah, setStatistikSekolah] = useState<StatItem[]>([]);

  const fetchDashboardData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setErrorMsg('');

    try {
      // Parallel API calls using Promise.allSettled for maximum fault tolerance
      const promises: Promise<Response>[] = [
        fetch(`${API_BASE}/backend/API/newsAPI.php?status=all`),
        fetch(`${API_BASE}/backend/API/galeri.php?status=all`),
      ];

      if (isAdmin) {
        promises.push(
          fetch(`${API_BASE}/backend/API/guru.php`),
          fetch(`${API_BASE}/backend/API/users.php`),
          fetch(`${API_BASE}/backend/API/hero_carousel.php`),
          fetch(`${API_BASE}/backend/API/pengaturan.php`),
          fetch(`${API_BASE}/backend/API/statistik.php`),
        );
      }

      const results = await Promise.allSettled(promises);

      // Process newsAPI
      if (results[0].status === 'fulfilled' && results[0].value.ok) {
        try {
          const json = await results[0].value.json();
          if (json.status === 'success' && Array.isArray(json.data)) {
            setBeritaList(json.data);
          }
        } catch {
          /* ignore parse error */
        }
      }

      // Process galeri
      if (results[1].status === 'fulfilled' && results[1].value.ok) {
        try {
          const json = await results[1].value.json();
          if (json.status === 'success' && Array.isArray(json.data)) {
            setGaleriList(json.data);
          }
        } catch {
          /* ignore parse error */
        }
      }

      if (isAdmin) {
        // Process guru
        if (results[2] && results[2].status === 'fulfilled' && results[2].value.ok) {
          try {
            const json = await results[2].value.json();
            if (json.status === 'success' && Array.isArray(json.data)) {
              setGuruList(json.data);
            }
          } catch {
            /* ignore */
          }
        }

        

        // Process users
        if (results[4] && results[4].status === 'fulfilled' && results[4].value.ok) {
          try {
            const json = await results[4].value.json();
            if (json.status === 'success' && Array.isArray(json.data)) {
              setUserList(json.data);
            }
          } catch {
            /* ignore */
          }
        }

        // Process hero carousel
        if (results[5] && results[5].status === 'fulfilled' && results[5].value.ok) {
          try {
            const json = await results[5].value.json();
            if (json.status === 'success' && Array.isArray(json.data)) {
              setHeroSlides(json.data);
            } else if (Array.isArray(json)) {
              setHeroSlides(json);
            }
          } catch {
            /* ignore */
          }
        }

        // Process pengaturan
        if (results[6] && results[6].status === 'fulfilled' && results[6].value.ok) {
          try {
            const json = await results[6].value.json();
            if (json.status === 'success' && json.data) {
              setTahunAjaran(json.data.tahun_ajaran || '2025/2026');
              setLinkPpdb(json.data.link_ppdb || '');
            }
          } catch {
            /* ignore */
          }
        }

        // Process statistik
        if (results[7] && results[7].status === 'fulfilled' && results[7].value.ok) {
          try {
            const json = await results[7].value.json();
            if (json.status === 'success' && Array.isArray(json.data)) {
              setStatistikSekolah(json.data);
            }
          } catch {
            /* ignore */
          }
        }
      }
    } catch {
      setErrorMsg('Gagal memuat beberapa data statistik dashboard.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [currentUser]);

  // Helper check for user upload ownership
  const isUploadedBySelf = (item: { uploaded_by?: number; uploader?: string }) => {
    if (item.uploaded_by && Number(item.uploaded_by) === Number(currentUser.id)) return true;
    if (item.uploader && item.uploader === currentUser.nama_penanggung_jawab) return true;
    return false;
  };

  // Calculations for ADMIN
  const guruAktifCount = guruList.filter((g) => g.status === 'Aktif').length;
  const totalGuruCount = guruList.length;

  const beritaVerifiedCount = beritaList.filter((b) => b.status_verifikasi === 'Verified').length;
  const beritaPendingCount = beritaList.filter((b) => b.status_verifikasi === 'Pending').length;

  const galeriVerifiedCount = galeriList.filter((g) => g.status_verifikasi === 'Verified').length;
  const galeriPendingCount = galeriList.filter((g) => g.status_verifikasi === 'Pending').length;


  const totalUsersCount = userList.length;
  const adminUsersCount = userList.filter((u) => u.role === 'ADMIN').length;
  const timUsersCount = userList.filter((u) => u.role === 'TIM').length;

  const totalPendingAction = beritaPendingCount + galeriPendingCount;

  // Calculations for TIM
  const myBeritaList = beritaList.filter(isUploadedBySelf);
  const myGaleriList = galeriList.filter(isUploadedBySelf);

  const myBeritaPending = myBeritaList.filter((b) => b.status_verifikasi === 'Pending').length;
  const myGaleriPending = myGaleriList.filter((g) => g.status_verifikasi === 'Pending').length;
  const myTotalPending = myBeritaPending + myGaleriPending;

  const myBeritaVerified = myBeritaList.filter((b) => b.status_verifikasi === 'Verified').length;
  const myGaleriVerified = myGaleriList.filter((g) => g.status_verifikasi === 'Verified').length;
  const myTotalVerified = myBeritaVerified + myGaleriVerified;

  // Recent 5 News & Recent 5 Gallery (Filtered if TIM)
  const recentBerita = (isAdmin ? beritaList : myBeritaList).slice(0, 5);
  const recentGaleri = (isAdmin ? galeriList : myGaleriList).slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                <Sparkles size={14} /> Dashboard Overview
              </span>
              <span className="bg-emerald-500/30 backdrop-blur-md text-emerald-100 text-xs font-semibold px-2.5 py-1 rounded-full">
                Role: {currentUser.role}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {currentUser.nama_penanggung_jawab}!
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm mt-1 max-w-xl">
              {isAdmin
                ? 'Kelola informasi sekolah, statistik publik, verifikasi postingan tim, serta konfigurasi website SD Negeri 1 Mulyoagung.'
                : 'Pantau status postingan berita dan dokumentasi foto galeri yang Anda unggah.'}
            </p>
          </div>

          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white backdrop-blur-md px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all border border-white/20 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Memperbarui...' : 'Segarkan Data'}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
          <AlertTriangle size={18} className="shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* SECTION 1: KARTU STATISTIK UTAMA */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : isAdmin ? (
        /* ADMIN STAT CARDS */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Guru Aktif */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  Guru &amp; Tendik
                </p>
                <h3 className="text-2xl font-black text-slate-800 mt-1">{guruAktifCount}</h3>
              </div>
              <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                <Users size={22} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Status Aktif</span>
              <span className="font-semibold text-teal-600">dari {totalGuruCount} total</span>
            </div>
          </div>

          {/* Card 2: Total Berita */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  Total Berita
                </p>
                <h3 className="text-2xl font-black text-slate-800 mt-1">{beritaList.length}</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <FileText size={22} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-600 font-semibold">{beritaVerifiedCount} Published</span>
              <span className="text-amber-600 font-semibold">{beritaPendingCount} Pending</span>
            </div>
          </div>

          {/* Card 3: Total Galeri */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  Foto Galeri
                </p>
                <h3 className="text-2xl font-black text-slate-800 mt-1">{galeriList.length}</h3>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <ImageIcon size={22} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-600 font-semibold">{galeriVerifiedCount} Verified</span>
              <span className="text-amber-600 font-semibold">{galeriPendingCount} Pending</span>
            </div>
          </div>


          {/* Card 5: User CMS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  User CMS
                </p>
                <h3 className="text-2xl font-black text-slate-800 mt-1">{totalUsersCount}</h3>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <UserCheck size={22} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-indigo-600 font-semibold">{adminUsersCount} Admin</span>
              <span className="text-teal-600 font-semibold">{timUsersCount} Tim</span>
            </div>
          </div>
        </div>
      ) : (
        /* TIM STAT CARDS */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase">Berita Diunggah</p>
              <h3 className="text-2xl font-extrabold text-slate-800">{myBeritaList.length}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl">
              <ImageIcon size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase">Galeri Diunggah</p>
              <h3 className="text-2xl font-extrabold text-slate-800">{myGaleriList.length}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase">Menunggu Verifikasi</p>
              <h3 className="text-2xl font-extrabold text-amber-600">{myTotalPending}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase">Telah Disetujui</p>
              <h3 className="text-2xl font-extrabold text-emerald-600">{myTotalVerified}</h3>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PANEL PERLU DITINDAKLANJUTI */}
      {isAdmin ? (
        <div
          className={`p-6 rounded-3xl border transition-all ${
            totalPendingAction > 0
              ? 'bg-amber-50/60 border-amber-200 shadow-md'
              : 'bg-white border-slate-100 shadow-sm'
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`p-3 rounded-2xl ${
                  totalPendingAction > 0
                    ? 'bg-amber-500 text-white animate-bounce'
                    : 'bg-teal-50 text-teal-600'
                }`}
              >
                <AlertTriangle size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-800">Perlu Ditindaklanjuti</h3>
                  {totalPendingAction > 0 && (
                    <span className="bg-red-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full animate-pulse">
                      {totalPendingAction} Item Pending
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                  {totalPendingAction > 0
                    ? 'Terdapat konten dari Tim Penulis yang memerlukan verifikasi Admin sebelum dipublikasikan ke publik.'
                    : 'Semua pengajuan berita dan galeri telah diverifikasi. Tidak ada antrean pending.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('verifikasi')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all cursor-pointer shrink-0"
            >
              <span>Lihat Pusat Verifikasi</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-200/60">
            <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-slate-700">
                  Berita Pending Verifikasi
                </span>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  beritaPendingCount > 0
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {beritaPendingCount} Berita
              </span>
            </div>

            <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <ImageIcon size={18} className="text-indigo-600" />
                <span className="text-xs sm:text-sm font-medium text-slate-700">
                  Galeri Pending Verifikasi
                </span>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  galeriPendingCount > 0
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {galeriPendingCount} Foto
              </span>
            </div>
          </div>
        </div>
      ) : myTotalPending > 0 ? (
        /* TIM PENDING NOTICE */
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock size={22} className="text-amber-600 shrink-0" />
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Postingan Menunggu Verifikasi</h4>
              <p className="text-slate-600 text-xs mt-0.5">
                Anda memiliki {myBeritaPending} berita dan {myGaleriPending} foto galeri yang saat
                ini sedang menunggu persetujuan admin.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* SECTION 3: AKTIVITAS TERBARU */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5 Berita Terakhir */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <FileText size={18} className="text-teal-600" />
              {isAdmin ? '5 Berita Terakhir' : 'Berita Terakhir Saya'}
            </h3>
            <button
              onClick={() => setActiveTab('berita')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
            >
              Lihat Semua <ArrowRight size={12} />
            </button>
          </div>

          {recentBerita.length === 0 ? (
            <p className="text-slate-400 text-xs py-4 text-center">Belum ada data berita.</p>
          ) : (
            <div className="space-y-3">
              {recentBerita.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50 border border-slate-100/80 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                      {item.judul}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {item.tanggal}
                      </span>
                      <span>&bull;</span>
                      <span>Oleh: {item.uploader || 'Admin'}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      item.status_verifikasi === 'Verified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.status_verifikasi === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {item.status_verifikasi}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5 Foto Galeri Terakhir */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <ImageIcon size={18} className="text-indigo-600" />
              {isAdmin ? '5 Galeri Terakhir' : 'Galeri Terakhir Saya'}
            </h3>
            <button
              onClick={() => setActiveTab('galeri')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
            >
              Lihat Semua <ArrowRight size={12} />
            </button>
          </div>

          {recentGaleri.length === 0 ? (
            <p className="text-slate-400 text-xs py-4 text-center">
              Belum ada data dokumentasi foto.
            </p>
          ) : (
            <div className="space-y-3">
              {recentGaleri.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50 border border-slate-100/80 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                      {item.foto_crop || item.foto ? (
                        <img
                          src={getImageUrl(item.foto_crop || item.foto || '')}
                          alt={item.judul}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon size={20} className="m-auto text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                        {item.judul}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span>{item.tanggal}</span>
                        <span>&bull;</span>
                        <span className="truncate">Oleh: {item.uploader || 'Admin'}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      item.status_verifikasi === 'Verified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.status_verifikasi === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {item.status_verifikasi}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 4 & 5: RINGKASAN HOMEPAGE & USER MANAGEMENT (ADMIN ONLY) */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section 4: Ringkasan Pengaturan Homepage */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 lg:col-span-2">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Sliders size={18} className="text-teal-600" /> Ringkasan Konfigurasi Homepage
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Hero Carousel */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-3">
                <div>
                  <p className="text-slate-500 text-xs font-semibold">Hero Carousel</p>
                  <h4 className="text-lg font-bold text-slate-800 mt-1">
                    {heroSlides.length} Slide Aktif
                  </h4>
                </div>
                <button
                  onClick={() => setActiveTab('hero')}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer pt-1"
                >
                  Kelola Carousel <ArrowRight size={12} />
                </button>
              </div>

              {/* Tahun Ajaran */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-3">
                <div>
                  <p className="text-slate-500 text-xs font-semibold">Tahun Ajaran</p>
                  <h4 className="text-lg font-bold text-slate-800 mt-1">{tahunAjaran}</h4>
                </div>
                <button
                  onClick={() => setActiveTab('visimisi')}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer pt-1"
                >
                  Atur Visi/Misi <ArrowRight size={12} />
                </button>
              </div>

              {/* Status PPDB */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-3">
                <div>
                  <p className="text-slate-500 text-xs font-semibold">Status Pendaftaran PPDB</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        linkPpdb ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                    <span className="text-xs font-bold text-slate-800">
                      {linkPpdb ? 'Link Aktif' : 'Belum Ada Link'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('ppdb')}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer pt-1"
                >
                  Kelola PPDB <ArrowRight size={12} />
                </button>
              </div>
            </div>

            {/* Sub-block: Statistik Sekolah di Homepage */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl space-y-3 mt-2">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                  <BarChart3 size={14} /> Statistik Sekolah di Homepage
                </span>
                <button
                  onClick={() => setActiveTab('statistik')}
                  className="text-xs text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  Ubah Data <ArrowRight size={12} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {statistikSekolah.length > 0 ? (
                  statistikSekolah.map((st) => (
                    <div key={st.id} className="bg-slate-800/80 p-2.5 rounded-xl text-center">
                      <p className="text-lg font-black text-teal-300">{st.jumlah}</p>
                      <p className="text-[11px] text-slate-300 truncate mt-0.5">{st.judul}</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 text-center text-xs text-slate-400 py-2">
                    Belum ada data statistik sekolah.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Manajemen User Summary */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <UserCheck size={18} className="text-teal-600" /> Ringkasan User CMS
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 text-white rounded-xl">
                      <UserCheck size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-indigo-950">Role ADMIN</p>
                      <p className="text-[11px] text-indigo-600">Akses penuh CRUD &amp; verifikasi</p>
                    </div>
                  </div>
                  <span className="text-xl font-black text-indigo-700">{adminUsersCount}</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-teal-50/70 border border-teal-100 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-600 text-white rounded-xl">
                      <Users size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-teal-950">Role TIM</p>
                      <p className="text-[11px] text-teal-600">Penulis berita &amp; galeri</p>
                    </div>
                  </div>
                  <span className="text-xl font-black text-teal-700">{timUsersCount}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('user')}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-2xl transition-all cursor-pointer text-xs sm:text-sm mt-4 shadow-sm"
            >
              <span>Kelola User &amp; Tambah Akun</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
