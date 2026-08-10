import React from 'react';
import { MapPin, Mail, Phone, ChevronRight, Sparkles, Youtube, Instagram, Facebook } from 'lucide-react';
import { NavTab } from '../types';
import logoImg from '../assets/logo.png';
import tiktokLogo from '../assets/logotiktok.png';

interface FooterProps {
  setActiveTab: (tab: NavTab) => void;
  onOpenPpdb: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenPpdb }) => {
  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#1E3A8A] dark:bg-slate-950 text-white transition-colors border-t border-blue-900/40">
      {/* KUNCI: py-10 untuk mobile, py-16 untuk desktop. gap-8 untuk mobile, gap-10 untuk desktop */}
      <div className="w-full py-10 sm:py-16 px-4 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 max-w-7xl mx-auto border-b border-white/10">
        
        {/* Brand Info */}
        <div className="md:col-span-5 space-y-3 sm:space-y-4">
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <img src={logoImg} className="w-full h-full object-contain drop-shadow-md" alt="Logo SD Negeri 1 Mulyoagung" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
              SD Negeri 1 Mulyoagung
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 dark:text-slate-400 max-w-md leading-relaxed">
            Selamat datang di SD Negeri 1 Mulyoagung, sekolah yang berkomitmen menciptakan lingkungan belajar yang aman, nyaman, dan inspiratif.
            Kami menghadirkan pendidikan berkualitas untuk membentuk peserta didik yang siap menghadapi perkembangan ilmu pengetahuan dan teknologi di masa depan.
          </p>

          <div className="space-y-2 pt-1 sm:pt-2">
            <span className="text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Media Sosial Resmi:
            </span>
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <a
                href="https://www.youtube.com/@mulyoagungsatu3851"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-[#FF0000] flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-md"
                title="YouTube Official"
              >
                <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://www.instagram.com/mulyoagung1_dau"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-md"
                title="Instagram Official"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100085140035121"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-[#1877F2] flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-md"
                title="Facebook Official"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@mulyoagung.1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-black flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md p-1.5 sm:p-2 overflow-hidden"
                title="TikTok Official"
              >
                <img src={tiktokLogo} alt="TikTok Official" className="w-full h-full object-contain" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-3 space-y-3 sm:space-y-4">
          <h3 className="text-sm sm:text-base font-bold text-white tracking-wide border-b border-blue-800/80 pb-1.5 sm:pb-2">
            Tautan Cepat
          </h3>
          <ul className="space-y-2 sm:space-y-2.5 text-[11px] sm:text-sm">
            <li>
              <button
                onClick={() => handleNavClick('home')}
                className="text-slate-200 hover:text-teal-300 flex items-center gap-1.5 transition-all"
              >
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-400" /> Beranda
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('profile')}
                className="text-slate-200 hover:text-teal-300 flex items-center gap-1.5 transition-all"
              >
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-400" /> Profil Sekolah
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('directory')}
                className="text-slate-200 hover:text-teal-300 flex items-center gap-1.5 transition-all"
              >
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-400" /> Direktori Guru & Tendik
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('news')}
                className="text-slate-200 hover:text-teal-300 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-400" /> Berita & Artikel
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('cms')}
                className="text-slate-300 hover:text-teal-300 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-400" /> CMS Portal Admin
              </button>
            </li>
            <li>
              <button
                onClick={onOpenPpdb}
                className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1.5 transition-all cursor-pointer mt-1"
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Penerimaan Siswa Baru (PPDB)
              </button>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div className="md:col-span-4 space-y-3 sm:space-y-4">
          <h3 className="text-sm sm:text-base font-bold text-white tracking-wide border-b border-blue-800/80 pb-1.5 sm:pb-2">
            Kontak Kami
          </h3>
          <ul className="space-y-2.5 sm:space-y-3.5 text-[11px] sm:text-sm text-slate-200 dark:text-slate-400">
            <li className="flex items-start gap-2.5 sm:gap-3">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400 shrink-0 mt-0.5 sm:mt-1" />
              <span className="leading-snug">
                JL. RAYA MULYOAGUNG NO.121 RT. 1 RW. 10 DUSUN MULYOAGUNG , Kec. Dau, Kab. Malang, Prov. Jawa Timur
              </span>
            </li>
            <li className="flex items-center gap-2.5 sm:gap-3">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400 shrink-0" />
              <a href="mailto:sdnmulyoagung01@gmail.com" className="hover:text-white transition-colors">
                sdnmulyoagung01@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2.5 sm:gap-3">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400 shrink-0" />
              <a href="tel:08123456789" className="hover:text-white transition-colors">
                (0341) 466-730
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      {/* Di HP jarak dikurangi (py-4) dan gap dibuat lebih rapat */}
      <div className="w-full py-4 sm:py-6 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-slate-300 dark:text-slate-500">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} SD Negeri Mulyoagung 1. Hak Cipta Dilindungi.
        </p>
        <div className="flex flex-wrap gap-3 sm:gap-6 justify-center">
          <button
            onClick={() => alert('Kebijakan Privasi SD Negeri Mulyoagung 1')}
            className="hover:text-white hover:underline transition-all"
          >
            Kebijakan Privasi
          </button>
          <button
            onClick={() => alert('Syarat & Ketentuan Penggunaan Website')}
            className="hover:text-white hover:underline transition-all"
          >
            Syarat & Ketentuan
          </button>
          <button
            onClick={() => alert('Peta Situs SD Negeri Mulyoagung 1')}
            className="hover:text-white hover:underline transition-all"
          >
            Peta Situs
          </button>
        </div>
      </div>
    </footer>
  );
};