import React, { useEffect } from 'react';
import { GraduationCap, Save } from 'lucide-react';
import { usePengaturanData } from './pengaturan/hooks/usePengaturanData';
import { PpdbSection } from './pengaturan/Sections/PpdbSection';
import { CmsToast } from './components/CmsToast';

export default function PPDBCrud() {
  const {
    tahunAjaran, setTahunAjaran, linkPpdb, setLinkPpdb,
    loading, saving, message, setMessage, fetchSettings, handleSavePpdb
  } = usePengaturanData();

  useEffect(() => { fetchSettings(); }, []);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-100 text-teal-700 rounded-xl"><GraduationCap size={24} /></div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Pendaftaran Peserta Didik Baru (PPDB)</h2>
            <p className="text-sm text-slate-500">Kelola tahun ajaran aktif dan tautan formulir pendaftaran PPDB online</p>
          </div>
        </div>
        <button onClick={() => handleSavePpdb()} disabled={saving || loading}
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer shrink-0">
          <Save size={18} /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
      <CmsToast message={message} onClose={() => setMessage(null)} />
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-600"></div>
        </div>
      ) : (
        <PpdbSection
          tahunAjaran={tahunAjaran} setTahunAjaran={setTahunAjaran}
          linkPpdb={linkPpdb} setLinkPpdb={setLinkPpdb}
        />
      )}
    </div>
  );
}