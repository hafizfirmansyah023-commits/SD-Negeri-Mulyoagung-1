import React from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { NavTab } from '../../types';
import logoImg from '../../assets/logo.png';
import tiktokLogo from '../../assets/logotiktok.png';
import { SOCIAL_LINKS } from '../../utils/footerData';

interface BrandInfoProps {
  onNavClick: (tab: NavTab) => void;
}

export const BrandInfo: React.FC<BrandInfoProps> = ({ onNavClick }) => (
  <div className="md:col-span-5 space-y-3 sm:space-y-4">
    <div onClick={() => onNavClick('home')} className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group">
      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
        <img
          src={logoImg}
          className="w-full h-full object-contain drop-shadow-md"
          alt="Logo SD Negeri 1 Mulyoagung"
        />
      </div>
      <span className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
        SD Negeri 1 Mulyoagung
      </span>
    </div>

    <p className="text-xs sm:text-sm text-slate-200 dark:text-slate-400 max-w-md leading-relaxed">
      Selamat datang di SD Negeri 1 Mulyoagung, sekolah yang berkomitmen menciptakan lingkungan belajar yang
      aman, nyaman, dan inspiratif. Kami menghadirkan pendidikan berkualitas untuk membentuk peserta didik yang
      siap menghadapi perkembangan ilmu pengetahuan dan teknologi di masa depan.
    </p>

    <div className="space-y-2 pt-1 sm:pt-2">
      <span className="text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider block">
        Media Sosial Resmi:
      </span>
      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
        <a
          href={SOCIAL_LINKS.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-[#FF0000] flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-md"
          title="YouTube Official"
        >
          <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>
        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-md"
          title="Instagram Official"
        >
          <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>
        <a
          href={SOCIAL_LINKS.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-[#1877F2] flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-md"
          title="Facebook Official"
        >
          <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>
        <a
          href={SOCIAL_LINKS.tiktok}
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
);
