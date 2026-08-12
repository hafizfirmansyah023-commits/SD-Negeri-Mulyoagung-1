import React, { useEffect, useRef, useState } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { Check, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropModalProps {
  open: boolean;
  imageSrc: string | null;
  aspectRatio?: number;
  circular?: boolean;
  outputWidth?: number;
  outputHeight?: number;
  outputType?: string;
  title?: string;
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
  onCancel,
  onConfirm,
}) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const cropperRef = useRef<Cropper | null>(null);
  const circularRef = useRef(circular);
  const [processing, setProcessing] = useState(false);

  circularRef.current = circular;

  useEffect(() => {
    if (!open || !imageSrc) return;

    const image = imageRef.current;
    if (!image) return;

    const cropper = new Cropper(image, {
      aspectRatio,
      viewMode: 1,
      dragMode: 'move',
      autoCropArea: 1,
      responsive: true,
      restore: false,
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
  }, [open, imageSrc, aspectRatio, circular]);

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

  const handleConfirm = () => {
    const cropper = cropperRef.current;
    if (!cropper || processing) return;

    setProcessing(true);
    try {
      const canvas = cropper.getCroppedCanvas({
        width: outputWidth,
        height: outputHeight,
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

        <div className="p-3 sm:p-5 flex flex-col gap-3 sm:gap-4">
          <div
            className="relative overflow-hidden rounded-2xl bg-slate-900 mx-auto w-full"
            style={circular ? { aspectRatio: containerAspect } : { aspectRatio: containerAspect, maxHeight: '55vh' }}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Pratinjau foto"
              className="block max-w-none w-full h-full"
            />
            {circular && <div className="crop-modal-mask absolute inset-0 pointer-events-none" />}
          </div>

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
