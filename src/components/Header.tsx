import React, { useState } from 'react';
import { Menu, X, Sparkles, Phone, Mail } from 'lucide-react';
import { NavTab } from '../types';
import logoImg from '../assets/logo.png';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenPpdb: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenPpdb,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'profile', label: 'Profile' },
    { id: 'directory', label: 'Directory' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'news', label: 'Berita' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Banner Contact Strip (Desktop/Tablet) */}
      <div className="bg-gradient-to-r from-[#0D4A46]/100 to-[#156B63]/100">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-teal-400" />
              info@SD Negerimulyoagung1.sch.id
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              (0341) 465-7890 / 08123456789
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded text-[11px] font-medium border border-teal-400/30">
              Akreditasi A
            </span>
            <span className="text-slate-300 text-[11px]">
              Kec. Dau, Kab. Malang
            </span>
          </div>
        </div>
      </div>

      {/* Main Top Header */}
      <header className="bg-gradient-to-r from-[#073632]/100 to-[#103632]/100">
        <div className="flex justify-between items-center px-4 sm:px-8 lg:px-12 w-full h-20 max-w-7xl mx-auto">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <img src={logoImg} className="w-full h-full object-contain drop-shadow-md" alt="Logo SD Negeri 1 Mulyoagung" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl sm:text-2xl text-white tracking-tight leading-none">
                SD Negeri 1 Mulyoagung
              </span>
              <span className="text-[11px] text-teal-200/80 font-medium tracking-wide">
                Kabupaten Malang
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-7 items-center h-full">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`h-full flex items-center px-1 font-semibold text-sm transition-all relative ${
                    isActive
                      ? 'text-[#028C84] dark:text-teal-400 border-b-2 border-[#028C84] dark:border-teal-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#028C84] dark:hover:text-teal-400'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">

            {/* PPDB Button */}
            <button
              onClick={onOpenPpdb}
              className="bg-[#028C84] hover:bg-[#006a64] text-white font-semibold text-sm py-2.5 px-6 rounded-full transition-all shadow-sm hover:shadow-md hover:scale-[1.02] flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Daftar Sekarang
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1E3A8A] dark:text-blue-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-5 shadow-xl transition-all">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-left py-3 px-4 rounded-xl text-base font-semibold transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-teal-50 dark:bg-teal-950/50 text-[#028C84] dark:text-teal-300'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#028C84] dark:bg-teal-400"></span>
                    )}
                  </button>
                );
              })}

              <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPpdb();
                  }}
                  className="w-full bg-[#028C84] hover:bg-[#006a64] text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  Daftar Sekarang (PPDB Online)
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
