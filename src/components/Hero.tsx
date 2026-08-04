import React from 'react';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { NavTab } from '../types';

interface HeroProps {
  onOpenPpdb: () => void;
  setActiveTab: (tab: NavTab) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenPpdb,
  setActiveTab,
}) => {
  return (
    <section className="relative w-full min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-[#0D4A46]">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        {/* GANTI FOTO SEKOLAH */}
        <div
          className="bg-cover bg-center w-full h-full opacity-15 scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1600')",
          }}
        />
        {/* Mengubah warna background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D4A46]/0 to-[#156B63]/50" />
      </div>

      {/* Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#20C997]/10 rounded-full blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-[#79EEDE]/10 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pt-16 sm:pt-20 pb-24 sm:pb-28 lg:pb-32 flex flex-col lg:flex-row items-center gap-12">

        {/* LEFT */}
        <div className="lg:w-3/5 text-center lg:text-left">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#20C997]/15 border border-[#20C997]/40 text-[#E8F3F2] px-5 py-2 rounded-full backdrop-blur-md shadow-lg">

            <Sparkles className="w-4 h-4 text-[#79EEDE]" />

            <span className="text-sm font-semibold">
              Tahun Ajaran 2025/2026
            </span>

          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl text-white font-extrabold leading-tight tracking-tight">
            Selamat Datang di <br />
            <span className="text-[#8cf4ea] dark:text-teal-300 drop-shadow-sm">
              SD Negeri 1 Mulyoagung
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-100 dark:text-slate-200 max-w-2xl leading-relaxed opacity-95">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum tenetur, quia voluptates ullam quidem odio et aut vel, ipsa odit, officiis non atque possimus commodi aperiam voluptatem eveniet. Sint, assumenda.
            Ipsam atque nam natus saepe fugiat ut nostrum, ex consectetur quos possimus, eaque aut soluta recusandae officia est perferendis quo dolor asperiores reprehenderit et laborum. Voluptatem nesciunt ut ex nihil.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">

            {/* PPDB */}
            <button
              onClick={onOpenPpdb}
              className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#156B63] hover:bg-[#20C997] text-white font-semibold transition-all duration-300 shadow-xl hover:scale-105 hover:shadow-[#20C997]/30"
            >

              PPDB Online

              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />

            </button>

            {/* Profil */}
            <button
              onClick={() => {
                setActiveTab('profile');
                const el = document.getElementById('profile-section');
                if (el) {
                  el.scrollIntoView({
                    behavior: 'smooth',
                  });
                }
              }}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-[#79EEDE] bg-white/5 hover:bg-[#79EEDE]/10 text-[#E8F3F2] backdrop-blur-md transition-all duration-300"
            >

              <BookOpen className="w-5 h-5 text-[#79EEDE]" />

              Profil Sekolah

            </button>

          </div>

        </div>

        {/* RIGHT */}
        <div className="hidden lg:flex lg:w-2/5 justify-center">

          <div className="relative max-w-[400px] w-full">

            {/* Glow */}
            <div className="absolute inset-0 bg-[#79EEDE]/15 rounded-3xl blur-3xl"></div>

            {/* Card */}
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-3 shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500">

              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800"
                alt="SD Negeri Mulyoagung 1"
                className="rounded-2xl object-cover w-full h-[480px]"
              />
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 px-4 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold">Lorem, ipsum.</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};