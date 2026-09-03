import React from 'react';
import { Menu, X, Search } from 'lucide-react';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenSearch?: () => void;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isOpen, onToggle, onOpenSearch }) => (
  <div className="flex min-[1200px]:hidden items-center gap-1 sm:gap-1.5 shrink-0">
    {onOpenSearch && (
      <button
        onClick={onOpenSearch}
        className="p-2 sm:p-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 active:bg-white/20 transition-all cursor-pointer shrink-0 flex items-center justify-center focus:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-400"
        aria-label="Cari Konten Website"
        title="Pencarian Cepat"
      >
        <Search className="w-5 h-5 text-teal-300" />
      </button>
    )}
    <button
      onClick={onToggle}
      className="p-2 sm:p-2.5 rounded-xl text-white hover:bg-white/10 active:bg-white/20 transition-all cursor-pointer shrink-0 flex items-center justify-center focus:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-400"
      aria-label={isOpen ? "Tutup Menu Navigasi" : "Buka Menu Navigasi"}
      aria-expanded={isOpen}
    >
      {isOpen ? <X className="w-6 h-6 text-teal-200" /> : <Menu className="w-6 h-6 text-white" />}
    </button>
  </div>
);
