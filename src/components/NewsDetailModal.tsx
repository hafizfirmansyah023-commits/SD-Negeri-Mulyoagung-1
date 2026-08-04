import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, User, Share2, ArrowRight } from 'lucide-react';
import { Article } from '../types';

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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl lg:max-w-3xl max-h-[85vh] sm:max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200/80 dark:border-slate-800 my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header / Banner */}
        <div className="relative h-56 sm:h-72 lg:h-80 w-full overflow-hidden shrink-0">
          <img
            src={article.image}
            alt={article.imageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors border border-white/20 shadow-md cursor-pointer z-10"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-5 right-5 sm:left-6 sm:right-6 text-white space-y-2">
            <span className="bg-[#028C84] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {article.category}
            </span>
            <h2 className="text-lg sm:text-2xl font-extrabold leading-snug drop-shadow-md">
              {article.title}
            </h2>
          </div>
        </div>

        {/* Modal Meta Bar */}
        <div className="flex flex-wrap items-center gap-4 px-5 sm:px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#028C84]" />
            {article.date}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#028C84]" />
            {article.author}
          </span>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-4 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          <p className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg border-l-4 border-[#028C84] pl-4 py-1 bg-teal-50/50 dark:bg-teal-950/30 rounded-r-xl">
            {article.summary}
          </p>
          <div className="space-y-4 whitespace-pre-line text-slate-700 dark:text-slate-300">
            {article.content}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
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
            className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#028C84] transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Bagikan Berita</span>
          </button>

          <button
            onClick={onClose}
            className="bg-[#1E3A8A] hover:bg-[#00236f] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>Tutup</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
