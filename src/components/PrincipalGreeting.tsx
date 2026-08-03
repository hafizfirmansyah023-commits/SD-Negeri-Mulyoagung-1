import React from 'react';
import { PRINCIPAL_INFO } from '../data/schoolData';
import { Quote } from 'lucide-react';

export const PrincipalGreeting: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 mb-16 relative">
      <div className="gray-liquid-glass rounded-[2.5rem] p-6 sm:p-10 lg:p-12 relative overflow-hidden transition-all duration-300">
        {/* Specular Gloss Reflection */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/70 to-transparent pointer-events-none rounded-t-[2.5rem]" />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center relative z-10">
          {/* Principal Image */}
          <div className="lg:w-1/3 flex flex-col items-center justify-center shrink-0">
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-8 border-white/90 p-2 bg-white/80 backdrop-blur-md shadow-lg">
              <img
                src={PRINCIPAL_INFO.photo}
                alt={PRINCIPAL_INFO.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="font-extrabold text-lg sm:text-xl text-[#1E3A8A]">
                {PRINCIPAL_INFO.name}
              </p>
              <p className="text-xs sm:text-sm font-bold text-[#028C84]">
                {PRINCIPAL_INFO.title}
              </p>
            </div>
          </div>

          {/* Principal Message */}
          <div className="lg:w-2/3 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200/80 text-[#028C84] shadow-sm">
                <Quote className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A8A]">
                Sambutan Kepala Sekolah
              </h2>
            </div>

            <div className="border-l-4 border-[#F9A825] pl-5 bg-white/75 backdrop-blur-md p-5 sm:p-6 rounded-2xl border-y border-r border-white/90 shadow-sm">
              <p className="text-slate-800 text-base sm:text-lg leading-relaxed whitespace-pre-line italic">
                {PRINCIPAL_INFO.greeting}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">
                SD Negeri Mulyoagung 1 - Kecamatan Dau, Kab. Malang
              </span>
              <span className="text-xs font-bold text-[#028C84] bg-white/90 px-3.5 py-1.5 rounded-full border border-teal-200/80 shadow-sm">
                Pendidikan Karakter
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
