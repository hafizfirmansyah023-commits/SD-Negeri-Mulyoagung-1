import React from 'react';
import { Key, User } from 'lucide-react';
import { getImageUrl } from '../../config/api';
import { UserSession } from '../types';
import { validateImageFile } from '../utils/fileValidation';

interface SelfProfileCardProps {
  currentUser: UserSession;
  username: string;
  setUsername: (val: string) => void;
  nama: string;
  setNama: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  setFotoFile: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SelfProfileCard: React.FC<SelfProfileCardProps> = ({
  currentUser,
  username,
  setUsername,
  nama,
  setNama,
  password,
  setPassword,
  setFotoFile,
  onSubmit,
}) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
      <h3 className="text-base sm:text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
        <Key className="text-teal-600 shrink-0" size={18} /> Edit Profil Saya
      </h3>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex justify-center mb-2">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-teal-500/30 flex items-center justify-center">
            {currentUser.foto ? (
              <img
                src={getImageUrl(currentUser.foto)}
                alt={currentUser.nama_penanggung_jawab}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={40} className="text-slate-400" />
            )}
          </div>
        </div>

        <div>
          <label className="block text-slate-700 text-xs sm:text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-xs sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-slate-700 text-xs sm:text-sm font-medium mb-1">Nama Penanggung Jawab</label>
          <input
            type="text"
            required
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-xs sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-slate-700 text-xs sm:text-sm font-medium mb-1">Password Baru (Opsional)</label>
          <input
            type="password"
            placeholder="Kosongkan jika tidak ubah"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-xs sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-slate-700 text-xs sm:text-sm font-medium mb-1">Ganti Foto Profil</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = validateImageFile(e.target.files?.[0] || null, e.target);
              setFotoFile(file);
            }}
            className="w-full text-slate-600 text-xs border border-slate-200 rounded-xl file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
          />
          <p className="text-slate-400 text-[11px] mt-1">Format: Gambar (JPG, PNG, WEBP, GIF). Maksimal 5MB.</p>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium py-2.5 rounded-xl shadow-sm cursor-pointer transition-colors text-sm"
        >
          Perbarui Profil
        </button>
      </form>
    </div>
  );
};
