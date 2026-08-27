import React from 'react';
import { Menu, X } from 'lucide-react';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isOpen, onToggle }) => (
  <div className="flex xl:hidden items-center gap-2">
    <button
      onClick={onToggle}
      className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
      aria-label="Open navigation menu"
    >
      {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
    </button>
  </div>
);
