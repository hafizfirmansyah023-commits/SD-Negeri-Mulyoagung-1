import React, { useEffect } from 'react';

import { CmsToast } from './components/CmsToast';
import { Layers, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePengaturanData } from './pengaturan/hooks/usePengaturanData';
import { StrukturHalamanUtamaSection } from './pengaturan/Sections/StrukturHalamanUtamaSection';

export default function StrukturHalamanUtamaCrud() {
  const {
    homepageSections,
    handleSectionDragStart,
    handleSectionDragOver,
    handleSectionDrop,
    updateSection,
    draggedSectionIndex,
    loading,
    saving,
    message,
    setMessage,
    fetchSettings,
    handleSaveStrukturHalamanUtama
  } = usePengaturanData();

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-100 text-teal-700 rounded-xl">
            <Layers size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Struktur Halaman Utama</h2>
            <p className="text-sm text-slate-500">Urutkan dan aktifkan/nonaktifkan bagian-bagian di halaman depan website</p>
          </div>
        </div>

        <button
          onClick={() => handleSaveStrukturHalamanUtama()}
          disabled={saving || loading}
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-teal-700/20 disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Save size={18} />
          {saving ? 'Menyimpan...' : 'Simpan Urutan'}
        </button>
      </div>

      <CmsToast message={message} onClose={() => setMessage(null)} />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-600"></div>
        </div>
      ) : (
        <StrukturHalamanUtamaSection
          homepageSections={homepageSections}
          onDragStart={handleSectionDragStart}
          onDragOver={handleSectionDragOver}
          onDrop={handleSectionDrop}
          onUpdate={updateSection}
          draggedSectionIndex={draggedSectionIndex}
        />
      )}
    </div>
  );
}
