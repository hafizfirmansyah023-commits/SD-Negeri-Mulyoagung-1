import React from 'react';
import { NavTab } from '../../types';
import logoImg from '../../assets/logo.png';

interface HeaderLogoProps {
  onClick: (tab: NavTab) => void;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({ onClick }) => (
  <div
    onClick={() => onClick('home')}
    className="flex items-center gap-2 sm:gap-2.5 xl:gap-3 cursor-pointer group shrink-0 min-w-0 max-w-[calc(100vw-110px)] sm:max-w-none select-none"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick('home');
      }
    }}
    aria-label="Beranda SD Negeri 1 Mulyoagung"
  >
    <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 xl:w-10 2xl:w-11 xl:h-10 2xl:h-11 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shrink-0">
      <img
        src={logoImg}
        className="w-full h-full object-contain drop-shadow-md"
        alt="Logo SD Negeri 1 Mulyoagung"
      />
    </div>
    <div className="flex flex-col min-w-0 justify-center">
      <span className="font-extrabold text-sm xs:text-[15px] sm:text-base lg:text-lg xl:text-[16px] 2xl:text-xl text-white tracking-tight leading-tight truncate drop-shadow-sm group-hover:text-teal-100 transition-colors">
        SD Negeri 1 Mulyoagung
      </span>
      <span className="text-[9px] sm:text-[10px] lg:text-xs xl:text-[10px] 2xl:text-xs text-teal-200/90 font-medium tracking-wide truncate">
        Kec. Dau, Kab. Malang
      </span>
    </div>
  </div>
);
