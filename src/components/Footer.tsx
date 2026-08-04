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
      <div className="w-full py-16 px-4 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-10 max-w-7xl mx-auto border-b border-white/10">
        {/* Brand Info */}
        <div className="md:col-span-5 space-y-4">
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <img src={logoImg} className="w-full h-full object-contain drop-shadow-md" alt="Logo SD Negeri 1 Mulyoagung" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              SD Negeri 1 Mulyoagung
            </span>
          </div>

          <p className="text-sm text-slate-200 dark:text-slate-400 max-w-md leading-relaxed">
            Selamat datang di SD Negeri 1 Mulyoagung, sekolah yang berkomitmen menciptakan lingkungan belajar yang aman, nyaman, dan inspiratif.
            Kami menghadirkan pendidikan berkualitas untuk membentuk peserta didik yang beriman, berakhlak mulia, berprestasi, kreatif, serta siap menghadapi perkembangan ilmu pengetahuan dan teknologi di masa depan.
          </p>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Media Sosial Resmi:
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="https://www.youtube.com/@mulyoagungsatu3851"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF0000] flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-md"
                title="YouTube Official"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/mulyoagung1_dau?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-md"
                title="Instagram Official"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://l.instagram.com/?u=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100085140035121%26utm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio&e=AUB8EPIOJOhfq3yW70pCmCuVzI5DHSUTdtzFNnDCEzQwRrZPwb4cQBLmZB4v5Z38Aw-CJX3tfVFMQ6I9Mw3KDSLL55YJizdPKU6amlqkRIe1o2-hRz-WODVrCaNVsJjv_n9NZxE"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#1877F2] flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-md"
                title="Facebook Official"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@mulyoagung.1?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-black flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md p-2 overflow-hidden"
                title="TikTok Official"
              >
                <img src={tiktokLogo} alt="TikTok Official" className="w-full h-full object-contain" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-3 space-y-4">
          <h3 className="text-base font-bold text-white tracking-wide border-b border-blue-800/80 pb-2">
            Tautan Cepat
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <button
                onClick={() => handleNavClick('home')}
                className="text-slate-200 dark:text-slate-400 hover:text-teal-300 flex items-center gap-1.5 transition-all text-xs sm:text-sm"
              >
                <ChevronRight className="w-3.5 h-3.5 text-teal-400" /> Beranda
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('profile')}
                className="text-slate-200 dark:text-slate-400 hover:text-teal-300 flex items-center gap-1.5 transition-all text-xs sm:text-sm"
              >
                <ChevronRight className="w-3.5 h-3.5 text-teal-400" /> Profil Sekolah
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('directory')}
                className="text-slate-200 dark:text-slate-400 hover:text-teal-300 flex items-center gap-1.5 transition-all text-xs sm:text-sm"
              >
                <ChevronRight className="w-3.5 h-3.5 text-teal-400" /> Direktori Guru & Tendik
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('news')}
                className="text-slate-200 dark:text-slate-400 hover:text-teal-300 flex items-center gap-1.5 transition-all text-xs sm:text-sm"
              >
                <ChevronRight className="w-3.5 h-3.5 text-teal-400" /> Berita & Artikel
              </button>
            </li>
            <li>
              <button
                onClick={onOpenPpdb}
                className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1.5 transition-all text-xs sm:text-sm"
              >
                <Sparkles className="w-3.5 h-3.5" /> Penerimaan Siswa Baru (PPDB)
              </button>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div className="md:col-span-4 space-y-4">
          <h3 className="text-base font-bold text-white tracking-wide border-b border-blue-800/80 pb-2">
            Kontak Kami
          </h3>
          <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200 dark:text-slate-400">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-1" />
              <span>
               JL. RAYA MULYOAGUNG NO.121 RT. 1 RW. 10 DUSUN MULYOAGUNG , Kec. Dau, Kab. Malang, Prov. Jawa Timur
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-teal-400 shrink-0" />
              <a href="mailto:sdnmulyoagung01@gmail.com" className="hover:text-white transition-colors">
                sdnmulyoagung01@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-teal-400 shrink-0" />
              <a href="tel:08123456789" className="hover:text-white transition-colors">
                (0341) 466-730
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="w-full py-6 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-300 dark:text-slate-500">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} SD Negeri Mulyoagung 1. Hak Cipta Dilindungi Undang-Undang.
        </p>
        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
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
