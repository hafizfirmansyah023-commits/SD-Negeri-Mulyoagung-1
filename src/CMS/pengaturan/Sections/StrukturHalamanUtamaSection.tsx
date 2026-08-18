import React from 'react';
import { GripVertical } from 'lucide-react';
import { HomepageSection } from '../types';

interface StrukturHalamanUtamaSectionProps {
  homepageSections: HomepageSection[];
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onUpdate: (index: number, field: string, value: any) => void;
  draggedSectionIndex: number | null;
}

export const StrukturHalamanUtamaSection: React.FC<StrukturHalamanUtamaSectionProps> = ({
  homepageSections,
  onDragStart,
  onDragOver,
  onDrop,
  onUpdate,
  draggedSectionIndex,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
      <div>
        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <span>🏠 Struktur & Urutan Halaman Utama</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Geser (drag & drop) kartu di bawah ini untuk mengatur urutan vertikal section di halaman utama. Gunakan centang/checkbox untuk menyembunyikan atau menampilkan section tersebut.
        </p>
      </div>

      <div className="space-y-4">
        {homepageSections.map((sec, index) => (
          <div
            key={sec.key}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, index)}
            className={`flex flex-col md:flex-row items-start md:items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 cursor-grab active:cursor-grabbing transition-all ${
              draggedSectionIndex === index ? 'opacity-40 border-teal-500 scale-[0.98]' : 'hover:border-teal-400'
            }`}
          >
            <div className="flex items-center gap-3 shrink-0">
              <GripVertical className="text-slate-400 shrink-0" size={20} />
              <input
                type="checkbox"
                checked={sec.is_active}
                onChange={(e) => onUpdate(index, 'is_active', e.target.checked)}
                className="w-5 h-5 rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
              />
              <span className="font-bold text-sm text-slate-800 w-32 capitalize">
                {sec.key}
              </span>
            </div>

            {sec.key !== 'hero' && sec.key !== 'stats' && sec.key !== 'sambutan' ? (
              <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                <div>
                  <input
                    type="text"
                    placeholder="Judul Section"
                    value={sec.judul}
                    onChange={(e) => onUpdate(index, 'judul', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-teal-600 focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Subjudul Section (Deskripsi Singkat)"
                    value={sec.subjudul}
                    onChange={(e) => onUpdate(index, 'subjudul', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700 focus:ring-1 focus:ring-teal-600 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-grow text-xs text-slate-500 italic">
                Section ini tidak memiliki judul kustom (konten diatur otomatis atau di tab Konten Utama).
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
