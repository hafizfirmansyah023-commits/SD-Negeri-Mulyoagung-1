import React from 'react';
import { User, BookOpen, GraduationCap, Edit2, Trash2 } from 'lucide-react';
import { getImageUrl } from '../../config/api';
import { Teacher } from '../hooks/useTeacherData';

interface GuruCardProps {
  teacher: Teacher;
  onEdit: (teacher: Teacher) => void;
  onDelete: (id: number) => void;
}

export const GuruCard: React.FC<GuruCardProps> = ({ teacher: t, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
      <div>
        <div className="relative h-44 sm:h-48 bg-slate-100 flex items-center justify-center">
          {t.foto ? (
            <img
              src={getImageUrl(t.foto)}
              alt={t.nama}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={64} className="text-slate-400" />
          )}
          <span className="absolute top-3 right-3 bg-teal-600/90 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium">
            {t.jabatan}
          </span>
        </div>
        <div className="p-4 sm:p-5 space-y-3">
          <h3 className="font-bold text-slate-800 text-base sm:text-lg leading-tight">{t.nama}</h3>
          <p className="text-slate-400 text-xs font-mono">NIP. {t.nip || '-'}</p>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm">
              <BookOpen size={16} className="text-slate-400 shrink-0" />
              <span>Tugas: {t.tugas}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm">
              <GraduationCap size={16} className="text-slate-400 shrink-0" />
              <span>Pendidikan: {t.riwayat_pendidikan}</span>
            </div>
            <div className="text-xs text-slate-400 flex justify-between pt-1">
              <span>Gender: {t.jenis_kelamin}</span>
              <span>Status: {t.status}</span>
            </div>
            {t.motto && (
              <p className="text-xs italic text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1 line-clamp-2">
                "{t.motto}"
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
        <button
          onClick={() => onEdit(t)}
          className="flex items-center gap-1.5 text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <Edit2 size={14} /> Ubah
        </button>
        <button
          onClick={() => onDelete(t.id)}
          className="flex items-center gap-1.5 text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <Trash2 size={14} /> Hapus
        </button>
      </div>
    </div>
  );
};
