import React, { useState } from 'react';
import { SCHOOL_FACILITIES } from '../data/schoolData';
import { Target, Compass, History, Monitor, BookOpen, Activity, HeartPulse, Coffee, Trees, CheckCircle2 } from 'lucide-react';

export const SchoolProfileSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visi-misi' | 'sejarah' | 'fasilitas'>('visi-misi');

  const getFacilityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Monitor':
        return <Monitor className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case 'Trees':
        return <Trees className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      default:
        return <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
    }
  };

  return (
    <section id="profile-section" className="w-full py-16 sm:py-20 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-[#028C84] dark:text-teal-400 font-bold text-xs uppercase tracking-wider bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
            <Compass className="w-4 h-4" />
            Mengenal Sekolah Kami
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A8A] dark:text-blue-300">
            Profil SD Negeri Mulyoagung 1
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Landasan visi pendidik, kilasan sejarah pengabdian, serta fasilitas sarana pendukung pembelajaran
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center border-b border-slate-200 dark:border-slate-800 max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab('visi-misi')}
            className={`py-3 px-6 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'visi-misi'
                ? 'border-[#028C84] text-[#028C84] dark:border-teal-400 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Visi & Misi
          </button>
          <button
            onClick={() => setActiveTab('sejarah')}
            className={`py-3 px-6 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'sejarah'
                ? 'border-[#028C84] text-[#028C84] dark:border-teal-400 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Sejarah Sekolah
          </button>
          <button
            onClick={() => setActiveTab('fasilitas')}
            className={`py-3 px-6 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'fasilitas'
                ? 'border-[#028C84] text-[#028C84] dark:border-teal-400 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Fasilitas Pembelajaran
          </button>
        </div>

        {/* Tab 1: Visi & Misi */}
        {activeTab === 'visi-misi' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-fade-in">
            {/* Visi */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#1E3A8A] text-white">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1E3A8A] dark:text-blue-300">
                  Visi Sekolah
                </h3>
              </div>
              <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 font-semibold leading-relaxed border-l-4 border-[#028C84] pl-4 py-2 bg-white dark:bg-slate-800/80 rounded-r-xl">
                "Terwujudnya Peserta Didik yang Beriman, Budi Pekerti Luhur, Berprestasi Akademik & Non-Akademik, Berwawasan Teknologi, dan Berbudaya Lingkungan."
              </p>
            </div>

            {/* Misi */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#028C84] text-white">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1E3A8A] dark:text-blue-300">
                  Misi Utama Sekolah
                </h3>
              </div>
              <ul className="space-y-3 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span>Menanamkan nilai-nilai keagamaan, kejujuran, dan sopan santun melalui kegiatan keagamaan harian.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span>Diselenggarakannya pembelajaran P5 (Profil Pelajar Pancasila) berbasis projek kearifan lokal.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span>Mengoptimalkan integrasi literasi digital dan pemanfaatan media TIK dalam pembelajaran harian.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span>Mengembangkan bakat seni, budaya, serta cabang olahraga secara intensif melalui ekstrakurikuler.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span>Mewujudkan lingkungan sekolah yang bersih, hijau, sehat, dan berwawasan lingkungan adiwiyata.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Sejarah */}
        {activeTab === 'sejarah' && (
          <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 lg:p-12 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500 text-white">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#1E3A8A] dark:text-blue-300">
                Sejarah Singkat SD Negeri Mulyoagung 1
              </h3>
            </div>

            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
              <p>
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
                className="bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover-lift flex flex-col"
              >
                <div className="h-44 w-full overflow-hidden relative">
                  <img
                    src={fac.image}
                    alt={fac.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2 rounded-xl shadow">
                    {getFacilityIcon(fac.iconName)}
                  </div>
                </div>

                <div className="p-6 space-y-2 flex-grow">
                  <h4 className="font-bold text-base text-[#1E3A8A] dark:text-blue-200">
                    {fac.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {fac.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
