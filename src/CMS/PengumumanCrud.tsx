import React, { useState, useEffect, useRef } from 'react';
import { Megaphone, Save, CheckCircle2, AlertCircle, Upload, Crop, Globe, Link, Eye, Calendar, Clock, Sparkles } from 'lucide-react';
import { getApiBaseUrl, getImageUrl } from '../config/api';
import { validateImageFile } from './utils/fileValidation';
import { ImageCropModal, CROP_RATIO_OPTIONS } from './components/ImageCropModal';

const API_BASE = getApiBaseUrl();

// Helper functions for date calculations
const getTodayStr = (): string => {
  return new Date().toISOString().split('T')[0];
};

const getDaysBetween = (startStr: string, endStr: string): number => {
  if (!startStr || !endStr) return 7;
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

const addDays = (startStr: string, days: number): string => {
  if (!startStr) return '';
  const date = new Date(startStr);
  date.setDate(date.getDate() + (days || 1));
  return date.toISOString().split('T')[0];
};

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
  const [photoOriginalUrl, setPhotoOriginalUrl] = useState('');
  const [photoFile, setFotoFile] = useState<File | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [photoLink, setPhotoLink] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropName, setCropName] = useState('foto');
  const cropSrcRef = useRef<string | null>(null);
  cropSrcRef.current = cropSrc;

  // Batas Tanggal & Masa Aktif
  const [tanggalMulai, setTanggalMulai] = useState(getTodayStr());
  const [tanggalSelesai, setTanggalSelesai] = useState(addDays(getTodayStr(), 7));
  const [durasiHari, setDurasiHari] = useState(7);

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
        setPhotoOriginalUrl(result.data.foto_original || '');
        setPhotoLink(result.data.photo_link || '');

        const start = result.data.tanggal_mulai || getTodayStr();
        setTanggalMulai(start);

        if (result.data.tanggal_selesai) {
          setTanggalSelesai(result.data.tanggal_selesai);
          setDurasiHari(getDaysBetween(start, result.data.tanggal_selesai));
        } else {
          const defaultEnd = addDays(start, 7);
          setTanggalSelesai(defaultEnd);
          setDurasiHari(7);
        }
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

  const handleStartChange = (val: string) => {
    setTanggalMulai(val);
    if (val) {
      setTanggalSelesai(addDays(val, durasiHari));
    }
  };

  const handleEndChange = (val: string) => {
    setTanggalSelesai(val);
    if (val && tanggalMulai) {
      const days = getDaysBetween(tanggalMulai, val);
      setDurasiHari(days);
    }
  };

  const handleDaysChange = (daysNum: number) => {
    const safeDays = daysNum > 0 ? daysNum : 1;
    setDurasiHari(safeDays);
    if (tanggalMulai) {
      setTanggalSelesai(addDays(tanggalMulai, safeDays));
    }
  };

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
    const source = photoOriginalUrl || photoUrl;
    if (!source) return;
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
    formData.append('tanggal_mulai', tanggalMulai);
    formData.append('tanggal_selesai', tanggalSelesai);
    if (originalFile) {
      formData.append('foto_original', originalFile);
    }
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
        setOriginalFile(null);
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

              {/* Date Range & Duration Card */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-50 to-teal-50/30 rounded-2xl border border-teal-100/80 space-y-4">
                <div className="flex items-center justify-between border-b border-teal-100 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-teal-600" size={18} />
                    <span className="font-bold text-slate-800 text-sm">Batas Tanggal & Masa Aktif Pengumuman</span>
                  </div>

                  {/* Expiration Status Badge */}
                  {(() => {
                    const today = getTodayStr();
                    if (today < tanggalMulai) {
                      return (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold flex items-center gap-1">
                          <Clock size={12} /> Belum Mulai
                        </span>
                      );
                    } else if (today > tanggalSelesai) {
                      return (
                        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold flex items-center gap-1">
                          <AlertCircle size={12} /> Kedaluwarsa (Expired)
                        </span>
                      );
                    } else {
                      return (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1">
                          <CheckCircle2 size={12} /> Aktif Berjalan
                        </span>
                      );
                    }
                  })()}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Tanggal Mulai */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                      <Calendar size={13} className="text-teal-600" /> Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={tanggalMulai}
                      onChange={(e) => handleStartChange(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-teal-600 font-medium"
                      required
                    />
                  </div>

                  {/* Tanggal Selesai */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                      <Calendar size={13} className="text-teal-600" /> Tanggal Selesai (Batas)
                    </label>
                    <input
                      type="date"
                      value={tanggalSelesai}
                      onChange={(e) => handleEndChange(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-teal-600 font-medium"
                      required
                    />
                  </div>

                  {/* Number Input Hari */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                      <Clock size={13} className="text-teal-600" /> Jumlah Hari Aktif
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={durasiHari}
                        onChange={(e) => handleDaysChange(parseInt(e.target.value) || 1)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-teal-600 font-bold"
                        required
                      />
                      <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium pointer-events-none">Hari</span>
                    </div>
                  </div>
                </div>

                {/* Quick Preset Buttons */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-xs text-slate-500 font-medium mr-1 flex items-center gap-1">
                    <Sparkles size={12} className="text-teal-600" /> Durasi Cepat:
                  </span>
                  {[
                    { label: '3 Hari', days: 3 },
                    { label: '7 Hari (1 Mgg)', days: 7 },
                    { label: '14 Hari (2 Mgg)', days: 14 },
                    { label: '30 Hari (1 Bln)', days: 30 },
                  ].map((preset) => (
                    <button
                      key={preset.days}
                      type="button"
                      onClick={() => handleDaysChange(preset.days)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                        durasiHari === preset.days
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  * Pengumuman akan otomatis tidak ditampilkan di website publik setelah melewati tanggal selesai.
                </p>
              </div>
              
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
                    <div className="flex-grow w-full space-y-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
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

                      <p className="text-slate-400 text-[11px]">Format: Gambar (JPG, PNG, WEBP, GIF). Maksimal 10MB.</p>
                      {photoUrl && (
                        <button
                          type="button"
                          onClick={handleReCrop}
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
                        >
                          <Crop size={13} /> Potong Ulang Foto Saat Ini
                        </button>
                      )}
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

      <ImageCropModal
        open={cropOpen}
        imageSrc={cropSrc}
        aspectRatio={1}
        circular={false}
        title="Potong Foto Brosur / Poster"
        outputWidth={800}
        outputHeight={800}
        ratioOptions={CROP_RATIO_OPTIONS}
        onCancel={handleCropCancel}
        onConfirm={handleCropConfirm}
      />
    </div>
  );
}
