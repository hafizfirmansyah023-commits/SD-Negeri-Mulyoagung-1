import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { NavTab } from '../../types';
import { QUICK_LINKS } from '../../utils/footerData';

interface QuickLinksProps {
  onNavClick: (tab: NavTab) => void;
  onOpenPpdb: () => void;
  linkPpdb?: string;
}

export const QuickLinks: React.FC<QuickLinksProps> = ({ onNavClick, onOpenPpdb, linkPpdb }) => (
  <div className="md:col-span-3 space-y-3 sm:space-y-4">
    <h3 className="text-sm sm:text-base font-bold text-white tracking-wide border-b border-blue-800/80 pb-1.5 sm:pb-2">
      Tautan Cepat
    </h3>
    <ul className="space-y-2 sm:space-y-2.5 text-[11px] sm:text-sm">
      {QUICK_LINKS.map((link) => (
        <li key={link.tab}>
          <button
            onClick={() => onNavClick(link.tab)}
            className={`${link.textClass ?? 'text-slate-200'} hover:text-teal-300 flex items-center gap-1.5 transition-all cursor-pointer`}
          >
            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-400" /> {link.label}
          </button>
        </li>
      ))}
      <li>
        {linkPpdb ? (
          <a
            href={linkPpdb}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1.5 transition-all cursor-pointer mt-1"
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Penerimaan Siswa Baru (PPDB)
          </a>
        ) : (
          <button
            onClick={onOpenPpdb}
            className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1.5 transition-all cursor-pointer mt-1"
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Penerimaan Siswa Baru (PPDB)
          </button>
        )}
      </li>
    </ul>
  </div>
);
