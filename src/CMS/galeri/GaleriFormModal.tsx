import React from 'react';
import { getImageUrl } from '../../config/api';
import { ImageUploadField, ImageUploadPayload } from '../components/ImageUploadField';
import { CROP_RATIO_OPTIONS } from '../components/ImageCropModal';
import { RichTextEditor } from '../components/RichTextEditor';

interface GaleriFormModalProps {
  showModal: boolean;
  editId: number | null;
  currentFoto?: string;
  currentOriginalFoto?: string;
  judul: string;
  setJudul: (val: string) => void;
  deskripsi: string;
  setDeskripsi: (val: string) => void;
  kategori: string;
  setKategori: (val: string) => void;
  tanggal: string;
  setTanggal: (val: string) => void;
  setFotoSelection: (payload: ImageUploadPayload) => void;
  error: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const GaleriFormModal: React.FC<GaleriFormModalProps> = ({
  showModal,
  editId,
  currentFoto,
  currentOriginalFoto,
  judul,
  setJudul,
  deskripsi,
  setDeskripsi,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-lg">
            {editId ? 'Edit Galeri Foto' : 'Tambah Foto Galeri Baru'}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-1 hover:bg-slate-50 rounded-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-slate-700 text-sm font-medium mb-1.5">Judul Dokumentasi</label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Upacara Bendera HUT RI ke-79"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-1.5">Kategori</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
              >
                <option value="Kegiatan">Kegiatan</option>
                <option value="Sarana & Prasarana">Sarana & Prasarana</option>
                <option value="Prestasi">Prestasi</option>
                <option value="Pembelajaran">Pembelajaran</option>
                <option value="Acara Khusus">Acara Khusus</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-1.5">Tanggal Kegiatan</label>
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
            <label className="block text-slate-700 text-sm font-medium mb-1.5">Deskripsi Singkat</label>
            <RichTextEditor
              value={deskripsi}
              onChange={setDeskripsi}
              placeholder="Keterangan seputar kegiatan ini..."
            />
          </div>

          <div>
            <ImageUploadField
              label="File Foto"
              hint={`Format: Gambar (JPG, PNG, WEBP, GIF). Maksimal 5MB. Pilih rasio potong yang diinginkan. ${editId ? 'Biarkan kosong jika tidak ingin mengubah foto.' : ''}`}
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
            <p className="text-slate-400 text-xs mt-1">Format: Gambar (JPG, PNG, WEBP, GIF). Maksimal 10MB. {editId ? 'Biarkan kosong jika tidak ingin mengubah foto.' : ''}</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
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
              Simpan Foto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
