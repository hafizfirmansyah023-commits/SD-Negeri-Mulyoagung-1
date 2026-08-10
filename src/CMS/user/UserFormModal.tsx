import React from 'react';

interface UserFormModalProps {
  showAddModal: boolean;
  newNama: string;
  setNewNama: (val: string) => void;
  newUsername: string;
  setNewUsername: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  newRole: 'ADMIN' | 'TIM';
  setNewRole: (val: 'ADMIN' | 'TIM') => void;
  setNewFotoFile: (file: File | null) => void;
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
  setNewFotoFile,
  onClose,
  onSubmit,
}) => {
  if (!showAddModal) return null;

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

        <form onSubmit={onSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
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
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-medium mb-1">Role / Hak Akses</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as 'ADMIN' | 'TIM')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-sm"
            >
              <option value="TIM">TIM (Kesiswaan / Kontributor)</option>
              <option value="ADMIN">ADMIN (Akses Penuh)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-medium mb-1">Foto Profil (Opsional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewFotoFile(e.target.files?.[0] || null)}
              className="w-full text-slate-600 text-xs sm:text-sm border border-slate-200 rounded-xl file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
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
              className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-sm font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Tambah Pengguna
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
