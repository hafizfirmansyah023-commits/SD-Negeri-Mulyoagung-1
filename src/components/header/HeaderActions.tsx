import React from 'react';
import { Sparkles, Search } from 'lucide-react';
import { NavTab } from '../../types';

interface HeaderActionsProps {
  activeTab: NavTab;
  onCmsClick: () => void;
  onOpenPpdb: () => void;
  onOpenSearch?: () => void;
  linkPpdb?: string;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  activeTab,
  onCmsClick,
  onOpenPpdb,
  onOpenSearch,
  linkPpdb,
}) => (
  <div className="hidden lg:flex items-center gap-3 xl:gap-3.5 shrink-0">
    {onOpenSearch && (
      <button
        onClick={onOpenSearch}
        className="flex items-center gap-2 text-xs xl:text-[13px] font-semibold py-2.5 px-4 rounded-full text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 border border-teal-400/30 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
        title="Pencarian Cepat"
        aria-label="Buka Pencarian"
      >
        <Search size={14} className="text-teal-300" />
        <span className="text-slate-100 font-medium">Cari</span>
      </button>
    )}

    <button
      onClick={onCmsClick}
      className={`text-xs xl:text-[13px] font-semibold py-2.5 px-4 rounded-full transition-all border border-teal-500/40 cursor-pointer whitespace-nowrap hover:scale-[1.02] active:scale-[0.98] ${
        activeTab === 'cms' ? 'bg-[#028C84] text-white shadow-md' : 'text-slate-200 hover:text-white bg-white/5 hover:bg-white/10'
      }`}
    >
      CMS Portal
    </button>

    {linkPpdb ? (
      <a
        href={linkPpdb}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gradient-to-r from-[#028C84] to-[#156B63] hover:from-[#006a64] hover:to-[#0f544d] text-white font-semibold text-xs xl:text-[13px] py-2.5 px-5 rounded-full transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer whitespace-nowrap"
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        PPDB Online
      </a>
    ) : (
      <button
        onClick={onOpenPpdb}
        className="bg-gradient-to-r from-[#028C84] to-[#156B63] hover:from-[#006a64] hover:to-[#0f544d] text-white font-semibold text-xs xl:text-[13px] py-2.5 px-5 rounded-full transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer whitespace-nowrap"
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        PPDB Online
      </button>
    )}
  </div>
);


