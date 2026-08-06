import React, { useState } from 'react';
import { TEACHERS_DIRECTORY } from '../data/schoolData';
import { Search, Mail, GraduationCap, BookOpen, VenusAndMars, BadgeCheck } from 'lucide-react';

export const DirectorySection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('Semua');

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
    <section className="relative w-full py-16 sm:py-24 bg-gradient-to-b from-white via-teal-50/30 to-white overflow-hidden transition-colors">
      {/* Decorative ambient glows matching SchoolProfileSection */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-[#028C84] font-bold text-xs uppercase tracking-wider bg-teal-50/80 border border-teal-200/80 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-md">
            <GraduationCap className="w-4 h-4 text-[#028C84]" />
            Tenaga Pendidik & Kependidikan
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[black] tracking-tight">
            Direktori Guru & Tendik
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Mengenal para pendidik profesional dan berdedikasi tinggi di SD Negeri 1 Mulyoagung
          </p>
        </div>

        {/* Filter & Search Bar Liquid Glass */}
        <div className="bg-white/70 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama guru / NIP / mata pelajaran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-teal-100/90 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#028C84] shadow-inner"
            />
          </div>

          {/* Role Filters Pill Switcher */}
          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-teal-50/60 border border-teal-100/80 w-full sm:w-auto justify-center">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${roleFilter === r
                    ? 'bg-gradient-to-r from-[#028C84] to-[#156B63] text-white shadow-md shadow-teal-700/20 scale-[1.02]'
                    : 'text-slate-600 hover:text-[#028C84] hover:bg-white/60'
                  }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Liquid Glass Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="group relative bg-white/75 backdrop-blur-xl rounded-3xl p-6 border border-white/80 shadow-[0_8px_25px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(2,140,132,0.14)] hover:border-teal-200/80 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 overflow-hidden"
            >
              {/* Subtle top corner gradient shine */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-teal-100/40 to-transparent rounded-tr-3xl pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-teal-500/30 shadow-md group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="inline-block bg-teal-50/90 border border-teal-200/80 text-[#028C84] text-[11px] font-bold px-3 py-0.5 rounded-full mb-1 shadow-xs">
                      {teacher.role}
                    </span>
                    <h3 className="font-extrabold text-base text-[#1E3A8A] group-hover:text-[#028C84] transition-colors leading-snug">
                      {teacher.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">
                      NIP. {teacher.nip}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-[#028C84] shrink-0" />
                    <span className="font-semibold text-slate-700">Tugas:</span>
                    <span className="truncate text-slate-600">{teacher.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-[#028C84] shrink-0" />
                    <span className="truncate text-slate-600">{teacher.education}</span>
                  </div>
                  {teacher.gender && (
                    <div className="flex items-center gap-2">
                      <VenusAndMars className="w-3.5 h-3.5 text-[#028C84] shrink-0" />
                      <span className="text-slate-600">Jenis Kelamin:</span>
                      <span className="truncate text-slate-600">{teacher.gender}</span>
                    </div>
                  )}
                  {teacher.status && (
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="w-3.5 h-3.5 text-[#028C84] shrink-0" />
                      <span className="text-slate-600">Status:</span>
                      <span className="truncate text-slate-600">{teacher.status}</span>
                    </div>
                  )}
                </div>

                {teacher.quote && (
                  <p className="text-xs italic text-slate-600 bg-teal-50/50 p-3 rounded-2xl border border-teal-100/60 leading-relaxed">
                    "{teacher.quote}"
                  </p>
                )}
              </div>

              {teacher.email && (
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <a
                    href={`mailto:${teacher.email}`}
                    className="w-full py-2.5 px-4 rounded-2xl bg-teal-50/80 hover:bg-[#028C84] text-[#028C84] hover:text-white border border-teal-200/80 transition-all duration-300 text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
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
          <div className="text-center py-12 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/80 p-8 shadow-sm">
            <p className="text-slate-500 text-sm font-semibold">
              Tidak ada data guru yang cocok dengan pencarian "{searchTerm}".
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
