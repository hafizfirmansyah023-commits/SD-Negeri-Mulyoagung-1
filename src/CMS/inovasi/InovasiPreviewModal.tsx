import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ExternalLink,
  Lightbulb,
  Calendar,
  User,
  Clock,
  Sparkles,
  Info,
  FolderOpen,
  LayoutGrid,
  List,
} from 'lucide-react';
import { InovasiItem } from '../../types';
import { getGoogleDriveEmbedUrl, DriveViewMode } from '../../utils/helpers';

interface InovasiPreviewModalProps {
  item: InovasiItem | null;
  onClose: () => void;
}

export const InovasiPreviewModal: React.FC<InovasiPreviewModalProps> = ({ item, onClose }) => {
  const [showInfo, setShowInfo] = useState(true);
  const [viewMode, setViewMode] = useState<DriveViewMode>('grid');

  // Lock body & html scroll when modal is open and reset states
  useEffect(() => {
    if (item) {
      setShowInfo(true);
      const prevBody = document.body.style.overflow;
      const prevHtml = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = prevBody;
        document.documentElement.style.overflow = prevHtml;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [item, onClose]);

  if (!item) return null;

  const isFolder = item.link_drive?.includes('folder') || item.link_drive?.includes('embeddedfolderview');
  const embedUrl = getGoogleDriveEmbedUrl(item.link_drive, viewMode);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return null;
    }
  };

  const formattedDate = formatDate(item.created_at);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-2xl sm:rounded-3xl w-full max-w-5xl h-[90vh] sm:h-[94vh] max-h-[960px] shadow-2xl border border-slate-800 flex flex-col overflow-y-auto text-left my-auto animate-in zoom-in-95 duration-200 scrollbar-thin scrollbar-thumb-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Minimal Top Bar */}
        <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md px-3.5 sm:px-5 py-2.5 sm:py-3 border-b border-teal-800/50 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden min-w-0 mr-2">
            <div className="p-1.5 sm:p-2 rounded-xl bg-teal-500/20 border border-teal-400/30 shrink-0 text-teal-300">
              <Lightbulb size={18} className="sm:w-5 sm:h-5 text-teal-300" />
            </div>
            <div className="overflow-hidden min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="bg-teal-500/25 border border-teal-400/40 text-teal-200 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                  {item.kategori}
                </span>
                {item.inovator && (
                  <>
                    <span className="text-slate-400 text-xs hidden sm:inline">•</span>
                    <span className="text-xs text-slate-300 hidden sm:inline truncate">{item.inovator}</span>
                  </>
                )}
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-white truncate leading-tight mt-0.5" title={item.judul}>
                {item.judul}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {isFolder && (
              <div className="hidden sm:inline-flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Tampilan Grid"
                >
                  <LayoutGrid size={12} />
                  <span>Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Tampilan List"
                >
                  <List size={12} />
                  <span>List</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold backdrop-blur-md transition-all border shadow-sm cursor-pointer active:scale-95 ${
                showInfo
                  ? 'bg-teal-500/25 border-teal-400/50 text-teal-200 hover:bg-teal-500/35'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title={showInfo ? 'Sembunyikan Info' : 'Tampilkan Info'}
            >
              <Info size={13} className="sm:w-3.5 sm:h-3.5 text-teal-300" />
              <span className="hidden sm:inline">{showInfo ? 'Tutup Info' : 'Lihat Info'}</span>
            </button>

            {item.link_drive && (
              <a
                href={item.link_drive}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-[11px] sm:text-xs font-semibold backdrop-blur-md transition-all border border-teal-400/40 shadow-sm cursor-pointer active:scale-95"
                title="Buka Dokumen di Tab Baru"
              >
                <ExternalLink size={13} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Buka Drive</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer active:scale-95"
              aria-label="Tutup preview"
              title="Tutup Modal (Esc)"
            >
              <X size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </div>

        {/* Collapsible Detail & Description Section */}
        {showInfo && (
          <div className="bg-gradient-to-b from-teal-950/70 via-slate-900 to-slate-900 p-3.5 sm:p-5 text-white flex flex-col gap-3 shrink-0 border-b border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="inline-flex items-center gap-1 bg-teal-500/20 border border-teal-400/30 text-teal-200 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full">
                    <Sparkles size={11} className="text-teal-300" />
                    {item.kategori}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    item.status === 'Published'
                      ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-200'
                      : 'bg-amber-500/20 border-amber-400/30 text-amber-200'
                  }`}>
                    {item.status}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    item.status_verifikasi === 'Verified'
                      ? 'bg-teal-500/20 border-teal-400/30 text-teal-200'
                      : item.status_verifikasi === 'Rejected'
                      ? 'bg-red-500/20 border-red-400/30 text-red-200'
                      : 'bg-yellow-500/20 border-yellow-400/30 text-yellow-200'
                  }`}>
                    {item.status_verifikasi}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowInfo(false)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2 py-1 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                  title="Sembunyikan Informasi"
                >
                  <X size={12} />
                  <span>Tutup Info</span>
                </button>
              </div>

              <h2 className="font-extrabold text-base sm:text-xl lg:text-2xl leading-snug text-white tracking-tight break-words pt-1">
                {item.judul}
              </h2>
            </div>

            {/* Meta Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] sm:text-xs">
              {item.inovator && (
                <div className="flex items-center gap-1.5 bg-slate-800/70 border border-slate-700/60 rounded-lg px-2.5 py-1.5 min-w-0">
                  <User size={13} className="text-teal-400 shrink-0" />
                  <span className="text-slate-400 shrink-0">Pelaksana:</span>
                  <span className="font-semibold text-white truncate" title={item.inovator}>
                    {item.inovator}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1.5 bg-slate-800/70 border border-slate-700/60 rounded-lg px-2.5 py-1.5 min-w-0">
                <User size={13} className="text-teal-400 shrink-0" />
                <span className="text-slate-400 shrink-0">Pengunggah:</span>
                <span className="font-semibold text-teal-200 truncate" title={item.uploader || 'Admin'}>
                  {item.uploader || 'Admin'}
                </span>
              </div>

              {formattedDate && (
                <div className="flex items-center gap-1.5 bg-slate-800/70 border border-slate-700/60 rounded-lg px-2.5 py-1.5 min-w-0">
                  <Clock size={13} className="text-teal-400 shrink-0" />
                  <span className="text-slate-400 shrink-0">Tanggal:</span>
                  <span className="font-semibold text-slate-200 truncate">{formattedDate}</span>
                </div>
              )}
            </div>

            {/* Description Box */}
            {item.deskripsi && (
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-200">
                <p className="whitespace-pre-wrap break-words leading-relaxed text-slate-300">
                  {item.deskripsi}
                </p>
              </div>
            )}
          </div>
        )}

        {/* GDrive Viewer Container */}
        <div className="min-h-[60vh] sm:min-h-[75vh] h-[60vh] sm:h-[75vh] bg-slate-900 relative overflow-hidden flex flex-col shrink-0">
          {embedUrl ? (
            <div className="w-full h-full relative">
              <iframe
                src={embedUrl}
                title={item.judul}
                className="w-full h-full border-0 bg-white"
                allow="autoplay; encrypted-media"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-3 bg-slate-900 min-h-[300px]">
              <FolderOpen size={48} className="text-slate-600" />
              <p className="font-semibold text-sm text-slate-200">
                Tautan Google Drive belum tersedia atau format tidak valid.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
