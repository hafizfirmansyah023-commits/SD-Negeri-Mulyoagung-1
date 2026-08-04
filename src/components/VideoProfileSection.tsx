import React, { useState } from 'react';
import { Play, PlayCircle, X, ExternalLink } from 'lucide-react';

export const VideoProfileSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="w-full py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
      <div className="bg-[#1E3A8A] dark:bg-slate-900 rounded-3xl overflow-hidden flex flex-col lg:flex-row relative shadow-xl border border-blue-900/40">
        {/* Background Ambient Lights */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        {/* Text Area */}
        <div className="lg:w-1/2 p-8 sm:p-12 lg:p-14 flex flex-col justify-center z-10 space-y-6">
          <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <PlayCircle className="w-4 h-4" />
            Dokumentasi Resmi
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            Video Profil Sekolah
          </h2>

          <p className="text-slate-200 dark:text-slate-300 text-base sm:text-lg leading-relaxed opacity-90 max-w-md">
            Mengenal lebih dekat lingkungan, fasilitas, dan kegiatan akademik di SD Negeri 1 Mulyoagung melalui tayangan video singkat kami.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setIsPlaying(true)}
              className="bg-[#F9A825] hover:bg-amber-500 text-[#1E3A8A] font-bold text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-2.5 shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isPlaying ? 'Sedang Memutar Video' : 'Putar Video Sekarang'}</span>
            </button>

            <a
              href="https://www.youtube.com/watch?v=-HU-Kg20g-M"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-2 border border-white/20 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Tonton di YouTube</span>
            </a>
          </div>
        </div>

        {/* Video Player / Thumbnail Area */}
        <div className="lg:w-1/2 relative min-h-[300px] sm:min-h-[380px] lg:min-h-[420px] bg-slate-950 overflow-hidden">
          {isPlaying ? (
            <div className="w-full h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[420px] relative">
              <iframe
                src="https://www.youtube.com/embed/-HU-Kg20g-M?autoplay=1"
                title="Video Profil SD Negeri 1 Mulyoagung"
                className="w-full h-full border-0 absolute inset-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={() => setIsPlaying(false)}
                className="absolute top-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-md z-20 border border-white/20 transition-all flex items-center gap-1.5 px-3 text-xs font-bold shadow-lg cursor-pointer"
                title="Tutup Pemutar Video"
              >
                <span>Tutup</span>
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-full h-full relative group cursor-pointer" onClick={() => setIsPlaying(true)}>
              <img
                src="https://img.youtube.com/vi/-HU-Kg20g-M/maxresdefault.jpg"
                alt="Video Profil Thumbnail SD Negeri Mulyoagung 1"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl border border-white/40">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white text-[#1E3A8A] rounded-full flex items-center justify-center shadow-lg pl-1">
                    <Play className="w-8 h-8 fill-current" />
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
