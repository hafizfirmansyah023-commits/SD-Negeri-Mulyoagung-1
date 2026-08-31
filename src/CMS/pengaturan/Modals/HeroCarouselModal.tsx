import React from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { HeroCarouselItem } from '../types';
import { ImageUploadField, ImageUploadPayload } from '../../components/ImageUploadField';
import { getImageUrl } from '../../../config/api';

interface HeroCarouselModalProps {
  open: boolean;
  editing: HeroCarouselItem | null;
  caption: string;
  tag: string;
  urutan: number;
  onChangeCaption: (val: string) => void;
  onChangeTag: (val: string) => void;
  onChangeUrutan: (val: number) => void;
  onFotoSelectionChange: (payload: ImageUploadPayload) => void;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const HeroCarouselModal: React.FC<HeroCarouselModalProps> = ({
  open,
  editing,
  caption,
  tag,
  urutan,
  onChangeCaption,
  onChangeTag,
  onChangeUrutan,
  onFotoSelectionChange,
  onSave,
  onClose,
}) => {
  React.useEffect(() => {
    if (open) {
      const prevBody = document.body.style.overflow;
      const prevHtml = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevBody;
        document.documentElement.style.overflow = prevHtml;
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200 my-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <ImageIcon className="text-teal-600" size={18} />
            {editing ? 'Edit Foto Carousel Hero' : 'Tambah Foto Carousel Hero Baru'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <ImageUploadField
              label="Foto Carousel Hero (Landscape 16:9) *"
              hint={`Format: Gambar (JPG, PNG, WEBP, GIF). Maksimal 10MB. ${editing ? 'Biarkan kosong jika tidak ingin mengubah foto.' : ''}`}
              currentImage={editing?.foto ? getImageUrl(editing.foto) : undefined}
              currentOriginalImage={
                editing?.foto_original
                  ? getImageUrl(editing.foto_original)
                  : editing?.foto
                    ? getImageUrl(editing.foto)
                    : undefined
              }
              circular={false}
              previewShape="rounded"
              aspectRatio={16 / 9}
              outputWidth={1280}
              onFileChange={onFotoSelectionChange}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Caption / Keterangan Singkat *
            </label>
            <input
              type="text"
              required
              placeholder="MA ONE BERGELORAA!!!"
              value={caption}
              onChange={(e) => onChangeCaption(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Urutan Tampil
            </label>
            <input
              type="number"
              min="1"
              value={urutan}
              onChange={(e) => onChangeUrutan(parseInt(e.target.value) || 1)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs font-bold text-slate-800"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Simpan Foto Hero
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
