import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FileText, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface NewsArticle {
  id: number;
  judul: string;
  isi: string;
  foto: string;
  kategori: string;
  tanggal: string;
  status_verifikasi: 'Pending' | 'Verified' | 'Rejected';
  uploader: string;
  uploaded_by: number;
}

interface UserSession {
  id: number;
  username: string;
  role: 'ADMIN' | 'TIM';
  nama_penanggung_jawab: string;
  foto: string;
}

interface BeritaCrudProps {
  currentUser: UserSession;
}

const API_BASE = 'http://localhost/sd-negeri-mulyoagung-1';

export default function BeritaCrud({ currentUser }: BeritaCrudProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [kategori, setKategori] = useState('Kegiatan Sekolah');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/backend/API/newsAPI.php?status=all`);
      const result = await response.json();
      if (result.status === 'success') {
        setArticles(result.data || []);
      } else {
        setError(result.message || 'Gagal memuat data berita.');
      }
    } catch (err) {
      setError('Gagal menghubungkan ke server backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const resetForm = () => {
    setJudul('');
    setIsi('');
    setKategori('Kegiatan Sekolah');
    setTanggal(new Date().toISOString().split('T')[0]);
    setFotoFile(null);
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
    setFotoFile(null);
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
    if (fotoFile) {
      formData.append('foto', fotoFile);
    }

    try {
      const response = await fetch(`${API_BASE}/backend/API/newsAPI.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message);
        setShowModal(false);
        resetForm();
        fetchArticles();
      } else {
        setError(result.message || 'Gagal menyimpan berita.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghubungi server.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', id.toString());

    try {
      const response = await fetch(`${API_BASE}/backend/API/newsAPI.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message);
        fetchArticles();
      } else {
        setError(result.message || 'Gagal menghapus berita.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghapus data.');
    }
  };

  const getStatusBadge = (status: 'Pending' | 'Verified' | 'Rejected') => {
    switch (status) {
      case 'Verified':
        return (
          <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-1 rounded-full font-semibold">
            <CheckCircle2 size={12} /> Terverifikasi
          </span>
        );
      case 'Rejected':
        return (
          <span className="flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 text-xs px-2.5 py-1 rounded-full font-semibold">
            <XCircle size={12} /> Ditolak
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2.5 py-1 rounded-full font-semibold">
            <Clock size={12} /> Menunggu Verifikasi
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-teal-600" /> Manajemen Berita & Pengumuman
          </h2>
          <p className="text-slate-500 text-sm">Kelola berita sekolah, pengumuman, dan artikel prestasi siswa.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all transform hover:scale-102 cursor-pointer"
        >
          <Plus size={18} /> Tulis Berita
        </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((art) => (
            <div key={art.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-56 bg-slate-100">
                  <img
                    src={`${API_BASE}/${art.foto}`}
                    alt={art.judul}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-sm">
                    {getStatusBadge(art.status_verifikasi)}
                  </div>
                  <span className="absolute bottom-3 right-3 bg-teal-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                    {art.kategori}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-bold text-slate-800 text-xl leading-snug line-clamp-2">{art.judul}</h3>
                  <p className="text-slate-500 text-sm line-clamp-3">{art.isi}</p>
                  
                  <div className="flex justify-between items-center text-xs text-slate-400 pt-4 border-t border-slate-50">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar size={13} /> {art.tanggal}
                    </span>
                    <span className="font-medium">Oleh: {art.uploader || 'Sistem'}</span>
                  </div>
                </div>
              </div>

              {currentUser.role === 'ADMIN' && (
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    onClick={() => handleOpenEdit(art)}
                    className="flex items-center gap-1.5 text-teal-700 bg-teal-50 hover:bg-teal-100 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <Edit2 size={14} /> Ubah
                  </button>
                  <button
                    onClick={() => handleDelete(art.id)}
                    className="flex items-center gap-1.5 text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              )}
            </div>
          ))}

          {articles.length === 0 && (
            <div className="col-span-full bg-white p-12 rounded-2xl text-center border border-slate-100">
              <FileText size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">Belum ada berita ditulis.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl border border-slate-100 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">{editId ? 'Ubah Konten Berita' : 'Tulis Berita Baru'}</h3>
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
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Judul Berita</label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Judul artikel / pengumuman penting"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-1.5">Kategori</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Pengumuman">Pengumuman</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-1.5">Tanggal Berita</label>
                  <input
                    type="date"
                    required
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Isi Lengkap Berita</label>
                <textarea
                  required
                  rows={6}
                  value={isi}
                  onChange={(e) => setIsi(e.target.value)}
                  placeholder="Tulis artikel berita secara detail di sini..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Foto Utama Berita</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFotoFile(e.target.files?.[0] || null)}
                  className="w-full text-slate-600 text-sm border border-slate-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
                <p className="text-slate-400 text-xs mt-1">
                  {editId ? 'Biarkan kosong jika tidak ingin mengubah foto.' : 'Foto utama untuk cover berita.'}
                </p>
              </div>

              {currentUser.role === 'TIM' && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3.5 rounded-xl text-xs">
                  <strong>Pemberitahuan:</strong> Sebagai Tim Kesiswaan, berita yang Anda kirimkan memerlukan persetujuan Admin agar tayang di website utama.
                </div>
              )}

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
                  Publikasikan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
