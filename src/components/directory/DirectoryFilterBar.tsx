import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';

interface DirectoryFilterBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  roleFilter: string;
  onRoleSelect: (role: string) => void;
  roles: string[];
  onReset?: () => void;
  isFiltered?: boolean;
}

export const DirectoryFilterBar: React.FC<DirectoryFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleSelect,
  roles,
  onReset,
  isFiltered,
}) => (
  <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-white/90 shadow-sm space-y-4">
    {/* Top Row: Search Input & Reset Button */}
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari nama guru / NIP / tugas / mata pelajaran..."
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-inner"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange({ target: { value: '' } } as any)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer"
            title="Hapus pencarian"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isFiltered && onReset && (
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer shrink-0 border border-red-100"
          title="Reset pencarian dan filter"
        >
          <RotateCcw size={13} />
          <span>Reset Filter</span>
        </button>
      )}
    </div>

    {/* Bottom Row: Role Filters Pill Switcher */}
    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
      {roles.map((r) => (
        <button
          key={r}
          onClick={() => onRoleSelect(r)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
            roleFilter === r
              ? 'bg-gradient-to-r from-[#028C84] to-[#156B63] text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:text-[#028C84] hover:bg-slate-200'
          }`}
        >
          {r === 'Bagan Struktur' ? ' ' + r : r}
        </button>
      ))}
    </div>
  </div>
);
