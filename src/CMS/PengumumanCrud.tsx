import React, { useState, useEffect } from 'react';
import { Megaphone, Save, CheckCircle2, AlertCircle, Upload, Globe, Link, Eye } from 'lucide-react';
import { getApiBaseUrl, getImageUrl } from '../config/api';

const API_BASE = getApiBaseUrl();

export default function PengumumanCrud() {
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [runningText, setRunningText] = useState('');
  
  const [isActive, setIsActive] = useState(true);
  const [showPopup, setShowPopup] = useState(true);
  
  const [showButton, setShowButton] = useState(false);
  const [buttonText, setButtonText] = useState('');
  const [buttonLink, setButtonLink] = useState('');
  
  const [showPhoto, setShowPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoFile, setFotoFile] = useState<File | null>(null);
  const [photoLink, setPhotoLink] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPengumuman = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/backend/API/pengumuman.php`);
      const result = await response.json();
      if (result.status === 'success' && result.data) {
        setJudul(result.data.judul || '');
        setIsi(result.data.isi || '');
        setRunningText(result.data.running_text || '');
        setIsActive(parseInt(result.data.is_active) === 1);
        setShowPopup(parseInt(result.data.show_popup) === 1);
        setShowButton(parseInt(result.data.show_button) === 1);
        setButtonText(result.data.button_text || '');
        setButtonLink(result.data.button_link || '');
        setShowPhoto(parseInt(result.data.show_photo) === 1);
        setPhotoUrl(result.data.foto || '');
        setPhotoLink(result.data.photo_link || '');
      } else {
        setError(result.message || 'Gagal memuat data pengumuman.');
      }
    } catch (err) {
      setError('Gagal menghubungkan ke backend API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengumuman();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('isi', isi);
    formData.append('running_text', runningText);
    formData.append('is_active', isActive ? '1' : '0');
    formData.append('show_popup', showPopup ? '1' : '0');
    formData.append('show_button', showButton ? '1' : '0');
    formData.append('button_text', buttonText);
    formData.append('button_link', buttonLink);
    formData.append('show_photo', showPhoto ? '1' : '0');
    formData.append('photo_link', photoLink);
    if (photoFile) {
      formData.append('foto', photoFile);
    }

    try {
      const response = await fetch(`${API_BASE}/backend/API/pengumuman.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message || 'Pengumuman berhasil diperbarui.');
        setFotoFile(null);
        setPreviewUrl(null);
        fetchPengumuman();
      } else {
        setError(result.message || 'Gagal menyimpan perubahan.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghubungi server.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Megaphone className="text-teal-600 w-7 h-7" />
            Kelola Pengumuman Penting
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Konfigurasi pengumuman pop-up dan teks berjalan (running text) di bagian atas website.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
          <AlertCircle className="shrink-0" size={18} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="shrink-0" size={18} />
          <span className="text-sm">{success}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left settings column */}
            <div className="space-y-6">
              <h3 className="font-bold text-slate-700 text-sm border-b pb-2">Pengaturan Umum</h3>
              
              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="block text-sm font-semibold text-slate-800">Status Pengumuman</span>
                  <span className="text-xs text-slate-500">Tampilkan / sembunyikan semua pengumuman</span>
                </div>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 accent-teal-600 cursor-pointer"
                />
              </div>

              {/* Show Popup Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="block text-sm font-semibold text-slate-800">Tampilkan Pop-up</span>
                  <span className="text-xs text-slate-500">Tampilkan pop-up sekali per kunjungan</span>
                </div>
                <input
                  type="checkbox"
                  checked={showPopup}
                  onChange={(e) => setShowPopup(e.target.checked)}
                  className="w-5 h-5 accent-teal-600 cursor-pointer"
                />
              </div>

              {/* Show Button Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="block text-sm font-semibold text-slate-800">Tampilkan Tombol</span>
                  <span className="text-xs text-slate-500">Tambahkan tombol aksi dalam pop-up</span>
                </div>
                <input
                  type="checkbox"
                  checked={showButton}
                  onChange={(e) => setShowButton(e.target.checked)}
                  className="w-5 h-5 accent-teal-600 cursor-pointer"
                />
              </div>

              {/* Show Photo Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="block text-sm font-semibold text-slate-800">Sertakan Foto / Brosur</span>
                  <span className="text-xs text-slate-500">Tampilkan foto di dalam pop-up</span>
                </div>
                <input
                  type="checkbox"
                  checked={showPhoto}
                  onChange={(e) => setShowPhoto(e.target.checked)}
                  className="w-5 h-5 accent-teal-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Middle/Right form inputs */}
            <div className="lg:col-span-2 space-y-5">
              <h3 className="font-bold text-slate-700 text-sm border-b pb-2">Detail Konten & Desain</h3>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Penerimaan Siswa Baru (PPDB) Dibuka!"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Isi Pengumuman
                </label>
                <textarea
                  value={isi}
                  onChange={(e) => setIsi(e.target.value)}
                  rows={4}
                  placeholder="Detail pengumuman di dalam pop-up..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all text-sm leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Teks Berjalan (Marquee Text)
                </label>
                <input
                  type="text"
                  value={runningText}
                  onChange={(e) => setRunningText(e.target.value)}
                  placeholder="Teks singkat berjalan di bar atas..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all text-sm"
                />
              </div>

              {/* Conditional Button settings */}
              {showButton && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                      <Globe size={14} className="text-slate-400" /> Nama Tombol
                    </label>
                    <input
                      type="text"
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      placeholder="Contoh: SPMB / Daftar Sekarang"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                      <Link size={14} className="text-slate-400" /> Link Tombol (Tujuan URL)
                    </label>
                    <input
                      type="text"
                      value={buttonLink}
                      onChange={(e) => setButtonLink(e.target.value)}
                      placeholder="Contoh: https://example.com/daftar"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>
              )}

              {/* Conditional Photo settings */}
              {showPhoto && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="w-24 h-24 bg-white rounded-xl border overflow-hidden shrink-0 flex items-center justify-center relative group">
                      <img
                        src={previewUrl || (photoUrl ? getImageUrl(photoUrl) : 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=120')}
                        alt="Brosur/Poster"
                        className="w-full h-full object-cover"
                      />
                      <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                        <Upload size={16} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="flex-grow w-full">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                        <Link size={14} className="text-slate-400" /> Link Klik Foto (Tujuan URL - Opsional)
                      </label>
                      <input
                        type="text"
                        value={photoLink}
                        onChange={(e) => setPhotoLink(e.target.value)}
                        placeholder="Link dibuka ketika gambar di-klik..."
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-md shadow-teal-700/10 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save size={18} />
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>

          </div>
        </form>
      )}
    </div>
  );
}
