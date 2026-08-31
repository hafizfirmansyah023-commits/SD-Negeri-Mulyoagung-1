import React, { useState } from 'react';
import { X, Key, Copy, Check, Eye, EyeOff, AlertTriangle, ShieldAlert } from 'lucide-react';
import { UserData } from './UserTable';

interface ResetPasswordModalProps {
  user: UserData | null;
  generatedPassword?: string | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirmReset: (user: UserData) => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  user,
  generatedPassword,
  isLoading,
  onClose,
  onConfirmReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  React.useEffect(() => {
    if (user) {
      const prevBody = document.body.style.overflow;
      const prevHtml = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevBody;
        document.documentElement.style.overflow = prevHtml;
      };
    }
  }, [user]);

  if (!user) return null;

  const handleCopy = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {!generatedPassword ? (
          /* Step 1: Confirmation Form */
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
              <ShieldAlert className="shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">Konfirmasi Reset Password</h3>
                <p className="text-xs text-slate-600">Password pengguna tersimpan terenkripsi. Admin hanya dapat mereset untuk meng-generate password baru.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm space-y-1">
              <p className="text-xs text-slate-500 font-medium">Pengguna yang di-reset:</p>
              <p className="font-semibold text-slate-800 text-base">{user.nama_penanggung_jawab}</p>
              <p className="text-xs text-slate-500">Username: <span className="font-mono text-slate-700">@{user.username}</span> | Role: <span className="font-bold text-teal-700">{user.role}</span></p>
            </div>

            <div className="text-xs text-slate-500 space-y-1.5 bg-blue-50/70 border border-blue-100 p-3 rounded-xl">
              <p className="flex items-start gap-1.5 text-blue-800">
                <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                Sistem akan secara otomatis meng-generate password acak baru yang dapat disalin dan diberikan ke pengguna.
              </p>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => onConfirmReset(user)}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm font-medium shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <Key size={16} /> Reset Password Sekarang
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Result Display */
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Key className="text-emerald-700" size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">Reset Password Berhasil!</h3>
                <p className="text-xs text-emerald-700">Password baru telah berhasil di-generate sistem.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <p className="text-xs text-slate-500 font-medium">Password Baru untuk <span className="font-semibold text-slate-800">{user.nama_penanggung_jawab}</span> (@{user.username}):</p>

              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  readOnly
                  value={generatedPassword}
                  className="w-full bg-white font-mono font-bold text-lg text-slate-800 px-4 py-2.5 rounded-xl border border-slate-300 pr-20 select-all focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                    title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check size={14} /> Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Salin
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic bg-amber-50/60 p-3 rounded-xl border border-amber-100 text-amber-800">
              * Harap berikan password acak baru ini secara langsung kepada anggota Tim. Catat atau salin password ini sebelum menutup jendela ini.
            </p>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium transition-colors cursor-pointer"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
