import React, { useState } from 'react';
import {
  Plus, Monitor, BookOpen, Activity, HeartPulse, Coffee, Trees, Building, Sparkles, X, RotateCcw
} from 'lucide-react';
import { getApiBaseUrl } from '../config/api';
import { UserSession } from './types';
import { useFacilityData, FasilitasItem } from './hooks/useFacilityData';
import { useCmsFilter } from './hooks/useCmsFilter';
import CmsFilterBar from './components/CmsFilterBar';
import { FasilitasCard } from './fasilitas/FasilitasCard';
import { FasilitasFormModal } from './fasilitas/FasilitasFormModal';
import { ImageUploadPayload } from './components/ImageUploadField';
import { CmsToast, ToastType } from './components/CmsToast';
import { CmsConfirmModal, ConfirmState } from './components/CmsConfirmModal';

interface FasilitasCrudProps {
  currentUser: UserSession;
}

const API_BASE = getApiBaseUrl();

export const getFacilityIconByTitle = (title: string, className = "w-5 h-5 text-[#028C84]") => {
  const t = title.toLowerCase();
  if (t.includes('lab') || t.includes('komputer') || t.includes('tik') || t.includes('coding') || t.includes('multimedia')) {
    return <Monitor className={className} />;
  }
  if (t.includes('pustaka') || t.includes('buku') || t.includes('baca') || t.includes('literasi')) {
    return <BookOpen className={className} />;
  }
  if (t.includes('lapangan') || t.includes('olahraga') || t.includes('futsal') || t.includes('basket') || t.includes('senam') || t.includes('fisik')) {
    return <Activity className={className} />;
  }
  if (t.includes('uks') || t.includes('sehat') || t.includes('kesehatan') || t.includes('poliklinik') || t.includes('medis')) {
    return <HeartPulse className={className} />;
  }
  if (t.includes('kantin') || t.includes('makan') || t.includes('gizi') || t.includes('kuliner') || t.includes('minum')) {
    return <Coffee className={className} />;
  }
  if (t.includes('taman') || t.includes('green') || t.includes('kebun') || t.includes('adiwiyata') || t.includes('pohon') || t.includes('hidroponik')) {
    return <Trees className={className} />;
  }
  if (t.includes('musa') || t.includes('masjid') || t.includes('agama') || t.includes('ibadah')) {
    return <Sparkles className={className} />;
  }
  return <Building className={className} />;
};

