import React from 'react';
import { Sparkles, Search } from 'lucide-react';
import { NavTab } from '../../types';
import { NavItem } from '../../utils/headerData';

interface MobileNavDrawerProps {
  navItems: NavItem[];
  activeTab: NavTab;
  onNavClick: (tab: NavTab) => void;
  onOpenPpdb: () => void;
  onOpenSearch?: () => void;
  onClose?: () => void;
  linkPpdb?: string;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  navItems,
  activeTab,
  onNavClick,
  onOpenPpdb,
  onOpenSearch,
  onClose,
  linkPpdb,
}) => (
  <>
    {/* Backdrop Overlay to close drawer when tapping outside */}
    <div
      onClick={onClose}
      className="fixed inset-0 top-0 bg-slate-950/60 backdrop-blur-xs z-40 xl:hidden transition-opacity"
    />

    {/* Sticky Expanded Drawer Container positioned directly below Header */}
    <div className="absolute top-full left-0 right-0 z-50 xl:hidden bg-[#073632]/98 backdrop-blur-2xl border-t border-teal-500/20 border-b border-teal-500/30 px-4 sm:px-6 py-4 sm:py-5 shadow-2xl max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain animate-in fade-in slide-in-from-top-3 duration-200">
      <div className="flex flex-col gap-1.5 sm:gap-2 max-w-lg mx-auto">
        {onOpenSearch && (
          <button
            onClick={() => {
              if (onClose) onClose();
              onOpenSearch();
            }}
            className="text-left py-2.5 px-4 mb-1 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/15 text-teal-200 border border-teal-400/30 transition-all flex items-center gap-2.5 cursor-pointer shadow-sm active:scale-[0.99]"
          >
            <Search size={16} className="text-teal-300" />
            <span>Pencarian Cepat Website...</span>
          </button>
        )}

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className={`text-left py-2.5 sm:py-3 px-4 rounded-xl text-sm sm:text-base font-semibold transition-all flex items-center justify-between cursor-pointer ${
                isActive
                  ? 'bg-teal-500/25 text-teal-200 border border-teal-400/30'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              {isActive && <span className="w-2 h-2 rounded-full bg-teal-400 shadow-sm shadow-teal-400"></span>}
            </button>
          );
        })}

        <button
          onClick={() => onNavClick('cms')}
          className={`text-left py-2.5 sm:py-3 px-4 rounded-xl text-sm sm:text-base font-semibold transition-all flex items-center justify-between cursor-pointer ${
            activeTab === 'cms'
              ? 'bg-teal-500/25 text-teal-200 border border-teal-400/30'
              : 'text-slate-200 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span>CMS Portal</span>
          {activeTab === 'cms' && <span className="w-2 h-2 rounded-full bg-teal-400 shadow-sm shadow-teal-400"></span>}
        </button>

        <div className="pt-3 mt-1 border-t border-teal-500/20">
          {linkPpdb ? (
            <a
              href={linkPpdb}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-teal-500 to-[#028C84] hover:from-teal-400 hover:to-[#006a64] text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-teal-500/30 active:scale-[0.99] text-sm sm:text-base"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Daftar Sekarang (PPDB Online)
            </a>
          ) : (
            <button
              onClick={onOpenPpdb}
              className="w-full bg-gradient-to-r from-teal-500 to-[#028C84] hover:from-teal-400 hover:to-[#006a64] text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-teal-500/30 active:scale-[0.99] text-sm sm:text-base cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Daftar Sekarang (PPDB Online)
            </button>
          )}
        </div>
      </div>
    </div>
  </>
);
