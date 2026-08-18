import React from 'react';
import { Sparkles } from 'lucide-react';
import { NavTab } from '../../types';
import { NavItem } from '../../utils/headerData';

interface MobileNavDrawerProps {
  navItems: NavItem[];
  activeTab: NavTab;
  onNavClick: (tab: NavTab) => void;
  onOpenPpdb: () => void;
  linkPpdb?: string;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  navItems,
  activeTab,
  onNavClick,
  onOpenPpdb,
  linkPpdb,
}) => (
  <div className="md:hidden bg-slate-900 border-b border-slate-800 px-6 py-5 shadow-xl transition-all max-h-[calc(100vh-5rem)] overflow-y-auto">
    <div className="flex flex-col gap-2">
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
);
