import React, { useEffect } from 'react';
import { X, ExternalLink, FolderOpen, FileText } from 'lucide-react';
import { AkademikMenuItem } from '../../types';

interface AkademikFormModalProps {
  showModal: boolean;
  editId: number | null;
  label: string;
  setLabel: (v: string) => void;
  deskripsi: string;
  setDeskripsi: (v: string) => void;
  linkGdrive: string;
  setLinkGdrive: (v: string) => void;
  isModul: boolean;
  setIsModul: (v: boolean) => void;
  urutan: number;
  setUrutan: (v: number) => void;
  aktif: boolean;
  setAktif: (v: boolean) => void;
  parentId: number | null;
  setParentId: (v: number | null) => void;
  categories: AkademikMenuItem[];
  error: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AkademikFormModal: React.FC<AkademikFormModalProps> = ({
  showModal,
  editId,
  label,
  setLabel,
  deskripsi,
  setDeskripsi,
  linkGdrive,
  setLinkGdrive,
  isModul,
  setIsModul,
  urutan,
  setUrutan,
  aktif,
  setAktif,
  parentId,
  setParentId,
  categories,
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

  // Mengedit kategori (parent null) -> sembunyikan link drive & is_modul
  const editingCategory = parentId === null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-xl shadow-xl border border-slate-100 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 sm:p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-lg sm:text-xl font-bold">
              {editId ? 'Ubah Menu Akademik' : 'Tambah Menu Akademik Baru'}
            </h3>
            <p className="text-xs text-teal-100 mt-0.5">
              {editingCategory ? 'Atur kategori grup di menu akademik publik.' : 'Atur item tautan Google Drive di dalam kategori.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-slate-200 text-2xl font-semibold cursor-pointer p-1"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 sm:p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Label Menu */}
          <div>
            <label className="block text-slate-700 text-sm font-medium mb-1.5">
              Nama / Label Menu *
            </label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={editingCategory ? 'Contoh: Perangkat Pembelajaran' : 'Contoh: Prota & Promes'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
            />
          </div>

          {/* Kategori Induk */}
          <div>
            <label className="block text-slate-700 text-sm font-medium mb-1.5">
              Kategori Induk
            </label>
            <select
              value={parentId === null ? '' : String(parentId)}
              onChange={(e) => {
                const v = e.target.value;
                setParentId(v === '' ? null : Number(v));
                if (editId && Number(v) === Number(editId)) {
                  setParentId(null);
                }
              }}
              disabled={!!editId && editingCategory}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm bg-white disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="">— Kategori Utama (Buat Grup) —</option>
              {categories
                .filter((c) => !editId || Number(c.id) !== Number(editId))
                .map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.label}
                  </option>
                ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              {editingCategory
                ? 'Kategori menampung beberapa item di bawahnya pada dropdown Akademik.'
                : 'Pilih kategori di mana item ini akan ditampilkan.'}
            </p>
          </div>

          {/* Bidang khusus item (bukan kategori) */}
          {!editingCategory && (
            <>
              {/* Link Google Drive */}
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">
                  Link Google Drive *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    value={linkGdrive}
                    onChange={(e) => setLinkGdrive(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <ExternalLink size={16} />
                  </div>
                </div>
              </div>

              {/* Deskripsi (kompatibilitas) */}
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">
                  Deskripsi Singkat (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Penjelasan singkat item ini (opsional)."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                />
              </div>
            </>
          )}

          {/* Urutan & Status Tampil */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-1.5">
                Urutan Tampil
              </label>
              <input
                type="number"
                min={0}
                value={urutan}
                onChange={(e) => setUrutan(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-medium mb-1.5">
                Status Visibilitas
              </label>
              <select
                value={aktif ? '1' : '0'}
                onChange={(e) => setAktif(e.target.value === '1')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm bg-white"
              >
                <option value="1">Aktif (Tampil di Navbar)</option>
                <option value="0">Nonaktif (Disembunyikan)</option>
              </select>
            </div>
          </div>

          {/* Toggle Khusus Item Modul Ajar (hanya item) */}
          {!editingCategory && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isModul}
                  onChange={(e) => setIsModul(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <span className="text-sm font-bold text-slate-800">
                  Item Modul Ajar &amp; LKPD
                </span>
              </label>
              <p className="text-xs text-slate-500 pl-6">
                Jika dicentang, halaman item ini menampilkan viewer Google Drive serta katalog modul ajar.
              </p>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-md shadow-teal-600/20 transition cursor-pointer"
            >
              {editId ? 'Simpan Perubahan' : editingCategory ? 'Tambah Kategori' : 'Tambah Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
