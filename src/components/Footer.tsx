import React from 'react';
import { NavTab } from '../types';
import { BrandInfo } from './footer/BrandInfo';
import { QuickLinks } from './footer/QuickLinks';
import { FooterContactInfo } from './footer/FooterContactInfo';
import { CopyrightBar } from './footer/CopyrightBar';

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
        <BrandInfo onNavClick={handleNavClick} />
        <QuickLinks onNavClick={handleNavClick} onOpenPpdb={onOpenPpdb} />
        <FooterContactInfo />
      </div>

      <CopyrightBar />
    </footer>
  );
};
