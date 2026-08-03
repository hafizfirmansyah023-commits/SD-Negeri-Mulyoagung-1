import React from 'react';
import { PRINCIPAL_INFO } from '../data/schoolData';
import { Quote } from 'lucide-react';

export const PrincipalGreeting: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 mb-16">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm border-t-4 border-t-[#028C84] border-x border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Principal Image */}
          <div className="lg:w-1/3 flex flex-col items-center justify-center shrink-0">
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-8 border-slate-100 dark:border-slate-800 p-2 bg-white dark:bg-slate-900 shadow-lg">
              <img
                src={PRINCIPAL_INFO.photo}
                alt={PRINCIPAL_INFO.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="font-bold text-lg sm:text-xl text-[#1E3A8A] dark:text-blue-300">
                {PRINCIPAL_INFO.name}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-[#028C84] dark:text-teal-400">
                {PRINCIPAL_INFO.title}
              </p>
            </div>
          </div>

          {/* Principal Message */}
          <div className="lg:w-2/3 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-[#028C84] dark:text-teal-400">
                <Quote className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A8A] dark:text-blue-300">
                Sambutan Kepala Sekolah
              </h2>
            </div>

            <div className="border-l-4 border-[#F9A825] dark:border-amber-400 pl-5 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-r-2xl border-y border-r border-slate-200/50 dark:border-slate-700/50">
              <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed whitespace-pre-line italic">
                {PRINCIPAL_INFO.greeting}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                SD Negeri Mulyoagung 1 - Kecamatan Dau, Kab. Malang
              </span>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                Pendidikan Karakter
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
