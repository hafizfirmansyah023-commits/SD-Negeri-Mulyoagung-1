import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ExternalLink,
  Download,
  FileText,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Calendar,
  GraduationCap,
  User,
  Clock,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { ModulItem } from '../hooks/useModulData';
import { getApiBaseUrl } from '../../config/api';
import { NativePdfViewer } from '../../components/common/NativePdfViewer';

interface ModulPreviewModalProps {
  module: ModulItem | null;
  onClose: () => void;
}

export const ModulPreviewModal: React.FC<ModulPreviewModalProps> = ({ module, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  // Lock body & html scroll when modal is open and reset states
  useEffect(() => {
    if (module) {
      setIsExpanded(false);
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
  }, [module, onClose]);

  if (!module) return null;

  const getFullPdfUrl = () => {
    if (module.sumber_tipe === 'upload' && module.file_pdf) {
      const base = getApiBaseUrl().replace(/\/$/, '');
      const path = module.file_pdf.startsWith('/') ? module.file_pdf : `/${module.file_pdf}`;
      return `${base}${path}`;
    }
    if (module.sumber_tipe === 'gdrive' && module.link_gdrive) {
      return module.link_gdrive;
    }
    return '';
  };

  const getGdriveEmbedUrl = () => {
    const rawUrl = getFullPdfUrl();
    if (!rawUrl) return '';

    let link = rawUrl;
    if (link.includes('/view')) {
      link = link.replace('/view', '/preview');
    } else if (!link.includes('/preview')) {
      link = link.endsWith('/') ? `${link}preview` : `${link}/preview`;
    }
    return link;
  };

  const directUrl = getFullPdfUrl();
  const gdriveEmbedUrl = getGdriveEmbedUrl();

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

  const formatSemester = (sem?: string) => {
    if (!sem) return '';
    if (sem.toLowerCase().includes('semester')) return sem;
    return `Semester ${sem}`;
  };

  const rawDescription = module.deskripsi ? module.deskripsi.trim() : '';
  const isLongDescription = rawDescription.length > 140;
  const formattedDate = formatDate(module.created_at);

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
              <BookOpen size={18} className="sm:w-5 sm:h-5 text-teal-300" />
            </div>
            <div className="overflow-hidden min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="bg-teal-500/25 border border-teal-400/40 text-teal-200 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                  {module.kategori}
                </span>
                <span className="text-slate-400 text-xs hidden sm:inline">•</span>
                <span className="text-xs text-slate-300 hidden sm:inline truncate">{module.mata_pelajaran}</span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-white truncate leading-tight mt-0.5" title={module.judul}>
                {module.judul}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold backdrop-blur-md transition-all border shadow-sm cursor-pointer active:scale-95 ${
                showInfo
                  ? 'bg-teal-500/25 border-teal-400/50 text-teal-200 hover:bg-teal-500/35'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title={showInfo ? 'Sembunyikan Informasi Modul' : 'Tampilkan Informasi Modul'}
            >
              <Info size={13} className="sm:w-3.5 sm:h-3.5 text-teal-300" />
              <span className="hidden sm:inline">{showInfo ? 'Tutup Info' : 'Lihat Info'}</span>
            </button>

            {directUrl && (
              <a
                href={directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-[11px] sm:text-xs font-semibold backdrop-blur-md transition-all border border-teal-400/40 shadow-sm cursor-pointer active:scale-95"
                title="Buka Dokumen di Tab Baru / Unduh"
              >
                <Download size={13} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Buka Dokumen</span>
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
            
            {/* Badges, Title & Quick Close Info Button */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="inline-flex items-center gap-1 bg-teal-500/20 border border-teal-400/30 text-teal-200 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full">
                    <Sparkles size={11} className="text-teal-300" />
                    {module.kategori}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 text-slate-200 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full">
                    <GraduationCap size={11} className="text-teal-400" />
                    {module.kelas}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full">
                    {formatSemester(module.semester)}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-indigo-950/60 border border-indigo-500/30 text-indigo-200 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full">
                    <Calendar size={11} className="text-indigo-300" />
                    TA {module.tahun_ajaran}
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
                {module.judul}
              </h2>
            </div>

            {/* Meta Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] sm:text-xs">
              <div className="flex items-center gap-1.5 bg-slate-800/70 border border-slate-700/60 rounded-lg px-2.5 py-1.5 min-w-0">
                <BookOpen size={13} className="text-teal-400 shrink-0" />
                <span className="text-slate-400 shrink-0">Mapel:</span>
                <span className="font-semibold text-white truncate" title={module.mata_pelajaran}>
                  {module.mata_pelajaran}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-800/70 border border-slate-700/60 rounded-lg px-2.5 py-1.5 min-w-0">
                <User size={13} className="text-teal-400 shrink-0" />
                <span className="text-slate-400 shrink-0">Pengunggah:</span>
                <span className="font-semibold text-teal-200 truncate" title={module.uploader || 'Guru SDN 1 Mulyoagung'}>
                  {module.uploader || 'Guru'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-800/70 border border-slate-700/60 rounded-lg px-2.5 py-1.5 min-w-0">
                <Layers size={13} className="text-teal-400 shrink-0" />
                <span className="text-slate-400 shrink-0">Sumber:</span>
                <span className="font-semibold text-emerald-300 truncate">
                  {module.sumber_tipe === 'gdrive' ? 'Google Drive' : 'File PDF'}
                </span>
              </div>

              {formattedDate ? (
                <div className="flex items-center gap-1.5 bg-slate-800/70 border border-slate-700/60 rounded-lg px-2.5 py-1.5 min-w-0">
                  <Clock size={13} className="text-teal-400 shrink-0" />
                  <span className="text-slate-400 shrink-0">Tanggal:</span>
                  <span className="font-semibold text-slate-200 truncate">{formattedDate}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-slate-800/70 border border-slate-700/60 rounded-lg px-2.5 py-1.5 min-w-0">
                  <Calendar size={13} className="text-teal-400 shrink-0" />
                  <span className="text-slate-400 shrink-0">Semester:</span>
                  <span className="font-semibold text-slate-200 truncate">{module.semester}</span>
                </div>
              )}
            </div>

            {/* Description Box with See More / See Less */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-teal-300 font-semibold text-xs">
                <FileText size={13} className="text-teal-400" />
                <span>Deskripsi Modul:</span>
              </div>

              {rawDescription ? (
                <div className="text-slate-300 leading-relaxed pt-0.5">
                  {isLongDescription ? (
                    <div>
                      <div className="whitespace-pre-wrap break-words text-slate-200">
                        {isExpanded ? rawDescription : `${rawDescription.slice(0, 140)}...`}
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-1 inline-flex items-center gap-1 text-teal-300 hover:text-white font-bold text-xs underline cursor-pointer transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            <span>See less</span>
                            <ChevronUp size={13} />
                          </>
                        ) : (
                          <>
                            <span>See more</span>
                            <ChevronDown size={13} />
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap break-words text-slate-200">{rawDescription}</p>
                  )}
                </div>
              ) : (
                <p className="text-slate-400 text-xs italic">
                  Tidak ada deskripsi tambahan untuk modul pembelajaran ini.
                </p>
              )}
            </div>
          </div>
        )}

        {/* PDF / GDrive Viewer Container (Fills viewport when scrolled) */}
        <div className="min-h-[75vh] sm:min-h-[82vh] h-[75vh] sm:h-[82vh] bg-slate-900 relative overflow-hidden flex flex-col shrink-0">
          {module.sumber_tipe === 'gdrive' && gdriveEmbedUrl ? (
            <div className="w-full h-full relative">
              <iframe
                src={gdriveEmbedUrl}
                title={module.judul}
                className="w-full h-full border-0 bg-white"
                allow="autoplay; encrypted-media"
              />
            </div>
          ) : module.sumber_tipe === 'upload' && directUrl ? (
            <NativePdfViewer pdfUrl={directUrl} title={module.judul} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-3 bg-slate-900 min-h-[300px]">
              <FileText size={48} className="text-slate-600" />
              <p className="font-semibold text-sm text-slate-200">
                File dokumen PDF belum tersedia atau tautan tidak valid.
              </p>
              {directUrl && (
                <a
                  href={directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm"
                >
                  <ExternalLink size={14} /> Coba Buka Link Langsung
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
