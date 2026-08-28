import React from 'react';
import { BookOpen, CheckCircle2, Clock, XCircle, Edit2, Trash2, FileText, ExternalLink, RefreshCw, Eye } from 'lucide-react';
import { getImageUrl, getApiBaseUrl } from '../../config/api';
import { UserSession } from '../types';
import { ModulItem } from '../hooks/useModulData';

interface ModulCardProps {
  module: ModulItem;
  currentUser: UserSession;
  onEdit: (module: ModulItem) => void;
  onDelete: (id: number) => void;
  onPreview: (module: ModulItem) => void;
}

export const ModulCard: React.FC<ModulCardProps> = ({
  module,
  currentUser,
  onEdit,
  onDelete,
  onPreview,
}) => {
  const isRejected = module.status_verifikasi === 'Rejected';
  const canModify = currentUser.role === 'ADMIN' || currentUser.id === module.uploaded_by;

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

  const getFullPdfUrl = (path?: string | null) => {
    if (!path) return '';
    return `${getApiBaseUrl()}/${path.replace(/^\/+/, '')}`;
  };

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between ${
        isRejected ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-100'
      }`}
    >
      <div>
        {/* Cover image or placeholder */}
        <div className="relative h-44 sm:h-48 bg-gradient-to-br from-teal-700 to-slate-900 overflow-hidden">
          {module.foto ? (
            <img
              src={getImageUrl(module.foto)}
              alt={module.judul}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-teal-200/80 p-4 text-center">
              <BookOpen size={48} className="mb-2 text-teal-300/60" />
              <span className="text-xs font-semibold uppercase tracking-wider">{module.mata_pelajaran}</span>
            </div>
          )}

          <div className="absolute top-3 left-3">
            {getStatusBadge(module.status_verifikasi)}
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-full font-medium">
              {module.kelas}
            </span>
            <span className="bg-teal-600/90 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-full font-medium">
              {module.semester}
            </span>
          </div>
        </div>

        {/* Warning banner for Rejected items */}
        {isRejected && (
          <div className="bg-red-50/90 border-b border-red-100 px-4 py-2 text-xs text-red-700 font-medium flex items-center gap-1.5">
            <XCircle size={14} className="shrink-0 text-red-600" />
            <span>Modul ditolak. Silakan perbaiki dan ajukan ulang.</span>
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-teal-700 font-semibold">
            <span className="bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100">{module.kategori}</span>
            <span>•</span>
            <span className="text-slate-500 font-medium">TA {module.tahun_ajaran}</span>
          </div>

          <h3 className="font-bold text-slate-800 text-base sm:text-lg leading-tight line-clamp-2">
            {module.judul}
          </h3>

          <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {module.deskripsi || 'Tidak ada deskripsi modul.'}
          </p>

          <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              {module.sumber_tipe === 'upload' ? (
                <span className="inline-flex items-center gap-1 text-teal-600 font-semibold bg-teal-50 px-2 py-0.5 rounded">
                  <FileText size={12} /> PDF Upload
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                  <ExternalLink size={12} /> Google Drive
                </span>
              )}
            </div>
            <span className="truncate">Oleh: {module.uploader || 'Guru'}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onPreview(module)}
          className="inline-flex items-center gap-1.5 text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Eye size={14} /> Lihat Modul
        </button>

        <div className="flex items-center gap-1.5">
          {canModify && (
            <>
              {isRejected ? (
                <button
                  onClick={() => onEdit(module)}
                  className="inline-flex items-center gap-1.5 text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                >
                  <RefreshCw size={13} /> Edit &amp; Ajukan
                </button>
              ) : (
                <button
                  onClick={() => onEdit(module)}
                  className="inline-flex items-center gap-1 text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Edit2 size={13} /> Ubah
                </button>
              )}
              <button
                onClick={() => onDelete(module.id)}
                className="inline-flex items-center gap-1 text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 size={13} /> Hapus
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
