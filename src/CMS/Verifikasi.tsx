import React, { useState, useEffect } from 'react';
import { Check, X, ShieldAlert, Image, FileText, CheckCircle2, XCircle, Search, Filter, RotateCcw } from 'lucide-react';
import { getApiBaseUrl, getImageUrl } from '../config/api';

interface GalleryItem {
  id: number;
  judul: string;
  deskripsi: string;
  foto: string;
  kategori: string;
  tanggal: string;
  status_verifikasi: 'Pending' | 'Verified' | 'Rejected';
  uploader: string;
}

interface NewsArticle {
  id: number;
  judul: string;
  isi: string;
  foto: string;
  kategori: string;
  tanggal: string;
  status_verifikasi: 'Pending' | 'Verified' | 'Rejected';
  uploader: string;
}

const API_BASE = getApiBaseUrl();

export default function Verifikasi() {
  const [pendingGallery, setPendingGallery] = useState<GalleryItem[]>([]);
  const [pendingNews, setPendingNews] = useState<NewsArticle[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'berita' | 'galeri'>('berita');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const fetchPendingData = async () => {
    setLoading(true);
    try {
      // Fetch news
      const resNews = await fetch(`${API_BASE}/backend/API/newsAPI.php?status=all`);
      const newsResult = await resNews.json();
      if (newsResult.status === 'success') {
        const pendingArticles = newsResult.data.filter((item: NewsArticle) => item.status_verifikasi === 'Pending');
        setPendingNews(pendingArticles);
      }

      // Fetch gallery
      const resGallery = await fetch(`${API_BASE}/backend/API/galeri.php?status=all`);
      const galResult = await resGallery.json();
      if (galResult.status === 'success') {
        const pendingItems = galResult.data.filter((item: GalleryItem) => item.status_verifikasi === 'Pending');
        setPendingGallery(pendingItems);
      }
    } catch (err) {
      setError('Gagal memuat data verifikasi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingData();
  }, []);

  const handleVerifyNews = async (id: number, decision: 'Verified' | 'Rejected') => {
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('action', 'verify');
    formData.append('id', id.toString());
    formData.append('status_verifikasi', decision);

    try {
      const response = await fetch(`${API_BASE}/backend/API/newsAPI.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message);
        fetchPendingData();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Gagal memproses verifikasi berita.');
    }
  };

  const handleVerifyGallery = async (id: number, decision: 'Verified' | 'Rejected') => {
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('action', 'verify');
    formData.append('id', id.toString());
    formData.append('status_verifikasi', decision);

    try {
      const response = await fetch(`${API_BASE}/backend/API/galeri.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message);
        fetchPendingData();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Gagal memproses verifikasi galeri.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ShieldAlert className="text-teal-600" /> Pusat Verifikasi
        </h2>
        <p className="text-slate-500 text-sm">Verifikasi konten berita atau foto galeri yang diunggah oleh Tim Kesiswaan.</p>

        {/* Sub Navigation */}
        <div className="flex gap-4 mt-6 border-b border-slate-100 pb-px">
          <button
            onClick={() => {
              setActiveSubTab('berita');
              setSelectedCategory('ALL');
            }}
            className={`pb-3 font-semibold text-sm transition-all relative cursor-pointer ${
              activeSubTab === 'berita' ? 'text-teal-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Antrean Berita ({pendingNews.length})
            {activeSubTab === 'berita' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveSubTab('galeri');
              setSelectedCategory('ALL');
            }}
            className={`pb-3 font-semibold text-sm transition-all relative cursor-pointer ${
              activeSubTab === 'galeri' ? 'text-teal-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Antrean Galeri ({pendingGallery.length})
            {activeSubTab === 'galeri' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      {(() => {
        const currentList = activeSubTab === 'berita' ? pendingNews : pendingGallery;
        const availableCategories = Array.from(new Set(currentList.map((item) => item.kategori).filter(Boolean)));

        return (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari judul, pengirim..."
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

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-slate-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
                >
                  <option value="ALL">Semua Kategori</option>
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {(searchTerm || selectedCategory !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('ALL');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} /> Reset Filter
                </button>
              )}
            </div>
          </div>
        );
      })()}

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
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-600"></div>
        </div>
      ) : (
        <div>
          {/* News Verification */}
          {activeSubTab === 'berita' && (() => {
            const filteredNews = pendingNews.filter((art) => {
              const matchesSearch =
                !searchTerm.trim() ||
                art.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                art.isi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (art.uploader && art.uploader.toLowerCase().includes(searchTerm.toLowerCase()));
              const matchesCategory = selectedCategory === 'ALL' || art.kategori === selectedCategory;
              return matchesSearch && matchesCategory;
            });

            return (
              <div className="space-y-4">
                {filteredNews.map((art) => (
                  <div key={art.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start justify-between">
                    <div className="flex flex-col md:flex-row gap-4 items-start flex-grow">
                      <div className="w-full md:w-44 h-28 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                        <img src={getImageUrl(art.foto)} alt={art.judul} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex gap-2 items-center">
                          <span className="bg-teal-50 text-teal-700 border border-teal-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
                            {art.kategori}
                          </span>
                          <span className="text-xs text-slate-400">{art.tanggal}</span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">{art.judul}</h3>
                        <p className="text-slate-500 text-sm line-clamp-2">{art.isi}</p>
                        <p className="text-xs text-slate-400">Pengirim: <strong className="text-slate-600">{art.uploader}</strong></p>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                      <button
                        onClick={() => handleVerifyNews(art.id, 'Verified')}
                        className="flex-grow flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer"
                      >
                        <Check size={16} /> Setujui
                      </button>
                      <button
                        onClick={() => handleVerifyNews(art.id, 'Rejected')}
                        className="flex-grow flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                      >
                        <X size={16} /> Tolak
                      </button>
                    </div>
                  </div>
                ))}

                {filteredNews.length === 0 && (
                  <div className="bg-white p-12 rounded-2xl text-center border border-slate-100">
                    <CheckCircle2 size={48} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500">
                      {(searchTerm || selectedCategory !== 'ALL') ? 'Tidak ada antrean berita yang sesuai dengan filter.' : 'Tidak ada antrean verifikasi berita.'}
                    </p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Gallery Verification */}
          {activeSubTab === 'galeri' && (() => {
            const filteredGallery = pendingGallery.filter((item) => {
              const matchesSearch =
                !searchTerm.trim() ||
                item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.uploader && item.uploader.toLowerCase().includes(searchTerm.toLowerCase()));
              const matchesCategory = selectedCategory === 'ALL' || item.kategori === selectedCategory;
              return matchesSearch && matchesCategory;
            });

            return (
              <div className="space-y-4">
                {filteredGallery.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start justify-between">
                    <div className="flex flex-col md:flex-row gap-4 items-start flex-grow">
                      <div className="w-full md:w-44 h-28 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                        <img src={getImageUrl(item.foto)} alt={item.judul} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex gap-2 items-center">
                          <span className="bg-teal-50 text-teal-700 border border-teal-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
                            {item.kategori}
                          </span>
                          <span className="text-xs text-slate-400">{item.tanggal}</span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">{item.judul}</h3>
                        <p className="text-slate-500 text-sm line-clamp-2">{item.deskripsi}</p>
                        <p className="text-xs text-slate-400">Pengirim: <strong className="text-slate-600">{item.uploader}</strong></p>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                      <button
                        onClick={() => handleVerifyGallery(item.id, 'Verified')}
                        className="flex-grow flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer"
                      >
                        <Check size={16} /> Setujui
                      </button>
                      <button
                        onClick={() => handleVerifyGallery(item.id, 'Rejected')}
                        className="flex-grow flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                      >
                        <X size={16} /> Tolak
                      </button>
                    </div>
                  </div>
                ))}

                {filteredGallery.length === 0 && (
                  <div className="bg-white p-12 rounded-2xl text-center border border-slate-100">
                    <CheckCircle2 size={48} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500">
                      {(searchTerm || selectedCategory !== 'ALL') ? 'Tidak ada antrean galeri yang sesuai dengan filter.' : 'Tidak ada antrean verifikasi galeri.'}
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
