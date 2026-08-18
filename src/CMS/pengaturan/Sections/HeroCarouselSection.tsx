import React from 'react';
import { Image as ImageIcon, Plus, GripVertical, Edit2, Trash2 } from 'lucide-react';
import { HeroCarouselItem } from '../types';
import { getImageUrl } from '../../../config/api';

interface HeroCarouselSectionProps {
  heroSlides: HeroCarouselItem[];
  onAdd: () => void;
  onEdit: (item: HeroCarouselItem) => void;
  onDelete: (id: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  draggedHeroIndex: number | null;
}

export const HeroCarouselSection: React.FC<HeroCarouselSectionProps> = ({
  heroSlides,
  onAdd,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  draggedHeroIndex,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-teal-600" />
            Kelola Foto Carousel Hero Header (Landscape)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Foto-foto ini akan tampil bergantian pada slider di bagian kanan Hero utama. Seluruh foto berukuran lanskap seragam.
          </p>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Tambah Foto Hero</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {heroSlides.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, index)}
            className={`bg-slate-50 rounded-2xl border transition-all duration-200 group flex flex-col cursor-grab active:cursor-grabbing ${
              draggedHeroIndex === index
                ? 'opacity-40 border-teal-500 scale-95 ring-2 ring-teal-500/30'
                : 'border-slate-200 hover:border-teal-400 hover:shadow-md'
            }`}
          >
            {/* Landscape Photo Container */}
            <div className="relative w-full aspect-video bg-slate-900 overflow-hidden rounded-t-2xl">
              <img
                src={getImageUrl(item.foto)}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
              />

              {/* Drag Handle Overlay Tag */}
              <div className="absolute top-2.5 left-2.5 bg-black/65 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                <GripVertical size={12} className="text-teal-400" />
                <span>Geser #{item.urutan}</span>
              </div>

              <div className="absolute top-2.5 right-2.5 bg-teal-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md">
                {item.tag || 'Hero Slide'}
              </div>
            </div>

            <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                  {item.caption}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-slate-400">
                <span className="text-[10px] font-semibold flex items-center gap-1">
                  <GripVertical size={12} /> Drag &amp; Drop
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="p-1.5 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
                    title="Edit Foto & Caption"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
                    title="Hapus Foto"
                  >
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {heroSlides.length === 0 && (
          <div className="col-span-full py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <ImageIcon className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-bold text-slate-700">Belum ada foto carousel hero yang diunggah.</p>
            <p className="text-xs text-slate-500 mt-1">Sistem saat ini menggunakan foto bawaan default.</p>
          </div>
        )}
      </div>
    </div>
  );
};
