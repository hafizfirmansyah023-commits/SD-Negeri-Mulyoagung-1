import React, { useState } from 'react';
import { User, Trash2, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { getImageUrl } from '../../config/api';
import { UserSession } from '../types';

export interface UserData {
  id: number;
  username: string;
  role: 'ADMIN' | 'TIM';
  nama_penanggung_jawab: string;
  foto: string;
  foto_original?: string;
  password_plain?: string;
  lastResetPassword?: string;
}

interface UserTableProps {
  users: UserData[];
  currentUser: UserSession;
  isFiltered: boolean;
  onDeleteUser: (id: number) => void;
  onResetPassword: (user: UserData) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  currentUser,
  isFiltered,
  onDeleteUser,
  onResetPassword,
}) => {
  const [showPasswordMap, setShowPasswordMap] = useState<Record<number, boolean>>({});

  const toggleShowPassword = (id: number) => {
    setShowPasswordMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
      <table className="w-full text-left border-collapse min-w-[400px]">
        <thead>
          <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase font-bold">
            <th className="pb-3">User</th>
            <th className="pb-3">Role</th>
            <th className="pb-3">Password</th>
            <th className="pb-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const isVisible = !!showPasswordMap[u.id];
            const plainPw = u.password_plain || u.lastResetPassword || u.username;

            return (
              <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="py-3 flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200">
                    {u.foto ? (
                      <img
                        src={getImageUrl(u.foto)}
                        alt={u.nama_penanggung_jawab}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={18} className="text-slate-400" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-slate-800 text-xs sm:text-sm truncate">
                      {u.nama_penanggung_jawab}
                    </p>
                    <p className="text-[11px] text-slate-400">@{u.username}</p>
                  </div>
                </td>
                <td className="py-3">
                  <span
                    className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      u.role === 'ADMIN'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-3">
                  <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-700">
                    <span className={isVisible ? 'font-semibold text-teal-700' : 'text-slate-500'}>
                      {isVisible ? (plainPw || '(Kosong)') : '••••••••'}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleShowPassword(u.id)}
                      className="p-0.5 text-slate-400 hover:text-teal-600 transition-colors cursor-pointer"
                      title={isVisible ? 'Sembunyikan Password' : 'Lihat Password'}
                    >
                      {isVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onResetPassword(u)}
                      className="p-2 rounded-lg text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors inline-flex cursor-pointer"
                      title="Reset Password Pengguna"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteUser(u.id)}
                      disabled={u.id === currentUser.id}
                      className={`p-2 rounded-lg transition-colors inline-flex cursor-pointer ${
                        u.id === currentUser.id
                          ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
                          : 'text-red-600 bg-red-50 hover:bg-red-100'
                      }`}
                      title="Hapus User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="py-8 text-center text-slate-400 text-xs sm:text-sm font-medium">
                {isFiltered
                  ? 'Tidak ada pengguna yang sesuai dengan filter atau pencarian.'
                  : 'Belum ada pengguna terdaftar.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
