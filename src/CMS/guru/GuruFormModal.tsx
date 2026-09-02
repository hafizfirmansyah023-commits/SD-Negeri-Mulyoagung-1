import React, { useEffect } from 'react';
import { getImageUrl } from '../../config/api';
import { ImageUploadField, ImageUploadPayload } from '../components/ImageUploadField';

interface GuruFormModalProps {
  showModal: boolean;
  editId: number | null;
  currentFoto?: string;
  currentOriginalFoto?: string;
  nama: string;
  setNama: (val: string) => void;
  nip: string;
  setNip: (val: string) => void;
  jabatan: string;
  setJabatan: (val: string) => void;
  tugas: string;
  setTugas: (val: string) => void;
  riwayatPendidikan: string;
  setRiwayatPendidikan: (val: string) => void;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  setJenisKelamin: (val: 'Laki-laki' | 'Perempuan') => void;
  status: string;
  setStatus: (val: string) => void;
  motto: string;
  setMotto: (val: string) => void;
  setFotoSelection: (payload: ImageUploadPayload) => void;
  error: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const GuruFormModal: React.FC<GuruFormModalProps> = ({
  showModal,
  editId,
  currentFoto,
  currentOriginalFoto,
  nama,
  setNama,
  nip,
  setNip,
  jabatan,
  setJabatan,
  tugas,
  setTugas,
  riwayatPendidikan,
  setRiwayatPendidikan,
  jenisKelamin,
  setJenisKelamin,
  status,
  setStatus,
  motto,
  setMotto,
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
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 sm:p-6 text-white flex justify-between items-center shrink-0">
          <h3 className="text-lg sm:text-xl font-bold">
            {editId ? 'Ubah Profil Guru/Staff' : 'Tambah Guru/Staff Baru'}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama beserta gelar"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">NIP</label>
                <input
                  type="number"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="Contoh: 19820315..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Jabatan Utama</label>
                <select
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                >
                  <option value="Komite Sekolah">Komite Sekolah</option>
                  <option value="Kepala Sekolah">Kepala Sekolah</option>
                  <option value="Guru Wali Kelas">Guru Wali Kelas</option>
                  <option value="Guru Mata Pelajaran">Guru Mata Pelajaran</option>
                  <option value="Tata Usaha">Tata Usaha</option>
                  <option value="Tenaga Kependidikan">Tenaga Kependidikan</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Tugas Spesifik</label>
                <input
                  type="text"
                  required
                  value={tugas}
                  onChange={(e) => setTugas(e.target.value)}
                  placeholder="Contoh: Guru Kelas 1A, Agama Islam, PJOK, dll"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Jenis Kelamin</label>
                <select
                  value={jenisKelamin}
                  onChange={(e) => setJenisKelamin(e.target.value as 'Laki-laki' | 'Perempuan')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Status Kepegawaian</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Mutasi">Mutasi</option>
                  <option value="Pensiun">Pensiun</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Riwayat Pendidikan</label>
                <input
                  type="text"
                  required
                  value={riwayatPendidikan}
                  onChange={(e) => setRiwayatPendidikan(e.target.value)}
                  placeholder="Contoh: S1 PGSD"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-medium mb-1.5">Motto / Kutipan Pribadi</label>
              <textarea
                rows={2}
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                placeholder="Contoh: Mendidik dengan hati, membentuk karakter mulia."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm resize-none"
              />
            </div>

            <div>
              <ImageUploadField
                label="Foto Profil"
                hint={`Format: Gambar (JPG, PNG, WEBP, GIF). Maksimal 10MB. Foto akan dipotong otomatis 1:1. ${editId ? 'Biarkan kosong jika tidak ingin mengubah foto.' : ''}`}
                currentImage={currentFoto ? getImageUrl(currentFoto) : undefined}
                currentOriginalImage={
                  currentOriginalFoto
                    ? getImageUrl(currentOriginalFoto)
                    : currentFoto
                      ? getImageUrl(currentFoto)
                      : undefined
                }
                circular
                previewShape="circle"
                outputWidth={512}
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
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
