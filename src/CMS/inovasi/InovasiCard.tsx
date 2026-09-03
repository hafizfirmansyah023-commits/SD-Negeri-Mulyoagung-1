import React from 'react';
import { Lightbulb, CheckCircle2, Clock, XCircle, Edit2, Trash2, ExternalLink, RefreshCw, Eye, Globe, FileEdit, User } from 'lucide-react';
import { getImageUrl } from '../../config/api';
import { UserSession } from '../types';
import { InovasiItem } from '../../types';

interface InovasiCardProps {
  item: InovasiItem;
  currentUser: UserSession;
  onEdit: (item: InovasiItem) => void;
  onDelete: (id: number | string) => void;
  onPreview: (item: InovasiItem) => void;
  onToggleStatus?: (id: number | string, newStatus: 'Draft' | 'Published') => void;
}

export const InovasiCard: React.FC<InovasiCardProps> = ({
  item,
  currentUser,
  onEdit,
  onDelete,
  onPreview,
  onToggleStatus,
}) => {
  const isRejected = item.status_verifikasi === 'Rejected';
  const isDraft = item.status === 'Draft';
  const isOwner = (item.uploaded_by && Number(item.uploaded_by) === Number(currentUser.id)) ||
    (item.uploader && item.uploader === currentUser.nama_penanggung_jawab);
  const canModify = currentUser.role === 'ADMIN' || isOwner;

  const getStatusVerifikasiBadge = (status: 'Pending' | 'Verified' | 'Rejected') => {
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

  const getStatusPublikasiBadge = (status: 'Draft' | 'Published') => {
    if (status === 'Draft') {
      return (
        <span className="flex items-center gap-1 bg-slate-800/90 text-amber-300 border border-amber-400/40 shadow-sm backdrop-blur-md text-[11px] px-2.5 py-1 rounded-full font-bold">
          <FileEdit size={11} /> Draft
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 bg-teal-600/95 text-white shadow-sm backdrop-blur-md text-[11px] px-2.5 py-1 rounded-full font-semibold">
        <Globe size={11} /> Published
      </span>
    );
  };

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between ${
        isRejected
          ? 'border-red-300 ring-2 ring-red-100'
          : isDraft
          ? 'border-amber-200/80 bg-amber-50/10'
          : 'border-slate-100'
      }`}
    >
      <div>
        {/* Cover image or placeholder */}
        <div
          className="relative h-44 sm:h-48 bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 overflow-hidden cursor-pointer group"
          onClick={() => onPreview(item)}
          title="Klik untuk melihat pratinjau inovasi"
        >
          {item.foto ? (
            <img
              src={getImageUrl(item.foto)}
              alt={item.judul}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-teal-200/80 p-4 text-center">
              <Lightbulb size={48} className="mb-2 text-teal-300/70 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold uppercase tracking-wider">{item.kategori}</span>
            </div>
          )}

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {getStatusVerifikasiBadge(item.status_verifikasi)}
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {getStatusPublikasiBadge(item.status)}
          </div>

          {/* Bottom Badges */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 max-w-[calc(100%-1.5rem)] flex-wrap justify-end">
            <span className="bg-teal-950/85 backdrop-blur-md text-teal-200 border border-teal-500/30 text-[11px] px-2.5 py-1 rounded-full font-medium truncate max-w-[160px]" title={item.kategori}>
              {item.kategori}
            </span>
          </div>
        </div>

        {/* Warning banner for Rejected items */}
        {isRejected && (
          <div className="bg-red-50/90 border-b border-red-100 px-4 py-2 text-xs text-red-700 font-medium flex items-center gap-1.5">
            <XCircle size={14} className="shrink-0 text-red-600" />
            <span>Inovasi ditolak. Silakan perbaiki dan ajukan ulang.</span>
          </div>
        )}

        {/* Informational banner for Draft items */}
        {isDraft && !isRejected && (
          <div className="bg-amber-50/90 border-b border-amber-200/70 px-4 py-2 text-xs text-amber-800 font-medium flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <FileEdit size={13} className="shrink-0 text-amber-600" />
              <span className="truncate">Inovasi berstatus <strong>Draft</strong> (belum tayang di website).</span>
            </div>
            {canModify && onToggleStatus && (
              <button
                type="button"
                onClick={() => onToggleStatus(item.id, 'Published')}
                className="shrink-0 text-[11px] font-bold text-teal-700 hover:text-teal-900 bg-teal-100/70 hover:bg-teal-200 px-2 py-0.5 rounded transition-colors cursor-pointer"
                title="Terbitkan inovasi ini"
              >
                Terbitkan
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-teal-700 font-semibold flex-wrap">
            <span className="bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100">{item.kategori}</span>
            {item.inovator && (
              <span className="inline-flex items-center gap-1 text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded">
                <User size={12} /> {item.inovator}
              </span>
            )}
          </div>

          <h3
            onClick={() => onPreview(item)}
            className="font-bold text-slate-800 hover:text-teal-700 transition-colors text-base sm:text-lg leading-tight line-clamp-2 cursor-pointer"
            title={item.judul}
          >
            {item.judul}
          </h3>

          <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {item.deskripsi || 'Tidak ada deskripsi inovasi.'}
          </p>

          <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-teal-600 font-semibold bg-teal-50 px-2 py-0.5 rounded">
                <ExternalLink size={12} /> Google Drive
              </span>
            </div>
            <span className="truncate">Oleh: {item.uploader || 'Admin'}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => onPreview(item)}
          className="inline-flex items-center gap-1.5 text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Eye size={14} /> Lihat Detail
        </button>

        <div className="flex items-center gap-1.5">
          {canModify ? (
            <>
              {onToggleStatus && !isRejected && (
                <button
                  type="button"
                  onClick={() => onToggleStatus(item.id, isDraft ? 'Published' : 'Draft')}
                  className={`inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                    isDraft
                      ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                  title={isDraft ? 'Terbitkan inovasi' : 'Jadikan draf'}
                >
                  {isDraft ? <Globe size={13} /> : <FileEdit size={13} />}
                  <span>{isDraft ? 'Terbitkan' : 'Draft'}</span>
                </button>
              )}

              {isRejected ? (
                <button
                  onClick={() => onEdit(item)}
                  className="inline-flex items-center gap-1.5 text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                >
                  <RefreshCw size={13} /> Edit &amp; Ajukan
                </button>
              ) : (
                <button
                  onClick={() => onEdit(item)}
                  className="inline-flex items-center gap-1 text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Edit2 size={13} /> Ubah
                </button>
              )}
              <button
                onClick={() => onDelete(item.id)}
                className="inline-flex items-center gap-1 text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 size={13} /> Hapus
              </button>
            </>
          ) : (
            <span className="text-[11px] font-medium text-slate-400 italic">
              Hanya dapat diedit oleh pembuat
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
