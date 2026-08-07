import React, { useState, useEffect } from 'react';
import { TEACHERS_DIRECTORY } from '../data/schoolData';
import { Search, GraduationCap, BookOpen, VenusAndMars, BadgeCheck } from 'lucide-react';
import { Teacher } from '../types';
import { getApiBaseUrl, getImageUrl } from '../config/api';

export const DirectorySection: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('Semua');

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/backend/API/guru.php`);
        const result = await response.json();
        if (result.status === 'success' && result.data && result.data.length > 0) {
          const mapped: Teacher[] = result.data.map((t: any) => ({
            id: t.id.toString(),
            name: t.nama,
            title: t.jabatan,
            role: t.jabatan,
            nip: t.nip || '',
            subject: t.tugas,
            image: t.foto ? getImageUrl(t.foto) : 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
            education: t.riwayat_pendidikan,
            gender: t.jenis_kelamin,
            status: t.status,
            quote: t.motto
          }));
          setTeachers(mapped);
        } else {
          setTeachers(TEACHERS_DIRECTORY);
        }
      } catch (e) {
        setTeachers(TEACHERS_DIRECTORY);
      }
    };
    loadTeachers();
  }, []);

  const roles = ['Semua', 'Kepala Sekolah', 'Komite Sekolah', 'Guru Wali Kelas', 'Guru Mata Pelajaran', 'Tata Usaha', 'Tenaga Kependidikan'];

  const roleOrder: { [key: string]: number } = {
    'Kepala Sekolah': 1,
    'Komite Sekolah': 2,
    'Guru Wali Kelas': 3,
    'Guru Mata Pelajaran': 4,
    'Tata Usaha': 5,
    'Tenaga Kependidikan': 6,
  };

  const filteredTeachers = teachers
    .filter((teacher) => {
      const matchesSearch =
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher.nip && teacher.nip.includes(searchTerm));

      const matchesRole = roleFilter === 'Semua' || teacher.role === roleFilter;

      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      const orderA = roleOrder[a.role] || 99;
      const orderB = roleOrder[b.role] || 99;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.name.localeCompare(b.name);
    });

  // Define category groups in requested order
  const categoryGroups = [
    { title: 'Kepimpinan & Komite Sekolah', roles: ['Kepala Sekolah', 'Komite Sekolah'] },
    { title: 'Tata Usaha', roles: ['Tata Usaha'] },
    { title: 'Guru Wali Kelas', roles: ['Guru Wali Kelas'] },
    { title: 'Guru Mata Pelajaran', roles: ['Guru Mata Pelajaran'] },
    { title: 'Tenaga Kependidikan', roles: ['Tenaga Kependidikan'] },
  ];

  const renderTeacherCard = (teacher: Teacher) => (
    <div
      key={teacher.id}
      className="group relative bg-white/75 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/80 shadow-[0_8px_25px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(2,140,132,0.14)] hover:border-teal-200/80 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 overflow-hidden animate-fade-in"
    >
      {/* Subtle top corner gradient shine */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-teal-100/40 to-transparent rounded-tr-3xl pointer-events-none" />

      <div className="space-y-4">
        <div className="flex flex-col min-[420px]:flex-row gap-4 sm:gap-5 items-center min-[420px]:items-start sm:items-center text-center min-[420px]:text-left">
          <div className="relative w-28 h-28 min-[420px]:w-24 min-[420px]:h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border-2 border-teal-500/30 shadow-md group-hover:scale-105 transition-transform duration-300">
            <img
              src={teacher.image}
              alt={teacher.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="inline-block bg-teal-50/90 border border-teal-200/80 text-[#028C84] text-[11px] font-bold px-3 py-0.5 rounded-full mb-1 shadow-xs truncate max-w-full">
              {teacher.role}
            </span>
            <h3 className="font-extrabold text-base text-[#1E3A8A] group-hover:text-[#028C84] transition-colors leading-snug break-words">
              {teacher.name}
            </h3>
            {teacher.nip ? (
              <p className="text-xs font-mono text-slate-500 mt-0.5 truncate">
                NIP. {teacher.nip}
              </p>
            ) : (
              <p className="text-xs font-mono text-slate-400 mt-0.5 italic">
                NIP. -
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <BookOpen className="w-3.5 h-3.5 text-[#028C84] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-slate-700 mr-1">Tugas:</span>
              <span className="text-slate-600 break-words">{teacher.subject}</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-[#028C84] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="text-slate-600 break-words">Riwayat Pendidikan: {teacher.education}</span>
            </div>
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
    </div>
  );

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
        <div className="bg-white/70 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col lg:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full lg:w-80 shrink-0">
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
          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-teal-50/60 border border-teal-100/80 w-full lg:w-auto justify-center">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors duration-200 cursor-pointer ${roleFilter === r
                    ? 'bg-gradient-to-r from-[#028C84] to-[#156B63] text-white shadow-md shadow-teal-700/20'
                    : 'text-slate-600 hover:text-[#028C84] hover:bg-white/60'
                  }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Content Display */}
        {roleFilter === 'Semua' ? (
          <div className="space-y-10">
            {categoryGroups.map((group) => {
              const groupTeachers = filteredTeachers.filter((t) => group.roles.includes(t.role));
              if (groupTeachers.length === 0) return null;

              return (
                <div key={group.title} className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-teal-100 pb-2">
                    <span className="w-2.5 h-6 bg-[#028C84] rounded-full" />
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E3A8A]">
                      {group.title}
                    </h3>
                    <span className="text-xs font-bold text-[#028C84] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/80">
                      {groupTeachers.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupTeachers.map(renderTeacherCard)}
                  </div>
                </div>
              );
            })}

            {/* Other unassigned roles fallback if any */}
            {(() => {
              const allAssignedRoles = categoryGroups.flatMap((g) => g.roles);
              const otherTeachers = filteredTeachers.filter((t) => !allAssignedRoles.includes(t.role));
              if (otherTeachers.length === 0) return null;

              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-teal-100 pb-2">
                    <span className="w-2.5 h-6 bg-slate-400 rounded-full" />
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E3A8A]">
                      Lainnya
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherTeachers.map(renderTeacherCard)}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map(renderTeacherCard)}
          </div>
        )}

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