export default function FasilitasCrud({ currentUser }: FasilitasCrudProps) {
  const {
    items,
    loading,
    error,
    setError,
    success,
    setSuccess,
    fetchFacilities,
    deleteFacility,
  } = useFacilityData();

  // Toast state
  const [toast, setToast] = useState<{ type: ToastType; text: string } | null>(null);

  // Confirm Modal state
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    variant: 'delete',
    onConfirm: () => {},
  });

  // Modal & Form States
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [fotoSelection, setFotoSelection] = useState<ImageUploadPayload>({ original: null, cropped: null });
  const [currentFoto, setCurrentFoto] = useState('');
  const [currentOriginalFoto, setCurrentOriginalFoto] = useState('');
  const [deleteModalId, setDeleteModalId] = useState<number | null>(null);

  // Filter Hook
  const {
    searchTerm,
    setSearchTerm,
    resetFilter,
    isFiltered,
    filteredItems,
  } = useCmsFilter<FasilitasItem>({
    items,
    searchFields: ['judul', 'deskripsi'],
  });

  const resetForm = () => {
    setJudul('');
    setDeskripsi('');
    setFotoUrl('');
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

  const handleOpenEdit = (fac: FasilitasItem) => {
    setError('');
    setEditId(fac.id);
    setJudul(fac.judul);
    setDeskripsi(fac.deskripsi);
    setFotoUrl('');
    setFotoSelection({ original: null, cropped: null });
    setCurrentFoto(fac.foto || '');
    setCurrentOriginalFoto(fac.foto_original || '');
    setShowModal(true);
  };

  const processSubmit = async () => {
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('action', editId ? 'update' : 'create');
    if (editId) {
      formData.append('id', editId.toString());
    }
    formData.append('judul', judul);
    formData.append('deskripsi', deskripsi);
    if (fotoSelection.original) {
      formData.append('foto_original', fotoSelection.original);
    }
    if (fotoSelection.cropped) {
      formData.append('foto', fotoSelection.cropped);
    }

    try {
      const response = await fetch(`${API_BASE}/backend/API/fasilitas.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.status === 'success') {
        setToast({ type: 'success', text: result.message || (editId ? 'Fasilitas berhasil diperbarui.' : 'Fasilitas berhasil ditambahkan.') });
        setShowModal(false);
        resetForm();
        fetchFacilities();
      } else {
        setError(result.message || 'Gagal menyimpan fasilitas.');
        setToast({ type: 'error', text: result.message || 'Gagal menyimpan fasilitas.' });
      }
    } catch {
      setToast({ type: 'error', text: 'Terjadi kesalahan saat menghubungi server.' });
      setError('Terjadi kesalahan saat menghubungi server.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      setConfirmState({
        isOpen: true,
        variant: 'edit',
        title: 'Konfirmasi Edit Fasilitas',
        message: 'Apakah Anda yakin ingin menyimpan perubahan fasilitas ini?',
        onConfirm: () => {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
          processSubmit();
        },
      });
    } else {
      processSubmit();
    }
  };

  const handleDeleteRequest = (id: number) => {
    setConfirmState({
      isOpen: true,
      variant: 'delete',
      title: 'Konfirmasi Hapus Fasilitas',
      message: 'Apakah Anda yakin ingin menghapus data fasilitas ini?',
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        const isSuccess = await deleteFacility(id);
        if (isSuccess) {
          setToast({ type: 'delete', text: 'Fasilitas berhasil dihapus.' });
        } else {
          setToast({ type: 'error', text: 'Gagal menghapus fasilitas.' });
        }
      },
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Building className="text-teal-600 shrink-0" /> Manajemen Fasilitas Pembelajaran
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Kelola daftar sarana dan prasarana pembelajaran yang ditampilkan pada profil sekolah.
          </p>
        </div>
        {currentUser.role === 'ADMIN' && (
          <button
            onClick={handleOpenCreate}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer text-sm"
          >
            <Plus size={18} /> Tambah Fasilitas
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <CmsFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Cari nama fasilitas, deskripsi..."
        isFiltered={isFiltered}
        onReset={resetFilter}
      />

      {/* Notifications */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-sm font-semibold flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="text-emerald-500 hover:text-emerald-700 cursor-pointer">
            <X size={18} />
          </button>
        </div>
      )}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-rose-500 hover:text-rose-700 cursor-pointer">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Card Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 p-6">
          {isFiltered ? (
            <div>
              <p className="text-sm font-medium">Tidak ditemukan fasilitas yang sesuai dengan kata kunci pencarian.</p>
              <button
                onClick={resetFilter}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw size={14} /> Reset Pencarian
              </button>
            </div>
          ) : (
            'Belum ada data fasilitas pembelajaran. Klik tombol "Tambah Fasilitas" di atas untuk menambah.'
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((fac) => (
            <FasilitasCard
              key={fac.id}
              fac={fac}
              currentUser={currentUser}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      {/* CmsToast */}
      <CmsToast message={toast} onClose={() => setToast(null)} />

      {/* Form Modal */}
      <FasilitasFormModal
        showModal={showModal}
        editId={editId}
        judul={judul}
        setJudul={setJudul}
        deskripsi={deskripsi}
        setDeskripsi={setDeskripsi}
        currentFoto={currentFoto}
        currentOriginalFoto={currentOriginalFoto}
        fotoUrl={fotoUrl}
        setFotoUrl={setFotoUrl}
        setFotoSelection={setFotoSelection}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />

      {/* Delete & Edit Confirmation Modal */}
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
