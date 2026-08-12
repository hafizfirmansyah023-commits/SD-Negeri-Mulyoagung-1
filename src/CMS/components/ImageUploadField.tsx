import React, { useEffect, useRef, useState } from 'react';
import { Check, Crop, X } from 'lucide-react';
import { validateImageFile } from '../utils/fileValidation';
import { ImageCropModal, type CropRatioOption } from './ImageCropModal';

export interface ImageUploadPayload {
  original: File | null;
  cropped: File | null;
}

interface ImageUploadFieldProps {
  label?: string;
  hint?: string;
  currentImage?: string;
  currentOriginalImage?: string;
  onFileChange: (payload: ImageUploadPayload) => void;
  aspectRatio?: number;
  circular?: boolean;
  outputWidth?: number;
  outputType?: string;
  previewShape?: 'circle' | 'rounded';
  ratioOptions?: CropRatioOption[];
}

interface SelectedImage {
  original: File | null;
  file: File;
  url: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  hint,
  currentImage,
  currentOriginalImage,
  onFileChange,
  aspectRatio = 1,
  circular = true,
  outputWidth = 512,
  outputType = 'image/png',
  previewShape = 'circle',
  ratioOptions,
}) => {
  const [selected, setSelected] = useState<SelectedImage | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropName, setCropName] = useState('foto');
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const cropSrcRef = useRef<string | null>(null);
  const selectedUrlRef = useRef<string | null>(null);

  cropSrcRef.current = cropSrc;

  useEffect(() => {
    return () => {
      if (selectedUrlRef.current) URL.revokeObjectURL(selectedUrlRef.current);
    };
  }, []);

  const isRemoteSrc = (src: string | null) =>
    !!src && (src.startsWith('http') || src.startsWith('data:') || src.startsWith('backend/'));

  const closeCrop = () => {
    setCropOpen(false);
    if (cropSrcRef.current && !isRemoteSrc(cropSrcRef.current)) {
      URL.revokeObjectURL(cropSrcRef.current);
    }
    setCropSrc(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = validateImageFile(input.files?.[0] || null, input);
    if (!file) return;

    input.value = '';
    if (cropSrcRef.current) closeCrop();
    setOriginalFile(file);
    setCropName(file.name);
    setCropSrc(URL.createObjectURL(file));
    setCropOpen(true);
  };

  const startReCrop = () => {
    const source = currentOriginalImage || currentImage;
    if (!source) return;
    if (cropSrcRef.current) closeCrop();
    setOriginalFile(null);
    setCropName(source.split('/').pop() || 'foto');
    setCropSrc(source);
    setCropOpen(true);
  };

  const handleCropConfirm = (blob: Blob) => {
    const ext =
      outputType === 'image/jpeg' ? 'jpg' : outputType === 'image/webp' ? 'webp' : 'png';
    const base = (cropName.replace(/\.[^.]+$/, '').trim() || 'foto').replace(
      /[^\w\- ]/g,
      '',
    );
    const croppedFile = new File([blob], `${base || 'foto'}.${ext}`, { type: outputType });
    const url = URL.createObjectURL(croppedFile);

    setSelected((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return { original: originalFile, file: croppedFile, url };
    });
    selectedUrlRef.current = url;
    onFileChange({ original: originalFile, cropped: croppedFile });
    setCropOpen(false);
    if (cropSrcRef.current && !isRemoteSrc(cropSrcRef.current)) {
      URL.revokeObjectURL(cropSrcRef.current);
    }
    setCropSrc(null);
  };

  const clearSelection = () => {
    if (selected) URL.revokeObjectURL(selected.url);
    selectedUrlRef.current = null;
    setSelected(null);
    setOriginalFile(null);
    onFileChange({ original: null, cropped: null });
  };

  return (
    <div>
      {label && (
        <label className="block text-slate-700 text-sm font-medium mb-1.5">{label}</label>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full text-slate-600 text-xs sm:text-sm border border-slate-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
      />

      {selected && (
        <div className="mt-3 flex items-center gap-3">
          <div
            className={`w-14 h-14 shrink-0 overflow-hidden bg-slate-100 border-2 border-teal-500/30 ${
              previewShape === 'circle' ? 'rounded-full' : 'rounded-xl'
            }`}
          >
            <img
              src={selected.url}
              alt="Pratinjau foto terpilih"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-700 truncate">{selected.file.name}</p>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
              <Check size={12} className="shrink-0" /> Foto siap diunggah (hasil potong)
            </p>
          </div>
          <button
            type="button"
            onClick={clearSelection}
            title="Hapus foto terpilih"
            className="shrink-0 p-2 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {!selected && currentImage && (
        <div className="mt-3 flex items-center gap-3">
          <div
            className={`w-14 h-14 shrink-0 overflow-hidden bg-slate-100 border-2 border-slate-200 ${
              previewShape === 'circle' ? 'rounded-full' : 'rounded-xl'
            }`}
          >
            <img
              src={currentImage}
              alt="Foto saat ini"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-700 truncate">Foto saat ini</p>
            <button
              type="button"
              onClick={startReCrop}
              className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
            >
              <Crop size={12} /> Potong Ulang Foto
            </button>
          </div>
        </div>
      )}

      {hint && <p className="text-slate-400 text-xs mt-1">{hint}</p>}

      <ImageCropModal
        open={cropOpen}
        imageSrc={cropSrc}
        aspectRatio={aspectRatio}
        circular={circular}
        outputWidth={outputWidth}
        outputHeight={Math.round(outputWidth / aspectRatio)}
        outputType={outputType}
        ratioOptions={ratioOptions}
        onCancel={closeCrop}
        onConfirm={handleCropConfirm}
      />
    </div>
  );
};
