import React, { useEffect } from 'react';
import { Upload, Link as LinkIcon, FileText, X, Globe, FileEdit } from 'lucide-react';
import { ImageUploadField, ImageUploadPayload } from '../components/ImageUploadField';
import { CROP_RATIO_OPTIONS } from '../components/ImageCropModal';
import { getImageUrl } from '../../config/api';

interface ModulFormModalProps {
  showModal: boolean;
  editId: number | null;
  judul: string;
  setJudul: (val: string) => void;
  deskripsi: string;
  setDeskripsi: (val: string) => void;
  mataPelajaran: string;
  setMataPelajaran: (val: string) => void;
  kelas: string;
  setKelas: (val: string) => void;
  semester: string;
  setSemester: (val: string) => void;
  tahunAjaran: string;
  setTahunAjaran: (val: string) => void;
  kategori: string;
  setKategori: (val: string) => void;
  sumberTipe: 'upload' | 'gdrive';
  setSumberTipe: (val: 'upload' | 'gdrive') => void;
  pdfFile: File | null;
  setPdfFile: (file: File | null) => void;
  currentPdfPath: string;
  linkGdrive: string;
  setLinkGdrive: (val: string) => void;
  status: 'Draft' | 'Published';
  setStatus: (val: 'Draft' | 'Published') => void;
  currentFoto: string;
  currentOriginalFoto: string;
  setFotoSelection: (payload: ImageUploadPayload) => void;
  error: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const MAPEL_OPTIONS = [
  'Pendidikan Pancasila',
  'Bahasa Indonesia',
  'Matematika',
  'IPAS (Ilmu Pengetahuan Alam & Sosial)',
  'Pendidikan Agama & Budi Pekerti',
  'PJOK (Pendidikan Jasmani & Olahraga)',
  'Seni & Budaya',
  'Bahasa Inggris',
  'Bahasa Jawa / Muatan Lokal',
  'Projek Penguatan Profil Pelajar Pancasila (P5)',
  'Lainnya',
];

const KELAS_OPTIONS = [
  'Kelas 1',
  'Kelas 2',
  'Kelas 3',
  'Kelas 4',
  'Kelas 5',
  'Kelas 6',
  'Semua Kelas',
];

const KATEGORI_OPTIONS = [
  'Modul Ajar',
  'Bahan Ajar / Slide',
  'Lembar Kerja Peserta Didik (LKPD)',
  'Buku Siswa / Guru',
  'Media Interaktif',
  'Asesmen / Soal Latihan',
];

export const ModulFormModal: React.FC<ModulFormModalProps> = ({
  showModal,
  editId,
  judul,
  setJudul,
  deskripsi,
  setDeskripsi,
  mataPelajaran,
  setMataPelajaran,
  kelas,
  setKelas,
  semester,
  setSemester,
  tahunAjaran,
  setTahunAjaran,
  kategori,
  setKategori,
  sumberTipe,
  setSumberTipe,
  pdfFile,
  setPdfFile,
  currentPdfPath,
  linkGdrive,
  setLinkGdrive,
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
            <h3 className="text-lg sm:text-xl font-bold">
              {editId ? 'Ubah Modul Pembelajaran' : 'Tambah Modul Pembelajaran Baru'}
            </h3>
            <p className="text-xs text-teal-100 mt-0.5">Unggah modul ajar, LKPD, atau materi kurikulum merdeka.</p>
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

            {/* Judul & Kategori */}
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-1.5">Judul Materi / Modul *</label>
              <input
                type="text"
                required
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Modul Ajar IPAS Bab 3 - Perkembangbiakan Tumbuhan"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-1.5">Deskripsi Singkat</label>
              <textarea
                rows={2}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Penjelasan ringkas isi materi, capaian pembelajaran, atau instruksi penggunaan."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
              />
            </div>

            {/* Mata Pelajaran & Kategori */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Mata Pelajaran *</label>
                <select
                  value={mataPelajaran}
                  onChange={(e) => setMataPelajaran(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm bg-white"
                >
                  {MAPEL_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Kategori Materi *</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm bg-white"
                >
                  {KATEGORI_OPTIONS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Kelas, Semester, Tahun Ajaran */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Kelas *</label>
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm bg-white"
                >
                  {KELAS_OPTIONS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Semester *</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm bg-white"
                >
                  <option value="Ganjil">Semester 1 (Ganjil)</option>
                  <option value="Genap">Semester 2 (Genap)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Tahun Ajaran *</label>
                <input
                  type="text"
                  required
                  value={tahunAjaran}
                  onChange={(e) => setTahunAjaran(e.target.value)}
                  placeholder="2025/2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                />
              </div>
            </div>

            {/* SUMBER MATERI (EXCLUSIVE OR: UPLOAD PDF vs GOOGLE DRIVE) */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <label className="block text-slate-800 text-sm font-bold">Sumber Materi Pembelajaran *</label>
              
              {/* Radio Selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSumberTipe('upload');
                    setLinkGdrive('');
                  }}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    sumberTipe === 'upload'
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Upload size={16} /> Upload PDF Langsung
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSumberTipe('gdrive');
                    setPdfFile(null);
                  }}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    sumberTipe === 'gdrive'
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <LinkIcon size={16} /> Link Google Drive
                </button>
              </div>

              {/* Conditional Input based on Sumber */}
              {sumberTipe === 'upload' ? (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold text-slate-600">File PDF Dokumen Materi</label>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setPdfFile(e.target.files[0]);
                      }
                    }}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                  />
                  {currentPdfPath && !pdfFile && (
                    <p className="text-[11px] text-teal-600 font-medium flex items-center gap-1">
                      <FileText size={13} /> File PDF saat ini tersimpan: {currentPdfPath.split('/').pop()}
                    </p>
                  )}
                  {pdfFile && (
                    <p className="text-[11px] text-emerald-600 font-medium">
                      File dipilih: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold text-slate-600">URL / Tautan Google Drive (PDF Shared)</label>
                  <input
                    type="url"
                    value={linkGdrive}
                    onChange={(e) => setLinkGdrive(e.target.value)}
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm bg-white"
                  />
                  <p className="text-[11px] text-slate-500">
                    Pastikan tautan Google Drive telah disetel ke <strong>&quot;Siapa saja yang memiliki link dapat melihat&quot;</strong>.
                  </p>
                </div>
              )}
            </div>

            {/* Cover / Thumbnail Image Upload */}
            <div>
              <ImageUploadField
                label="Cover / Thumbnail Modul (Opsional)"
                hint="Format: Gambar (JPG, PNG, WEBP, GIF). Maksimal 10MB."
                currentImage={currentFoto ? getImageUrl(currentFoto) : ''}
                currentOriginalImage={currentOriginalFoto ? getImageUrl(currentOriginalFoto) : ''}
                ratioOptions={CROP_RATIO_OPTIONS}
                aspectRatio={16 / 9}
                circular={false}
                previewShape="rounded"
                onFileChange={setFotoSelection}
              />
            </div>

            {/* Status (Draft / Published) */}
            <div className="space-y-2">
              <label className="block text-slate-700 text-sm font-semibold">Status Publikasi Modul *</label>
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
                      Diterbitkan ke publik di website setelah terverifikasi admin.
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
              {editId ? 'Simpan Perubahan' : 'Unggah Modul'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
