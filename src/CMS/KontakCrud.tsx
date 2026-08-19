import React, { useEffect } from 'react';
import { Mail, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePengaturanData } from './pengaturan/hooks/usePengaturanData';
import { KontakSection } from './pengaturan/Sections/KontakSection';

export default function KontakCrud() {
  const {
    emailSekolah, setEmailSekolah,
    teleponSekolah, setTeleponSekolah,
    whatsappSekolah, setWhatsappSekolah,
    alamatSekolah, setAlamatSekolah,
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
            <Mail size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Kontak Resmi Sekolah</h2>
            <p className="text-sm text-slate-500">Kelola email, nomor telepon, nomor WhatsApp, dan alamat fisik sekolah</p>
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
        <KontakSection
          emailSekolah={emailSekolah}
          setEmailSekolah={setEmailSekolah}
          teleponSekolah={teleponSekolah}
          setTeleponSekolah={setTeleponSekolah}
          whatsappSekolah={whatsappSekolah}
          setWhatsappSekolah={setWhatsappSekolah}
          alamatSekolah={alamatSekolah}
          setAlamatSekolah={setAlamatSekolah}
        />
      )}
    </div>
  );
}
