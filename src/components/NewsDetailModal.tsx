import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Share2, ArrowRight } from 'lucide-react';
import { Article } from '../types';
import { stripHtml } from '../utils/helpers';

interface NewsDetailModalProps {
  article: Article | null;
  onClose: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ article, onClose }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (article) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [article]);

  if (!article) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl lg:max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200/80 dark:border-slate-800 my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header / Banner */}
        {/* Tinggi banner disesuaikan agar tidak terlalu memakan tempat di HP */}
        <div className="relative h-44 sm:h-72 lg:h-80 w-full overflow-hidden shrink-0">
          <img
            src={article.image}
            alt={article.imageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors border border-white/20 shadow-md cursor-pointer z-10"
            aria-label="Tutup Modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6 text-white space-y-1.5 sm:space-y-2">
            <span className="bg-[#028C84] text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-sm">
              {article.category}
            </span>
            <h2 className="text-base sm:text-2xl font-extrabold leading-snug drop-shadow-md">
              {article.title}
            </h2>
          </div>
        </div>

        {/* Modal Meta Bar */}
        <div className="flex flex-wrap items-center gap-4 px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#028C84]" />
            {article.date}
          </span>
        </div>

        {/* Modal Content Body */}
        {/* Padding dan ukuran teks dirampingkan untuk mobile */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-3 sm:space-y-4 text-slate-700 dark:text-slate-300 text-xs sm:text-base leading-relaxed">
          <p className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-lg border-l-3 sm:border-l-4 border-[#028C84] pl-3 sm:pl-4 py-1.5 bg-teal-50/50 dark:bg-teal-950/30 rounded-r-xl">
            {stripHtml(article.summary)}
          </p>
          <div 
            className="space-y-3 sm:space-y-4 text-slate-700 dark:text-slate-300 text-xs sm:text-base leading-relaxed prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: article.title,
                  text: article.summary,
                  url: window.location.href,
                });
              } else {
                alert('Tautan berita berhasil disalin!');
              }
            }}
            className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#028C84] transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Bagikan</span>
          </button>

          <button
            onClick={onClose}
            className="bg-[#1E3A8A] hover:bg-[#00236f] text-white text-[11px] sm:text-xs font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>Tutup</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};