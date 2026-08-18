import React from 'react';
import { getYoutubeId } from '../utils/youtube';

interface KontenUtamaSectionProps {
  heroTitle: string;
  setHeroTitle: (val: string) => void;
  heroSubtitle: string;
  setHeroSubtitle: (val: string) => void;
  videoUrl: string;
  setVideoUrl: (val: string) => void;
  profilVisi: string;
  setProfilVisi: (val: string) => void;
  profilMisiInput: string;
  setProfilMisiInput: (val: string) => void;
  profilSejarah: string;
  setProfilSejarah: (val: string) => void;
}

export const KontenUtamaSection: React.FC<KontenUtamaSectionProps> = ({
  heroTitle,
  setHeroTitle,
  heroSubtitle,
  setHeroSubtitle,
  videoUrl,
  setVideoUrl,
  profilVisi,
  setProfilVisi,
  profilMisiInput,
  setProfilMisiInput,
  profilSejarah,
  setProfilSejarah,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
      <div>
        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <span>✍️ Edit Konten Utama Halaman Utama</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Sesuaikan isi teks utama di halaman depan sekolah seperti Visi, Misi, Sejarah, Teks Hero Header, serta video profil resmi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HERO SETTINGS */}
        <div className="space-y-4 border border-slate-100 p-4 rounded-xl bg-slate-50/50">
          <h4 className="font-bold text-sm text-teal-800 uppercase tracking-wider border-b border-teal-100 pb-2">
            Bagian Hero Header
          </h4>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Judul Hero (Teks Berwarna Emas)
            </label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="Selamat Datang di SD Negeri 1 Mulyoagung"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Subjudul / Deskripsi Singkat Hero
            </label>
            <textarea
              rows={4}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              placeholder="Tuliskan deskripsi singkat pembuka sekolah..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
            />
          </div>
        </div>

        {/* VIDEO & PROFILE TEXTS */}
        <div className="space-y-4 border border-slate-100 p-4 rounded-xl bg-slate-50/50">
          <h4 className="font-bold text-sm text-teal-800 uppercase tracking-wider border-b border-teal-100 pb-2">
            Video &amp; Profil Sekolah
          </h4>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              URL Embed Video YouTube
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
            />
            <p className="text-[10px] text-slate-500 mt-1 mb-3">
              Masukkan URL video YouTube lengkap. Mendukung format biasa, sharing link, shorts, atau embed. Contoh: https://www.youtube.com/watch?v=5T2k922_Z8Q
            </p>
            {videoUrl.trim() && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-200 shadow-sm">
                {getYoutubeId(videoUrl) ? (
                  <iframe
                    className="w-full h-full"
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

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Visi Sekolah
            </label>
            <textarea
              rows={3}
              value={profilVisi}
              onChange={(e) => setProfilVisi(e.target.value)}
              placeholder="Visi sekolah..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Misi Sekolah (Satu Baris Per Butir Misi)
            </label>
            <textarea
              rows={5}
              value={profilMisiInput}
              onChange={(e) => setProfilMisiInput(e.target.value)}
              placeholder="Tuliskan misi sekolah. Tekan enter/baris baru untuk memisahkan butir misi..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Sejarah Sekolah
            </label>
            <textarea
              rows={5}
              value={profilSejarah}
              onChange={(e) => setProfilSejarah(e.target.value)}
              placeholder="Sejarah singkat berdirinya sekolah..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
