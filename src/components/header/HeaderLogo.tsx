import React from 'react';
import { NavTab } from '../../types';
import logoImg from '../../assets/logo.png';

interface HeaderLogoProps {
  onClick: (tab: NavTab) => void;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({ onClick }) => (
  <div
    onClick={() => onClick('home')}
    className="flex items-center gap-3 cursor-pointer group min-w-0"
  >
    <div className="w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
      <img
        src={logoImg}
        className="w-full h-full object-contain drop-shadow-md"
        alt="Logo SD Negeri 1 Mulyoagung"
      />
    </div>
    {/* FIX MOBILE: min-w-0 pada wrapper ini + truncate pada teks mencegah nama sekolah
        mendorong tombol hamburger keluar layar di HP sempit. Ukuran font dasar (mobile)
        diperkecil ke text-lg khusus <sm; dari sm ke atas tetap sm:text-2xl seperti aslinya. */}
    <div className="flex flex-col min-w-0">
      <span className="font-bold text-lg sm:text-2xl text-white tracking-tight leading-none truncate">
        SD Negeri 1 Mulyoagung
      </span>
      <span className="text-[11px] text-teal-200/80 font-medium tracking-wide truncate">
        Kabupaten Malang
      </span>
    </div>
  </div>
);
