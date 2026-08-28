import React from 'react';
import { Calendar, CheckCircle2, Clock, XCircle, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { getImageUrl } from '../../config/api';
import { UserSession } from '../types';
import { NewsArticle } from '../hooks/useNewsData';

interface BeritaCardProps {
  article: NewsArticle;
  currentUser: UserSession;
  onEdit: (article: NewsArticle) => void;
  onDelete: (id: number) => void;
}

export const BeritaCard: React.FC<BeritaCardProps> = ({
  article,
  currentUser,
  onEdit,
  onDelete,
}) => {
  const isRejected = article.status_verifikasi === 'Rejected';

  const getStatusBadge = (status: 'Pending' | 'Verified' | 'Rejected') => {
    switch (status) {
      case 'Verified':
        return (
          <span className="flex items-center gap-1 bg-emerald-500/90 text-white shadow-sm backdrop-blur-md text-xs px-2.5 py-1 rounded-full font-semibold">
            <CheckCircle2 size={12} /> Terverifikasi
          </span>
        );
      case 'Rejected':
        return (
          <span className="flex items-center gap-1 bg-red-600/95 text-white shadow-sm backdrop-blur-md text-xs px-2.5 py-1 rounded-full font-semibold animate-pulse">
            <XCircle size={12} /> Status Ditolak
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 bg-amber-500/90 text-white shadow-sm backdrop-blur-md text-xs px-2.5 py-1 rounded-full font-semibold">
            <Clock size={12} /> Menunggu Verifikasi
          </span>
        );
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between ${
        isRejected ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-100'
      }`}
    >
      <div>
        <div className="relative h-44 sm:h-48 bg-slate-100">
          <img
            src={getImageUrl(article.foto)}
            alt={article.judul}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            {getStatusBadge(article.status_verifikasi)}
          </div>
          <span className="absolute bottom-3 right-3 bg-slate-900/75 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium">
            {article.kategori}
          </span>
        </div>

        {/* Warning banner for Rejected items */}
        {isRejected && (
          <div className="bg-red-50/90 border-b border-red-100 px-4 py-2 text-xs text-red-700 font-medium flex items-center gap-1.5">
            <XCircle size={14} className="shrink-0 text-red-600" />
            <span>Konten ini ditolak. Silakan edit dan ajukan ulang.</span>
          </div>
        )}

        <div className="p-4 sm:p-5 space-y-2">
          <h3 className="font-bold text-slate-800 text-base sm:text-lg leading-tight line-clamp-1">
            {article.judul}
          </h3>
          <p 
            className="text-slate-500 text-xs sm:text-sm line-clamp-2"
            dangerouslySetInnerHTML={{ __html: article.isi }}
          />

          <div className="flex justify-between items-center text-xs text-slate-400 pt-3 border-t border-slate-50 gap-2">
            <span className="flex items-center gap-1 shrink-0">
              <Calendar size={12} /> {article.tanggal}
            </span>
            <span className="truncate">Pengunggah: {article.uploader || 'Sistem'}</span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
        {isRejected ? (
          <button
            onClick={() => onEdit(article)}
            className="flex items-center gap-1.5 text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw size={14} /> Edit &amp; Ajukan Ulang
          </button>
        ) : (
          <button
            onClick={() => onEdit(article)}
            className="flex items-center gap-1.5 text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <Edit2 size={14} /> Ubah
          </button>
        )}
        <button
          onClick={() => onDelete(article.id)}
          className="flex items-center gap-1.5 text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <Trash2 size={14} /> Hapus
        </button>
      </div>
    </div>
  );
};

