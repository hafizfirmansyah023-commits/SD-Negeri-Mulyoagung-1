import React, { useEffect } from 'react';
import { Mail, Save } from 'lucide-react';
import { usePengaturanData } from './pengaturan/hooks/usePengaturanData';
import { KontakSection } from './pengaturan/Sections/KontakSection';
import { CmsToast } from './components/CmsToast';

export default function KontakCrud() {
  const {
    emailSekolah, setEmailSekolah,
    teleponSekolah, setTeleponSekolah,
    whatsappSekolah, setWhatsappSekolah,
    alamatSekolah, setAlamatSekolah,
    loading, saving, message, setMessage, fetchSettings, handleSaveKontak
  } = usePengaturanData();

  useEffect(() => { fetchSettings(); }, []);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-100 text-teal-700 rounded-xl"><Mail size={24} /></div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Kontak Resmi Sekolah</h2>
            <p className="text-sm text-slate-500">Kelola email, nomor telepon, nomor WhatsApp, dan alamat fisik sekolah</p>
          </div>
        </div>
        <button onClick={() => handleSaveKontak()} disabled={saving || loading}
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
        <KontakSection
          emailSekolah={emailSekolah} setEmailSekolah={setEmailSekolah}
          teleponSekolah={teleponSekolah} setTeleponSekolah={setTeleponSekolah}
          whatsappSekolah={whatsappSekolah} setWhatsappSekolah={setWhatsappSekolah}
          alamatSekolah={alamatSekolah} setAlamatSekolah={setAlamatSekolah}
        />
      )}
    </div>
  );
}