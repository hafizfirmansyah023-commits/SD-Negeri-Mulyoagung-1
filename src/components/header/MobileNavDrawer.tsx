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
      className="fixed inset-0 top-20 bg-slate-950/60 backdrop-blur-sm z-40 xl:hidden transition-opacity"
    />

    {/* Drawer Container */}
    <div className="fixed top-20 left-0 right-0 z-50 xl:hidden bg-slate-900 border-b border-slate-800 px-5 sm:px-6 py-5 shadow-2xl max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex flex-col gap-2">
        {onOpenSearch && (
          <button
            onClick={() => {
              if (onClose) onClose();
              onOpenSearch();
            }}
            className="text-left py-2.5 px-4 mb-1 rounded-xl text-sm font-semibold bg-slate-800/80 hover:bg-slate-800 text-teal-300 border border-teal-500/30 transition-colors flex items-center gap-2.5 cursor-pointer shadow-sm"
          >
            <Search size={16} className="text-teal-400" />
            <span>Pencarian Cepat Website...</span>
          </button>
        )}

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className={`text-left py-3 px-4 rounded-xl text-base font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                isActive ? 'bg-teal-950/50 text-[#028C84] dark:text-teal-300' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{item.label}</span>
              {isActive && <span className="w-2 h-2 rounded-full bg-[#028C84] dark:bg-teal-400"></span>}
            </button>
          );
        })}

        <button
          onClick={() => onNavClick('cms')}
          className={`text-left py-3 px-4 rounded-xl text-base font-semibold transition-colors flex items-center justify-between cursor-pointer ${
            activeTab === 'cms' ? 'bg-teal-950/50 text-[#028C84] dark:text-teal-300' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <span>CMS Portal</span>
          {activeTab === 'cms' && <span className="w-2 h-2 rounded-full bg-[#028C84] dark:bg-teal-400"></span>}
        </button>

        <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800">
          {linkPpdb ? (
            <a
              href={linkPpdb}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#028C84] hover:bg-[#006a64] text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              Daftar Sekarang (PPDB Online)
            </a>
          ) : (
            <button
              onClick={onOpenPpdb}
              className="w-full bg-[#028C84] hover:bg-[#006a64] text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              Daftar Sekarang (PPDB Online)
            </button>
          )}
        </div>
      </div>
    </div>
  </>
);
