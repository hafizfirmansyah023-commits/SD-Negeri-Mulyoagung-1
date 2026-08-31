import React from 'react';
import { AlertTriangle, Trash2, Edit3, X, Loader2 } from 'lucide-react';

export type ConfirmVariant = 'delete' | 'edit';

export interface ConfirmState {
  isOpen: boolean;
  variant: ConfirmVariant;
  title?: string;
  message?: string;
  confirmText?: string;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

interface CmsConfirmModalProps {
  isOpen: boolean;
  variant?: ConfirmVariant;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export const CmsConfirmModal: React.FC<CmsConfirmModalProps> = ({
  isOpen,
  variant = 'delete',
  title,
  message,
  confirmText,
  cancelText = 'Batal',
  loading = false,
  onConfirm,
  onClose,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      const prevBody = document.body.style.overflow;
      const prevHtml = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevBody;
        document.documentElement.style.overflow = prevHtml;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isDelete = variant === 'delete';

  const defaultTitle = isDelete ? 'Konfirmasi Hapus' : 'Konfirmasi Perubahan';
  const defaultMessage = isDelete
    ? 'Apakah Anda yakin ingin menghapus data ini? Data yang dihapus tidak dapat dikembalikan.'
    : 'Apakah Anda yakin ingin menyimpan perubahan data ini?';
  const defaultConfirmText = isDelete ? 'Ya, Hapus Data' : 'Ya, Simpan Perubahan';

  const displayTitle = title || defaultTitle;
  const displayMessage = message || defaultMessage;
  const displayConfirmText = confirmText || defaultConfirmText;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transform transition-all animate-scale-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 sm:p-3 rounded-xl ${
                isDelete
                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                  : 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400'
              }`}
            >
              {isDelete ? <Trash2 size={20} /> : <Edit3 size={20} />}
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100">
              {displayTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Tutup modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/60 dark:border-slate-700">
            <AlertTriangle
              size={18}
              className={`shrink-0 mt-0.5 ${
                isDelete ? 'text-rose-500' : 'text-teal-600 dark:text-teal-400'
              }`}
            />
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {displayMessage}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 p-4 sm:p-5 bg-slate-50/80 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white transition-all shadow-md cursor-pointer disabled:opacity-50 ${
              isDelete
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                : 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20'
            }`}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            <span>{displayConfirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
