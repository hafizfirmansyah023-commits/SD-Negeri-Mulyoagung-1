import React from 'react';
import { getImageUrl } from '../../config/api';
import { ImageUploadField, ImageUploadPayload } from '../components/ImageUploadField';
import { CROP_RATIO_OPTIONS } from '../components/ImageCropModal';
import { RichTextEditor } from '../components/RichTextEditor';

interface BeritaFormModalProps {
  showModal: boolean;
  editId: number | null;
  currentFoto?: string;
  currentOriginalFoto?: string;
  judul: string;
  setJudul: (val: string) => void;
  isi: string;
  setIsi: (val: string) => void;
  kategori: string;
  setKategori: (val: string) => void;
  tanggal: string;
  setTanggal: (val: string) => void;
  setFotoSelection: (payload: ImageUploadPayload) => void;
  error: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BeritaFormModal: React.FC<BeritaFormModalProps> = ({
  showModal,
  editId,
  currentFoto,
  currentOriginalFoto,
  judul,
  setJudul,
  isi,
  setIsi,
  kategori,
  setKategori,
  tanggal,
  setTanggal,
  setFotoSelection,
  error,
  onClose,
  onSubmit,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl shadow-xl border border-slate-100 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 sm:p-6 text-white flex justify-between items-center shrink-0">
          <h3 className="text-lg sm:text-xl font-bold">
            {editId ? 'Ubah Konten Berita' : 'Tulis Berita Baru'}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-slate-200 text-2xl font-semibold cursor-pointer p-1"
          >
            &times;
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
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
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Kategori</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                >
                  <option value="Kegiatan Sekolah">Kegiatan Sekolah</option>
                  <option value="Prestasi">Prestasi</option>
                  <option value="Pengumuman">Pengumuman</option>
                  <option value="Inovasi">Inovasi</option>
                  <option value="Edukasi">Edukasi</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Tanggal Publish</label>
                <input
                  type="date"
                  required
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-medium mb-1.5">Isi Berita / Artikel *</label>
              <RichTextEditor
                value={isi}
                onChange={setIsi}
                placeholder="Tuliskan isi berita selengkapnya..."
              />
            </div>

            <div>
              <ImageUploadField
                label="Foto Utama Berita"
                hint={`Format: Gambar (JPG, PNG, WEBP, GIF). Maksimal 10MB. Pilih rasio potong yang diinginkan. ${editId ? 'Biarkan kosong jika tidak ingin mengubah foto.' : ''}`}
                currentImage={currentFoto ? getImageUrl(currentFoto) : undefined}
                currentOriginalImage={
                  currentOriginalFoto
                    ? getImageUrl(currentOriginalFoto)
                    : currentFoto
                      ? getImageUrl(currentFoto)
                      : undefined
                }
                circular={false}
                previewShape="rounded"
                aspectRatio={4 / 3}
                outputWidth={1024}
                ratioOptions={CROP_RATIO_OPTIONS}
                onFileChange={setFotoSelection}
              />

            </div>
          </div>

          <div className="p-4 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-5 py-2.5 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium transition-colors text-sm cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 sm:px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 font-medium transition-colors text-sm cursor-pointer"
            >
              Simpan Berita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
