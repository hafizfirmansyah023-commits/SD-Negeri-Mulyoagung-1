import React from 'react';
import { Edit2, Trash2, ExternalLink, Eye, EyeOff, Layers } from 'lucide-react';
import { AkademikMenuItem } from '../../types';

interface AkademikCardProps {
  item: AkademikMenuItem;
  onEdit: (item: AkademikMenuItem) => void;
  onDelete: (item: AkademikMenuItem) => void;
}

export const AkademikCard: React.FC<AkademikCardProps> = ({ item, onEdit, onDelete }) => {
  const isModul = Number(item.is_modul) === 1;
  const isAktif = Number(item.aktif) === 1;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div className="space-y-3">
        {/* Header Info */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center border border-teal-100">
              {item.urutan}
            </span>
            <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-snug line-clamp-1">
              {item.label}
            </h4>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isModul && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
                Modul Ajar
              </span>
            )}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                isAktif
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              {isAktif ? <Eye size={11} /> : <EyeOff size={11} />}
              {isAktif ? 'Aktif' : 'Nonaktif'}
            </span>
          </div>
        </div>

        {/* Deskripsi */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {item.deskripsi || 'Tidak ada deskripsi singkat.'}
        </p>

        {/* Link GDrive */}
        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Layers size={13} className="text-teal-600 shrink-0" />
            <span className="text-[11px] text-slate-600 truncate font-mono">
              {item.link_gdrive}
            </span>
          </div>
          <a
            href={item.link_gdrive}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:text-teal-800 shrink-0 p-1 hover:bg-teal-50 rounded-lg transition"
            title="Buka Link Google Drive"
          >
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit(item)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 text-xs font-semibold transition cursor-pointer"
        >
          <Edit2 size={13} /> Ubah
        </button>
        <button
          onClick={() => onDelete(item)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-xs font-semibold transition cursor-pointer"
        >
          <Trash2 size={13} /> Hapus
        </button>
      </div>
    </div>
  );
};
