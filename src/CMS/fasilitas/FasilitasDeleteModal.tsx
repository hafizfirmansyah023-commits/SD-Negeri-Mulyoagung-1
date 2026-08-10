import React from 'react';

interface FasilitasDeleteModalProps {
  deleteModalId: number | null;
  onClose: () => void;
  onConfirm: (id: number) => void;
}

export const FasilitasDeleteModal: React.FC<FasilitasDeleteModalProps> = ({
  deleteModalId,
  onClose,
  onConfirm,
}) => {
  if (deleteModalId === null) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Konfirmasi Hapus</h3>
        <p className="text-sm text-slate-600">
          Apakah Anda yakin ingin menghapus data fasilitas ini? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm font-semibold cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(deleteModalId)}
            className="px-4 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-700 text-sm font-semibold cursor-pointer"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};
