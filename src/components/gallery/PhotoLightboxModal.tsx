import React from 'react';
import { X } from 'lucide-react';
import { GalleryItem } from '../../types';

interface PhotoLightboxModalProps {
  photo: GalleryItem | null;
  onClose: () => void;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-950/80 hover:bg-slate-950 text-white transition-colors border border-white/20 cursor-pointer"
          aria-label="Tutup Foto"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="max-h-[75vh] w-full overflow-hidden flex items-center justify-center bg-black">
          <img src={photo.image} alt={photo.title} className="max-h-[75vh] w-auto object-contain" />
        </div>

        <div className="p-6 bg-slate-900 text-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="bg-[#028C84] text-white text-xs font-bold px-3 py-1 rounded-full">
              {photo.category}
            </span>
            <span className="text-xs text-slate-400">{photo.date}</span>
          </div>
          <h3 className="text-xl font-bold">{photo.title}</h3>
          <p className="text-sm text-slate-300">{photo.description}</p>
        </div>
      </div>
    </div>
  );
};
