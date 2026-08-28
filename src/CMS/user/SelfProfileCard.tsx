import React, { useState } from 'react';
import { Key, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { getImageUrl } from '../../config/api';
import { UserSession } from '../types';
import { ImageUploadField, ImageUploadPayload } from '../components/ImageUploadField';

interface SelfProfileCardProps {
  currentUser: UserSession;
  username: string;
  setUsername: (val: string) => void;
  nama: string;
  setNama: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  setFotoSelection: (payload: ImageUploadPayload) => void;
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
  setFotoSelection,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordInvalid = password.length > 0 && password.length < 6;

  const handleSubmit = (e: React.FormEvent) => {
    if (isPasswordInvalid) {
      e.preventDefault();
      return;
    }
    onSubmit(e);
  };

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-teal-100 transition-all duration-300 transform space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
            <Key size={18} />
          </div>
          Edit Profil Saya
        </h3>
        <span
          className={`text-[11px] uppercase font-bold tracking-wider px-3 py-1 rounded-full ${
            currentUser.role === 'ADMIN'
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              : currentUser.role === 'GURU'
              ? 'bg-teal-50 text-teal-700 border border-teal-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
        >
          {currentUser.role}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center justify-center mb-3">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-md ring-2 ring-teal-500/30 group-hover:ring-teal-500 transition-all duration-300 flex items-center justify-center">
              {currentUser.foto ? (
                <img
                  src={getImageUrl(currentUser.foto)}
                  alt={currentUser.nama_penanggung_jawab}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <User size={48} className="text-slate-400" />
              )}
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-700 mt-2">{currentUser.nama_penanggung_jawab}</p>
          <p className="text-[11px] text-slate-400">@{currentUser.username}</p>
        </div>

        <div>
          <label className="block text-slate-700 text-xs sm:text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-xs sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-slate-700 text-xs sm:text-sm font-medium mb-1">Nama Penanggung Jawab</label>
          <input
            type="text"
            required
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-xs sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-slate-700 text-xs sm:text-sm font-medium mb-1">Password Baru (Opsional)</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Kosongkan jika tidak ubah"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-4 pr-10 py-2.5 rounded-xl border ${
                isPasswordInvalid ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-teal-500/20 focus:border-teal-500'
              } focus:outline-none focus:ring-2 transition-all text-xs sm:text-sm`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              title={showPassword ? 'Sembunyikan Password' : 'Tampilkan Password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {isPasswordInvalid && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle size={14} className="shrink-0" /> Password harus memiliki minimal 6 karakter.
            </p>
          )}
        </div>

        <div>
          <ImageUploadField
            label="Ganti Foto Profil"
            hint="Format: Gambar (JPG, PNG, WEBP, GIF). Maksimal 10MB. Foto akan dipotong otomatis 1:1."
            currentImage={currentUser.foto ? getImageUrl(currentUser.foto) : undefined}
            currentOriginalImage={
              currentUser.foto_original
                ? getImageUrl(currentUser.foto_original)
                : currentUser.foto
                  ? getImageUrl(currentUser.foto)
                  : undefined
            }
            circular
            previewShape="circle"
            outputWidth={512}
            onFileChange={setFotoSelection}
          />
        </div>

        <button
          type="submit"
          disabled={isPasswordInvalid}
          className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium py-3 rounded-xl shadow-sm hover:shadow-md active:scale-[0.99] cursor-pointer transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          Perbarui Profil
        </button>
      </form>
    </div>
  );
};
