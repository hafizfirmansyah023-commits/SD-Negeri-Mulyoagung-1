import React from 'react';
import { Check, X } from 'lucide-react';
import { getImageUrl } from '../../config/api';

interface VerifikasiCardProps {
  id: number;
  judul: string;
  deskripsiAtauIsi: string;
  foto: string;
  kategori: string;
  tanggal: string;
  uploader: string;
  statusBadge?: React.ReactNode;
  onVerify: (id: number, decision: 'Verified' | 'Rejected') => void;
}

export const VerifikasiCard: React.FC<VerifikasiCardProps> = ({
  id,
  judul,
  deskripsiAtauIsi,
  foto,
  kategori,
  tanggal,
  uploader,
  statusBadge,
  onVerify,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 flex flex-col md:flex-row gap-4 sm:gap-6 items-start justify-between">
      <div className="flex flex-col sm:flex-row gap-4 items-start flex-grow w-full">
        <div className="w-full sm:w-44 h-36 sm:h-28 bg-slate-100 rounded-xl overflow-hidden shrink-0">
          <img src={getImageUrl(foto)} alt={judul} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-2 min-w-0 flex-1">
          <div className="flex gap-2 items-center flex-wrap">
            <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
              {kategori}
            </span>
            {statusBadge}
            <span className="text-xs text-slate-400">{tanggal}</span>
          </div>
          <h3 className="font-bold text-slate-800 text-base sm:text-lg">{judul}</h3>
          <p 
            className="text-slate-500 text-xs sm:text-sm line-clamp-2"
            dangerouslySetInnerHTML={{ __html: deskripsiAtauIsi }}
          />
          <p className="text-xs text-slate-400">
            Pengirim: <strong className="text-slate-600">{uploader}</strong>
          </p>
        </div>
      </div>

      <div className="flex sm:flex-col gap-2.5 shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <button
          onClick={() => onVerify(id, 'Verified')}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-colors cursor-pointer min-h-[40px]"
        >
          <Check size={16} /> Setujui
        </button>
        <button
          onClick={() => onVerify(id, 'Rejected')}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[40px]"
        >
          <X size={16} /> Tolak
        </button>
      </div>
    </div>
  );
};
