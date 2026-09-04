import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, ArrowRight, User } from 'lucide-react';
import { getImageUrl } from '../../config/api';
import { InovasiItem } from '../../types';

interface InovasiCardProps {
  item: InovasiItem;
}

export const InovasiCard: React.FC<InovasiCardProps> = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/inovasi/${item.id}`);
  };

  return (
    <article
      onClick={handleClick}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-200/80 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1"
    >
      <div>
        {/* Thumbnail / Cover */}
        <div className="relative h-48 sm:h-52 bg-gradient-to-br from-teal-800 via-teal-900 to-slate-950 overflow-hidden">
          {item.foto ? (
            <img
              src={getImageUrl(item.foto)}
              alt={item.judul}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-teal-200/80 p-4 text-center">
              <Lightbulb size={52} className="mb-2 text-teal-300/60 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-200/90">{item.kategori}</span>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-teal-700/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
              {item.kategori}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <span className="bg-slate-900/80 backdrop-blur-md text-teal-300 border border-teal-500/30 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <ArrowRight size={10} /> Detail
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 space-y-2">
          {item.inovator && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <User size={13} className="text-teal-600" />
              <span className="truncate">{item.inovator}</span>
            </div>
          )}

          <h3 className="font-bold text-slate-800 text-base sm:text-lg leading-tight line-clamp-2 group-hover:text-[#028C84] transition-colors">
            {item.judul}
          </h3>

          <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {item.deskripsi || 'Dokumentasi inovasi sekolah berbasis foto dan video interaktif.'}
          </p>
        </div>
      </div>

      {/* Footer Action */}
      <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
        <span className="truncate text-xs">Oleh: {item.uploader || 'SDN 1 Mulyoagung'}</span>
        
        <div className="flex items-center gap-1 text-teal-600 font-semibold group-hover:translate-x-0.5 transition-transform shrink-0">
          <span className="text-[11px] group-hover:underline">Eksplorasi Inovasi</span>
          <ArrowRight size={12} />
        </div>
      </div>
    </article>
  );
};
