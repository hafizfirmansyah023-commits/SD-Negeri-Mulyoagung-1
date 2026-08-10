import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { GalleryItem } from '../../types';

interface PhotoLightboxModalProps {
  photo: GalleryItem | null;
  onClose: () => void;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({ photo, onClose }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (photo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [photo]);

  if (!photo) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl lg:max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-800 my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 sm:p-2.5 rounded-full bg-slate-950/80 hover:bg-slate-950 text-white transition-colors border border-white/20 shadow-md cursor-pointer"
          aria-label="Tutup Foto"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Area Gambar */}
        {/* min-h-0 dan flex-shrink penting agar gambar mau mengecil jika layar sempit */}
        <div className="w-full flex-shrink overflow-hidden flex items-center justify-center bg-black min-h-0 relative">
          <img 
            src={photo.image} 
            alt={photo.title} 
            className="w-auto h-auto max-w-full max-h-[55vh] sm:max-h-[70vh] object-contain" 
          />
        </div>

        {/* Area Teks (Bisa di-scroll jika deskripsi sangat panjang) */}
        {/* Padding dan teks dirampingkan untuk mobile */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white space-y-2 sm:space-y-3 overflow-y-auto shrink-0">
          <div className="flex items-center justify-between">
            <span className="bg-[#028C84] text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-sm">
              {photo.category}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
              {photo.date}
            </span>
          </div>
          
          <h3 className="text-base sm:text-xl font-bold leading-snug text-slate-100">
            {photo.title}
          </h3>
          
          {photo.description && (
            <p className="text-[11px] sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {photo.description}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};