import React, { useEffect } from 'react';
import { Globe, Save } from 'lucide-react';
import { usePengaturanData } from './pengaturan/hooks/usePengaturanData';
import { getYoutubeId } from './pengaturan/utils/youtube';
import { CmsToast } from './components/CmsToast';

export default function KontenUtamaCrud() {
  const {
    videoUrl, setVideoUrl,
    loading, saving, message, setMessage, fetchSettings, handleSaveVideoUrl
  } = usePengaturanData();

  useEffect(() => { fetchSettings(); }, []);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-100 text-teal-700 rounded-xl"><Globe size={24} /></div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Video Profil Sekolah</h2>
            <p className="text-sm text-slate-500">Kelola video profil resmi sekolah di halaman utama</p>
          </div>
        </div>
        <button onClick={() => handleSaveVideoUrl()} disabled={saving || loading}
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
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="max-w-3xl space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">URL Embed Video YouTube</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
              />
              <p className="text-[10px] text-slate-500 mt-1 mb-3">
                Masukkan URL video YouTube lengkap. Mendukung format biasa, sharing link, shorts, atau embed.
              </p>
              {videoUrl.trim() && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-200 shadow-sm max-w-xl">
                  {getYoutubeId(videoUrl) ? (
                    <iframe
                      className="w-full h-full animate-fade-in"
                      src={`https://www.youtube.com/embed/${getYoutubeId(videoUrl)}`}
                      title="YouTube video player preview"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-slate-400">
                      Format URL YouTube tidak dikenali. Preview tidak dapat dimuat.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}