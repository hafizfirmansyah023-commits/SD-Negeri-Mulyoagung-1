import React, { useState } from 'react';
import { Check, X, BookOpen, Image as ImageIcon, FileText } from 'lucide-react';
import { getImageUrl } from '../../config/api';

interface VerifikasiCardProps {
  id: number;
  judul: string;
  deskripsiAtauIsi: string;
  foto?: string;
  kategori: string;
  tanggal: string;
  uploader: string;
  statusBadge?: React.ReactNode;
  fallbackIcon?: React.ReactNode;
  fallbackLabel?: string;
  isModule?: boolean;
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
  fallbackIcon,
  fallbackLabel,
  isModule = false,
  onVerify,
}) => {
  const [imageError, setImageError] = useState(false);
  const hasValidImage = foto && foto.trim() !== '' && !imageError;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 flex flex-col md:flex-row gap-4 sm:gap-6 items-start justify-between">
      <div className="flex flex-col sm:flex-row gap-4 items-start flex-grow w-full">
        {/* Cover Thumbnail Container */}
        <div className="w-full sm:w-44 h-36 sm:h-28 rounded-xl overflow-hidden shrink-0 relative bg-slate-100">
          {hasValidImage ? (
            <img
              src={getImageUrl(foto)}
              alt={judul}
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : isModule ? (
            /* Modul Ajar Gradient Cover Fallback (Consistent with ModulCard) */
            <div className="w-full h-full bg-gradient-to-br from-teal-700 to-slate-900 flex flex-col items-center justify-center text-teal-200/90 p-2 text-center select-none">
              <BookOpen size={30} className="mb-1 text-teal-300/80" />
              <span className="text-[10px] font-bold uppercase tracking-wider line-clamp-1 px-1">
                {fallbackLabel || kategori}
              </span>
            </div>
          ) : (
            /* General Fallback (Berita / Galeri) */
            <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-2 text-center select-none">
              {fallbackIcon || <ImageIcon size={28} className="mb-1 text-slate-300" />}
              <span className="text-[10px] font-semibold text-slate-500 line-clamp-1 px-1">
                {fallbackLabel || kategori}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2 min-w-0 flex-1">
          <div className="flex gap-2 items-center flex-wrap">
            <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
              {kategori}
            </span>
            {statusBadge}
            <span className="text-xs text-slate-400">{tanggal}</span>
          </div>
          <h3 className="font-bold text-slate-800 text-base sm:text-lg line-clamp-2">{judul}</h3>
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

