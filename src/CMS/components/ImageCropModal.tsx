import React, { useEffect, useRef, useState } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { Check, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

export interface CropRatioOption {
  label: string;
  value: number | null;
}

export const CROP_RATIO_OPTIONS: CropRatioOption[] = [
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 },
  { label: '16:9', value: 16 / 9 },
  { label: 'Bebas', value: null },
];

interface ImageCropModalProps {
  open: boolean;
  imageSrc: string | null;
  aspectRatio?: number;
  circular?: boolean;
  outputWidth?: number;
  outputHeight?: number;
  outputType?: string;
  title?: string;
  ratioOptions?: CropRatioOption[];
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}

const CROP_OVERRIDE_STYLES = `
  .crop-modal .cropper-container { width: 100%; height: 100%; }
  .crop-modal .cropper-view-box { overflow: hidden; }
  .crop-modal.crop-modal-circle .cropper-view-box,
  .crop-modal.crop-modal-circle .cropper-view-box .cropper-face { border-radius: 50%; }
  .crop-modal.crop-modal-circle .cropper-view-box .cropper-dashed,
  .crop-modal.crop-modal-circle .cropper-view-box .cropper-line,
  .crop-modal.crop-modal-circle .cropper-view-box .cropper-point { display: none; }
  .crop-modal.crop-modal-circle .cropper-view-box .cropper-face { background-color: transparent; }
  .crop-modal.crop-modal-circle .crop-modal-mask {
    background: radial-gradient(circle closest-side at 50% 50%, rgba(2,6,23,0) 0%, rgba(2,6,23,0) calc(100% - 2px), rgba(2,6,23,0.6) 100%);
  }
`;

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  open,
  imageSrc,
  aspectRatio = 1,
  circular = true,
  outputWidth,
  outputHeight,
  outputType = 'image/png',
  title = 'Potong Foto',
  ratioOptions,
  onCancel,
  onConfirm,
}) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const cropperRef = useRef<Cropper | null>(null);
  const circularRef = useRef(circular);
  const ratioRef = useRef<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [currentRatio, setCurrentRatio] = useState<number | null>(null);

  circularRef.current = circular;

  // Reset status ketika sumber gambar / modal / rasio default berubah.
  useEffect(() => {
    setImgLoaded(false);
    setLoadFailed(false);
    setProcessing(false);
    const initial = Number.isFinite(aspectRatio) ? aspectRatio : null;
    ratioRef.current = initial;
    setCurrentRatio(initial);
  }, [open, imageSrc, aspectRatio]);

  // Inisialisasi Cropper hanya setelah gambar benar-benar selesai dimuat.
  useEffect(() => {
    if (!open || !imageSrc || !imgLoaded) return;

    const image = imageRef.current;
    if (!image || image.naturalWidth === 0) return;

    const cropper = new Cropper(image, {
      aspectRatio: ratioRef.current ?? NaN,
      viewMode: 1,
      dragMode: 'move',
      autoCropArea: 1,
      responsive: true,
      restore: false,
      checkCrossOrigin: false,
      guides: circular ? false : true,
      center: circular ? false : true,
      highlight: false,
      background: false,
      movable: true,
      rotatable: true,
      scalable: false,
      zoomable: true,
      zoomOnTouch: true,
      zoomOnWheel: true,
      cropBoxMovable: !circular,
      cropBoxResizable: !circular,
      minContainerWidth: 200,
      minContainerHeight: 200,
      ready: () => {
        if (!circularRef.current) return;
        const data = cropper.getContainerData();
        cropper.setCropBoxData({ left: 0, top: 0, width: data.width, height: data.height });
      },
    });
    cropperRef.current = cropper;

    return () => {
      cropper.destroy();
      cropperRef.current = null;
    };
  }, [open, imageSrc, imgLoaded, aspectRatio, circular]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open || !imageSrc) return null;

  const zoomIn = () => cropperRef.current?.zoom(0.1);
  const zoomOut = () => cropperRef.current?.zoom(-0.1);
  const rotate = () => cropperRef.current?.rotate(90);

  const selectRatio = (value: number | null) => {
    ratioRef.current = value;
    setCurrentRatio(value);
    cropperRef.current?.setAspectRatio(value ?? NaN);
  };

  const handleConfirm = () => {
    const cropper = cropperRef.current;
    if (!cropper || processing) return;

    setProcessing(true);
    try {
      const ratio = ratioRef.current;
      const cropOptions =
        ratio === null
          ? { maxWidth: 1920, maxHeight: 1920 }
          : outputWidth
            ? { width: outputWidth, height: Math.round(outputWidth / ratio) }
            : {};
      const canvas = cropper.getCroppedCanvas({
        ...cropOptions,
        imageSmoothingQuality: 'high',
      });
      canvas.toBlob((blob) => {
        setProcessing(false);
        if (blob) onConfirm(blob);
      }, outputType);
    } catch {
      setProcessing(false);
    }
  };

  const containerAspect = `${aspectRatio}`;

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <style>{CROP_OVERRIDE_STYLES}</style>
      <div
        className={`crop-modal ${circular ? 'crop-modal-circle' : ''} bg-white rounded-2xl sm:rounded-3xl w-full ${
          circular ? 'max-w-sm sm:max-w-md' : 'max-w-lg sm:max-w-xl'
        } shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col`}
      >
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 sm:p-5 text-white flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-bold">{title}</h3>
            <p className="text-teal-100 text-[11px] sm:text-xs mt-0.5">
              Geser untuk memindahkan &bull; Cubit / scroll / tombol untuk zoom
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-white hover:text-slate-200 text-2xl font-semibold cursor-pointer p-1"
            aria-label="Tutup"
          >
            &times;
          </button>
        </div>

        <div className="p-3 sm:p-5 flex flex-col gap-3 sm:gap-4 flex-1 min-h-0 overflow-y-auto">
          <div
            className="relative overflow-hidden rounded-2xl bg-slate-900 mx-auto w-full"
            style={circular ? { aspectRatio: containerAspect } : { aspectRatio: containerAspect, maxHeight: '55vh' }}
          >
            <img
              key={imageSrc}
              ref={imageRef}
              src={imageSrc}
              crossOrigin="anonymous"
              alt="Pratinjau foto"
              className="block max-w-none w-full h-full object-contain"
              onLoad={() => {
                setLoadFailed(false);
                setImgLoaded(true);
              }}
              onError={() => {
                setLoadFailed(true);
                setImgLoaded(false);
              }}
            />
            {loadFailed && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm px-6 text-center">
                Gagal memuat gambar. Coba lagi atau pilih foto baru.
              </div>
            )}
            {circular && <div className="crop-modal-mask absolute inset-0 pointer-events-none" />}
          </div>

          {ratioOptions && ratioOptions.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {ratioOptions.map((opt) => {
                const active = currentRatio === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => selectRatio(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={zoomOut}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Perkecil"
            >
              <ZoomOut size={18} />
            </button>
            <button
              type="button"
              onClick={rotate}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Putar 90 derajat"
            >
              <RotateCw size={18} />
            </button>
            <button
              type="button"
              onClick={zoomIn}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Perbesar"
            >
              <ZoomIn size={18} />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-4 sm:px-5 pb-4 sm:pb-5 pt-2 border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 sm:px-5 py-2.5 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium transition-colors text-sm cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={processing}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 font-medium transition-colors text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Check size={16} />
            {processing ? 'Memproses...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
};
