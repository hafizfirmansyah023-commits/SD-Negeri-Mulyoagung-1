import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Lightbulb, RotateCcw } from 'lucide-react';
import { getApiBaseUrl } from '../config/api';
import { UserSession } from './types';
import { InovasiItem } from '../types';
import { useInovasiData } from './hooks/useInovasiData';
import { useCmsFilter } from './hooks/useCmsFilter';
import { getUniqueValues } from './utils/cmsHelpers';
import { InovasiCard } from './inovasi/InovasiCard';
import { InovasiFormModal, INOVASI_KATEGORI_OPTIONS } from './inovasi/InovasiFormModal';
import { InovasiPreviewModal } from './inovasi/InovasiPreviewModal';
import { ImageUploadPayload } from './components/ImageUploadField';
import { CmsToast, ToastType } from './components/CmsToast';
import { CmsConfirmModal, ConfirmState } from './components/CmsConfirmModal';
import { Pagination } from '../components/common/Pagination';
import { getGoogleDriveEmbedUrl } from '../utils/helpers';

interface InovasiCrudProps {
  currentUser: UserSession;
}

const API_BASE = getApiBaseUrl();
const ITEMS_PER_PAGE = 6;

export default function InovasiCrud({ currentUser }: InovasiCrudProps) {
  const {
    inovasiList,
    loading,
    error,
    setError,
    fetchInovasi,
    deleteInovasi,
    updateInovasiStatus,
  } = useInovasiData();

  const [toast, setToast] = useState<{ type: ToastType; text: string } | null>(null);

  // Preview Modal state
  const [previewItem, setPreviewItem] = useState<InovasiItem | null>(null);

  // Confirm Modal state
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    variant: 'delete',
    onConfirm: () => {},
  });

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | string | null>(null);
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState(INOVASI_KATEGORI_OPTIONS[0]);
  const [inovator, setInovator] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [linkDrive, setLinkDrive] = useState('');
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
    filteredItems: filteredInovasi,
  } = useCmsFilter<InovasiItem>({
    items: inovasiList,
    searchFields: ['judul', 'kategori', 'inovator', 'deskripsi', 'uploader'],
    initialFilters: {
      kategori: 'ALL',
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
    const maxPage = Math.ceil(filteredInovasi.length / ITEMS_PER_PAGE) || 1;
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [filteredInovasi.length, currentPage]);

  const paginatedInovasi = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredInovasi.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredInovasi, currentPage]);

  const availableKategori = getUniqueValues(inovasiList, 'kategori');

  const resetForm = () => {
    setEditId(null);
    setJudul('');
    setKategori(INOVASI_KATEGORI_OPTIONS[0]);
    setInovator('');
    setDeskripsi('');
    setLinkDrive('');
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

  const handleOpenEdit = (item: InovasiItem) => {
    setError('');
    setEditId(item.id);
    setJudul(item.judul);
    setKategori(item.kategori);
    setInovator(item.inovator || '');
    setDeskripsi(item.deskripsi || '');
    setLinkDrive(item.link_drive || '');
    setStatus(item.status || 'Published');
    setFotoSelection({ original: null, cropped: null });
    setCurrentFoto(item.foto_cover_crop || item.foto_cover || '');
    setCurrentOriginalFoto(item.foto_cover || '');
    setShowModal(true);
  };

  const handleToggleStatus = async (id: number | string, newStatus: 'Draft' | 'Published') => {
    const ok = await updateInovasiStatus(id, newStatus, currentUser.id, currentUser.role);
    if (ok) {
      setToast({
        type: 'success',
        text: `Status inovasi berhasil diubah menjadi ${newStatus === 'Published' ? 'Diterbitkan (Published)' : 'Draf (Draft)'}.`,
      });
    } else {
      setToast({ type: 'error', text: 'Gagal mengubah status inovasi.' });
    }
  };

  const processSubmit = async () => {
    setError('');

    if (!judul.trim() || !kategori.trim() || !linkDrive.trim()) {
      const msg = 'Judul, kategori, dan link Google Drive wajib diisi.';
      setError(msg);
      setToast({ type: 'error', text: msg });
      return;
    }

    const formData = new FormData();
    formData.append('action', editId ? 'update' : 'create');
    if (editId) {
      formData.append('id', editId.toString());
    }
    formData.append('judul', judul.trim());
    formData.append('kategori', kategori.trim());
    formData.append('inovator', inovator.trim());
    formData.append('deskripsi', deskripsi.trim());
    formData.append('link_drive', linkDrive.trim());
    formData.append('status', status);
    formData.append('uploaded_by', currentUser.id.toString());
    formData.append('user_id', currentUser.id.toString());
    formData.append('role', currentUser.role);

    if (fotoSelection.original) {
      formData.append('foto_original', fotoSelection.original);
    }
    if (fotoSelection.cropped) {
      formData.append('foto', fotoSelection.cropped);
    }

    try {
      const response = await fetch(`${API_BASE}/backend/API/inovasi.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setToast({ type: 'success', text: result.message || 'Inovasi berhasil disimpan.' });
        setShowModal(false);
        resetForm();
        fetchInovasi();
      } else {
        setError(result.message || 'Gagal menyimpan inovasi.');
        setToast({ type: 'error', text: result.message || 'Gagal menyimpan inovasi.' });
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
        title: 'Konfirmasi Edit Inovasi',
        message: currentUser.role === 'ADMIN'
          ? 'Apakah Anda yakin ingin menyimpan perubahan pada inovasi ini?'
          : 'Menyimpan perubahan akan mengembalikan status inovasi ke "Menunggu Verifikasi" (Pending) agar ditinjau ulang oleh Admin. Lanjutkan?',
        onConfirm: () => {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
          processSubmit();
        },
      });
    } else {
      processSubmit();
    }
  };

  const handleDelete = (id: number | string) => {
    setConfirmState({
      isOpen: true,
      variant: 'delete',
      title: 'Konfirmasi Hapus Inovasi',
      message: 'Apakah Anda yakin ingin menghapus inovasi ini? Data inovasi dan file cover terkait akan dihapus secara permanen.',
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        const ok = await deleteInovasi(id, currentUser.id, currentUser.role);
        if (ok) {
          setToast({ type: 'delete', text: 'Inovasi berhasil dihapus.' });
        } else {
          setToast({ type: 'error', text: 'Gagal menghapus inovasi.' });
        }
      },
    });
  };

  const handlePreview = (item: InovasiItem) => {
    setPreviewItem(item);
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
            <Lightbulb className="text-teal-600 shrink-0" /> Manajemen Inovasi
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Kelola dokumentasi karya inovatif sekolah, link Google Drive, dan status publikasi.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all cursor-pointer text-sm"
        >
          <Plus size={18} /> Tambah Inovasi
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5 space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100">
          {[
            { key: 'ALL', label: 'Semua Inovasi', count: inovasiList.length },
            {
              key: 'Published',
              label: 'Published (Terbit)',
              count: inovasiList.filter((m) => m.status === 'Published').length,
              activeColor: 'bg-teal-600 text-white shadow-xs',
            },
            {
              key: 'Draft',
              label: 'Draft (Draf)',
              count: inovasiList.filter((m) => m.status === 'Draft').length,
              activeColor: 'bg-slate-800 text-amber-300 shadow-xs',
            },
            {
              key: 'Pending',
              label: 'Menunggu Verifikasi',
              count: inovasiList.filter((m) => m.status_verifikasi === 'Pending').length,
              activeColor: 'bg-amber-600 text-white shadow-xs',
            },
            {
              key: 'Rejected',
              label: 'Ditolak',
              count: inovasiList.filter((m) => m.status_verifikasi === 'Rejected').length,
              activeColor: 'bg-red-600 text-white shadow-xs',
            },
          ].map((tab) => {
            const isActive = currentTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? tab.activeColor || 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="lg:col-span-5 relative">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari judul, kategori, inovator, deskripsi..."
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-700 placeholder-slate-400 min-h-[38px] transition-all"
              />
              <Lightbulb
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filter Kategori */}
          <div className="lg:col-span-4">
            <select
              value={filters.kategori || 'ALL'}
              onChange={(e) => setFilter('kategori', e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer min-h-[38px] font-medium"
            >
              <option value="ALL">Semua Kategori Inovasi</option>
              {availableKategori.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filter Action */}
          <div className="lg:col-span-3 flex items-center justify-end">
            {isFiltered ? (
              <button
                type="button"
                onClick={resetFilter}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/60 rounded-xl transition-all cursor-pointer min-h-[38px]"
              >
                <RotateCcw size={13} /> Reset Filter
              </button>
            ) : (
              <div className="hidden lg:flex items-center justify-end w-full text-slate-400 text-xs font-medium px-2">
                <span>{filteredInovasi.length} inovasi ditemukan</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <CmsToast message={toast} onClose={() => setToast(null)} />

      {/* Inovasi Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginatedInovasi.map((item) => (
              <InovasiCard
                key={item.id}
                item={item}
                currentUser={currentUser}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onPreview={handlePreview}
                onToggleStatus={handleToggleStatus}
              />
            ))}

            {filteredInovasi.length === 0 && (
              <div className="col-span-full bg-white p-8 sm:p-12 rounded-2xl text-center border border-slate-100">
                <Lightbulb size={48} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium text-sm">
                  {isFiltered ? 'Tidak ada inovasi yang sesuai dengan filter atau kata kunci pencarian.' : 'Belum ada data inovasi diunggah.'}
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
            totalItems={filteredInovasi.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}

      {/* Form Modal */}
      <InovasiFormModal
        showModal={showModal}
        editId={editId}
        judul={judul}
        setJudul={setJudul}
        kategori={kategori}
        setKategori={setKategori}
        inovator={inovator}
        setInovator={setInovator}
        deskripsi={deskripsi}
        setDeskripsi={setDeskripsi}
        linkDrive={linkDrive}
        setLinkDrive={setLinkDrive}
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
      <InovasiPreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
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
