import React, { useState, useEffect } from 'react';
import { AlertOctagon, X, FileX, HardDriveUpload, ShieldAlert } from 'lucide-react';
import { setFileValidationErrorListener, FileValidationError } from '../utils/fileValidation';

export const FileValidationModal: React.FC = () => {
  const [errorInfo, setErrorInfo] = useState<FileValidationError | null>(null);

  useEffect(() => {
    // Register listener for validation errors
    setFileValidationErrorListener((error) => {
      setErrorInfo(error);
    });

    return () => {
      setFileValidationErrorListener(null);
    };
  }, []);

  if (!errorInfo) return null;

  const isSizeError = errorInfo.title.toLowerCase().includes('ukuran') || errorInfo.message.toLowerCase().includes('mb');

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md transition-all duration-300 animate-fadeIn"
      onClick={() => setErrorInfo(null)}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-red-100 overflow-hidden transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Iconic Red Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-500" />

        {/* Close Button */}
        <button
          onClick={() => setErrorInfo(null)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          aria-label="Tutup alert"
        >
          <X size={18} />
        </button>

        <div className="text-center pt-2">
          {/* Iconic Red Animated Badge & Glow */}
          <div className="relative mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-red-500/30 blur-xl animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shadow-inner">
              {isSizeError ? <HardDriveUpload size={32} /> : <FileX size={32} />}
            </div>
          </div>

          {/* Title in Iconic Red */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/80 text-red-700 text-xs font-bold mb-2">
            <AlertOctagon size={14} className="shrink-0 text-red-600" />
            <span>PERINGATAN UPLOAD</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            {errorInfo.title}
          </h3>

          {/* Message */}
          <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed px-1">
            {errorInfo.message}
          </p>

          {/* Constraint Box in Red Accent */}
          <div className="mt-4 p-3.5 bg-red-50/70 border border-red-100 rounded-2xl text-[11px] sm:text-xs text-red-900 flex items-start gap-2.5 text-left">
            <ShieldAlert size={16} className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-red-900">Ketentuan Foto Upload:</span>
              <span className="text-red-700">Maksimal ukuran file: <strong>10MB</strong> &bull; Format wajib: <strong>Gambar (JPG, PNG, WEBP, GIF)</strong></span>
            </div>
          </div>

          {/* Action Button - Iconic Red Gradient */}
          <button
            onClick={() => setErrorInfo(null)}
            className="w-full mt-5 py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-600/30 transition-all duration-200 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            Mengerti &amp; Pilih File Lain
          </button>
        </div>
      </div>
    </div>
  );
};
