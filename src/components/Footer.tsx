import React from 'react';
import { GraduationCap, MapPin, Mail, Phone, ChevronRight, QrCode, Camera, Play, Sparkles } from 'lucide-react';
import { NavTab } from '../types';

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
            <div className="p-2 rounded-xl bg-amber-400 text-blue-950 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              SDN Mulyoagung 1
            </span>
          </div>

          <p className="text-sm text-slate-200 dark:text-slate-400 max-w-md leading-relaxed">
            Beriman, Kreatif, Berprestasi, Berkarakter, dan Berbudaya. Mengabdi untuk negeri mendidik anak bangsa dengan sepenuh hati.
          </p>

          <div className="flex gap-3 pt-2">
            <a
              href="#qr"
              onClick={(e) => {
                e.preventDefault();
                alert('QR Code Digital Card SDN Mulyoagung 1');
              }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#028C84] flex items-center justify-center text-white transition-colors"
              title="QR Digital"
            >
              <QrCode className="w-4 h-4" />
            </a>
            <a
              href="#instagram"
              onClick={(e) => {
                e.preventDefault();
                alert('Instagram: @sdnmulyoagung1_malang');
              }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#028C84] flex items-center justify-center text-white transition-colors"
              title="Instagram Sekolah"
            >
              <Camera className="w-4 h-4" />
            </a>
            <a
              href="#youtube"
              onClick={(e) => {
                e.preventDefault();
                alert('YouTube Channel: SD Negeri Mulyoagung 1 Official');
              }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#028C84] flex items-center justify-center text-white transition-colors"
              title="YouTube Official"
            >
              <Play className="w-4 h-4 fill-current" />
            </a>
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
                Jl. Raya Mulyoagung No. 1, Kecamatan Dau, Kabupaten Malang, Jawa Timur 65151
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-teal-400 shrink-0" />
              <a href="mailto:info@sdnmulyoagung1.sch.id" className="hover:text-white transition-colors">
                info@sdnmulyoagung1.sch.id
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-teal-400 shrink-0" />
              <a href="tel:08123456789" className="hover:text-white transition-colors">
                (0341) 465-7890 / 08123456789
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
            onClick={() => alert('Peta Situs SDN Mulyoagung 1')}
            className="hover:text-white hover:underline transition-all"
          >
            Peta Situs
          </button>
        </div>
      </div>
    </footer>
  );
};
