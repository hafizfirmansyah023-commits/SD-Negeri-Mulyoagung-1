import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { Teacher } from '../types';
import { useTeachersData } from '../hooks/useTeachersData';
import { ROLE_FILTERS, filterAndSortTeachers, findOrBuildTeacherObj } from '../utils/directoryHelpers';
import { DirectoryFilterBar } from './directory/DirectoryFilterBar';
import { OrgChartSection } from './directory/OrgChartSection';
import { DirectoryContent } from './directory/DirectoryContent';
import { TeacherProfileModal } from './directory/TeacherProfileModal';
import { PensiunContent } from './directory/PensiunContent';
import { MutasiContent } from './directory/MutasiContent';
import { useDebounce } from '../hooks/useDebounce';

export const DirectorySection: React.FC = () => {
  const teachers = useTeachersData();
  const [searchTerm, setSearchTerm] = useState('');
  const [pensiunSearchTerm, setPensiunSearchTerm] = useState('');
  const [mutasiSearchTerm, setMutasiSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 1000);
  const debouncedPensiunSearch = useDebounce(pensiunSearchTerm, 1000);
  const debouncedMutasiSearch = useDebounce(mutasiSearchTerm, 1000);
  const [roleFilter, setRoleFilter] = useState<string>('Semua');
  const [selectedTeacherForModal, setSelectedTeacherForModal] = useState<Teacher | null>(null);
  const [activeTab, setActiveTab] = useState<'aktif' | 'pensiun' | 'mutasi'>('aktif');

  const scrollToBagan = () => {
    const el = document.getElementById('bagan-struktur-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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

  // Dipakai saat kotak Bagan Struktur (selain kolom Guru Mata Pelajaran) diklik
  const handleOrgChartCardClick = (roleOrTask: string, fallbackName: string) => {
    setSelectedTeacherForModal(findOrBuildTeacherObj(teachers, roleOrTask, fallbackName));
  };

  // Only active teachers shown in main directory & org chart (exclude pensiun & mutasi)
  const activeTeachers = teachers.filter((t) => {
    const st = (t.status || '').toLowerCase();
    if (!st || st === 'aktif') return true;
    return false;
  });

  const filteredTeachers = filterAndSortTeachers(activeTeachers, debouncedSearch, roleFilter);

  const tabScrollPositions = React.useRef<{ aktif: number; pensiun: number; mutasi: number }>({
    aktif: 0,
    pensiun: 0,
    mutasi: 0,
  });

  const handleTabChange = (newTab: 'aktif' | 'pensiun' | 'mutasi') => {
    if (newTab === activeTab) return;
    // Simpan posisi scroll untuk tab yang sedang ditinggalkan
    tabScrollPositions.current[activeTab] = window.scrollY;
    setActiveTab(newTab);

    // Kembalikan posisi scroll untuk tab tujuan secara instan
    requestAnimationFrame(() => {
      window.scrollTo({ top: tabScrollPositions.current[newTab] ?? 0, behavior: 'instant' as ScrollBehavior });
    });
  };

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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[black] tracking-tight">Direktori Guru & Tendik</h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Mengenal para pendidik profesional dan berdedikasi tinggi di SD Negeri 1 Mulyoagung
          </p>
        </div>

        {/* Tabs for Aktif vs Pensiun vs Mutasi */}
        <div className="flex justify-center mb-8">
          <div className="bg-teal-50/80 p-1.5 rounded-2xl border border-teal-100 flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => handleTabChange('aktif')}
              className={`px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeTab === 'aktif'
                  ? 'bg-gradient-to-r from-[#028C84] to-[#156B63] text-white shadow-md shadow-teal-700/20'
                  : 'text-slate-600 hover:text-[#028C84] hover:bg-white/60'
              }`}
            >
              Guru & Tendik Aktif
            </button>
            <button
              onClick={() => handleTabChange('pensiun')}
              className={`px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeTab === 'pensiun'
                  ? 'bg-gradient-to-r from-[#028C84] to-[#156B63] text-white shadow-md shadow-teal-700/20'
                  : 'text-slate-600 hover:text-[#028C84] hover:bg-white/60'
              }`}
            >
              Purna Tugas (Pensiun)
            </button>
            <button
              onClick={() => handleTabChange('mutasi')}
              className={`px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeTab === 'mutasi'
                  ? 'bg-gradient-to-r from-[#028C84] to-[#156B63] text-white shadow-md shadow-teal-700/20'
                  : 'text-slate-600 hover:text-[#028C84] hover:bg-white/60'
              }`}
            >
              Status Mutasi
            </button>
          </div>
        </div>

        {activeTab === 'aktif' && (
          <>
            <DirectoryFilterBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              roleFilter={roleFilter}
              onRoleSelect={handleRoleSelect}
              roles={ROLE_FILTERS}
            />

            {roleFilter === 'Bagan Struktur' && (
              <OrgChartSection
                teachers={activeTeachers}
                onCardClick={handleOrgChartCardClick}
                onMapelGroupClick={setSelectedTeacherForModal}
              />
            )}

            {roleFilter !== 'Bagan Struktur' && (
              <DirectoryContent
                filteredTeachers={filteredTeachers}
                roleFilter={roleFilter}
                searchTerm={searchTerm}
                onTeacherClick={setSelectedTeacherForModal}
              />
            )}
          </>
        )}

        {activeTab === 'pensiun' && (
          <PensiunContent
            teachers={teachers}
            searchTerm={pensiunSearchTerm}
            debouncedSearchTerm={debouncedPensiunSearch}
            onSearchChange={(e) => setPensiunSearchTerm(e.target.value)}
            onTeacherClick={setSelectedTeacherForModal}
          />
        )}

        {activeTab === 'mutasi' && (
          <MutasiContent
            teachers={teachers}
            searchTerm={mutasiSearchTerm}
            debouncedSearchTerm={debouncedMutasiSearch}
            onSearchChange={(e) => setMutasiSearchTerm(e.target.value)}
            onTeacherClick={setSelectedTeacherForModal}
          />
        )}
      </div>

      <TeacherProfileModal teacher={selectedTeacherForModal} onClose={() => setSelectedTeacherForModal(null)} />
    </section>
  );
};

