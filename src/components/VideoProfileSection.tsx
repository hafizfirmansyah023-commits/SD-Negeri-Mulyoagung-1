import React, { useState } from 'react';
import { Play, PlayCircle, X, ExternalLink } from 'lucide-react';
import { useHomepageConfig } from '../hooks/useHomepageConfig';

export const VideoProfileSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const homepageConfig = useHomepageConfig();

  const getYoutubeId = (url: string) => {
    if (!url) return '5T2k922_Z8Q';
    const trimmed = url.trim();
    if (trimmed.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    const match = trimmed.match(regExp);
    return (match && match[1].length === 11) ? match[1] : '5T2k922_Z8Q';
  };

  const videoId = getYoutubeId(homepageConfig.videoUrl);
  const videoSection = homepageConfig.sections.find(s => s.key === 'video');
  const sectionTitle = videoSection ? videoSection.judul : 'Video Profil Sekolah';
  const sectionSubtitle = videoSection ? videoSection.subjudul : 'Mengenal lebih dekat lingkungan, fasilitas, dan kegiatan akademik di SD Negeri 1 Mulyoagung melalui tayangan video singkat kami.';

  return (
    // Padding section diperkecil untuk mobile (py-10)
    <section className="w-full py-10 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
      {/* Sudut border diubah ke rounded-2xl untuk mobile agar tidak terlalu melengkung */}
      <div className="bg-[#1E3A8A] dark:bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col lg:flex-row relative shadow-xl border border-blue-900/40">
        
        {/* Background Ambient Lights */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />Base path: ``

        {/* Text Area */}
        {/* Padding diperkecil (p-5), jarak antar elemen dirapatkan (space-y-3) */}
        <div className="lg:w-1/2 p-5 sm:p-12 lg:p-14 flex flex-col justify-center z-10 space-y-3 sm:space-y-6">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 text-amber-400 font-bold text-[10px] sm:text-xs uppercase tracking-wider">
            <PlayCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Dokumentasi Resmi
          </div>

          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            {sectionTitle}
          </h2>

          <p className="text-slate-200 dark:text-slate-300 text-xs sm:text-lg leading-snug sm:leading-relaxed opacity-90 max-w-md">
            {sectionSubtitle}
          </p>

          {/* Buttons Area: Di mobile menjadi sejajar dan proporsional */}
          <div className="pt-2 flex flex-row flex-wrap sm:flex-nowrap gap-2 sm:gap-3 w-full">
            <button
              onClick={() => setIsPlaying(true)}
              className="flex-1 sm:flex-none bg-[#F9A825] hover:bg-amber-500 text-[#1E3A8A] font-bold text-[10px] sm:text-sm py-2 px-3 sm:py-3 sm:px-6 rounded-lg sm:rounded-xl flex items-center justify-center gap-1.5 sm:gap-2.5 shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0" />
              <span className="line-clamp-1">{isPlaying ? 'Memutar...' : 'Putar Video'}</span>
            </button>

            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 text-white font-semibold text-[10px] sm:text-sm py-2 px-3 sm:py-3 sm:px-6 rounded-lg sm:rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 border border-white/20 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="line-clamp-1">Di YouTube</span>
            </a>
          </div>
        </div>

        {/* Video Player / Thumbnail Area */}
        <div className="lg:w-1/2 relative w-full aspect-video lg:aspect-auto lg:min-h-[420px] bg-slate-950 overflow-hidden">
          {isPlaying ? (
            <div className="w-full h-full relative">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="Video Profil"
                className="w-full h-full border-0 absolute inset-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={() => setIsPlaying(false)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-slate-900/80 hover:bg-slate-900 text-white p-1.5 sm:p-2 rounded-full backdrop-blur-md z-20 border border-white/20 transition-all flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 text-[10px] sm:text-xs font-bold shadow-lg cursor-pointer"
                title="Tutup Pemutar Video"
              >
                <span>Tutup</span>
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ) : (
            <div className="w-full h-full relative group cursor-pointer" onClick={() => setIsPlaying(true)}>
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt="Video Profil Thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                <div className="w-14 h-14 sm:w-24 sm:h-24 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl border border-white/40">
                  <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white text-[#1E3A8A] rounded-full flex items-center justify-center shadow-lg pl-0.5 sm:pl-1">
                    <Play className="w-5 h-5 sm:w-8 sm:h-8 fill-current" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};