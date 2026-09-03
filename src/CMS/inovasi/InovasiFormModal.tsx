import React, { useEffect } from 'react';
import { Link as LinkIcon, X, Globe, FileEdit, Lightbulb, User } from 'lucide-react';
import { ImageUploadField, ImageUploadPayload } from '../components/ImageUploadField';
import { CROP_RATIO_OPTIONS } from '../components/ImageCropModal';
import { getImageUrl } from '../../config/api';

interface InovasiFormModalProps {
  showModal: boolean;
  editId: number | string | null;
  judul: string;
  setJudul: (val: string) => void;
  kategori: string;
  setKategori: (val: string) => void;
  inovator: string;
  setInovator: (val: string) => void;
  deskripsi: string;
  setDeskripsi: (val: string) => void;
  linkDrive: string;
  setLinkDrive: (val: string) => void;
  status: 'Draft' | 'Published';
  setStatus: (val: 'Draft' | 'Published') => void;
  currentFoto: string;
  currentOriginalFoto: string;
  setFotoSelection: (payload: ImageUploadPayload) => void;
  error: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const INOVASI_KATEGORI_OPTIONS = [
  'Inovasi Pembelajaran',
  'Karya Siswa',
  'Digitalisasi Sekolah',
  'Media Kreatif & Edukasi',
  'Lingkungan & Adiwiyata',
  'Pengembangan Karakter',
  'Lainnya',
];

export const InovasiFormModal: React.FC<InovasiFormModalProps> = ({
  showModal,
  editId,
  judul,
  setJudul,
  kategori,
  setKategori,
  inovator,
  setInovator,
  deskripsi,
  setDeskripsi,
  linkDrive,
  setLinkDrive,
  status,
  setStatus,
  currentFoto,
  currentOriginalFoto,
  setFotoSelection,
  error,
  onClose,
  onSubmit,
}) => {
  useEffect(() => {
    if (showModal) {
      const prevBody = document.body.style.overflow;
      const prevHtml = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevBody;
        document.documentElement.style.overflow = prevHtml;
      };
    }
  }, [showModal]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl shadow-xl border border-slate-100 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 sm:p-6 text-white flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Lightbulb size={22} className="text-teal-200" />
              {editId ? 'Ubah Inovasi' : 'Tambah Inovasi Baru'}
            </h3>
            <p className="text-xs text-teal-100 mt-0.5">Dokumentasi karya, inovasi pembelajaran, atau kegiatan berbasis Google Drive.</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-slate-200 text-2xl font-semibold cursor-pointer p-1"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            {/* Judul */}
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-1.5">Judul Inovasi *</label>
              <input
                type="text"
                required
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Pojok Literasi Digital & Bank Sampah Mandiri"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
              />
            </div>

            {/* Kategori & Inovator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Kategori Inovasi *</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm bg-white"
                >
                  {INOVASI_KATEGORI_OPTIONS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5 flex items-center justify-between">
                  <span>Nama Inovator / Pelaksana</span>
                  <span className="text-xs text-slate-400 font-normal">Opsional</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    value={inovator}
                    onChange={(e) => setInovator(e.target.value)}
                    placeholder="Contoh: Tim Adiwiyata / Siswa Kelas 5"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Link Google Drive */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <label className="block text-slate-800 text-sm font-bold flex items-center gap-1.5">
                <LinkIcon size={16} className="text-teal-600" /> Tautan Google Drive (Folder / Video / Foto) *
              </label>
              <input
                type="url"
                required
                value={linkDrive}
                onChange={(e) => setLinkDrive(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/... atau /file/d/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm bg-white"
              />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Tautan folder atau file Google Drive akan otomatis disematkan (embed) pada halaman detail inovasi. Pastikan akses folder/file disetel ke <strong>&quot;Siapa saja yang memiliki link dapat melihat&quot;</strong>.
              </p>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-1.5 flex items-center justify-between">
                <span>Deskripsi & Cerita Inovasi</span>
                <span className="text-xs text-slate-400 font-normal">Opsional</span>
              </label>
              <textarea
                rows={3}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Jelaskan latar belakang inovasi, tujuan, manfaat bagi siswa/sekolah, dan dokumentasi yang ada..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
              />
            </div>

            {/* Cover / Thumbnail Image Upload */}
            <div>
              <ImageUploadField
                label="Foto Sampul / Cover Inovasi (Opsional)"
                hint="Format: Gambar (JPG, PNG, WEBP, GIF). Maksimal 10MB."
                currentImage={currentFoto ? getImageUrl(currentFoto) : ''}
                currentOriginalImage={currentOriginalFoto ? getImageUrl(currentOriginalFoto) : ''}
                ratioOptions={CROP_RATIO_OPTIONS}
                aspectRatio={16 / 9}
                circular={false}
                previewShape="rounded"
                onFileChange={setFotoSelection}
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Jika tidak diisi, kartu inovasi akan otomatis menggunakan ilustrasi placeholder modern.
              </p>
            </div>

            {/* Status (Draft / Published) */}
            <div className="space-y-2">
              <label className="block text-slate-700 text-sm font-semibold">Status Publikasi Inovasi *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('Published')}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    status === 'Published'
                      ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${status === 'Published' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Globe size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-800">Published</span>
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">Publik</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Diterbitkan ke publik di halaman Inovasi setelah terverifikasi.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('Draft')}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    status === 'Draft'
                      ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${status === 'Draft' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <FileEdit size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-800">Draft</span>
                      <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">Draf Pribadi</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Simpan draf di CMS, tidak akan tampil di halaman publik website.
                    </p>
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              {editId ? 'Simpan Perubahan' : 'Tambah Inovasi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
