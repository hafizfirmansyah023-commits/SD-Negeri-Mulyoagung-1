import React from 'react';
import { Calendar, Maximize2, Share2 } from 'lucide-react';
import { GalleryItem } from '../../types';

interface GalleryCardProps {
  item: GalleryItem;
  onClick: (item: GalleryItem) => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ item, onClick }) => {
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description || item.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan galeri berhasil disalin!');
    }
  };

  return (
    <div
      onClick={() => onClick(item)}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-200/80 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1"
    >
      <div>
        {/* Container Foto - Samakan rasio & tinggi dengan CMS GaleriCard (h-44 sm:h-48) */}
        <div className="relative h-44 sm:h-48 bg-slate-100 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute bottom-3 right-3 bg-slate-900/75 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
            {item.category}
          </span>
          <div className="absolute top-3 right-3 bg-white/30 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg border border-white/30">
            <Maximize2 className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Detail Konten */}
        <div className="p-4 sm:p-5 space-y-2">
          <h3 className="font-bold text-slate-800 text-base sm:text-lg leading-tight line-clamp-1 group-hover:text-[#028C84] transition-colors">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer Tanggal & Aksi Bagikan */}
      <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Calendar size={13} className="text-teal-600 shrink-0" />
          <span>{item.date}</span>
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#028C84] transition-colors p-1 rounded hover:bg-slate-100 cursor-pointer"
            title="Bagikan Dokumentasi"
          >
            <Share2 size={13} />
            <span>Bagikan</span>
          </button>
          <span className="text-[11px] text-teal-600 font-semibold group-hover:underline">Lihat Detail</span>
        </div>
      </div>
    </div>
  );
};

