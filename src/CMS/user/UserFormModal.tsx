import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { ImageUploadField, ImageUploadPayload } from '../components/ImageUploadField';

interface UserFormModalProps {
  showAddModal: boolean;
  newNama: string;
  setNewNama: (val: string) => void;
  newUsername: string;
  setNewUsername: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  newRole: 'ADMIN' | 'TIM' | 'GURU';
  setNewRole: (val: 'ADMIN' | 'TIM' | 'GURU') => void;
  setNewFotoSelection: (payload: ImageUploadPayload) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  showAddModal,
  newNama,
  setNewNama,
  newUsername,
  setNewUsername,
  newPassword,
  setNewPassword,
  newRole,
  setNewRole,
  setNewFotoSelection,
  onClose,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    if (showAddModal) {
      const prevBody = document.body.style.overflow;
      const prevHtml = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevBody;
        document.documentElement.style.overflow = prevHtml;
      };
    }
  }, [showAddModal]);

  if (!showAddModal) return null;

  const isPasswordInvalid = newPassword.length > 0 && newPassword.length < 6;

  const handleSubmit = (e: React.FormEvent) => {
    if (newPassword.length < 6) {
      e.preventDefault();
      return;
    }
    onSubmit(e);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-md shadow-xl border border-slate-100 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 sm:p-6 text-white flex justify-between items-center shrink-0">
          <h3 className="text-base sm:text-lg font-bold">Tambah Pengguna Baru</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-slate-200 text-2xl font-bold cursor-pointer p-1"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-slate-700 text-sm font-medium mb-1">Nama Penanggung Jawab</label>
            <input
              type="text"
              required
              value={newNama}
              onChange={(e) => setNewNama(e.target.value)}
              placeholder="Nama Lengkap / Jabatan"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              required
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="username_akses"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className={`w-full pl-4 pr-11 py-2.5 rounded-xl border ${
                  isPasswordInvalid ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-teal-500/20'
                } focus:outline-none focus:ring-2 text-sm`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                title={showPassword ? 'Sembunyikan Password' : 'Tampilkan Password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {isPasswordInvalid && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={14} className="shrink-0" /> Password harus memiliki minimal 6 karakter.
              </p>
            )}
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-medium mb-1.5">Peran / Hak Akses</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as 'ADMIN' | 'TIM' | 'GURU')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
            >
              <option value="TIM">Tim Kesiswaan / Kontributor (Perlu Verifikasi Admin)</option>
              <option value="GURU">Guru Pengajar (Upload Modul Pembelajaran)</option>
              <option value="ADMIN">Administrator Utama (Akses Penuh)</option>
            </select>
          </div>

          <div>
            <ImageUploadField
              label="Foto Profil (Opsional)"
              hint="Format: Gambar (JPG, PNG, WEBP, GIF). Maksimal 10MB. Foto akan dipotong otomatis 1:1."
              circular
              previewShape="circle"
              outputWidth={512}
              onFileChange={setNewFotoSelection}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm font-semibold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={newPassword.length < 6}
              className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-sm font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tambah Pengguna
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
