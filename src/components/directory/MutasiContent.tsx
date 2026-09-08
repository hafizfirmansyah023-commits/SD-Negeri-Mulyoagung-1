import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { Teacher } from '../../types';
import { TeacherCard } from './TeacherCard';

interface MutasiContentProps {
  teachers: Teacher[];
  searchTerm: string;
  debouncedSearchTerm?: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTeacherClick: (teacher: Teacher) => void;
  onReset?: () => void;
}

export const MutasiContent: React.FC<MutasiContentProps> = ({
  teachers,
  searchTerm,
  debouncedSearchTerm,
  onSearchChange,
  onTeacherClick,
  onReset,
}) => {
  const query = debouncedSearchTerm !== undefined ? debouncedSearchTerm : searchTerm;

  // Filter only mutated teachers
  const mutasiTeachers = teachers.filter(
    (t) => t.status?.toLowerCase() === 'mutasi' || t.status?.toLowerCase().includes('mutasi')
  );

  // Apply search term
  const filteredTeachers = mutasiTeachers.filter((teacher) => {
    return (
      teacher.name.toLowerCase().includes(query.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(query.toLowerCase()) ||
      (teacher.nip && teacher.nip.includes(query))
    );
  });

  const handleClear = () => {
    if (onReset) {
      onReset();
    } else {
      onSearchChange({ target: { value: '' } } as any);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white/85 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Cari nama guru mutasi / NIP / tugas..."
              value={searchTerm}
              onChange={onSearchChange}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-xs sm:text-sm text-slate-700 placeholder-slate-400 shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer"
                title="Hapus pencarian"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {searchTerm.trim() !== '' && (
            <button
              onClick={handleClear}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer shrink-0 border border-red-100"
              title="Reset pencarian"
            >
              <RotateCcw size={14} />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>

      {filteredTeachers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} onClick={onTeacherClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/80 p-8 shadow-sm">
          <p className="text-slate-500 text-sm font-semibold">
            {searchTerm
              ? `Tidak ada data guru mutasi yang cocok dengan pencarian "${searchTerm}".`
              : 'Belum ada data guru dengan status mutasi.'}
          </p>
          {searchTerm && (
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5">Coba ubah kata kunci pencarian Anda.</p>
          )}
        </div>
      )}
    </div>
  );
};

