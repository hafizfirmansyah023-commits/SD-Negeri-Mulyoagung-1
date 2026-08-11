import React from 'react';
import { validateImageFile } from '../utils/fileValidation';

interface FasilitasFormModalProps {
  showModal: boolean;
  editId: number | null;
  judul: string;
  setJudul: (val: string) => void;
  deskripsi: string;
  setDeskripsi: (val: string) => void;
  fotoUrl: string;
  setFotoUrl: (val: string) => void;
  setFotoFile: (file: File | null) => void;
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
  fotoUrl,
  setFotoUrl,
  setFotoFile,
  onClose,
  onSubmit,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-lg shadow-xl border border-slate-100 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 sm:p-6 text-white flex justify-between items-center shrink-0">
          <h3 className="text-lg sm:text-xl font-bold">
            {editId ? 'Ubah Fasilitas Pembelajaran' : 'Tambah Fasilitas Baru'}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-slate-200 text-2xl font-bold cursor-pointer p-1"
          >
            &times;
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
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
            <textarea
              required
              rows={4}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan spesifikasi dan keunggulan fasilitas..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Unggah Foto Fasilitas</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = validateImageFile(e.target.files?.[0] || null, e.target);
                setFotoFile(file);
              }}
              className="w-full text-xs sm:text-sm text-slate-600 border border-slate-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
            <p className="text-slate-400 text-xs mt-1">Format: Gambar (JPG, PNG, WEBP, GIF). Maksimal 5MB.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Atau Gunakan URL Gambar</label>
            <input
              type="url"
              value={fotoUrl}
              onChange={(e) => setFotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
            />
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
              Simpan Fasilitas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
