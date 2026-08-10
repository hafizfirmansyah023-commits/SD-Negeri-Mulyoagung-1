import React from 'react';
import { Tag, Edit2, Trash2 } from 'lucide-react';
import { UserSession } from '../types';

export interface StatistikItem {
  id: number;
  judul: string;
  jumlah: string;
  label: string;
}

interface StatistikCardProps {
  item: StatistikItem;
  currentUser: UserSession;
  onEdit: (item: StatistikItem) => void;
  onDelete: (id: number) => void;
}

export const StatistikCard: React.FC<StatistikCardProps> = ({
  item,
  currentUser,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
      <div className="p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 bg-teal-50 text-teal-700 border border-teal-200 text-xs px-2.5 py-1 rounded-full font-semibold">
            <Tag size={12} /> {item.judul}
          </span>
          <span className="text-xs text-slate-400 font-mono">ID #{item.id}</span>
        </div>

        <div className="text-center py-4">
          <p className="text-3xl sm:text-4xl font-extrabold text-[#1E3A8A] leading-none">{item.jumlah}</p>
          <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-2">{item.label}</p>
        </div>
      </div>

      {currentUser.role === 'ADMIN' && (
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={() => onEdit(item)}
            className="flex items-center gap-1.5 text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <Edit2 size={14} /> Ubah
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="flex items-center gap-1.5 text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <Trash2 size={14} /> Hapus
          </button>
        </div>
      )}
    </div>
  );
};
