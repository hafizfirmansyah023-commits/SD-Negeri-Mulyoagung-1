import React from 'react';
import { NavTab } from '../../types';
import logoImg from '../../assets/logo.png';

interface HeaderLogoProps {
  onClick: (tab: NavTab) => void;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({ onClick }) => (
  <div
    onClick={() => onClick('home')}
    className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0 min-w-0 max-w-[calc(100vw-120px)] xs:max-w-none"
  >
    <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
      <img
        src={logoImg}
        className="w-full h-full object-contain drop-shadow-md"
        alt="Logo SD Negeri 1 Mulyoagung"
      />
    </div>
    <div className="flex flex-col min-w-0">
      <span className="font-extrabold text-sm xs:text-base sm:text-lg lg:text-2xl text-white tracking-tight leading-tight truncate drop-shadow-sm">
        SD Negeri 1 Mulyoagung
      </span>
      <span className="text-[9px] sm:text-xs text-teal-200/90 font-medium tracking-wide truncate">
        Kec. Dau, Kab. Malang
      </span>
    </div>
  </div>
);
