import React, { useState } from 'react';
import { Plus, FileText, RotateCcw } from 'lucide-react';
import { getApiBaseUrl } from '../config/api';
import { UserSession } from './types';
import { useNewsData, NewsArticle } from './hooks/useNewsData';
import { useCmsFilter } from './hooks/useCmsFilter';
import CmsFilterBar from './components/CmsFilterBar';
import { getUniqueValues } from './utils/cmsHelpers';
import { BeritaCard } from './berita/BeritaCard';
import { BeritaFormModal } from './berita/BeritaFormModal';
import { ImageUploadPayload } from './components/ImageUploadField';
import { CmsToast } from './components/CmsToast';

interface BeritaCrudProps {
  currentUser: UserSession;
}

const API_BASE = getApiBaseUrl();

export default function BeritaCrud({ currentUser }: BeritaCrudProps) {
  const {
    articles,
    loading,
    error,
    setError,
    success,
    setSuccess,
    fetchArticles,
    deleteArticle,
  } = useNewsData();

  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [kategori, setKategori] = useState('Kegiatan Sekolah');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
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
    filteredItems: filteredArticles,
  } = useCmsFilter<NewsArticle>({
    items: articles,
    searchFields: ['judul', 'isi', 'uploader'],
    initialFilters: { kategori: 'ALL', status_verifikasi: 'ALL' },
  });

  const availableCategories = getUniqueValues(articles, 'kategori');
  const availableStatuses = getUniqueValues(articles, 'status_verifikasi');

  const resetForm = () => {
    setJudul('');
    setIsi('');
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

  const handleOpenEdit = (article: NewsArticle) => {
    setError('');
    setEditId(article.id);
    setJudul(article.judul);
    setIsi(article.isi);
    setKategori(article.kategori);
    setTanggal(article.tanggal);
    setFotoSelection({ original: null, cropped: null });
    setCurrentFoto(article.foto || '');
    setCurrentOriginalFoto(article.foto_original || '');
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
    formData.append('isi', isi);
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
      const response = await fetch(`${API_BASE}/backend/API/newsAPI.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setToast({ type: 'success', text: result.message || 'Berita berhasil disimpan.' });
        setShowModal(false);
        resetForm();
        fetchArticles();
      } else {
        setError(result.message || 'Gagal menyimpan berita.');
        setToast({ type: 'error', text: result.message || 'Gagal menyimpan berita.' });
      }
    } catch {
      setToast({ type: 'error', text: 'Terjadi kesalahan saat menghubungi server.' });
      setError('Terjadi kesalahan saat menghubungi server.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
    const ok = await deleteArticle(id);
    if (ok) {
      setToast({ type: 'success', text: 'Berita berhasil dihapus.' });
    } else {
      setToast({ type: 'error', text: 'Gagal menghapus berita.' });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-teal-600 shrink-0" /> Manajemen Berita & Pengumuman
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Kelola berita sekolah, pengumuman, dan artikel prestasi siswa.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all cursor-pointer text-sm"
        >
          <Plus size={18} /> Tulis Berita
        </button>
      </div>

      {/* Filter Bar */}
      <CmsFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Cari judul, isi, uploader..."
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

      {/* Alert Notifications — diganti CmsToast */}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <CmsToast message={toast} onClose={() => setToast(null)} />

      {/* Articles Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredArticles.map((art) => (
            <BeritaCard
              key={art.id}
              article={art}
              currentUser={currentUser}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}

          {filteredArticles.length === 0 && (
            <div className="col-span-full bg-white p-8 sm:p-12 rounded-2xl text-center border border-slate-100">
              <FileText size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium text-sm">
                {isFiltered ? 'Tidak ada berita yang sesuai dengan filter atau kata kunci pencarian.' : 'Belum ada berita ditulis.'}
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
      <BeritaFormModal
        showModal={showModal}
        editId={editId}
        currentFoto={currentFoto}
        currentOriginalFoto={currentOriginalFoto}
        judul={judul}
        setJudul={setJudul}
        isi={isi}
        setIsi={setIsi}
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
