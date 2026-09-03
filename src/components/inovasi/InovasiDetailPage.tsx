import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Lightbulb, ArrowLeft, ExternalLink, Calendar, User, Share2, Check, FolderOpen, LayoutGrid, List } from 'lucide-react';
import { useInovasiDetail } from '../../hooks/useInovasiData';
import { getGoogleDriveEmbedUrl, DriveViewMode } from '../../utils/helpers';

export const InovasiDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { inovasi, loading, error } = useInovasiDetail(id);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<DriveViewMode>('grid');

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: inovasi?.judul || 'Inovasi SDN 1 Mulyoagung',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
          <p className="text-sm text-slate-500 font-medium">Memuat dokumentasi inovasi...</p>
        </div>
      </div>
    );
  }

  if (error || !inovasi) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <Lightbulb size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Inovasi Tidak Ditemukan</h2>
          <p className="text-sm text-slate-500">
            {error || 'Dokumentasi inovasi yang Anda cari mungkin telah dihapus atau belum dipublikasikan.'}
          </p>
          <Link
            to="/inovasi"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft size={16} /> Kembali ke Inovasi
          </Link>
        </div>
      </div>
    );
  }

  const isFolder = inovasi.link_drive.includes('folder') || inovasi.link_drive.includes('embeddedfolderview');
  const embedUrl = getGoogleDriveEmbedUrl(inovasi.link_drive, viewMode);

  // Default description if not set
  const defaultDescription = `Dokumentasi inovasi sekolah berbasis ${inovasi.kategori.toLowerCase()} dan google drive. Silakan eksplorasi konten di dalam folder/file tersebut.`;
  const descriptionContent = inovasi.deskripsi || defaultDescription;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-teal-600 selection:text-white">
      {/* Top Bar Header with theme gradient */}
      <header className="bg-gradient-to-r from-[#073632] to-[#103632] text-white shadow-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/inovasi"
            className="p-2 text-teal-200 hover:text-white bg-white/10 hover:bg-white/15 rounded-xl transition-colors shrink-0"
            title="Kembali ke daftar inovasi"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block truncate">
              {inovasi.kategori}
            </span>
            <h1 className="text-xs sm:text-sm font-bold text-slate-100 truncate" title={inovasi.judul}>
              {inovasi.judul}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold rounded-xl border border-teal-500/30 transition-colors cursor-pointer"
            title="Bagikan inovasi"
          >
            {copied ? <Check size={14} className="text-emerald-300" /> : <Share2 size={14} />}
            <span className="hidden sm:inline">{copied ? 'Tersalin' : 'Bagikan'}</span>
          </button>
          <a
            href={inovasi.link_drive}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-teal-500 to-[#028C84] hover:from-teal-400 hover:to-[#006a64] text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">Buka di Google Drive</span>
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Info & Description Box with Website Theme - Moved above iframe */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="inline-block bg-teal-50 text-[#028C84] border border-teal-200 text-xs font-bold px-3 py-1 rounded-full mb-2">
                {inovasi.kategori}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">{inovasi.judul}</h2>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500">
              {inovasi.inovator && (
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <User size={14} className="text-teal-600" />
                  <span>Pelaksana: <strong className="text-slate-800">{inovasi.inovator}</strong></span>
                </div>
              )}
              {inovasi.created_at && (
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <Calendar size={14} className="text-teal-600" />
                  <span>{new Date(inovasi.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description content */}
          <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {descriptionContent}
          </div>
        </div>

        {/* Drive Iframe Container */}
        <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden relative flex-1 flex flex-col min-h-[60vh] sm:min-h-[75vh] md:min-h-[80vh]">
          {/* Iframe top status header & Grid/List switcher */}
          <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-medium truncate">
              <FolderOpen size={16} className="text-teal-700 shrink-0" />
              <span className="truncate">Dokumentasi Google Drive Viewer</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Grid / List view mode switcher (if folder) */}
              {isFolder && (
                <div className="inline-flex items-center bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Tampilan Grid / Thumbnail Kotak"
                  >
                    <LayoutGrid size={13} />
                    <span className="hidden min-[480px]:inline">Grid</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Tampilan List / Baris"
                  >
                    <List size={13} />
                    <span className="hidden min-[480px]:inline">List</span>
                  </button>
                </div>
              )}

              <a
                href={inovasi.link_drive}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 shrink-0"
              >
                <span>Buka Tab Penuh</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {embedUrl ? (
            <iframe
              key={embedUrl}
              src={embedUrl}
              title={inovasi.judul}
              className="w-full h-full flex-1 min-h-[55vh] sm:min-h-[70vh] md:min-h-[75vh] border-0 bg-white"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center min-h-[55vh]">
              <Lightbulb size={48} className="text-slate-400 mb-3" />
              <p className="text-slate-600 text-sm">Tautan Google Drive tidak dapat disematkan langsung.</p>
              <a
                href={inovasi.link_drive}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 shadow-sm"
              >
                <ExternalLink size={14} /> Buka Google Drive
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
