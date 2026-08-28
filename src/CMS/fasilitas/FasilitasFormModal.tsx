import React from 'react';
import { getImageUrl } from '../../config/api';
import { ImageUploadField, ImageUploadPayload } from '../components/ImageUploadField';
import { CROP_RATIO_OPTIONS } from '../components/ImageCropModal';
import { RichTextEditor } from '../components/RichTextEditor';

interface FasilitasFormModalProps {
  showModal: boolean;
  editId: number | null;
  judul: string;
  setJudul: (val: string) => void;
  deskripsi: string;
  setDeskripsi: (val: string) => void;
  currentFoto?: string;
  currentOriginalFoto?: string;
  fotoUrl: string;
  setFotoUrl: (val: string) => void;
  setFotoSelection: (payload: ImageUploadPayload) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const FasilitasFormModal: React.FC<FasilitasFormModalProps> = ({
  showModal,
  editId,
  judul,
  setJudul,
  deskripsi,
  setDeskripsi,
  currentFoto,
  currentOriginalFoto,
  fotoUrl,
  setFotoUrl,
  setFotoSelection,
  onClose,
  onSubmit,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl shadow-xl border border-slate-100 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 sm:p-6 text-white flex justify-between items-center shrink-0">
          <h3 className="text-lg sm:text-xl font-bold">
            {editId ? 'Ubah Data Fasilitas' : 'Tambah Fasilitas Baru'}
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
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Nama Fasilitas / Ruangan
              </label>
              <input
                type="text"
                required
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Laboratorium Komputer & TIK"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi Fasilitas</label>
              <RichTextEditor
                value={deskripsi}
                onChange={setDeskripsi}
                placeholder="Jelaskan spesifikasi dan keunggulan fasilitas..."
              />
            </div>

            <div>
              <ImageUploadField
                label="Unggah Foto Fasilitas"
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
              Simpan Fasilitas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
