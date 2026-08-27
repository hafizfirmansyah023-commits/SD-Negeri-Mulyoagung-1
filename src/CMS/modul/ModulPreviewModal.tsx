import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Download, FileText, BookOpen } from 'lucide-react';
import { ModulItem } from '../hooks/useModulData';
import { getApiBaseUrl } from '../../config/api';
import { NativePdfViewer } from '../../components/common/NativePdfViewer';

interface ModulPreviewModalProps {
  module: ModulItem | null;
  onClose: () => void;
}

export const ModulPreviewModal: React.FC<ModulPreviewModalProps> = ({ module, onClose }) => {
  // Lock body & html scroll when modal is open
  useEffect(() => {
    if (module) {
      const prevBody = document.body.style.overflow;
      const prevHtml = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevBody;
        document.documentElement.style.overflow = prevHtml;
      };
    }
  }, [module]);

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

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl w-full max-w-5xl h-[94vh] sm:h-[92vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-left my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-950 p-3 sm:p-4 md:p-5 text-white flex justify-between items-center shrink-0 border-b border-teal-700/50">
          <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden min-w-0">
            <div className="p-2 sm:p-2.5 rounded-xl bg-teal-500/20 border border-teal-400/30 shrink-0 text-teal-300">
              <BookOpen size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div className="overflow-hidden min-w-0">
              <h3 className="font-bold text-xs sm:text-base lg:text-lg leading-tight truncate text-white">
                {module.judul}
              </h3>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-teal-200/90 mt-0.5 sm:mt-1">
                <span className="font-semibold text-teal-300 truncate">{module.mata_pelajaran}</span>
                <span>•</span>
                <span>{module.kelas}</span>
                <span>•</span>
                <span>Semester {module.semester}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-2">
            {directUrl && (
              <a
                href={directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-teal-600/90 hover:bg-teal-600 text-white text-[11px] sm:text-xs font-semibold backdrop-blur-md transition-all border border-teal-400/40 shadow-sm cursor-pointer"
                title="Buka Dokumen di Tab Baru / Unduh"
              >
                <Download size={13} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Buka Dokumen</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Tutup preview"
            >
              <X size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Container */}
        <div className="flex-1 bg-slate-900 relative overflow-hidden flex flex-col min-h-0">
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
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-3 bg-slate-900">
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

        {/* Footer Info & Close Action */}
        <div className="p-2.5 sm:p-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden min-w-0">
            <span className="bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800 font-bold px-2 py-0.5 rounded-full shrink-0">
              {module.kategori}
            </span>
            <span className="text-slate-600 dark:text-slate-400 truncate">
              Oleh: <strong className="text-slate-800 dark:text-slate-200">{module.uploader || 'Guru'}</strong>
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-colors cursor-pointer shrink-0"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

