import React from 'react';
import { Menu, X, Search } from 'lucide-react';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenSearch?: () => void;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isOpen, onToggle, onOpenSearch }) => (
  <div className="flex xl:hidden items-center gap-1 sm:gap-2">
    {onOpenSearch && (
      <button
        onClick={onOpenSearch}
        className="p-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 lg:hidden"
        aria-label="Cari Konten"
        title="Pencarian Cepat"
      >
        <Search className="w-5 h-5 text-teal-300" />
      </button>
    )}
    <button
      onClick={onToggle}
      className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
      aria-label="Open navigation menu"
    >
      {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
    </button>
  </div>
);
