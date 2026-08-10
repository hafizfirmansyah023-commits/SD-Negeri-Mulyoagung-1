import React from 'react';
import { Calendar, CheckCircle2, Clock, XCircle, Edit2, Trash2 } from 'lucide-react';
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
  const getStatusBadge = (status: 'Pending' | 'Verified' | 'Rejected') => {
    switch (status) {
      case 'Verified':
        return (
          <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-1 rounded-full font-semibold">
            <CheckCircle2 size={12} /> Terverifikasi
          </span>
        );
      case 'Rejected':
        return (
          <span className="flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 text-xs px-2.5 py-1 rounded-full font-semibold">
            <XCircle size={12} /> Ditolak
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2.5 py-1 rounded-full font-semibold">
            <Clock size={12} /> Menunggu Verifikasi
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
      <div>
        <div className="relative h-48 sm:h-56 bg-slate-100">
          <img
            src={getImageUrl(article.foto)}
            alt={article.judul}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-sm">
            {getStatusBadge(article.status_verifikasi)}
          </div>
          <span className="absolute bottom-3 right-3 bg-teal-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
            {article.kategori}
          </span>
        </div>
        <div className="p-4 sm:p-6 space-y-3">
          <h3 className="font-bold text-slate-800 text-lg sm:text-xl leading-snug line-clamp-2">
            {article.judul}
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm line-clamp-3">{article.isi}</p>

          <div className="flex justify-between items-center text-xs text-slate-400 pt-4 border-t border-slate-50">
            <span className="flex items-center gap-1 font-medium">
              <Calendar size={13} /> {article.tanggal}
            </span>
            <span className="font-medium">Oleh: {article.uploader || 'Sistem'}</span>
          </div>
        </div>
      </div>

      {currentUser.role === 'ADMIN' && (
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={() => onEdit(article)}
            className="flex items-center gap-1.5 text-teal-700 bg-teal-50 hover:bg-teal-100 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <Edit2 size={14} /> Ubah
          </button>
          <button
            onClick={() => onDelete(article.id)}
            className="flex items-center gap-1.5 text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <Trash2 size={14} /> Hapus
          </button>
        </div>
      )}
    </div>
  );
};
