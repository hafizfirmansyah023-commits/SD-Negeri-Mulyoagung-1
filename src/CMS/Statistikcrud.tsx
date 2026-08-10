import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BarChart3, Hash, Tag, Search, RotateCcw, X } from 'lucide-react';
import { getApiBaseUrl } from '../config/api';
import { UserSession } from './types';

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

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [judul, setJudul] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [label, setLabel] = useState('');

  const fetchStatistik = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/backend/API/statistik.php`);
      const result = await response.json();
      if (result.status === 'success') {
        setItems(result.data || []);
      } else {
        setError(result.message || 'Gagal memuat data statistik.');
      }
    } catch (err) {
      setError('Gagal menghubungi server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistik();
  }, []);

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
        setError(result.message || 'Gagal menyimpan data.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menyimpan data.');
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
    } catch (err) {
      setError('Terjadi kesalahan saat menghapus data.');
    }
  };

  const filteredItems = items.filter((item) => {
    return (
      !searchTerm.trim() ||
      item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jumlah.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="text-teal-600" /> Statistik Sekolah
          </h2>
          <p className="text-slate-500 text-sm">Kelola angka-angka statistik yang ditampilkan di halaman utama (Siswa Aktif, Alumni, Akreditasi, dsb).</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all transform hover:scale-102 cursor-pointer"
        >
          <Plus size={18} /> Tambah Statistik
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari judul, label, jumlah..."
            className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-slate-700 placeholder-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={15} />
            </button>
          )}
        </div>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw size={14} /> Reset
          </button>
        )}
      </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 bg-teal-50 text-teal-700 border border-teal-200 text-xs px-2.5 py-1 rounded-full font-semibold">
                    <Tag size={12} /> {item.judul}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ID #{item.id}</span>
                </div>

                <div className="text-center py-4">
                  <p className="text-4xl font-extrabold text-[#1E3A8A] leading-none">{item.jumlah}</p>
                  <p className="text-slate-500 text-sm font-semibold mt-2">{item.label}</p>
                </div>
              </div>

              {currentUser.role === 'ADMIN' && (
                <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="flex items-center gap-1.5 text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <Edit2 size={14} /> Ubah
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1.5 text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              )}
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-full bg-white p-12 rounded-2xl text-center border border-slate-100">
              <BarChart3 size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">
                {searchTerm ? `Tidak ada data statistik yang sesuai dengan "${searchTerm}".` : 'Belum ada data statistik.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} /> Reset Pencarian
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl border border-slate-100 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">{editId ? 'Ubah Statistik' : 'Tambah Statistik Baru'}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-slate-200 text-2xl font-semibold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Judul / Kunci Statistik</label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: siswa, alumni, akreditasi"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <p className="text-slate-400 text-xs mt-1">Nama unik untuk mengidentifikasi statistik ini.</p>
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Jumlah / Angka</label>
                <div className="relative">
                  <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={jumlah}
                    onChange={(e) => setJumlah(e.target.value)}
                    placeholder="Contoh: 250+, 500+, A"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Label Tampilan</label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Contoh: Siswa Aktif, Alumni, Akreditasi"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 font-medium transition-colors cursor-pointer"
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