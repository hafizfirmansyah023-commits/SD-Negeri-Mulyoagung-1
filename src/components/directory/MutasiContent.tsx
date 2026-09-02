import React from 'react';
import { Search } from 'lucide-react';
import { Teacher } from '../../types';
import { TeacherCard } from './TeacherCard';

interface MutasiContentProps {
  teachers: Teacher[];
  searchTerm: string;
  debouncedSearchTerm?: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTeacherClick: (teacher: Teacher) => void;
}

export const MutasiContent: React.FC<MutasiContentProps> = ({
  teachers,
  searchTerm,
  debouncedSearchTerm,
  onSearchChange,
  onTeacherClick,
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white/75 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex justify-center items-center">
        <div className="relative w-full lg:w-96 shrink-0 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama guru mutasi / NIP / tugas..."
              value={searchTerm}
              onChange={onSearchChange}
              className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-teal-100/90 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#028C84] shadow-inner"
            />
          </div>
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
        </div>
      )}
    </div>
  );
};
