import React from 'react';
import { X, Calendar, User, Clock, Share2, ArrowRight } from 'lucide-react';
import { Article } from '../types';

interface NewsDetailModalProps {
  article: Article | null;
  onClose: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
        {/* Modal Header */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0">
          <img
            src={article.image}
            alt={article.imageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors border border-white/20"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white space-y-2">
            <span className="bg-[#028C84] text-white text-xs font-bold px-3 py-1 rounded-full">
              {article.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold leading-snug drop-shadow-sm">
              {article.title}
            </h2>
          </div>
        </div>

        {/* Modal Meta Bar */}
        <div className="flex flex-wrap items-center gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            {article.date}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            Estimasi Baca: {article.readTime}
          </span>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-slate-700 dark:text-slate-300 text-base leading-relaxed">
          <p className="font-semibold text-slate-900 dark:text-slate-100 text-lg border-l-4 border-teal-500 pl-4 py-1">
            {article.summary}
          </p>
          <div className="space-y-4 whitespace-pre-line text-slate-700 dark:text-slate-300">
            {article.content}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
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
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400"
          >
            <Share2 className="w-4 h-4" />
            Bagikan Berita
          </button>

          <button
            onClick={onClose}
            className="bg-[#1E3A8A] hover:bg-[#00236f] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors flex items-center gap-1.5"
          >
            Tutup
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
