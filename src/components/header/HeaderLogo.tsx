import React from 'react';
import { NavTab } from '../../types';
import logoImg from '../../assets/logo.png';

interface HeaderLogoProps {
  onClick: (tab: NavTab) => void;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({ onClick }) => (
  <div
    onClick={() => onClick('home')}
    className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
  >
    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
      <img
        src={logoImg}
        className="w-full h-full object-contain drop-shadow-md"
        alt="Logo SD Negeri 1 Mulyoagung"
      />
    </div>
    <div className="flex flex-col">
      <span className="font-extrabold text-base sm:text-xl lg:text-2xl text-white tracking-tight leading-tight whitespace-nowrap drop-shadow-sm">
        SD Negeri 1 Mulyoagung
      </span>
      <span className="text-[10px] sm:text-xs text-teal-200/90 font-medium tracking-wide whitespace-nowrap">
        Kec. Dau, Kab. Malang
      </span>
    </div>
  </div>
);
