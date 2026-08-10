import React, { useState, useEffect } from 'react';
import { TEACHERS_DIRECTORY } from '../data/schoolData';
import { Search, GraduationCap, BookOpen, VenusAndMars, BadgeCheck, User, School, ArrowLeftRight, X, Eye, Sparkles, LayoutGrid } from 'lucide-react';
import { Teacher } from '../types';
import { getApiBaseUrl, getImageUrl } from '../config/api';

export const DirectorySection: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('Semua');
  const [selectedTeacherForModal, setSelectedTeacherForModal] = useState<Teacher | null>(null);

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

  // Helper to scroll smoothly to Bagan section
  const scrollToBagan = () => {
    const el = document.getElementById('bagan-struktur-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Helper to extract class number & letter from a teacher's "tugas"/subject field
  // Contoh: "Kelas 3A" -> { number: 3, letter: 'A' }, "Wali Kelas 6B" -> { number: 6, letter: 'B' }
  const extractKelasInfo = (subject: string) => {
    const match = (subject || '').match(/kelas\s*(\d+)\s*([a-zA-Z]?)/i);
    if (match) {
      return { number: parseInt(match[1], 10), letter: (match[2] || '').toUpperCase() };
    }
    return { number: 999, letter: '' };
  };

  // Helper to dynamically match teacher name from DB data state
  const getTeacherName = (targetRoleOrTask: string, fallbackName: string) => {
    if (!teachers || teachers.length === 0) return fallbackName;
    const term = targetRoleOrTask.toLowerCase();

    const matches = teachers.filter((t) => {
      const subj = (t.subject || '').toLowerCase();
      const role = (t.role || t.title || '').toLowerCase();

      if (term === 'komite sekolah') {
        return role.includes('komite');
      }
      if (term === 'kepala sekolah') {
        return role.includes('kepala');
      }
      if (term === 'tata usaha') {
        return role.includes('tata usaha') || subj.includes('tata usaha');
      }
      if (term === 'unit perpustakaan') {
        return subj.includes('perpustakaan') || role.includes('perpustakaan');
      }
      if (term.startsWith('kelas ')) {
        const classCode = term.replace('kelas ', '').trim();
        return subj.includes(classCode) || subj.includes(`kelas ${classCode}`) || subj.includes(`fase ${classCode}`);
      }
      if (term === 'penjaga') {
        return role.includes('penjaga') || subj.includes('penjaga');
      }
      if (term === 'tenaga kebersihan') {
        return role.includes('kebersihan') || subj.includes('kebersihan');
      }
      if (term === 'tenaga keamanan') {
        return role.includes('keamanan') || role.includes('satpam') || subj.includes('keamanan') || subj.includes('satpam');
      }
      return false;
    });

    if (matches.length === 1) {
      return matches[0].name;
    } else if (matches.length > 1) {
      return matches.map((m) => m.name).join(' & ');
    }

    return fallbackName;
  };

  // Helper to find teacher object from database (guru_tendik) for Modal popup summary
  const findOrBuildTeacherObj = (targetRoleOrTask: string, fallbackName: string): Teacher => {
    if (teachers && teachers.length > 0) {
      const term = targetRoleOrTask.toLowerCase();
      const fallbackTerm = fallbackName.toLowerCase();

      // 1. First try matching exact or partial name in DB teachers
      let found = teachers.find((t) => t.name.toLowerCase().includes(fallbackTerm) || fallbackTerm.includes(t.name.toLowerCase()));

      // 2. If not found by name, search by task/role in DB teachers
      if (!found) {
        found = teachers.find((t) => {
          const subj = (t.subject || '').toLowerCase();
          const role = (t.role || t.title || '').toLowerCase();

          if (term === 'komite sekolah') return role.includes('komite');
          if (term === 'kepala sekolah') return role.includes('kepala');
          if (term === 'tata usaha') return role.includes('tata usaha') || subj.includes('tata usaha');
          if (term === 'unit perpustakaan') return subj.includes('perpustakaan') || role.includes('perpustakaan');
          if (term.startsWith('kelas ')) {
            const classCode = term.replace('kelas ', '').trim();
            return subj.includes(classCode) || subj.includes(`kelas ${classCode}`) || subj.includes(`fase ${classCode}`);
          }
          if (term === 'penjaga') return role.includes('penjaga') || subj.includes('penjaga');
          if (term === 'tenaga kebersihan') return role.includes('kebersihan') || subj.includes('kebersihan');
          if (term === 'tenaga keamanan') return role.includes('keamanan') || role.includes('satpam') || subj.includes('keamanan') || subj.includes('satpam');
          return false;
        });
      }

      if (found) return found;
    }

    return {
      id: `modal-${targetRoleOrTask}`,
      name: fallbackName,
      title: targetRoleOrTask.toUpperCase(),
      role: targetRoleOrTask.toUpperCase(),
      nip: '-',
      subject: targetRoleOrTask,
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
      education: 'Pendidikan Pendidik / Tendik SD Negeri 1 Mulyoagung',
      gender: 'Laki-laki / Perempuan',
      status: 'Aktif',
      quote: 'Berdedikasi untuk kemajuan pendidikan siswa-siswi SD Negeri 1 Mulyoagung.'
    };
  };

  const handleCardClick = (roleOrTask: string, fallbackName: string) => {
    const teacherObj = findOrBuildTeacherObj(roleOrTask, fallbackName);
    setSelectedTeacherForModal(teacherObj);
  };

  // ============================================================
  // GROUPING DINAMIS: GURU MATA PELAJARAN
  // Mengelompokkan guru dengan role "Guru Mata Pelajaran" berdasarkan
  // field "tugas" (subject). Jika ada 2+ guru dengan tugas/mapel yang
  // sama persis, mereka digabung menjadi satu card (dipisah label "&").
  // Card baru otomatis muncul ketika ada guru baru dengan mapel baru
  // ditambahkan lewat halaman admin (data guru_tendik).
  // ============================================================
  const mapelGroups = React.useMemo(() => {
    const mapelTeachers = teachers.filter(
      (t) => (t.role || t.title || '').trim().toLowerCase() === 'guru mata pelajaran'
    );

    const groups: { [subjectKey: string]: { label: string; teachers: Teacher[] } } = {};

    mapelTeachers.forEach((t) => {
      const rawSubject = (t.subject || 'Lainnya').trim();
      const key = rawSubject.toLowerCase(); // normalisasi supaya "PJOK" & "pjok" dianggap sama

      if (!groups[key]) {
        groups[key] = { label: rawSubject.toUpperCase(), teachers: [] };
      }
      groups[key].teachers.push(t);
    });

    return Object.values(groups).sort((a, b) => a.label.localeCompare(b.label));
  }, [teachers]);

  const roles = ['Semua', 'Bagan Struktur', 'Kepala Sekolah', 'Komite Sekolah', 'Guru Wali Kelas', 'Guru Mata Pelajaran', 'Tata Usaha', 'Tenaga Kependidikan'];

  const roleOrder: { [key: string]: number } = {
    'Kepala Sekolah': 1,
    'Komite Sekolah': 2,
    'Guru Wali Kelas': 3,
    'Guru Mata Pelajaran': 4,
    'Tata Usaha': 5,
    'Tenaga Kependidikan': 6,
  };

  const handleRoleSelect = (r: string) => {
    setRoleFilter(r);
    if (r === 'Bagan Struktur') {
      setTimeout(scrollToBagan, 100);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.toLowerCase().includes('bagan') || val.toLowerCase().includes('struktur')) {
      setRoleFilter('Bagan Struktur');
      setTimeout(scrollToBagan, 100);
    }
  };

  const filteredTeachers = teachers
    .filter((teacher) => {
      const matchesSearch =
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher.nip && teacher.nip.includes(searchTerm));

      const matchesRole = roleFilter === 'Semua' || roleFilter === 'Bagan Struktur' || teacher.role === roleFilter;

      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      const orderA = roleOrder[a.role] || 99;
      const orderB = roleOrder[b.role] || 99;
      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // Khusus Guru Wali Kelas: urutkan dari kelas terendah ke tertinggi (1A, 1B, 2A, 2B, ... 6A, 6B)
      if (a.role === 'Guru Wali Kelas' && b.role === 'Guru Wali Kelas') {
        const kelasA = extractKelasInfo(a.subject);
        const kelasB = extractKelasInfo(b.subject);
        if (kelasA.number !== kelasB.number) {
          return kelasA.number - kelasB.number;
        }
        return kelasA.letter.localeCompare(kelasB.letter);
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
      onClick={() => setSelectedTeacherForModal(teacher)}
      className="group relative bg-white/75 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/80 shadow-[0_8px_25px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(2,140,132,0.14)] hover:border-teal-200/80 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 overflow-hidden animate-fade-in cursor-pointer"
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
        <div className="bg-white/75 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col lg:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full lg:w-96 shrink-0 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama guru / NIP / tugas / bagan..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-teal-100/90 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#028C84] shadow-inner"
              />
            </div>
          </div>

          {/* Role Filters Pill Switcher */}
          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-teal-50/60 border border-teal-100/80 w-full lg:w-auto justify-center">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => handleRoleSelect(r)}
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

        {/* Bagan Struktur Organisasi (Tersembunyi secara default, hanya tampil saat filter 'Bagan Struktur' diklik dari Search Bar) */}
        {roleFilter === 'Bagan Struktur' && (
          <div id="bagan-struktur-section" className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-3xl border-2 border-sky-300/60 shadow-[0_15px_40px_rgba(2,140,132,0.08)] space-y-6 scroll-mt-24">
            {/* Header Banner Bagan */}
            <div className="relative bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 rounded-2xl p-4 sm:p-5 text-center text-white shadow-lg overflow-hidden border border-sky-400">
              {/* Banner Background Accents */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 px-2 sm:px-6">
                <div className="hidden sm:flex items-center gap-2 text-yellow-300 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
                  <BookOpen className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-lg sm:text-2xl font-black tracking-wide text-white uppercase drop-shadow-md">
                    BAGAN STRUKTUR ORGANISASI SD NEGERI 1 MULYOAGUNG
                  </h3>
                  <p className="text-xs sm:text-base font-extrabold text-amber-300 tracking-wider mt-0.5 flex items-center justify-center gap-1.5">
                    <span>TAHUN AJARAN 2025/2026</span>
                    <span className="text-white/80 font-normal text-xs bg-white/20 px-2 py-0.5 rounded-full">(Klik kotak untuk ringkasan profil)</span>
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-yellow-300 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
                  <School className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Org Chart Flow Diagram Container (Scrollable on small screens) */}
            <div className="overflow-x-auto pb-4 pt-2">
              <div className="min-w-[1000px] space-y-6 px-4">
                
                {/* TOP LEVEL: KOMITE SEKOLAH <---> KEPALA SEKOLAH */}
                <div className="flex justify-center items-center gap-10 relative">
                  {/* Komite Sekolah */}
                  <div
                    onClick={() => handleCardClick('komite sekolah', 'SOLEH')}
                    className="w-72 border-2 border-sky-500 rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
                  >
                    <div className="bg-sky-600 text-white font-extrabold text-xs uppercase px-3 py-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-white" />
                        <span>KOMITE SEKOLAH</span>
                      </span>
                      <Eye className="w-3.5 h-3.5 text-sky-200 group-hover:text-white" />
                    </div>
                    <div className="p-3 bg-gradient-to-b from-sky-50 to-white flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 border border-red-400 flex items-center justify-center text-red-500 shrink-0 shadow-sm">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="font-extrabold text-xs text-slate-800 uppercase leading-snug break-words">
                        {getTeacherName('komite sekolah', 'SOLEH')}
                      </div>
                    </div>
                  </div>

                  {/* Double Arrow Connector */}
                  <div className="flex items-center justify-center text-slate-700 bg-slate-100 border border-slate-300 p-2.5 rounded-full shadow-sm">
                    <ArrowLeftRight className="w-5 h-5 text-slate-800 stroke-[2.5]" />
                  </div>

                  {/* Kepala Sekolah */}
                  <div
                    onClick={() => handleCardClick('kepala sekolah', 'AMALIA DYAH ERVIANA, S.Pd.')}
                    className="w-80 border-2 border-blue-700 rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
                  >
                    <div className="bg-blue-800 text-white font-extrabold text-xs uppercase px-3 py-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-white" />
                        <span>KEPALA SEKOLAH</span>
                      </span>
                      <Eye className="w-3.5 h-3.5 text-blue-200 group-hover:text-white" />
                    </div>
                    <div className="p-3 bg-gradient-to-b from-blue-50 to-white flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 border border-red-400 flex items-center justify-center text-red-500 shrink-0 shadow-sm">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="font-extrabold text-xs text-slate-800 uppercase leading-snug break-words">
                        {getTeacherName('kepala sekolah', 'AMALIA DYAH ERVIANA, S.Pd.')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vertical Trunk Line from Kepala Sekolah down to tree */}
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-6 bg-slate-800" />
                  <div className="w-[85%] h-0.5 bg-slate-800 relative">
                    {/* Arrowhead connections down to 4 columns */}
                    <div className="absolute top-0 left-0 -translate-x-1/2 w-0.5 h-5 bg-slate-800" />
                    <div className="absolute top-0 left-[24%] -translate-x-1/2 w-0.5 h-5 bg-slate-800" />
                    <div className="absolute top-0 left-[62%] -translate-x-1/2 w-0.5 h-5 bg-slate-800" />
                    <div className="absolute top-0 right-0 translate-x-1/2 w-0.5 h-5 bg-slate-800" />
                  </div>
                </div>

                {/* 4 MAIN BRANCH COLUMNS */}
                <div className="grid grid-cols-4 gap-4 items-start pt-3">
                  
                  {/* COLUMN 1: TATA USAHA & UNIT PERPUSTAKAAN */}
                  <div className="space-y-4">
                    {/* Tata Usaha */}
                    <div
                      onClick={() => handleCardClick('tata usaha', 'ANISA CHOIRINA, S.Pd.')}
                      className="border border-orange-400 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <div className="bg-orange-500 text-white font-black text-xs uppercase px-2 py-1.5 text-center">
                        TATA USAHA
                      </div>
                      <div className="p-2.5 bg-orange-50/50 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="font-extrabold text-xs text-slate-800 uppercase leading-snug break-words">
                          {getTeacherName('tata usaha', 'ANISA CHOIRINA, S.Pd.')}
                        </div>
                      </div>
                    </div>

                    {/* Unit Perpustakaan */}
                    <div
                      onClick={() => handleCardClick('unit perpustakaan', 'ANISA CHOIRINA, S.Pd.')}
                      className="border border-orange-400 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <div className="bg-orange-500 text-white font-black text-xs uppercase px-2 py-1.5 text-center">
                        UNIT PERPUSTAKAAN
                      </div>
                      <div className="p-2.5 bg-orange-50/50 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="font-extrabold text-xs text-slate-800 uppercase leading-snug break-words">
                          {getTeacherName('unit perpustakaan', 'ANISA CHOIRINA, S.Pd.')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* COLUMN 2: GURU MATA PELAJARAN (DINAMIS dari data guru_tendik) */}
                  <div className="border-2 border-emerald-600 rounded-2xl overflow-hidden bg-emerald-50/40 p-2.5 space-y-3 shadow-sm">
                    <div className="bg-emerald-700 text-white font-black text-xs uppercase px-2 py-1.5 rounded-lg text-center tracking-wide">
                      GURU MATA PELAJARAN
                    </div>

                    {mapelGroups.length > 0 ? (
                      mapelGroups.map((group) => (
                        <div
                          key={group.label}
                          onClick={() => setSelectedTeacherForModal(group.teachers[0])}
                          className="border border-emerald-500 rounded-xl overflow-hidden bg-white hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                        >
                          <div className="bg-emerald-600 text-white font-extrabold text-xs uppercase px-2 py-1 text-center">
                            {group.label}
                          </div>
                          <div className="p-2.5 space-y-1.5 bg-emerald-50/30">
                            {group.teachers.map((t, idx) => (
                              <React.Fragment key={t.id}>
                                {idx > 0 && (
                                  <div className="text-[11px] font-extrabold text-emerald-800 text-center uppercase">
                                    &
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                                    <User className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="font-extrabold text-xs text-slate-800 uppercase leading-snug break-words">
                                    {t.name}
                                  </div>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-[11px] text-slate-400 italic py-3">
                        Belum ada data Guru Mata Pelajaran
                      </div>
                    )}
                  </div>

                  {/* COLUMN 3: GURU KELAS (2 SUB-COLUMNS) */}
                  <div className="border-2 border-emerald-700 rounded-2xl overflow-hidden bg-emerald-50/40 p-2.5 space-y-3 shadow-sm col-span-1">
                    <div className="bg-emerald-800 text-white font-black text-xs uppercase px-2 py-1.5 rounded-lg text-center tracking-wide">
                      GURU KELAS
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Left Column (1A - 6A) */}
                      <div className="space-y-2">
                        {[
                          { label: 'Kelas 1A', code: 'kelas 1a', default: 'SUNU HAYUTAMA, S.Pd.' },
                          { label: 'Kelas 2A', code: 'kelas 2a', default: 'RATNA YULIYA KIRNAWATI, S.Pd.' },
                          { label: 'Kelas 3A', code: 'kelas 3a', default: 'ADI KURNIAWAN, S.Pd.' },
                          { label: 'Kelas 4A', code: 'kelas 4a', default: 'NUR AINI FARIDA, S.Pd.' },
                          { label: 'Kelas 5A', code: 'kelas 5a', default: 'SITI MAISAROH, S.Pd.' },
                          { label: 'Kelas 6A', code: 'kelas 6a', default: 'VIVIN NOHTAHFIAH, S.Pd.' },
                        ].map((item) => (
                          <div
                            key={item.label}
                            onClick={() => handleCardClick(item.code, item.default)}
                            className="border border-emerald-400 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                          >
                            <div className="bg-emerald-600 text-white font-extrabold text-[11px] uppercase py-1 px-1 text-center">
                              {item.label}
                            </div>
                            <div className="p-1.5 flex items-center gap-1.5 bg-emerald-50/20">
                              <div className="w-5 h-5 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                                <User className="w-3.5 h-3.5" />
                              </div>
                              <div className="font-extrabold text-[11px] text-slate-800 uppercase leading-snug break-words">
                                {getTeacherName(item.code, item.default)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Right Column (1B - 6B) */}
                      <div className="space-y-2">
                        {[
                          { label: 'Kelas 1B', code: 'kelas 1b', default: 'PUTRI ANGGUN LIARTA, S.Pd.' },
                          { label: 'Kelas 2B', code: 'kelas 2b', default: 'YUNIA NUR AFIYAH, S.Pd.' },
                          { label: 'Kelas 3B', code: 'kelas 3b', default: 'SOQIBATUL ISLAMIYAH, S.Pd.' },
                          { label: 'Kelas 4B', code: 'kelas 4b', default: 'SRI HARTATIK, S.Pd.' },
                          { label: 'Kelas 5B', code: 'kelas 5b', default: 'YUNI TRI HARIANTI, S.IP., S.Pd.' },
                          { label: 'Kelas 6B', code: 'kelas 6b', default: 'YULIDA ARIANI, S.Pd.' },
                        ].map((item) => (
                          <div
                            key={item.label}
                            onClick={() => handleCardClick(item.code, item.default)}
                            className="border border-emerald-400 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                          >
                            <div className="bg-emerald-600 text-white font-extrabold text-[11px] uppercase py-1 px-1 text-center">
                              {item.label}
                            </div>
                            <div className="p-1.5 flex items-center gap-1.5 bg-emerald-50/20">
                              <div className="w-5 h-5 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                                <User className="w-3.5 h-3.5" />
                              </div>
                              <div className="font-extrabold text-[11px] text-slate-800 uppercase leading-snug break-words">
                                {getTeacherName(item.code, item.default)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* COLUMN 4: TENAGA KEPENDIDIKAN */}
                  <div className="border-2 border-amber-400 rounded-2xl overflow-hidden bg-amber-50/40 p-2.5 space-y-3 shadow-sm">
                    <div className="bg-amber-400 text-slate-900 font-black text-xs uppercase px-2 py-1.5 rounded-lg text-center tracking-wide">
                      TENAGA KEPENDIDIKAN
                    </div>

                    {/* Penjaga */}
                    <div
                      onClick={() => handleCardClick('penjaga', 'ABDUL MUJIB')}
                      className="border border-amber-300 rounded-xl overflow-hidden bg-white hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <div className="bg-amber-300 text-slate-900 font-extrabold text-xs uppercase px-2 py-1 text-center">
                        PENJAGA
                      </div>
                      <div className="p-2.5 flex items-center gap-2 bg-amber-50/30">
                        <div className="w-7 h-7 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="font-extrabold text-xs text-slate-800 uppercase leading-snug break-words">
                          {getTeacherName('penjaga', 'ABDUL MUJIB')}
                        </div>
                      </div>
                    </div>

                    {/* Tenaga Kebersihan */}
                    <div
                      onClick={() => handleCardClick('tenaga kebersihan', 'MARSUDI')}
                      className="border border-amber-300 rounded-xl overflow-hidden bg-white hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <div className="bg-amber-300 text-slate-900 font-extrabold text-xs uppercase px-2 py-1 text-center">
                        TENAGA KEBERSIHAN
                      </div>
                      <div className="p-2.5 flex items-center gap-2 bg-amber-50/30">
                        <div className="w-7 h-7 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="font-extrabold text-xs text-slate-800 uppercase leading-snug break-words">
                          {getTeacherName('tenaga kebersihan', 'MARSUDI')}
                        </div>
                      </div>
                    </div>

                    {/* Tenaga Keamanan */}
                    <div
                      onClick={() => handleCardClick('tenaga keamanan', 'AGUS SUKOCO')}
                      className="border border-amber-300 rounded-xl overflow-hidden bg-white hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <div className="bg-amber-300 text-slate-900 font-extrabold text-xs uppercase px-2 py-1 text-center">
                        TENAGA KEAMANAN
                      </div>
                      <div className="p-2.5 flex items-center gap-2 bg-amber-50/30">
                        <div className="w-7 h-7 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="font-extrabold text-xs text-slate-800 uppercase leading-snug break-words">
                          {getTeacherName('tenaga keamanan', 'AGUS SUKOCO')}
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          </div>
        )}

        {/* Content Display: Kartu Direktori Guru (Disembunyikan saat filter 'Bagan Struktur' aktif) */}
        {roleFilter !== 'Bagan Struktur' && (
          <>
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
          </>
        )}
      </div>

      {/* POPUP MODAL RINGKASAN DATA GURU / TENDIK (DARI DATABASE GURU_TENDIK) */}
      {selectedTeacherForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-teal-100 animate-scale-up">
            {/* Header Gradient */}
            <div className="bg-gradient-to-r from-[#028C84] to-[#1E3A8A] p-5 text-white flex justify-between items-center relative">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-base sm:text-lg">Ringkasan Profil Guru / Tendik</h3>
              </div>
              <button
                onClick={() => setSelectedTeacherForModal(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-teal-500/40 shadow-md shrink-0 bg-slate-100">
                  <img
                    src={selectedTeacherForModal.image}
                    alt={selectedTeacherForModal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className="inline-block bg-teal-50 border border-teal-200 text-[#028C84] text-xs font-bold px-3 py-0.5 rounded-full">
                    {selectedTeacherForModal.role || selectedTeacherForModal.title}
                  </span>
                  <h4 className="text-xl font-extrabold text-[#1E3A8A]">
                    {selectedTeacherForModal.name}
                  </h4>
                  <p className="text-xs font-mono text-slate-500">
                    NIP. {selectedTeacherForModal.nip || '-'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 text-sm text-slate-700">
                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <BookOpen className="w-4 h-4 text-[#028C84] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block text-xs uppercase tracking-wide">Tugas / Mata Pelajaran</span>
                    <span className="text-slate-600 font-medium text-xs sm:text-sm">{selectedTeacherForModal.subject}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <GraduationCap className="w-4 h-4 text-[#028C84] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block text-xs uppercase tracking-wide">Riwayat Pendidikan</span>
                    <span className="text-slate-600 font-medium text-xs sm:text-sm">{selectedTeacherForModal.education}</span>
                  </div>
                </div>

                {selectedTeacherForModal.gender && (
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <VenusAndMars className="w-4 h-4 text-[#028C84] shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 block text-xs uppercase tracking-wide">Jenis Kelamin</span>
                      <span className="text-slate-600 font-medium text-xs sm:text-sm">{selectedTeacherForModal.gender}</span>
                    </div>
                  </div>
                )}

                {selectedTeacherForModal.status && (
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <BadgeCheck className="w-4 h-4 text-[#028C84] shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 block text-xs uppercase tracking-wide">Status Pegawai</span>
                      <span className="text-slate-600 font-medium text-xs sm:text-sm">{selectedTeacherForModal.status}</span>
                    </div>
                  </div>
                )}
              </div>

              {selectedTeacherForModal.quote && (
                <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-200/80 text-xs sm:text-sm text-slate-700 italic">
                  "{selectedTeacherForModal.quote}"
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedTeacherForModal(null)}
                className="px-5 py-2.5 bg-[#028C84] hover:bg-[#156B63] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};