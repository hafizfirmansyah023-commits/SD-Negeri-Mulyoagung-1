import React from 'react';
import { Calendar, Maximize2 } from 'lucide-react';
import { GalleryItem } from '../../types';

interface GalleryCardProps {
  item: GalleryItem;
  onClick: (item: GalleryItem) => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ item, onClick }) => (
  <div
    onClick={() => onClick(item)}
    className="group relative h-64 sm:h-72 rounded-3xl overflow-hidden cursor-pointer shadow-[0_8px_25px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(2,140,132,0.18)] hover:border-teal-300/80 transition-all duration-300 border border-white/80 flex flex-col justify-end"
  >
    <img
      src={item.image}
      alt={item.title}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 absolute inset-0"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

    <div className="absolute top-4 right-4 bg-white/25 backdrop-blur-md text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg border border-white/30 transform translate-y-1 group-hover:translate-y-0">
      <Maximize2 className="w-4 h-4" />
    </div>

    <div className="relative z-10 p-5 text-white space-y-2">
      <span className="bg-[#028C84] text-white text-[10px] font-bold px-3 py-0.5 rounded-full inline-block shadow-sm">
        {item.category}
      </span>
      <h3 className="text-base font-bold leading-snug line-clamp-1 group-hover:text-teal-200 transition-colors">
        {item.title}
      </h3>
      <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
        <Calendar className="w-3.5 h-3.5 text-teal-400" />
        <span>{item.date}</span>
      </div>
    </div>
  </div>
);
