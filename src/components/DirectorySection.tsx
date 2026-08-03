import React, { useState } from 'react';
import { TEACHERS_DIRECTORY } from '../data/schoolData';
import { Search, Mail, GraduationCap, Award, Briefcase, BookOpen } from 'lucide-react';
import { Teacher } from '../types';

export const DirectorySection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('Semua');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const roles = ['Semua', 'Kepala Sekolah', 'Guru Kelas', 'Guru Mata Pelajaran'];

  const filteredTeachers = TEACHERS_DIRECTORY.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.nip.includes(searchTerm);

    const matchesRole = roleFilter === 'Semua' || teacher.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <section className="w-full py-16 sm:py-20 bg-slate-50 dark:bg-slate-900/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-[#028C84] dark:text-teal-400 font-bold text-xs uppercase tracking-wider bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
            <GraduationCap className="w-4 h-4" />
            Tenaga Pendidik & Kependidikan
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A8A] dark:text-blue-300">
            Direktori Guru & Tendik
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Mengenal para pendidik profesional dan berdedikasi tinggi di SD Negeri Mulyoagung 1
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama guru / NIP / mata pelajaran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Role Filters */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  roleFilter === r
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm hover-lift border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-teal-500/30">
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="inline-block bg-teal-50 dark:bg-teal-950/60 text-[#028C84] dark:text-teal-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1">
                      {teacher.role}
                    </span>
                    <h3 className="font-bold text-base text-[#1E3A8A] dark:text-blue-200 leading-snug">
                      {teacher.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      NIP. {teacher.nip}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Tugas:
                    </span>
                    <span className="truncate">{teacher.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span className="truncate">{teacher.education}</span>
                  </div>
                  {teacher.experienceYears && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span>Pengabdian: {teacher.experienceYears} Tahun</span>
                    </div>
                  )}
                </div>

                {teacher.quote && (
                  <p className="text-xs italic text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    "{teacher.quote}"
                  </p>
                )}
              </div>

              {teacher.email && (
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/80">
                  <a
                    href={`mailto:${teacher.email}`}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-teal-50 dark:hover:bg-teal-950/60 text-slate-700 dark:text-slate-200 hover:text-[#028C84] dark:hover:text-teal-300 transition-colors text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Kirim Pesan Email</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Tidak ada data guru yang cocok dengan pencarian "{searchTerm}".
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
