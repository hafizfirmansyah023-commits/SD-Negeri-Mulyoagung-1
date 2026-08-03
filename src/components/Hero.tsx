import React from 'react';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { NavTab } from '../types';

interface HeroProps {
  onOpenPpdb: () => void;
  setActiveTab: (tab: NavTab) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenPpdb, setActiveTab }) => {
  return (
    <section className="relative w-full min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-[#1E3A8A] dark:bg-slate-950">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="bg-cover bg-center w-full h-full opacity-25 dark:opacity-15 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1600')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A8A]/95 via-[#1E3A8A]/85 to-[#028C84]/80 dark:from-slate-950/95 dark:via-slate-900/90 dark:to-teal-950/80" />
      </div>

      {/* Decorative Glow Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20 text-center lg:text-left flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
        {/* Left Text Column */}
        <div className="lg:w-3/5 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#F9A825]/20 text-[#F9A825] dark:bg-amber-400/20 dark:text-amber-300 border border-[#F9A825]/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Tahun Ajaran 2025/2026
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl text-white font-extrabold leading-tight tracking-tight">
            Selamat Datang di <br />
            <span className="text-[#8cf4ea] dark:text-teal-300 drop-shadow-sm">
              SD Negeri Mulyoagung 1
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-100 dark:text-slate-200 max-w-2xl leading-relaxed opacity-95">
            Beriman, Kreatif, Berprestasi, Berkarakter, dan Berbudaya. Kami berkomitmen mencetak generasi unggul untuk masa depan bangsa.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
            <button
              onClick={onOpenPpdb}
              className="bg-[#028C84] hover:bg-[#006a64] text-white font-semibold text-base py-3.5 px-8 rounded-full transition-all hover:scale-105 shadow-lg hover:shadow-teal-500/20 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>PPDB Online</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                setActiveTab('profile');
                const el = document.getElementById('profile-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white/10 hover:bg-white/20 border-2 border-white/80 text-white font-semibold text-base py-3.5 px-8 rounded-full transition-all flex items-center justify-center gap-2 backdrop-blur-sm cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Profil Sekolah</span>
            </button>
          </div>
        </div>

        {/* Right Photo Frame */}
        <div className="lg:w-2/5 hidden lg:block">
          <div className="relative w-full aspect-square max-w-[380px] mx-auto">
            <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10 w-full h-full p-2 bg-white/15 dark:bg-slate-800/30 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800"
                alt="Siswa SD Negeri Mulyoagung 1 tersenyum gembira"
                className="w-full h-full object-cover rounded-2xl shadow-inner"
              />
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 px-4 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold">Pendidikan Karakter & Digital</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
