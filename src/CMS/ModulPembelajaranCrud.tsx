import React, { useState, useMemo, useEffect } from 'react';
import { Plus, BookOpen, RotateCcw } from 'lucide-react';
import { getApiBaseUrl, getImageUrl } from '../config/api';
import { UserSession } from './types';
import { useModulData, ModulItem } from './hooks/useModulData';
import { useCmsFilter } from './hooks/useCmsFilter';
import CmsFilterBar from './components/CmsFilterBar';
import { getUniqueValues } from './utils/cmsHelpers';
import { ModulCard } from './modul/ModulCard';
import { ModulFormModal } from './modul/ModulFormModal';
import { ImageUploadPayload } from './components/ImageUploadField';
import { CmsToast, ToastType } from './components/CmsToast';
import { CmsConfirmModal, ConfirmState } from './components/CmsConfirmModal';
import { ModulPreviewModal } from './modul/ModulPreviewModal';
import { Pagination } from '../components/common/Pagination';

interface ModulPembelajaranCrudProps {
  currentUser: UserSession;
}

const API_BASE = getApiBaseUrl();
const ITEMS_PER_PAGE = 6;

export default function ModulPembelajaranCrud({ currentUser }: ModulPembelajaranCrudProps) {
  const {
    modules,
    loading,
    error,
    setError,
    fetchModules,
    deleteModule,
    updateModulStatus,
  } = useModulData();

  const [toast, setToast] = useState<{ type: ToastType; text: string } | null>(null);

  // Confirm Modal state
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    variant: 'delete',
    onConfirm: () => {},
  });

  // Preview Modal state
  const [previewModule, setPreviewModule] = useState<ModulItem | null>(null);

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [mataPelajaran, setMataPelajaran] = useState('Pendidikan Pancasila');
  const [kelas, setKelas] = useState('Kelas 1');
  const [semester, setSemester] = useState('Ganjil');
  const [tahunAjaran, setTahunAjaran] = useState('2025/2026');
  const [kategori, setKategori] = useState('Modul Ajar');
  const [sumberTipe, setSumberTipe] = useState<'upload' | 'gdrive'>('upload');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [currentPdfPath, setCurrentPdfPath] = useState('');
  const [linkGdrive, setLinkGdrive] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Published'>('Published');
  const [fotoSelection, setFotoSelection] = useState<ImageUploadPayload>({ original: null, cropped: null });
  const [currentFoto, setCurrentFoto] = useState('');
  const [currentOriginalFoto, setCurrentOriginalFoto] = useState('');

  // Filter Hook
  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    resetFilter,
    isFiltered,
    filteredItems: filteredModules,
  } = useCmsFilter<ModulItem>({
    items: modules,
    searchFields: ['judul', 'deskripsi', 'mata_pelajaran', 'kelas', 'kategori', 'uploader'],
    initialFilters: {
      mata_pelajaran: 'ALL',
      kelas: 'ALL',
      status: 'ALL',
      status_verifikasi: 'ALL',
    },
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  // Adjust page if data is deleted and current page exceeds max page
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

  const availableMapel = getUniqueValues(modules, 'mata_pelajaran');
  const availableKelas = getUniqueValues(modules, 'kelas');

  const resetForm = () => {
    setEditId(null);
    setJudul('');
    setDeskripsi('');
    setMataPelajaran('Pendidikan Pancasila');
    setKelas('Kelas 1');
    setSemester('Ganjil');
    setTahunAjaran('2025/2026');
    setKategori('Modul Ajar');
    setSumberTipe('upload');
    setPdfFile(null);
    setCurrentPdfPath('');
    setLinkGdrive('');
    setStatus('Published');
    setFotoSelection({ original: null, cropped: null });
    setCurrentFoto('');
    setCurrentOriginalFoto('');
    setError('');
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (mod: ModulItem) => {
    setError('');
    setEditId(mod.id);
    setJudul(mod.judul);
    setDeskripsi(mod.deskripsi || '');
    setMataPelajaran(mod.mata_pelajaran);
    setKelas(mod.kelas);
    setSemester(mod.semester);
    setTahunAjaran(mod.tahun_ajaran);
    setKategori(mod.kategori);
    setSumberTipe(mod.sumber_tipe);
    setPdfFile(null);
    setCurrentPdfPath(mod.file_pdf || '');
    setLinkGdrive(mod.link_gdrive || '');
    setStatus(mod.status || 'Published');
    setFotoSelection({ original: null, cropped: null });
    setCurrentFoto(mod.foto_cover_crop || mod.foto_cover || '');
    setCurrentOriginalFoto(mod.foto_cover || '');
    setShowModal(true);
  };

  const handleToggleStatus = async (id: number, newStatus: 'Draft' | 'Published') => {
    const ok = await updateModulStatus(id, newStatus, currentUser.id, currentUser.role);
    if (ok) {
      setToast({
        type: 'success',
        text: `Status modul berhasil diubah menjadi ${newStatus === 'Published' ? 'Diterbitkan (Published)' : 'Draf (Draft)'}.`,
      });
    } else {
      setToast({ type: 'error', text: 'Gagal mengubah status modul.' });
    }
  };

  const processSubmit = async () => {
    setError('');

    // Validasi sumber
    if (sumberTipe === 'upload' && !editId && !pdfFile) {
      setError('File PDF materi wajib diunggah.');
      return;
    }
    if (sumberTipe === 'gdrive' && !linkGdrive.trim()) {
      setError('Link Google Drive wajib diisi.');
      return;
    }

    const formData = new FormData();
    formData.append('action', editId ? 'update' : 'create');
    if (editId) {
      formData.append('id', editId.toString());
    }
    formData.append('judul', judul);
    formData.append('deskripsi', deskripsi);
    formData.append('mata_pelajaran', mataPelajaran);
    formData.append('kelas', kelas);
    formData.append('semester', semester);
    formData.append('tahun_ajaran', tahunAjaran);
    formData.append('kategori', kategori);
    formData.append('sumber_tipe', sumberTipe);
    formData.append('status', status);
    formData.append('uploaded_by', currentUser.id.toString());
    formData.append('user_id', currentUser.id.toString());
    formData.append('role', currentUser.role);

    if (sumberTipe === 'upload' && pdfFile) {
      formData.append('file_pdf', pdfFile);
    } else if (sumberTipe === 'gdrive') {
      formData.append('link_gdrive', linkGdrive);
    }

    if (fotoSelection.original) {
      formData.append('foto_original', fotoSelection.original);
    }
    if (fotoSelection.cropped) {
      formData.append('foto', fotoSelection.cropped);
    }

    try {
      const response = await fetch(`${API_BASE}/backend/API/modul_pembelajaran.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setToast({ type: 'success', text: result.message || 'Modul pembelajaran berhasil disimpan.' });
        setShowModal(false);
        resetForm();
        fetchModules();
      } else {
        setError(result.message || 'Gagal menyimpan modul pembelajaran.');
        setToast({ type: 'error', text: result.message || 'Gagal menyimpan modul.' });
      }
    } catch {
      setError('Terjadi kesalahan saat menghubungi server backend.');
      setToast({ type: 'error', text: 'Terjadi kesalahan saat menghubungi server.' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      setConfirmState({
        isOpen: true,
        variant: 'edit',
        title: 'Konfirmasi Edit Modul',
        message: currentUser.role === 'ADMIN'
          ? 'Apakah Anda yakin ingin menyimpan perubahan pada modul pembelajaran ini?'
          : 'Menyimpan perubahan akan mengembalikan status modul ke "Menunggu Verifikasi" (Pending) agar ditinjau ulang oleh Admin. Lanjutkan?',
        onConfirm: () => {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
          processSubmit();
        },
      });
    } else {
      processSubmit();
    }
  };

  const handleDelete = (id: number) => {
    setConfirmState({
      isOpen: true,
      variant: 'delete',
      title: 'Konfirmasi Hapus Modul',
      message: 'Apakah Anda yakin ingin menghapus modul pembelajaran ini? File PDF atau link terkait akan dihapus secara permanen.',
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        const ok = await deleteModule(id, currentUser.id, currentUser.role);
        if (ok) {
          setToast({ type: 'delete', text: 'Modul pembelajaran berhasil dihapus.' });
        } else {
          setToast({ type: 'error', text: 'Gagal menghapus modul.' });
        }
      },
    });
  };

  // Determine active tab key based on filters
  const currentTab = useMemo(() => {
    if (filters.status === 'Published') return 'Published';
    if (filters.status === 'Draft') return 'Draft';
    if (filters.status_verifikasi === 'Pending') return 'Pending';
    if (filters.status_verifikasi === 'Rejected') return 'Rejected';
    return 'ALL';
  }, [filters]);

  const handleTabClick = (tabKey: string) => {
    if (tabKey === 'ALL') {
      setFilter('status', 'ALL');
      setFilter('status_verifikasi', 'ALL');
    } else if (tabKey === 'Published') {
      setFilter('status', 'Published');
      setFilter('status_verifikasi', 'ALL');
    } else if (tabKey === 'Draft') {
      setFilter('status', 'Draft');
      setFilter('status_verifikasi', 'ALL');
    } else if (tabKey === 'Pending') {
      setFilter('status', 'ALL');
      setFilter('status_verifikasi', 'Pending');
    } else if (tabKey === 'Rejected') {
      setFilter('status', 'ALL');
      setFilter('status_verifikasi', 'Rejected');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="text-teal-600 shrink-0" /> Modul &amp; Bahan Pembelajaran
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Kelola modul ajar, LKPD, bahan ajar digital, dan status publikasi (Draft &amp; Published).
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all cursor-pointer text-sm"
        >
          <Plus size={18} /> Tambah Modul
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-1.5 overflow-x-auto">
        {[
          { key: 'ALL', label: 'Semua Modul', count: modules.length },
          {
            key: 'Published',
            label: 'Published (Terbit)',
            count: modules.filter((m) => m.status === 'Published').length,
            activeColor: 'bg-teal-600 text-white shadow-sm',
          },
          {
            key: 'Draft',
            label: 'Draft (Draf)',
            count: modules.filter((m) => m.status === 'Draft').length,
            activeColor: 'bg-slate-800 text-amber-300 shadow-sm',
          },
          {
            key: 'Pending',
            label: 'Menunggu Verifikasi',
            count: modules.filter((m) => m.status_verifikasi === 'Pending').length,
            activeColor: 'bg-amber-600 text-white shadow-sm',
          },
          {
            key: 'Rejected',
            label: 'Ditolak',
            count: modules.filter((m) => m.status_verifikasi === 'Rejected').length,
            activeColor: 'bg-red-600 text-white shadow-sm',
          },
        ].map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? tab.activeColor || 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <CmsFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Cari judul, mapel, kelas, pengunggah..."
        isFiltered={isFiltered}
        onReset={resetFilter}
        selectFilters={[
          {
            key: 'status',
            value: filters.status || 'ALL',
            onChange: (val) => setFilter('status', val),
            options: [
              { value: 'ALL', label: 'Semua Publikasi' },
              { value: 'Published', label: 'Published (Terbit)' },
              { value: 'Draft', label: 'Draft (Draf)' },
            ],
          },
          {
            key: 'status_verifikasi',
            value: filters.status_verifikasi || 'ALL',
            onChange: (val) => setFilter('status_verifikasi', val),
            options: [
              { value: 'ALL', label: 'Semua Verifikasi' },
              { value: 'Verified', label: 'Terverifikasi' },
              { value: 'Pending', label: 'Menunggu Verifikasi' },
              { value: 'Rejected', label: 'Ditolak' },
            ],
          },
          {
            key: 'mata_pelajaran',
            value: filters.mata_pelajaran || 'ALL',
            onChange: (val) => setFilter('mata_pelajaran', val),
            options: [
              { value: 'ALL', label: 'Semua Mapel' },
              ...availableMapel.map((m) => ({ value: m, label: m })),
            ],
          },
          {
            key: 'kelas',
            value: filters.kelas || 'ALL',
            onChange: (val) => setFilter('kelas', val),
            options: [
              { value: 'ALL', label: 'Semua Kelas' },
              ...availableKelas.map((k) => ({ value: k, label: k })),
            ],
          },
        ]}
      />

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <CmsToast message={toast} onClose={() => setToast(null)} />

      {/* Modules Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginatedModules.map((mod) => (
              <ModulCard
                key={mod.id}
                module={mod}
                currentUser={currentUser}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onPreview={(m) => setPreviewModule(m)}
                onToggleStatus={handleToggleStatus}
              />
            ))}

            {filteredModules.length === 0 && (
              <div className="col-span-full bg-white p-8 sm:p-12 rounded-2xl text-center border border-slate-100">
                <BookOpen size={48} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium text-sm">
                  {isFiltered ? 'Tidak ada modul yang sesuai dengan filter atau kata kunci pencarian.' : 'Belum ada modul pembelajaran diunggah.'}
                </p>
                {isFiltered && (
                  <button
                    onClick={resetFilter}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <RotateCcw size={14} /> Reset Filter
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredModules.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}

      {/* Form Modal */}
      <ModulFormModal
        showModal={showModal}
        editId={editId}
        judul={judul}
        setJudul={setJudul}
        deskripsi={deskripsi}
        setDeskripsi={setDeskripsi}
        mataPelajaran={mataPelajaran}
        setMataPelajaran={setMataPelajaran}
        kelas={kelas}
        setKelas={setKelas}
        semester={semester}
        setSemester={setSemester}
        tahunAjaran={tahunAjaran}
        setTahunAjaran={setTahunAjaran}
        kategori={kategori}
        setKategori={setKategori}
        sumberTipe={sumberTipe}
        setSumberTipe={setSumberTipe}
        pdfFile={pdfFile}
        setPdfFile={setPdfFile}
        currentPdfPath={currentPdfPath}
        linkGdrive={linkGdrive}
        setLinkGdrive={setLinkGdrive}
        status={status}
        setStatus={setStatus}
        currentFoto={currentFoto}
        currentOriginalFoto={currentOriginalFoto}
        setFotoSelection={setFotoSelection}
        error={error}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />

      {/* Preview Modal */}
      <ModulPreviewModal
        module={previewModule}
        onClose={() => setPreviewModule(null)}
      />

      {/* Confirmation Modal */}
      <CmsConfirmModal
        isOpen={confirmState.isOpen}
        variant={confirmState.variant}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
