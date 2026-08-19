import React, { useState } from 'react';
import { Plus, Image, RotateCcw } from 'lucide-react';
import { getApiBaseUrl } from '../config/api';
import { UserSession } from './types';
import { useGalleryData, GalleryItem } from './hooks/useGalleryData';
import { useCmsFilter } from './hooks/useCmsFilter';
import CmsFilterBar from './components/CmsFilterBar';
import { getUniqueValues } from './utils/cmsHelpers';
import { GaleriCard } from './galeri/GaleriCard';
import { GaleriFormModal } from './galeri/GaleriFormModal';
import { ImageUploadPayload } from './components/ImageUploadField';
import { CmsToast } from './components/CmsToast';

interface GaleriCrudProps {
  currentUser: UserSession;
}

const API_BASE = getApiBaseUrl();

export default function GaleriCrud({ currentUser }: GaleriCrudProps) {
  const {
    items,
    loading,
    error,
    setError,
    success,
    setSuccess,
    fetchGallery,
    deleteGalleryItem,
  } = useGalleryData();

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategori, setKategori] = useState('Kegiatan Sekolah');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [fotoSelection, setFotoSelection] = useState<ImageUploadPayload>({ original: null, cropped: null });
  const [currentFoto, setCurrentFoto] = useState('');
  const [currentOriginalFoto, setCurrentOriginalFoto] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filter Hook
  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    resetFilter,
    isFiltered,
    filteredItems,
  } = useCmsFilter<GalleryItem>({
    items,
    searchFields: ['judul', 'deskripsi', 'uploader'],
    initialFilters: { kategori: 'ALL', status_verifikasi: 'ALL' },
  });

  const availableCategories = getUniqueValues(items, 'kategori');
  const availableStatuses = getUniqueValues(items, 'status_verifikasi');

  const resetForm = () => {
    setJudul('');
    setDeskripsi('');
    setKategori('Kegiatan Sekolah');
    setTanggal(new Date().toISOString().split('T')[0]);
    setFotoSelection({ original: null, cropped: null });
    setCurrentFoto('');
    setCurrentOriginalFoto('');
    setEditId(null);
    setError('');
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setError('');
    setEditId(item.id);
    setJudul(item.judul);
    setDeskripsi(item.deskripsi);
    setKategori(item.kategori);
    setTanggal(item.tanggal);
    setFotoSelection({ original: null, cropped: null });
    setCurrentFoto(item.foto || '');
    setCurrentOriginalFoto(item.foto_original || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('action', editId ? 'update' : 'create');
    if (editId) {
      formData.append('id', editId.toString());
    }
    formData.append('judul', judul);
    formData.append('deskripsi', deskripsi);
    formData.append('kategori', kategori);
    formData.append('tanggal', tanggal);
    formData.append('uploaded_by', currentUser.id.toString());
    formData.append('role', currentUser.role);
    if (fotoSelection.original) {
      formData.append('foto_original', fotoSelection.original);
    }
    if (fotoSelection.cropped) {
      formData.append('foto', fotoSelection.cropped);
    }

    try {
      const response = await fetch(`${API_BASE}/backend/API/galeri.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setToast({ type: 'success', text: result.message || 'Foto galeri berhasil disimpan.' });
        setShowModal(false);
        resetForm();
        fetchGallery();
      } else {
        setError(result.message || 'Gagal menyimpan foto galeri.');
        setToast({ type: 'error', text: result.message || 'Gagal menyimpan foto galeri.' });
      }
    } catch {
      setToast({ type: 'error', text: 'Terjadi kesalahan saat menghubungi server.' });
      setError('Terjadi kesalahan saat menghubungi server.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus foto galeri ini?')) return;
    await deleteGalleryItem(id);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Image className="text-teal-600 shrink-0" /> Galeri Foto & Kegiatan
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Kelola dokumentasi foto kegiatan sekolah dan ekstrakurikuler.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all cursor-pointer text-sm"
        >
          <Plus size={18} /> Unggah Foto Galeri
        </button>
      </div>

      {/* Filter Bar Component */}
      <CmsFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Cari judul, deskripsi, uploader..."
        isFiltered={isFiltered}
        onReset={resetFilter}
        selectFilters={[
          {
            key: 'kategori',
            value: filters.kategori || 'ALL',
            onChange: (val) => setFilter('kategori', val),
            options: [
              { value: 'ALL', label: 'Semua Kategori' },
              ...availableCategories.map((c) => ({ value: c, label: c })),
            ],
          },
          {
            key: 'status_verifikasi',
            value: filters.status_verifikasi || 'ALL',
            onChange: (val) => setFilter('status_verifikasi', val),
            options: [
              { value: 'ALL', label: 'Semua Status' },
              ...availableStatuses.map((st) => ({
                value: st,
                label: st === 'Verified' ? 'Terverifikasi' : st === 'Rejected' ? 'Ditolak' : 'Menunggu Verifikasi',
              })),
            ],
          },
        ]}
      />

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <CmsToast message={toast} onClose={() => setToast(null)} />

      {/* Grid Content */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <GaleriCard
              key={item.id}
              item={item}
              currentUser={currentUser}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-full bg-white p-8 sm:p-12 rounded-2xl text-center border border-slate-100">
              <Image size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium text-sm">
                {isFiltered ? 'Tidak ada item galeri yang sesuai dengan filter atau pencarian.' : 'Belum ada foto galeri.'}
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
      )}

      {/* Form Modal */}
      <GaleriFormModal
        showModal={showModal}
        editId={editId}
        currentFoto={currentFoto}
        currentOriginalFoto={currentOriginalFoto}
        judul={judul}
        setJudul={setJudul}
        deskripsi={deskripsi}
        setDeskripsi={setDeskripsi}
        kategori={kategori}
        setKategori={setKategori}
        tanggal={tanggal}
        setTanggal={setTanggal}
        setFotoSelection={setFotoSelection}
        error={error}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
