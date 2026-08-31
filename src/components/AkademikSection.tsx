import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLink, BookOpen, ArrowLeft, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { AkademikMenuItem } from '../types';
import { getApiBaseUrl } from '../config/api';
import { ModulPembelajaranSection } from './ModulPembelajaranSection';

export const AkademikSection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<AkademikMenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${getApiBaseUrl()}/backend/API/akademik_menu.php`);
        const json = await res.json();
        if (json.status === 'success' && Array.isArray(json.data)) {
          setItems(json.data);
        }
      } catch {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const selectedItem = items.find((item) => String(item.id) === id) || (items.length > 0 && !id ? items[0] : null);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!selectedItem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <BookOpen size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Menu Akademik Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 mb-6">Pilih menu akademik lainnya melalui navigasi di atas.</p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition cursor-pointer"
        >
          <ArrowLeft size={16} /> Kembali ke Beranda
        </button>
      </div>
    );
  }

  const isModulType = Boolean(selectedItem.is_modul == 1 || selectedItem.label.toLowerCase().includes('modul ajar'));

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#073632] via-[#0b4843] to-[#103632] text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-semibold uppercase tracking-wider mb-4">
            <Layers size={14} /> Dokumen Akademik SDN 1 Mulyoagung
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            {selectedItem.label}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
            {selectedItem.deskripsi || 'Akses dokumen resmi pembelajaran dan kurikulum SD Negeri 1 Mulyoagung melalui Google Drive.'}
          </p>
        </div>
      </section>

      {/* Main Container Card */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 pb-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-100/80 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto border border-teal-100 shadow-inner">
            <BookOpen size={30} />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              Akses Dokumen Resmi {selectedItem.label}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Klik tombol di bawah ini untuk membuka dan mengunduh berkas lengkap pada penyimpanan Google Drive resmi sekolah.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={selectedItem.link_gdrive}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-teal-700/25 hover:shadow-teal-700/40 hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
            >
              <Sparkles size={18} className="text-amber-300" />
              <span>Buka di Google Drive</span>
              <ExternalLink size={16} />
            </a>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs">
            <ShieldCheck size={14} className="text-teal-600" />
            <span>Dokumen resmi terverifikasi SD Negeri 1 Mulyoagung</span>
          </div>
        </div>

      </main>

      {/* Jika tipe Modul Ajar & LKPD, render modul pembelajaran section full-width seperti Berita & Galeri */}
      {isModulType && (
        <div className="w-full">
          <ModulPembelajaranSection />
        </div>
      )}
    </div>
  );
};
