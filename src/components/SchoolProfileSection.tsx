import React, { useState } from 'react';
import { SCHOOL_FACILITIES } from '../data/schoolData';
import { Target, Compass, History, Monitor, BookOpen, Activity, HeartPulse, Coffee, Trees, CheckCircle2, Sparkles } from 'lucide-react';

export const SchoolProfileSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visi-misi' | 'sejarah' | 'fasilitas'>('visi-misi');

  const getFacilityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Monitor':
        return <Monitor className="w-5 h-5 text-[#028C84]" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-[#028C84]" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-[#028C84]" />;
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5 text-[#028C84]" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-[#028C84]" />;
      case 'Trees':
        return <Trees className="w-5 h-5 text-[#028C84]" />;
      default:
        return <BookOpen className="w-5 h-5 text-[#028C84]" />;
    }
  };

  return (
    <section id="profile-section" className="relative w-full py-16 sm:py-24 bg-gradient-to-b from-white via-teal-50/30 to-white overflow-hidden transition-colors">
      {/* Decorative subtle ambient glows for white background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-[#028C84] font-bold text-xs uppercase tracking-wider bg-teal-50/80 border border-teal-200/80 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-md">
            <Compass className="w-4 h-4 text-[#028C84]" />
            Mengenal Sekolah Kami
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[black] tracking-tight">
            Profil SD Negeri 1 Mulyoagung
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Landasan visi pendidik, kilasan sejarah pengabdian, serta fasilitas sarana pendukung pembelajaran
          </p>
        </div>

        {/* Liquid Glass Pill Tab Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-full bg-white/70 backdrop-blur-xl border border-teal-100 shadow-[0_4px_20px_0_rgba(2,140,132,0.08)] space-x-1">
            <button
              onClick={() => setActiveTab('visi-misi')}
              className={`py-2.5 px-6 text-xs sm:text-sm font-bold rounded-full transition-all duration-300 cursor-pointer ${
                activeTab === 'visi-misi'
                  ? 'bg-gradient-to-r from-[#028C84] to-[#156B63] text-white shadow-md shadow-teal-700/20 scale-[1.02]'
                  : 'text-slate-600 hover:text-[#028C84] hover:bg-teal-50/50'
              }`}
            >
              Visi & Misi
            </button>
            <button
              onClick={() => setActiveTab('sejarah')}
              className={`py-2.5 px-6 text-xs sm:text-sm font-bold rounded-full transition-all duration-300 cursor-pointer ${
                activeTab === 'sejarah'
                  ? 'bg-gradient-to-r from-[#028C84] to-[#156B63] text-white shadow-md shadow-teal-700/20 scale-[1.02]'
                  : 'text-slate-600 hover:text-[#028C84] hover:bg-teal-50/50'
              }`}
            >
              Sejarah Sekolah
            </button>
            <button
              onClick={() => setActiveTab('fasilitas')}
              className={`py-2.5 px-6 text-xs sm:text-sm font-bold rounded-full transition-all duration-300 cursor-pointer ${
                activeTab === 'fasilitas'
                  ? 'bg-gradient-to-r from-[#028C84] to-[#156B63] text-white shadow-md shadow-teal-700/20 scale-[1.02]'
                  : 'text-slate-600 hover:text-[#028C84] hover:bg-teal-50/50'
              }`}
            >
              Fasilitas Pembelajaran
            </button>
          </div>
        </div>

        {/* Tab 1: Visi & Misi */}
        {activeTab === 'visi-misi' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-fade-in">
            {/* Visi Liquid Glass Card */}
            <div className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(2,140,132,0.12)] hover:border-teal-200/80 transition-all duration-300 space-y-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-100/40 to-transparent rounded-tr-3xl pointer-events-none" />
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#1e40af] text-white shadow-md shadow-blue-950/20">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Arah Pendirian</span>
                  <h3 className="text-xl font-extrabold text-[#1E3A8A]">
                    Visi Sekolah
                  </h3>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-teal-50/90 via-white/80 to-teal-50/40 border border-teal-100/80 shadow-inner">
                <p className="text-base sm:text-lg text-slate-800 font-bold leading-relaxed border-l-4 border-[#028C84] pl-4">
                  "Terwujudnya Peserta Didik yang Beriman, Budi Pekerti Luhur, Berprestasi Akademik & Non-Akademik, Berwawasan Teknologi, dan Berbudaya Lingkungan."
                </p>
              </div>
            </div>

            {/* Misi Liquid Glass Card */}
            <div className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(2,140,132,0.12)] hover:border-teal-200/80 transition-all duration-300 space-y-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-100/40 to-transparent rounded-tr-3xl pointer-events-none" />
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#028C84] to-[#156B63] text-white shadow-md shadow-teal-900/20">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Langkah Strategis</span>
                  <h3 className="text-xl font-extrabold text-[#1E3A8A]">
                    Misi Utama Sekolah
                  </h3>
                </div>
              </div>
              <ul className="space-y-3.5 text-sm sm:text-base text-slate-700">
                <li className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50/60 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-[#028C84] shrink-0 mt-0.5" />
                  <span>Menanamkan nilai-nilai keagamaan, kejujuran, dan sopan santun melalui kegiatan keagamaan harian.</span>
                </li>
                <li className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50/60 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-[#028C84] shrink-0 mt-0.5" />
                  <span>Diselenggarakannya pembelajaran P5 (Profil Pelajar Pancasila) berbasis projek kearifan lokal.</span>
                </li>
                <li className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50/60 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-[#028C84] shrink-0 mt-0.5" />
                  <span>Mengoptimalkan integrasi literasi digital dan pemanfaatan media TIK dalam pembelajaran harian.</span>
                </li>
                <li className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50/60 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-[#028C84] shrink-0 mt-0.5" />
                  <span>Mengembangkan bakat seni, budaya, serta cabang olahraga secara intensif melalui ekstrakurikuler.</span>
                </li>
                <li className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50/60 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-[#028C84] shrink-0 mt-0.5" />
                  <span>Mewujudkan lingkungan sekolah yang bersih, hijau, sehat, dan berwawasan lingkungan adiwiyata.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Sejarah */}
        {activeTab === 'sejarah' && (
          <div className="relative bg-white/75 backdrop-blur-xl rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(2,140,132,0.12)] hover:border-teal-200/80 transition-all duration-300 space-y-6 animate-fade-in overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-100/40 to-transparent rounded-tr-3xl pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md shadow-amber-900/20">
                <History className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Perjalanan Pengabdian</span>
                <h3 className="text-2xl font-extrabold text-[#1E3A8A]">
                  Sejarah Singkat SD Negeri Mulyoagung 1
                </h3>
              </div>
            </div>

            <div className="prose max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 pt-2">
              <p className="p-4 bg-teal-50/40 rounded-2xl border border-teal-100/60">
                SD Negeri Mulyoagung 1 didirikan sejak tahun 1978 sebagai wujud perhatian pemerintah daerah terhadap akses pendidikan dasar bermutu di wilayah Kecamatan Dau, Kabupaten Malang.
              </p>
              <p>
                Berdiri di atas tanah seluas lebih dari 2.500 m², sekolah ini terus bertransformasi mengiringi perkembangan jaman. Dari yang semula berawal dari bangunan sederhana dengan 6 ruang kelas, kini SD Negeri Mulyoagung 1 telah menjelma menjadi sekolah rujukan berakreditasi A yang dilengkapi sarana multimedia, laboratorium komputer, perpustakaan digital, serta berbagai sarana pendukung modern.
              </p>
              <p>
                Ribuan lulusan alumni terbaik telah lahir dan melanjutkan pendidikan ke jenjang terbaik di Kabupaten Malang hingga luar daerah. Komitmen kami tetap konsisten: mendidik dengan hati, mengutamakan akhlak mulia, dan mencetak generasi unggul yang siap menjawab tantangan masa depan.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Fasilitas */}
        {activeTab === 'fasilitas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {SCHOOL_FACILITIES.map((fac) => (
              <div
                key={fac.id}
                className="group relative bg-white/75 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/80 shadow-[0_8px_25px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_35px_rgba(2,140,132,0.14)] hover:border-teal-200/80 transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                <div className="h-48 w-full overflow-hidden relative">
                  <img
                    src={fac.image}
                    alt={fac.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/85 backdrop-blur-md p-2.5 rounded-2xl shadow-md border border-white/60">
                    {getFacilityIcon(fac.iconName)}
                  </div>
                </div>

                <div className="p-6 space-y-2 flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-lg text-[#1E3A8A] group-hover:text-[#028C84] transition-colors">
                      {fac.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                      {fac.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
