import React from 'react';
import { LEGAL_LINKS } from '../../utils/footerData';

export const CopyrightBar: React.FC = () => (
  <div className="w-full py-5 sm:py-6 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] sm:text-xs text-slate-300/80 dark:text-slate-400">
    <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 text-center md:text-left leading-relaxed">
      <span>© {new Date().getFullYear()} SD Negeri 1 Mulyoagung.</span>
      <span className="hidden sm:inline text-slate-400/50">•</span>
      <span className="text-slate-300/90">All Rights Reserved.</span>
      <span className="hidden sm:inline text-slate-400/50">•</span>
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-teal-200 border border-teal-300/20 font-medium text-[10px] sm:text-[11px] shadow-xs">
        <span className="text-slate-300/80">Build By</span>
        <span className="font-semibold text-white tracking-wide">Ilham Zainuri & M Hafiz Firmansyah</span>
      </span>
    </div>

    <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center">
      {LEGAL_LINKS.map((link) => (
        <button
          key={link.label}
          onClick={() => alert(link.message)}
          className="hover:text-teal-300 transition-colors cursor-pointer"
        >
          {link.label}
        </button>
      ))}
    </div>
  </div>
);

