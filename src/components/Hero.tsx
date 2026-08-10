import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { NavTab } from '../types';
import heroImg from '../assets/images/img1.webp';
import heroImg1 from '../assets/images/img2.webp';
import { getApiBaseUrl } from '../config/api';

interface HeroProps {
  onOpenPpdb: () => void;
  setActiveTab: (tab: NavTab) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenPpdb,
  setActiveTab,
}) => {
  const [tahunAjaran, setTahunAjaran] = useState('2025/2026');

  useEffect(() => {
    const fetchTahunAjaran = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/backend/API/pengaturan.php`);
        const data = await response.json();
        if (data.status === 'success' && data.tahun_ajaran) {
          setTahunAjaran(data.tahun_ajaran);
        }
      } catch (err) {
        // Keep default fallback
      }
    };
    fetchTahunAjaran();
  }, []);

  return (
    // min-h diperkecil untuk mobile agar tidak terlalu kosong ke bawah
    <section className="relative w-full min-h-[480px] sm:min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-[#0D4A46]">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="bg-cover bg-center w-full h-full opacity-30 scale-105"
          style={{
            backgroundImage: `url(${heroImg1})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D4A46]/0 to-[#156B63]/50" />
      </div>

      {/* Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-[#20C997]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] bg-[#79EEDE]/10 rounded-full blur-3xl"></div>

      {/* Content */}
      {/* Padding Y (atas-bawah) diperkecil untuk mobile */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-20 sm:pt-24 lg:pt-16 pb-16 sm:pb-28 lg:pb-32 flex flex-col lg:flex-row items-center gap-8 sm:gap-12">

        {/* LEFT */}
        {/* space-y-4 agar jarak antar teks lebih teratur */}
        <div className="lg:w-3/5 text-center lg:text-left space-y-4 sm:space-y-6">

          {/* Badge */}
          {/* Padding dan font diperkecil di mobile */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#20C997]/15 border border-[#20C997]/40 text-[#E8F3F2] px-3 py-1.5 sm:px-5 sm:py-2 rounded-full backdrop-blur-md shadow-lg">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#79EEDE]" />
            <span className="text-[10px] sm:text-sm font-semibold">
              Tahun Ajaran {tahunAjaran}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl text-white font-extrabold leading-[1.15] tracking-tight">
            Selamat Datang di <br className="hidden sm:block" />
            <span className="text-[#8cf4ea] dark:text-teal-300 drop-shadow-sm">
              SD Negeri 1 Mulyoagung
            </span>
          </h1>

          <p className="text-[13px] sm:text-lg lg:text-xl text-slate-100 dark:text-slate-200 max-w-2xl leading-snug sm:leading-relaxed opacity-95 mx-auto lg:mx-0">
            Selamat datang di SD Negeri 1 Mulyoagung, sekolah yang berkomitmen menciptakan lingkungan belajar yang aman, nyaman, dan inspiratif. Kami menghadirkan pendidikan berkualitas untuk membentuk peserta didik yang beriman, 
            berakhlak mulia, berprestasi, kreatif, serta siap menghadapi perkembangan ilmu pengetahuan dan teknologi di masa depan.
          </p>

          {/* Buttons */}
          {/* mt diubah, gap dirapatkan, padding tombol lebih efisien */}
          <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center lg:justify-start">

            {/* PPDB */}
            <button
              onClick={onOpenPpdb}
              className="group flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-[#156B63] hover:bg-[#20C997] text-white text-sm sm:text-base font-semibold transition-all duration-300 shadow-xl hover:scale-105 hover:shadow-[#20C997]/30"
            >
              PPDB Online
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
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
              className="flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-full border-2 border-[#79EEDE] bg-white/5 hover:bg-[#79EEDE]/10 text-[#E8F3F2] text-sm sm:text-base backdrop-blur-md transition-all duration-300"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#79EEDE]" />
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
                src={heroImg}
                alt="SD Negeri Mulyoagung 1"
                className="rounded-2xl object-cover w-full h-[480px]"
              />
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 px-4 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold">"MA ONE Bergelora!"</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};