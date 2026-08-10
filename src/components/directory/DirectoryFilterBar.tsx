import React from 'react';
import { Search } from 'lucide-react';

interface DirectoryFilterBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  roleFilter: string;
  onRoleSelect: (role: string) => void;
  roles: string[];
}

export const DirectoryFilterBar: React.FC<DirectoryFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleSelect,
  roles,
}) => (
  <div className="bg-white/75 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col lg:flex-row gap-4 justify-between items-center">
    {/* Search Input */}
    <div className="relative w-full lg:w-96 shrink-0 flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari nama guru / NIP / tugas / bagan..."
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-teal-100/90 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#028C84] shadow-inner"
        />
      </div>
    </div>

    {/* Role Filters Pill Switcher */}
    <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-teal-50/60 border border-teal-100/80 w-full lg:w-auto justify-center">
      {roles.map((r) => (
        <button
          key={r}
          onClick={() => onRoleSelect(r)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors duration-200 cursor-pointer ${
            roleFilter === r
              ? 'bg-gradient-to-r from-[#028C84] to-[#156B63] text-white shadow-md shadow-teal-700/20'
              : 'text-slate-600 hover:text-[#028C84] hover:bg-white/60'
          }`}
        >
          {r === 'Bagan Struktur' ? ' ' + r : r}
        </button>
      ))}
    </div>
  </div>
);
