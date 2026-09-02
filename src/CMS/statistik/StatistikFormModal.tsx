import React, { useEffect } from 'react';
import { Tag, Hash } from 'lucide-react';

interface StatistikFormModalProps {
  showModal: boolean;
  editId: number | null;
  judul: string;
  setJudul: (val: string) => void;
  jumlah: string;
  setJumlah: (val: string) => void;
  label: string;
  setLabel: (val: string) => void;
  error: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const StatistikFormModal: React.FC<StatistikFormModalProps> = ({
  showModal,
  editId,
  judul,
  setJudul,
  jumlah,
  setJumlah,
  label,
  setLabel,
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
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-md shadow-xl border border-slate-100 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 sm:p-6 text-white flex justify-between items-center shrink-0">
          <h3 className="text-base sm:text-lg font-bold">{editId ? 'Ubah Data Statistik' : 'Tambah Statistik Baru'}</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-slate-200 text-2xl font-semibold cursor-pointer p-1"
          >
            &times;
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-slate-700 text-sm font-medium mb-1">Kategori / Judul Singkat</label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                required
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Siswa, Alumni, Akreditasi"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-medium mb-1">Angka / Nilai Utama</label>
            <div className="relative">
              <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                required
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                placeholder="Contoh: 250+, 1000+, A"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-bold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-medium mb-1">Label Penjelas</label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Contoh: Siswa Aktif Terdaftar"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm font-medium transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-sm font-medium transition-colors cursor-pointer"
            >
              Simpan Statistik
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
