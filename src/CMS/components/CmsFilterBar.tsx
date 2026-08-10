import React from 'react';
import { Search, Filter, RotateCcw, X } from 'lucide-react';

export interface SelectFilterConfig {
  key: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  options: { value: string; label: string }[];
}

export interface CmsFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  selectFilters?: SelectFilterConfig[];
  isFiltered: boolean;
  onReset: () => void;
  className?: string;
}

export default function CmsFilterBar({
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Cari kata kunci...',
  selectFilters = [],
  isFiltered,
  onReset,
  className = '',
}: CmsFilterBarProps) {
  return (
    <div
      className={`bg-white p-3.5 sm:p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between transition-all ${className}`}
    >
      {/* Search Input Box */}
      <div className="relative w-full sm:w-72 md:w-80">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          size={18}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-10 pr-9 py-2.5 sm:py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-slate-700 placeholder-slate-400 min-h-[42px]"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Select Filters & Reset Button */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
        {selectFilters.map((sf, index) => (
          <div key={sf.key || index} className="flex-1 sm:flex-initial min-w-[130px] sm:min-w-0">
            <div className="flex items-center gap-1.5">
              {index === 0 && <Filter size={16} className="text-slate-400 shrink-0 hidden sm:inline" />}
              <select
                value={sf.value}
                onChange={(e) => sf.onChange(e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer min-h-[42px] font-medium"
              >
                {sf.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer min-h-[42px] w-full sm:w-auto"
          >
            <RotateCcw size={14} /> Reset Filter
          </button>
        )}
      </div>
    </div>
  );
}
