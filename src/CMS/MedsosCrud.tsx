import React, { useEffect } from 'react';

import { CmsToast } from './components/CmsToast';
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
    loading, saving, message, setMessage, fetchSettings, handleSaveAll
  } = usePengaturanData();

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
          onClick={() => handleSaveAll()}
          disabled={saving || loading}
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-teal-700/20 disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Save size={18} />
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-semibold ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-600"></div>
        </div>
      ) : (
        <MedsosSection
          medsosList={medsosList}
          onAdd={handleOpenAddMedsos}
          onEdit={handleOpenEditMedsos}
          onDelete={handleDeleteMedsos}
        />
      )}

      <MedsosModal
        open={medsosModalOpen}
        editing={medsosEditingItem}
        formData={medsosFormData}
        onChange={handleMedsosFormChange}
        onSave={handleSaveMedsosItem}
        onClose={() => setMedsosModalOpen(false)}
      />
    </div>
  );
}
