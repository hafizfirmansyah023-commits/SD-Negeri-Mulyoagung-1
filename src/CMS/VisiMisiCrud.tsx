import React, { useEffect } from 'react';
import { BookOpen, Save } from 'lucide-react';
import { usePengaturanData } from './pengaturan/hooks/usePengaturanData';
import { RichTextEditor } from './components/RichTextEditor';
import { CmsToast } from './components/CmsToast';

export default function VisiMisiCrud() {
  const {
    profilVisi, setProfilVisi, profilMisiInput, setProfilMisiInput,
    loading, saving, message, setMessage, fetchSettings, handleSaveVisiMisi
  } = usePengaturanData();

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-100 text-teal-700 rounded-xl">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Visi &amp; Misi Sekolah</h2>
            <p className="text-sm text-slate-500">Kelola pernyataan visi dan butir-butir misi resmi sekolah</p>
          </div>
        </div>

        <button
          onClick={() => handleSaveVisiMisi()}
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
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Visi Sekolah
              </label>
              <RichTextEditor
                value={profilVisi}
                onChange={setProfilVisi}
                placeholder="Tulis visi sekolah di sini..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Misi Sekolah (Satu Baris Per Butir Misi)
              </label>
              <textarea
                rows={8}
                value={profilMisiInput}
                onChange={(e) => setProfilMisiInput(e.target.value)}
                placeholder="Tuliskan misi sekolah. Tekan enter/baris baru untuk memisahkan butir misi..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}