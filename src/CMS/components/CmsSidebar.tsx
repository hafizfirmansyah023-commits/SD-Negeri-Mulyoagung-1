import React, { useState } from 'react';
import {
  Users, Image, FileText, User, ShieldAlert, LogOut, ArrowLeft,
  School, Building, Settings, Award, Megaphone, BarChart3, Menu, X
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

  const handleSelectTab = (tab: CmsTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  const navItems = (
    <nav className="p-4 space-y-1.5">
      {user.role === 'ADMIN' && (
        <>
          <button
            onClick={() => handleSelectTab('guru')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'guru'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <Users size={18} /> Direktori Guru
          </button>
          <button
            onClick={() => handleSelectTab('sambutan')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'sambutan'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <Award size={18} /> Sambutan Kepsek
          </button>
          <button
            onClick={() => handleSelectTab('pengumuman')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'pengumuman'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <Megaphone size={18} /> Pengumuman Penting
          </button>
          <button
            onClick={() => handleSelectTab('statistik')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'statistik'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <BarChart3 size={18} /> Statistik Sekolah
          </button>
          <button
            onClick={() => handleSelectTab('fasilitas')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'fasilitas'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <Building size={18} /> Fasilitas Pembelajaran
          </button>
        </>
      )}

      <button
        onClick={() => handleSelectTab('galeri')}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
          activeTab === 'galeri'
            ? 'bg-teal-600 text-white shadow-sm'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
        }`}
      >
        <Image size={18} /> Galeri Foto
      </button>

      <button
        onClick={() => handleSelectTab('berita')}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
          activeTab === 'berita'
            ? 'bg-teal-600 text-white shadow-sm'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
        }`}
      >
        <FileText size={18} /> Berita & Pengumuman
      </button>

      {user.role === 'ADMIN' && (
        <button
          onClick={() => handleSelectTab('verifikasi')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'verifikasi'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
          }`}
        >
          <ShieldAlert size={18} /> Pusat Verifikasi
        </button>
      )}

      <button
        onClick={() => handleSelectTab('user')}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
          activeTab === 'user'
            ? 'bg-teal-600 text-white shadow-sm'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
        }`}
      >
        <User size={18} /> Pengaturan Akun
      </button>

      {user.role === 'ADMIN' && (
        <button
          onClick={() => handleSelectTab('pengaturan')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'pengaturan'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
          }`}
        >
          <Settings size={18} /> Pengaturan Sekolah
        </button>
      )}
    </nav>
  );

  return (
    <>
      {/* Mobile Top Navigation Header */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-md border-b border-slate-800">
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

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar Content container (Drawer on mobile, Sticky on desktop) */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 md:z-auto w-72 md:w-64 bg-slate-900 text-white flex flex-col h-screen max-h-screen shrink-0 overflow-y-auto transition-transform duration-300 ease-in-out ${
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
                className={`text-[10px] uppercase font-bold tracking-wide px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                  user.role === 'ADMIN'
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