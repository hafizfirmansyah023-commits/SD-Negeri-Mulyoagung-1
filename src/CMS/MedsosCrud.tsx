import React, { useState, useEffect } from 'react';

import { CmsToast } from './components/CmsToast';
import { CmsConfirmModal, ConfirmState } from './components/CmsConfirmModal';
import { Share2, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePengaturanData } from './pengaturan/hooks/usePengaturanData';
import { MedsosSection } from './pengaturan/Sections/MedsosSection';
import { MedsosModal } from './pengaturan/Modals/MedsosModal';

export default function MedsosCrud() {
  const {
    medsosList,
    medsosModalOpen, setMedsosModalOpen, medsosEditingItem, medsosFormData,
    handleMedsosFormChange, handleOpenAddMedsos, handleOpenEditMedsos,
    handleDeleteMedsos, handleSaveMedsosItem,
    loading, saving, message, setMessage, fetchSettings, handleSaveMedsos
  } = usePengaturanData();

  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    variant: 'delete',
    onConfirm: () => {},
  });

  const onDeleteMedsosRequest = (id: string) => {
    setConfirmState({
      isOpen: true,
      variant: 'delete',
      title: 'Konfirmasi Hapus Media Sosial',
      message: 'Apakah Anda yakin ingin menghapus media sosial ini?',
      onConfirm: () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        handleDeleteMedsos(id);
      },
    });
  };

  const onSaveMedsosSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (medsosEditingItem) {
      setConfirmState({
        isOpen: true,
        variant: 'edit',
        title: 'Konfirmasi Edit Media Sosial',
        message: 'Apakah Anda yakin ingin menyimpan perubahan media sosial ini?',
        onConfirm: () => {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
          handleSaveMedsosItem(e);
        },
      });
    } else {
      handleSaveMedsosItem(e);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-100 text-teal-700 rounded-xl">
            <Share2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Media Sosial Sekolah</h2>
            <p className="text-sm text-slate-500">Kelola tautan media sosial resmi sekolah seperti Instagram, Facebook, YouTube, dll.</p>
          </div>
        </div>

        <button
          onClick={() => handleSaveMedsos()}
          disabled={saving || loading}
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-teal-700/20 disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Save size={18} />
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      <CmsToast message={message} onClose={() => setMessage(null)} />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-600"></div>
        </div>
      ) : (
        <MedsosSection
          medsosList={medsosList}
          onAdd={handleOpenAddMedsos}
          onEdit={handleOpenEditMedsos}
          onDelete={onDeleteMedsosRequest}
        />
      )}

      <MedsosModal
        open={medsosModalOpen}
        editing={medsosEditingItem}
        formData={medsosFormData}
        onChange={handleMedsosFormChange}
        onSave={onSaveMedsosSubmit}
        onClose={() => setMedsosModalOpen(false)}
      />

      <CmsConfirmModal
        isOpen={confirmState.isOpen}
        variant={confirmState.variant}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
