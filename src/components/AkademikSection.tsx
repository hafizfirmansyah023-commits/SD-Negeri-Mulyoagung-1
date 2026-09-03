import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLink, BookOpen, ArrowLeft, Layers, ShieldCheck, Sparkles, LayoutGrid, List, Share2, Check } from 'lucide-react';
import { AkademikMenuItem } from '../types';
import { getApiBaseUrl } from '../config/api';
import { getGoogleDriveEmbedUrl, DriveViewMode } from '../utils/helpers';
import { ModulPembelajaranSection } from './ModulPembelajaranSection';

export const AkademikSection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<AkademikMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<DriveViewMode>('grid');
  const [copied, setCopied] = useState(false);

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

  // Hanya item (yang punya parent / link gdrive) yang bisa dibuka viewer. Kategori tidak bisa diklik.
  const linkItems = items.filter((i) => (i.parent_id && Number(i.parent_id) > 0) || (i.link_gdrive && String(i.link_gdrive).trim() !== ''));
  const selectedItem = linkItems.find((item) => String(item.id) === id) || (linkItems.length > 0 && !id ? linkItems[0] : null);

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

  const isModulType = Number(selectedItem.is_modul) === 1;
  const embedUrl = getGoogleDriveEmbedUrl(selectedItem.link_gdrive, viewMode);
  const defaultDescription = `Dokumen akademik resmi sekolah berupa ${selectedItem.label.toLowerCase()}. Silakan eksplorasi konten di dalam folder Google Drive.`;
  const descriptionContent = selectedItem.deskripsi || defaultDescription;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${selectedItem.label} - Akademik SDN 1 Mulyoagung`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
            {descriptionContent}
          </p>
        </div>
      </section>

      {/* Main Container Card - Title & Description on top, Drive viewer below */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 -mt-8 relative z-20 pb-16 space-y-12">
        
        {/* Info Card: Title, Desc, Share & Drive Link */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100/80 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <BookOpen size={24} />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                  Akses Dokumen Resmi {selectedItem.label}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Klik tombol di bawah untuk membuka dokumen di Google Drive.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                title="Bagikan halaman ini"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
                <span className="hidden sm:inline">{copied ? 'Tersalin' : 'Bagikan'}</span>
              </button>
              <a
                href={selectedItem.link_gdrive}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
              >
                <ExternalLink size={14} />
                <span>Buka Tab</span>
              </a>
            </div>
          </div>

          {/* Google Drive Viewer */}
          <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative flex-1 flex flex-col min-h-[60vh] sm:min-h-[75vh]">
            {/* Viewer Toolbar */}
            <div className="bg-white px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-medium truncate">
                <Layers size={14} className="text-teal-700 shrink-0" />
                <span className="truncate">Google Drive Viewer</span>
              </div>

              <a
                href={selectedItem.link_gdrive}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 shrink-0"
              >
                <span>Buka di Google Drive</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={selectedItem.label}
                className="w-full h-full flex-1 min-h-[55vh] sm:min-h-[70vh] md:min-h-[75vh] border-0 bg-white"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center min-h-[55vh]">
                <BookOpen size={48} className="text-slate-400 mb-3" />
                <p className="text-slate-600 text-sm">Tautan Google Drive tidak dapat disematkan langsung.</p>
                <a
                  href={selectedItem.link_gdrive}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
                >
                  <ExternalLink size={14} /> Buka Google Drive
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Jika tipe Modul Ajar & LKPD, render modul pembelajaran section full-width */}
        {isModulType && (
          <div className="w-full">
            <ModulPembelajaranSection />
          </div>
        )}

        {/* Footer Verification Badge */}
        <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
          <ShieldCheck size={14} className="text-teal-600" />
          <span>Dokumen resmi terverifikasi SD Negeri 1 Mulyoagung</span>
        </div>

      </main>
    </div>
  );
};
