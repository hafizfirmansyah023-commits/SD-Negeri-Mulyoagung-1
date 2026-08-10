import React from 'react';
import { LEGAL_LINKS } from '../../utils/footerData';

export const CopyrightBar: React.FC = () => (
  <div className="w-full py-4 sm:py-6 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-slate-300 dark:text-slate-500">
    <p className="text-center md:text-left">
      © {new Date().getFullYear()} SD Negeri 1 Mulyoagung. Hak Cipta Dilindungi.
    </p>
    <div className="flex flex-wrap gap-3 sm:gap-6 justify-center">
      {LEGAL_LINKS.map((link) => (
        <button
          key={link.label}
          onClick={() => alert(link.message)}
          className="hover:text-white hover:underline transition-all"
        >
          {link.label}
        </button>
      ))}
    </div>
  </div>
);
