import React, { useState, useEffect } from 'react';
import {
  Users, Image, FileText, User, ShieldAlert, LogOut, ArrowLeft,
  School, Building, Settings, Award, Megaphone, BarChart3, Menu, X,
  BookOpen, History, Layers, Globe, GraduationCap, Sliders, Mail, Share2,
  LayoutDashboard
} from 'lucide-react';
import { getImageUrl } from '../../config/api';
import { UserSession, CmsTab } from '../types';
import logoImg from '../../assets/images/logo.png';

interface CmsSidebarProps {
  user: UserSession;
  activeTab: CmsTab;
  setActiveTab: (tab: CmsTab) => void;
  onBackToHome: () => void;
  onLogout: () => void;
}

export default function CmsSidebar({
  user,
  activeTab,
  setActiveTab,
  onBackToHome,
  onLogout,
}: CmsSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);

  // Auto hide sticky navbar on scroll down, show on scroll up
  useEffect(() => {
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      const scrollDiff = currentScrollY - lastScrollY;

      // Always show if near the top
      if (currentScrollY < 10) {
        setIsNavVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      // Ignore small scroll jitters (< 6px)
      if (Math.abs(scrollDiff) < 6) {
        return;
      }

      // Scrolling down -> hide navbar
      if (scrollDiff > 0 && currentScrollY > 40) {
        setIsNavVisible(false);
      } 
      // Scrolling up -> show navbar
      else if (scrollDiff < 0) {
        setIsNavVisible(true);
      }

      lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (mobileOpen) {
      const prevBody = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleResize = () => {
        if (window.innerWidth >= 768) {
          setMobileOpen(false);
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          setMobileOpen(false);
        }
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = prevBody;
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileOpen]);

  const handleSelectTab = (tab: CmsTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  const navItems = (
    <nav className="p-4 space-y-6">
      {/* Kategori: DASHBOARD OVERVIEW */}
      <div className="space-y-1">
        <button
          onClick={() => handleSelectTab('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'dashboard'
            ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
        >
          <LayoutDashboard size={18} /> Dashboard
        </button>
      </div>

      {/* Kategori: POST */}
      {user.role !== 'GURU' && (
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 block mb-1">
            Postingan
          </span>
          {user.role === 'ADMIN' && (
            <button
              onClick={() => handleSelectTab('pengumuman')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'pengumuman'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
            >
              <Megaphone size={18} /> Pengumuman Penting
            </button>
          )}
          <button
            onClick={() => handleSelectTab('berita')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'berita'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
          >
            <FileText size={18} /> Berita &amp; Kegiatan
          </button>
          <button
            onClick={() => handleSelectTab('galeri')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'galeri'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
          >
            <Image size={18} /> Galeri Foto
          </button>
        </div>
      )}

      {/* Kategori: DATA SEKOLAH */}
      {(user.role === 'ADMIN' || user.role === 'GURU') && (
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 block mb-1">
            Data Sekolah
          </span>
          <button
            onClick={() => handleSelectTab('modul')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'modul'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
          >
            <BookOpen size={18} /> Modul Pembelajaran
          </button>
          {user.role === 'ADMIN' && (
            <>
              <button
                onClick={() => handleSelectTab('akademik')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'akademik'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
              >
                <Layers size={18} /> Menu Akademik
              </button>
              <button
                onClick={() => handleSelectTab('visimisi')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'visimisi'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
              >
                <BookOpen size={18} /> Visi &amp; Misi
              </button>
              <button
                onClick={() => handleSelectTab('sejarah')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'sejarah'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
              >
                <History size={18} /> Sejarah Sekolah
              </button>
              <button
                onClick={() => handleSelectTab('guru')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'guru'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
              >
                <Users size={18} /> Direktori Guru
              </button>
              <button
                onClick={() => handleSelectTab('fasilitas')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'fasilitas'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
              >
                <Building size={18} /> Fasilitas Pembelajaran
              </button>
              <button
                onClick={() => handleSelectTab('statistik')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'statistik'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
              >
                <BarChart3 size={18} /> Statistik Sekolah
              </button>
            </>
          )}
        </div>
      )}

      {/* Kategori: PENGATURAN WEBSITE */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 block mb-1">
          Pengaturan Website
        </span>
        {user.role === 'ADMIN' && (
          <>
            <button
              onClick={() => handleSelectTab('sambutan')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'sambutan'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
            >
              <Award size={18} /> Sambutan Kepsek
            </button>
            <button
              onClick={() => handleSelectTab('strukturorganisasi')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'strukturorganisasi'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
            >
              <Layers size={18} /> Struktur Halaman
            </button>
            <button
              onClick={() => handleSelectTab('kontenutama')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'kontenutama'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
            >
              <Globe size={18} /> Video Profil
            </button>
            <button
              onClick={() => handleSelectTab('ppdb')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'ppdb'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
            >
              <GraduationCap size={18} /> Halaman PPDB
            </button>
            <button
              onClick={() => handleSelectTab('hero')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'hero'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
            >
              <Sliders size={18} /> Carousel Hero Header
            </button>
            <button
              onClick={() => handleSelectTab('kontak')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'kontak'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
            >
              <Mail size={18} /> Kontak Resmi
            </button>
            <button
              onClick={() => handleSelectTab('medsos')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'medsos'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
            >
              <Share2 size={18} /> Media Sosial
            </button>
            <button
              onClick={() => handleSelectTab('verifikasi')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'verifikasi'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
            >
              <ShieldAlert size={18} /> Pusat Verifikasi
            </button>
          </>
        )}
        <button
          onClick={() => handleSelectTab('user')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'user'
            ? 'bg-teal-600 text-white shadow-sm'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
        >
          <User size={18} /> Pengaturan Akun
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile Top Navigation Header */}
      <div
        className={`md:hidden bg-slate-900 text-white px-4 py-3.5 flex justify-between items-center fixed top-0 left-0 right-0 z-40 shadow-md border-b border-slate-800 transition-transform duration-300 ease-in-out ${
          isNavVisible || mobileOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <img src={logoImg} alt="Logo SD" className="w-7 h-7 object-contain shrink-0" />
          <div>
            <h1 className="font-bold text-xs leading-tight text-slate-200">SDN 1 Mulyoagung</h1>
            <p className="text-[10px] text-teal-400 font-semibold uppercase">{activeTab}</p>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Spacer for Mobile Fixed Top Header */}
      <div className="md:hidden h-14 w-full shrink-0" />

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar Content container (Fixed 100vh drawer on mobile & fixed 100vh sidebar on desktop) */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 md:z-30 w-72 md:w-64 bg-slate-900 text-white flex flex-col h-screen max-h-screen shrink-0 overflow-y-auto transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex-grow">
          {/* Logo Section */}
          <div className="p-5 sm:p-6 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="Logo SD" className="w-8 h-8 object-contain shrink-0" />
              <div>
                <h1 className="font-bold text-sm leading-tight text-slate-200">SDN 1 Mulyoagung</h1>
                <p className="text-xs text-slate-500">Dashboard Konten</p>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Section */}
          <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
              {user.foto ? (
                <img
                  src={getImageUrl(user.foto)}
                  alt={user.nama_penanggung_jawab}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={20} className="text-slate-400" />
              )}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-xs truncate text-slate-200">{user.nama_penanggung_jawab}</p>
              <span
                className={`text-[10px] uppercase font-bold tracking-wide px-2 py-0.5 rounded-full inline-block mt-0.5 ${user.role === 'ADMIN'
                  ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/50'
                  : 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
                  }`}
              >
                {user.role}
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          {navItems}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2 mt-auto">
          <button
            onClick={() => {
              setMobileOpen(false);
              onBackToHome();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Ke Web Utama
          </button>
          <button
            onClick={() => {
              setMobileOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut size={14} /> Keluar Akun
          </button>
        </div>
      </aside>
    </>
  );
}