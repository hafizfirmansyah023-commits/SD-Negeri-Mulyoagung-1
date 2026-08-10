import React from 'react';
import { Sparkles } from 'lucide-react';
import { NavTab } from '../../types';

interface HeaderActionsProps {
  activeTab: NavTab;
  onCmsClick: () => void;
  onOpenPpdb: () => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ activeTab, onCmsClick, onOpenPpdb }) => (
  <div className="hidden md:flex items-center gap-3">
    <button
      onClick={onCmsClick}
      className={`text-sm font-semibold py-2 px-4 rounded-full transition-all border border-teal-500/30 cursor-pointer ${
        activeTab === 'cms' ? 'bg-[#028C84] text-white' : 'text-slate-300 hover:text-white'
      }`}
    >
      CMS Portal
    </button>

    <button
      onClick={onOpenPpdb}
      className="bg-[#028C84] hover:bg-[#006a64] text-white font-semibold text-sm py-2.5 px-6 rounded-full transition-all shadow-sm hover:shadow-md hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
    >
      <Sparkles className="w-4 h-4" />
      Daftar Sekarang
    </button>
  </div>
);
