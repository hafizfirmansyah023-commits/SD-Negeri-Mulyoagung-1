import React, { useState, useEffect, useCallback } from 'react';
import { Plus, BarChart3, RotateCcw } from 'lucide-react';
import { getApiBaseUrl } from '../config/api';
import { UserSession } from './types';
import { useCmsFilter } from './hooks/useCmsFilter';
import CmsFilterBar from './components/CmsFilterBar';
import { StatistikCard, StatistikItem } from './statistik/StatistikCard';
import { StatistikFormModal } from './statistik/StatistikFormModal';
import { CmsToast, ToastType } from './components/CmsToast';
import { CmsConfirmModal, ConfirmState } from './components/CmsConfirmModal';

interface StatistikCrudProps {
  currentUser: UserSession;
}

const API_BASE = getApiBaseUrl();

export default function StatistikCrud({ currentUser }: StatistikCrudProps) {
  const [items, setItems] = useState<StatistikItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [toast, setToast] = useState<{ type: ToastType; text: string } | null>(null);

  // Confirm Modal state
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    variant: 'delete',
    onConfirm: () => {},
  });

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [judul, setJudul] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [label, setLabel] = useState('');

  // Filter Hook
  const {
    searchTerm,
    setSearchTerm,
    resetFilter,
    isFiltered,
    filteredItems,
  } = useCmsFilter<StatistikItem>({
    items,
    searchFields: ['judul', 'jumlah', 'label'],
  });

  const fetchStatistik = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/backend/API/statistik.php`);
      const result = await response.json();
      if (result.status === 'success') {
        setItems(result.data || []);
      } else {
        setError(result.message || 'Gagal memuat data statistik.');
      }
    } catch {
      setError('Gagal menghubungi server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistik();
  }, [fetchStatistik]);

  const resetForm = () => {
    setJudul('');
    setJumlah('');
    setLabel('');
    setEditId(null);
    setError('');
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (item: StatistikItem) => {
    setError('');
    setEditId(item.id);
    setJudul(item.judul);
    setJumlah(item.jumlah);
    setLabel(item.label);
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
    formData.append('jumlah', jumlah);
    formData.append('label', label);

    try {
      const response = await fetch(`${API_BASE}/backend/API/statistik.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setToast({ type: 'success', text: result.message || 'Data statistik berhasil disimpan.' });
        setShowModal(false);
        resetForm();
        fetchStatistik();
      } else {
        setError(result.message || 'Gagal menyimpan statistik.');
        setToast({ type: 'error', text: result.message || 'Gagal menyimpan statistik.' });
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
        title: 'Konfirmasi Edit Statistik',
        message: 'Apakah Anda yakin ingin menyimpan perubahan data statistik ini?',
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
      title: 'Konfirmasi Hapus Statistik',
      message: 'Apakah Anda yakin ingin menghapus data statistik ini?',
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        const formData = new FormData();
        formData.append('action', 'delete');
        formData.append('id', id.toString());

        try {
          const response = await fetch(`${API_BASE}/backend/API/statistik.php`, {
            method: 'POST',
            body: formData,
          });
          const result = await response.json();
          if (result.status === 'success') {
            setToast({ type: 'delete', text: 'Data statistik berhasil dihapus.' });
            fetchStatistik();
          } else {
            setToast({ type: 'error', text: result.message || 'Gagal menghapus data.' });
          }
        } catch {
          setToast({ type: 'error', text: 'Terjadi kesalahan saat menghapus data.' });
        }
      },
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="text-teal-600 shrink-0" /> Statistik Sekolah
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Kelola angka-angka statistik yang ditampilkan di halaman utama (Siswa Aktif, Alumni, Akreditasi, dsb).
          </p>
        </div>
        {currentUser.role === 'ADMIN' && (
          <button
            onClick={handleOpenCreate}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all cursor-pointer text-sm"
          >
            <Plus size={18} /> Tambah Statistik
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <CmsFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Cari judul, label, jumlah..."
        isFiltered={isFiltered}
        onReset={resetFilter}
      />

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
      {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">{success}</div>}

      {/* Grid Content */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <StatistikCard
              key={item.id}
              item={item}
              currentUser={currentUser}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-full bg-white p-8 sm:p-12 rounded-2xl text-center border border-slate-100">
              <BarChart3 size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium text-sm">
                {isFiltered ? 'Tidak ada data statistik yang sesuai dengan kata kunci pencarian.' : 'Belum ada data statistik.'}
              </p>
              {isFiltered && (
                <button
                  onClick={resetFilter}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} /> Reset Pencarian
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      <StatistikFormModal
        showModal={showModal}
        editId={editId}
        judul={judul}
        setJudul={setJudul}
        jumlah={jumlah}
        setJumlah={setJumlah}
        label={label}
        setLabel={setLabel}
        error={error}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />

      <CmsToast message={toast} onClose={() => setToast(null)} />

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