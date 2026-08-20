import React, { useState, useEffect, useRef } from 'react';
import { Award, Upload, Save, User, FileText, CheckCircle2, AlertCircle, Crop } from 'lucide-react';
import { getApiBaseUrl, getImageUrl } from '../config/api';
import { validateImageFile } from './utils/fileValidation';
import { ImageCropModal } from './components/ImageCropModal';
import { RichTextEditor } from './components/RichTextEditor';
import { CmsToast, ToastType } from './components/CmsToast';

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
  const [fotoOriginalUrl, setFotoOriginalUrl] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropName, setCropName] = useState('foto');
  const cropSrcRef = useRef<string | null>(null);
  cropSrcRef.current = cropSrc;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; text: string } | null>(null);

  const fetchSambutan = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/backend/API/sambutan.php`);
      const result = await response.json();
      if (result.status === 'success' && result.data) {
        setNama(result.data.nama || '');
        setSambutan(result.data.sambutan || '');
        setFotoUrl(result.data.foto || '');
        setFotoOriginalUrl(result.data.foto_original || '');
      } else {
        setToast({ type: 'error', text: result.message || 'Gagal memuat data sambutan.' });
      }
    } catch (err) {
      setToast({ type: 'error', text: 'Gagal menghubungkan ke backend API.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSambutan();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = validateImageFile(e.target.files?.[0] || null, e.target);
    if (!file) return;
    e.target.value = '';
    if (cropSrcRef.current) URL.revokeObjectURL(cropSrcRef.current);
    setOriginalFile(file);
    setCropName(file.name);
    setCropSrc(URL.createObjectURL(file));
    setCropOpen(true);
  };

  const handleReCrop = () => {
    const source = fotoOriginalUrl || fotoUrl;
    if (!source) return;
    setOriginalFile(null);
    if (cropSrcRef.current) URL.revokeObjectURL(cropSrcRef.current);
    setCropName(source.split('/').pop() || 'foto');
    setCropSrc(getImageUrl(source));
    setCropOpen(true);
  };

  const handleCropCancel = () => {
    setCropOpen(false);
    if (cropSrcRef.current) {
      URL.revokeObjectURL(cropSrcRef.current);
      setCropSrc(null);
    }
  };

  const handleCropConfirm = (blob: Blob) => {
    const base = (cropName.replace(/\.[^.]+$/, '').trim() || 'foto').replace(/[^\w\- ]/g, '');
    const file = new File([blob], `${base || 'foto'}.png`, { type: 'image/png' });
    setFotoFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    handleCropCancel();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('sambutan', sambutan);
    if (originalFile) {
      formData.append('foto_original', originalFile);
    }
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
        setToast({ type: 'success', text: result.message || 'Sambutan Kepala Sekolah berhasil diperbarui.' });
        setFotoFile(null);
        setOriginalFile(null);
        setPreviewUrl(null);
        fetchSambutan();
      } else {
        setToast({ type: 'error', text: result.message || 'Gagal menyimpan perubahan.' });
      }
    } catch (err) {
      setToast({ type: 'error', text: 'Terjadi kesalahan saat menghubungi server.' });
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

      <CmsToast message={toast} onClose={() => setToast(null)} />

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
                Format: Gambar (JPG, PNG, WEBP, GIF). Maksimal 10MB.
              </p>
              {fotoUrl && (
                <button
                  type="button"
                  onClick={handleReCrop}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
                >
                  <Crop size={14} /> Potong Ulang Foto Saat Ini
                </button>
              )}
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
                  Isi Sambutan *
                </label>
                <RichTextEditor
                  value={sambutan}
                  onChange={setSambutan}
                  placeholder="Ketik isi sambutan di sini..."
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

      <ImageCropModal
        open={cropOpen}
        imageSrc={cropSrc}
        aspectRatio={1}
        circular
        title="Potong Foto Kepala Sekolah"
        outputWidth={512}
        outputHeight={512}
        onCancel={handleCropCancel}
        onConfirm={handleCropConfirm}
      />
    </div>
  );
}
