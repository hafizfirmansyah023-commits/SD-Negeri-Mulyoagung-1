import React, { useState, useEffect } from 'react';
import { Award, Upload, Save, User, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { getApiBaseUrl, getImageUrl } from '../config/api';

const API_BASE = getApiBaseUrl();

interface SambutanData {
  nama: string;
  sambutan: string;
  foto: string;
}

export default function SambutanKepsekCrud() {
  const [nama, setNama] = useState('');
  const [sambutan, setSambutan] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSambutan = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/backend/API/sambutan.php`);
      const result = await response.json();
      if (result.status === 'success' && result.data) {
        setNama(result.data.nama || '');
        setSambutan(result.data.sambutan || '');
        setFotoUrl(result.data.foto || '');
      } else {
        setError(result.message || 'Gagal memuat data sambutan.');
      }
    } catch (err) {
      setError('Gagal menghubungkan ke backend API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSambutan();
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
    formData.append('nama', nama);
    formData.append('sambutan', sambutan);
    if (fotoFile) {
      formData.append('foto', fotoFile);
    }

    try {
      const response = await fetch(`${API_BASE}/backend/API/sambutan.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message || 'Sambutan berhasil diperbarui.');
        setFotoFile(null);
        setPreviewUrl(null);
        fetchSambutan();
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
            <Award className="text-teal-600 w-7 h-7" />
            Kelola Sambutan Kepala Sekolah
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Sesuaikan teks sambutan, nama kepala sekolah, dan foto profil yang tampil di halaman depan.
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
            
            {/* Foto Upload & Preview Column */}
            <div className="flex flex-col items-center">
              <label className="block text-sm font-semibold text-slate-700 mb-3 w-full text-center lg:text-left">
                Foto Kepala Sekolah
              </label>
              
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-slate-100 p-2 bg-slate-50 shadow-inner group mb-4">
                <img
                  src={previewUrl || (fotoUrl ? getImageUrl(fotoUrl) : 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600')}
                  alt="Kepala Sekolah"
                  className="w-full h-full object-cover rounded-full"
                />
                <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer duration-300 rounded-full">
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-xs font-semibold">Ganti Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-slate-400 text-xs text-center max-w-xs">
                Format yang disarankan: JPG, PNG, atau WEBP. Maksimal 2MB.
              </p>
            </div>

            {/* Form Fields Column */}
            <div className="lg:col-span-2 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <User size={16} className="text-slate-400" />
                  Nama Kepala Sekolah
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Amalia Dyah Erviana, S.Pd."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <FileText size={16} className="text-slate-400" />
                  Isi Sambutan
                </label>
                <textarea
                  value={sambutan}
                  onChange={(e) => setSambutan(e.target.value)}
                  rows={8}
                  placeholder="Ketik isi sambutan di sini..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all text-sm leading-relaxed"
                  required
                />
              </div>

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
