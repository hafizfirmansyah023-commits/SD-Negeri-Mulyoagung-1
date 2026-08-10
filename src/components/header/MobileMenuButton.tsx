import React from 'react';
import { Menu, X } from 'lucide-react';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isOpen, onToggle }) => (
  <div className="flex md:hidden items-center gap-2">
    <button
      onClick={onToggle}
      className="p-2 text-[#1E3A8A] dark:text-blue-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
      aria-label="Open navigation menu"
    >
      {isOpen ? <X className="w-7 h-7 text-white" /> : <Menu className="w-7 h-7 text-white" />}
    </button>
  </div>
);
