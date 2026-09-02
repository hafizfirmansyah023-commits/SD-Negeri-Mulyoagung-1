import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Search, Filter, Download, ExternalLink, Eye, RotateCcw, X, FileText, Calendar, Layers } from 'lucide-react';
import { getApiBaseUrl, getImageUrl } from '../config/api';
import { Pagination } from './common/Pagination';
import { ModulPreviewModal } from '../CMS/modul/ModulPreviewModal';
import { ModulItem } from '../CMS/hooks/useModulData';
import { useDebounce } from '../hooks/useDebounce';

const ITEMS_PER_PAGE = 6;

export const ModulPembelajaranSection: React.FC = () => {
  const [modules, setModules] = useState<ModulItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [selectedKelas, setSelectedKelas] = useState('Semua');
  const [selectedSemester, setSelectedSemester] = useState('Semua');
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState('Semua');
  const [selectedMapel, setSelectedMapel] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 1000);
  const [currentPage, setCurrentPage] = useState(1);
  const [previewModule, setPreviewModule] = useState<ModulItem | null>(null);

  useEffect(() => {
    const fetchPublicModules = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${getApiBaseUrl()}/backend/API/modul_pembelajaran.php`);
        const json = await res.json();
        if (json.status === 'success' && Array.isArray(json.data)) {
          setModules(json.data);
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchPublicModules();
  }, []);

  // Filter option lists
  const availableKategori = useMemo(() => ['Semua', ...Array.from(new Set(modules.map((m) => m.kategori).filter(Boolean)))], [modules]);
  const availableKelas = useMemo(() => ['Semua', ...Array.from(new Set(modules.map((m) => m.kelas).filter(Boolean)))], [modules]);
  const availableSemester = useMemo(() => ['Semua', ...Array.from(new Set(modules.map((m) => m.semester).filter(Boolean)))], [modules]);
  const availableTahunAjaran = useMemo(() => ['Semua', ...Array.from(new Set(modules.map((m) => m.tahun_ajaran).filter(Boolean)))], [modules]);
  const availableMapel = useMemo(() => ['Semua', ...Array.from(new Set(modules.map((m) => m.mata_pelajaran).filter(Boolean)))], [modules]);

  // Filtered & Searched Modules
  const filteredModules = useMemo(() => {
    let result = modules;

    if (selectedKategori !== 'Semua') {
      result = result.filter((m) => m.kategori === selectedKategori);
    }
    if (selectedKelas !== 'Semua') {
      result = result.filter((m) => m.kelas === selectedKelas);
    }
    if (selectedSemester !== 'Semua') {
      result = result.filter((m) => m.semester === selectedSemester);
    }
    if (selectedTahunAjaran !== 'Semua') {
      result = result.filter((m) => m.tahun_ajaran === selectedTahunAjaran);
    }
    if (selectedMapel !== 'Semua') {
      result = result.filter((m) => m.mata_pelajaran === selectedMapel);
    }

    if (debouncedSearch.trim() !== '') {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (m) =>
          (m.judul && m.judul.toLowerCase().includes(q)) ||
          (m.deskripsi && m.deskripsi.toLowerCase().includes(q)) ||
          (m.mata_pelajaran && m.mata_pelajaran.toLowerCase().includes(q)) ||
          (m.kelas && m.kelas.toLowerCase().includes(q)) ||
          (m.kategori && m.kategori.toLowerCase().includes(q)) ||
          (m.uploader && m.uploader.toLowerCase().includes(q))
      );
    }

    return result;
  }, [modules, selectedKategori, selectedKelas, selectedSemester, selectedTahunAjaran, selectedMapel, debouncedSearch]);

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedKategori, selectedKelas, selectedSemester, selectedTahunAjaran, selectedMapel, debouncedSearch]);

  // Adjust page if current page exceeds max page
  useEffect(() => {
    const maxPage = Math.ceil(filteredModules.length / ITEMS_PER_PAGE) || 1;
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [filteredModules.length, currentPage]);

  const paginatedModules = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredModules.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredModules, currentPage]);

  const isFiltered =
    selectedKategori !== 'Semua' ||
    selectedKelas !== 'Semua' ||
    selectedSemester !== 'Semua' ||
    selectedTahunAjaran !== 'Semua' ||
    selectedMapel !== 'Semua' ||
    searchTerm.trim() !== '';

  const handleReset = () => {
    setSelectedKategori('Semua');
    setSelectedKelas('Semua');
    setSelectedSemester('Semua');
    setSelectedTahunAjaran('Semua');
    setSelectedMapel('Semua');
    setSearchTerm('');
  };

  return (
    <section id="modul-section" className="relative w-full py-16 sm:py-24 bg-gradient-to-b from-white via-teal-50/30 to-white overflow-hidden transition-colors">
      {/* Decorative subtle ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-[#028C84] font-bold text-xs uppercase tracking-wider bg-teal-50/80 border border-teal-200/80 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-md">
            <BookOpen className="w-4 h-4 text-[#028C84]" />
            Ruang Belajar Digital
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[black] tracking-tight">
            Modul &amp; Bahan Pembelajaran
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Akses materi ajar, modul Kurikulum Merdeka, lembar kerja siswa, dan buku panduan digital SDN 1 Mulyoagung.
          </p>
        </div>

        {/* Filter Bar Multi-Kriteria */}
        <div className="bg-white/85 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          {/* Search Row */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari judul materi, topik bahasan, atau nama guru pengampu..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-xs sm:text-sm text-slate-700 placeholder-slate-400 shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {isFiltered && (
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw size={14} /> Reset Filter
              </button>
            )}
          </div>

          {/* Dropdown Filters Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100">
            {/* Mapel */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Mata Pelajaran</label>
              <select
                value={selectedMapel}
                onChange={(e) => setSelectedMapel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
              >
                {availableMapel.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Kelas */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Tingkat Kelas</label>
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
              >
                {availableKelas.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Kategori Materi</label>
              <select
                value={selectedKategori}
                onChange={(e) => setSelectedKategori(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
              >
                {availableKategori.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
              >
                {availableSemester.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Tahun Ajaran */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Tahun Ajaran</label>
              <select
                value={selectedTahunAjaran}
                onChange={(e) => setSelectedTahunAjaran(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
              >
                {availableTahunAjaran.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginatedModules.map((mod) => (
              <article
                key={mod.id}
                onClick={() => setPreviewModule(mod)}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-200/80 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1"
              >
                <div>
                  {/* Thumbnail / Cover */}
                  <div className="relative h-44 sm:h-48 bg-gradient-to-br from-teal-800 to-slate-900 overflow-hidden">
                    {mod.foto ? (
                      <img
                        src={getImageUrl(mod.foto)}
                        alt={mod.judul}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-teal-200/80 p-4 text-center">
                        <BookOpen size={48} className="mb-2 text-teal-300/50 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold uppercase tracking-wider">{mod.mata_pelajaran}</span>
                      </div>
                    )}

                    {/* Category & Class Badges */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-teal-700/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                        {mod.kategori}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                      <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                        {mod.kelas}
                      </span>
                      <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                        {mod.semester}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-teal-700">{mod.mata_pelajaran}</span>
                      <span>TA {mod.tahun_ajaran}</span>
                    </div>

                    <h3 className="font-bold text-slate-800 text-base sm:text-lg leading-tight line-clamp-1 group-hover:text-[#028C84] transition-colors">
                      {mod.judul}
                    </h3>

                    <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {mod.deskripsi || 'Materi pembelajaran digital interaktif untuk menunjang kegiatan belajar siswa.'}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                  <span className="truncate text-xs">Oleh: {mod.uploader || 'Guru SDN 1 Mulyoagung'}</span>
                  
                  <div className="flex items-center gap-1.5 text-teal-600 font-semibold group-hover:translate-x-0.5 transition-transform shrink-0">
                    <Eye size={13} />
                    <span className="text-[11px] group-hover:underline">Buka Materi</span>
                  </div>
                </div>
              </article>
            ))}

            {filteredModules.length === 0 && (
              <div className="col-span-full bg-white p-8 sm:p-12 rounded-2xl text-center border border-slate-100 space-y-2 shadow-sm">
                <BookOpen size={48} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-700 font-bold text-base">Tidak ada modul pembelajaran yang ditemukan</p>
                <p className="text-slate-400 text-xs sm:text-sm">Silakan sesuaikan kriteria filter atau ubah kata kunci pencarian Anda.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredModules.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={(page) => {
            setCurrentPage(page);
            const el = document.getElementById('modul-section');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        />

      </div>

      {/* Preview Modal */}
      <ModulPreviewModal
        module={previewModule}
        onClose={() => setPreviewModule(null)}
      />
    </section>
  );
};
