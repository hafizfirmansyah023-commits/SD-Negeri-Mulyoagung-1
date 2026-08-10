import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, BarChart3, Hash, Tag, RotateCcw } from 'lucide-react';
import { getApiBaseUrl } from '../config/api';
import { UserSession } from './types';
import { useCmsFilter } from './hooks/useCmsFilter';
import CmsFilterBar from './components/CmsFilterBar';

interface StatistikItem {
  id: number;
  judul: string;
  jumlah: string;
  label: string;
}

interface StatistikCrudProps {
  currentUser: UserSession;
}

const API_BASE = getApiBaseUrl();

export default function StatistikCrud({ currentUser }: StatistikCrudProps) {
  const [items, setItems] = useState<StatistikItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    formData.append('jumlah', jumlah);
    formData.append('label', label);

    try {
      const response = await fetch(`${API_BASE}/backend/API/statistik.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message);
        setShowModal(false);
        resetForm();
        fetchStatistik();
      } else {
        setError(result.message || 'Gagal menyimpan statistik.');
      }
    } catch {
      setError('Terjadi kesalahan saat menghubungi server.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data statistik ini?')) return;
    setError('');
    setSuccess('');

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
        setSuccess(result.message);
        fetchStatistik();
      } else {
        setError(result.message || 'Gagal menghapus data.');
      }
    } catch {
      setError('Terjadi kesalahan saat menghapus data.');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Mobile Responsive */}
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
              <div className="p-5 sm:p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 bg-teal-50 text-teal-700 border border-teal-200 text-xs px-2.5 py-1 rounded-full font-semibold">
                    <Tag size={12} /> {item.judul}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ID #{item.id}</span>
                </div>

                <div className="text-center py-4">
                  <p className="text-3xl sm:text-4xl font-extrabold text-[#1E3A8A] leading-none">{item.jumlah}</p>
                  <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-2">{item.label}</p>
                </div>
              </div>

              {currentUser.role === 'ADMIN' && (
                <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="flex items-center gap-1.5 text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <Edit2 size={14} /> Ubah
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1.5 text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              )}
            </div>
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

      {/* Modal Form - Mobile Scrollable */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-md shadow-xl border border-slate-100 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 sm:p-6 text-white flex justify-between items-center shrink-0">
              <h3 className="text-base sm:text-lg font-bold">{editId ? 'Ubah Data Statistik' : 'Tambah Statistik Baru'}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-slate-200 text-2xl font-semibold cursor-pointer p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1">Kategori / Judul Singkat</label>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    required
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    placeholder="Contoh: Siswa, Alumni, Akreditasi"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1">Angka / Nilai Utama</label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    required
                    value={jumlah}
                    onChange={(e) => setJumlah(e.target.value)}
                    placeholder="Contoh: 250+, 1000+, A"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1">Label Penjelas</label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Contoh: Siswa Aktif Terdaftar"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm font-medium transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-sm font-medium transition-colors cursor-pointer"
                >
                  Simpan Statistik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}