import React from 'react';
import { ArrowLeftRight, BookOpen, Eye, School, User } from 'lucide-react';
import { Teacher } from '../../types';
import { KELAS_A_LIST, KELAS_B_LIST, getMapelGroups, getTeacherNameByRole } from '../../utils/directoryHelpers';

interface OrgChartSectionProps {
  teachers: Teacher[];
  onCardClick: (roleOrTask: string, fallbackName: string) => void;
  onMapelGroupClick: (teacher: Teacher) => void;
}

export const OrgChartSection: React.FC<OrgChartSectionProps> = ({ teachers, onCardClick, onMapelGroupClick }) => {
  const mapelGroups = React.useMemo(() => getMapelGroups(teachers), [teachers]);
  const getName = (code: string, fallback: string) => getTeacherNameByRole(teachers, code, fallback);

  return (
    <div
      id="bagan-struktur-section"
      className="bg-white/80 backdrop-blur-xl p-3 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border-2 border-teal-300/60 shadow-[0_15px_40px_rgba(2,140,132,0.08)] space-y-4 sm:space-y-6 scroll-mt-24"
    >
      {/* Header Banner Bagan */}
      <div className="relative bg-gradient-to-r from-[#0D4A46] via-[#028C84] to-teal-500 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center text-white shadow-lg overflow-hidden border border-teal-400">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 px-1 sm:px-6">
          <div className="hidden sm:flex items-center gap-2 text-yellow-300 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
            <BookOpen className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm sm:text-2xl font-black tracking-wide text-white uppercase drop-shadow-md leading-snug">
              BAGAN STRUKTUR ORGANISASI SD NEGERI 1 MULYOAGUNG
            </h3>
            <p className="text-[11px] sm:text-base font-extrabold text-amber-300 tracking-wider flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5">
              <span>TAHUN AJARAN 2025/2026</span>
              <span className="text-white/90 font-normal text-[10px] sm:text-xs bg-black/20 px-2 py-0.5 rounded-full mt-1 sm:mt-0">
                (Klik kotak untuk ringkasan profil)
              </span>
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-yellow-300 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
            <School className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Indikator Scroll untuk Mobile */}
      <div className="block lg:hidden text-center pt-2">
        <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-[10px] font-bold px-3 py-1.5 rounded-full border border-teal-200 animate-pulse shadow-sm">
          <ArrowLeftRight className="w-3 h-3" />
          Geser layar ke kanan/kiri untuk melihat bagan penuh
        </span>
      </div>

      {/* Org Chart Flow Diagram Container */}
      <div className="overflow-x-auto pb-4 pt-1 sm:pt-2 rounded-xl">
        <div className="min-w-[1000px] space-y-5 sm:space-y-6 px-2 sm:px-4">
          
          {/* TOP LEVEL: KOMITE SEKOLAH <---> KEPALA SEKOLAH */}
          <div className="flex justify-center items-center gap-6 sm:gap-10 relative">
            <div
              onClick={() => onCardClick('komite sekolah', 'SOLEH')}
              className="w-64 sm:w-72 border-2 border-sky-500 rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group shrink-0"
            >
              <div className="bg-sky-600 text-white font-extrabold text-[11px] sm:text-xs uppercase px-3 py-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-white" />
                  <span>KOMITE SEKOLAH</span>
                </span>
                <Eye className="w-3.5 h-3.5 text-sky-200 group-hover:text-white" />
              </div>
              <div className="p-2.5 sm:p-3 bg-gradient-to-b from-sky-50 to-white flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-100 border border-red-400 flex items-center justify-center text-red-500 shrink-0 shadow-sm">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="font-extrabold text-[11px] sm:text-xs text-slate-800 uppercase leading-snug break-words">
                  {getName('komite sekolah', 'SOLEH')}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center text-slate-700 bg-slate-100 border border-slate-300 p-2 sm:p-2.5 rounded-full shadow-sm shrink-0">
              <ArrowLeftRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-800 stroke-[2.5]" />
            </div>

            <div
              onClick={() => onCardClick('kepala sekolah', 'AMALIA DYAH ERVIANA, S.Pd.')}
              className="w-64 sm:w-72 border-2 border-blue-700 rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group shrink-0"
            >
              <div className="bg-blue-800 text-white font-extrabold text-[11px] sm:text-xs uppercase px-3 py-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-white" />
                  <span>KEPALA SEKOLAH</span>
                </span>
                <Eye className="w-3.5 h-3.5 text-blue-200 group-hover:text-white" />
              </div>
              <div className="p-2.5 sm:p-3 bg-gradient-to-b from-blue-50 to-white flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-100 border border-red-400 flex items-center justify-center text-red-500 shrink-0 shadow-sm">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="font-extrabold text-[11px] sm:text-xs text-slate-800 uppercase leading-snug break-words">
                  {getName('kepala sekolah', 'AMALIA DYAH ERVIANA, S.Pd.')}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-0.5 h-5 sm:h-6 bg-slate-800" />
            <div className="w-[85%] h-0.5 bg-slate-800 relative">
              <div className="absolute top-0 left-0 -translate-x-1/2 w-0.5 h-4 sm:h-5 bg-slate-800" />
              <div className="absolute top-0 left-[24%] -translate-x-1/2 w-0.5 h-4 sm:h-5 bg-slate-800" />
              <div className="absolute top-0 left-[62%] -translate-x-1/2 w-0.5 h-4 sm:h-5 bg-slate-800" />
              <div className="absolute top-0 right-0 translate-x-1/2 w-0.5 h-4 sm:h-5 bg-slate-800" />
            </div>
          </div>

          {/* 4 MAIN BRANCH COLUMNS - Diubah menjadi items-start agar card menyesuaikan tinggi data */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4 items-start pt-2 sm:pt-3">
            
            {/* COLUMN 1: TATA USAHA & UNIT PERPUSTAKAAN */}
            <div className="border-2 border-orange-500 rounded-xl sm:rounded-2xl overflow-hidden bg-orange-50/40 p-2 sm:p-2.5 flex flex-col gap-2.5 sm:gap-3 shadow-sm w-full">
              <div className="bg-orange-600 text-white font-black text-[11px] sm:text-xs uppercase px-1 sm:px-2 py-1.5 rounded-lg text-center tracking-wide shrink-0">
                ADMINISTRASI
              </div>

              <div
                onClick={() => onCardClick('tata usaha', 'ANISA CHOIRINA, S.Pd.')}
                className="border border-orange-400 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
              >
                <div className="bg-orange-500 text-white font-extrabold text-[10px] sm:text-xs uppercase px-2 py-1 text-center">
                  TATA USAHA
                </div>
                <div className="p-2 sm:p-2.5 flex items-center gap-1.5 sm:gap-2 bg-orange-50/30">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="font-extrabold text-[10px] sm:text-xs text-slate-800 uppercase leading-snug break-words">
                    {getName('tata usaha', 'ANISA CHOIRINA, S.Pd.')}
                  </div>
                </div>
              </div>

              <div
                onClick={() => onCardClick('unit perpustakaan', 'ANISA CHOIRINA, S.Pd.')}
                className="border border-orange-400 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
              >
                <div className="bg-orange-500 text-white font-extrabold text-[10px] sm:text-xs uppercase px-2 py-1 text-center">
                  PERPUSTAKAAN
                </div>
                <div className="p-2 sm:p-2.5 flex items-center gap-1.5 sm:gap-2 bg-orange-50/30">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="font-extrabold text-[10px] sm:text-xs text-slate-800 uppercase leading-snug break-words">
                    {getName('unit perpustakaan', 'ANISA CHOIRINA, S.Pd.')}
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: GURU MATA PELAJARAN */}
            <div className="border-2 border-emerald-600 rounded-xl sm:rounded-2xl overflow-hidden bg-emerald-50/40 p-2 sm:p-2.5 flex flex-col gap-2.5 sm:gap-3 shadow-sm w-full">
              <div className="bg-emerald-700 text-white font-black text-[11px] sm:text-xs uppercase px-1 sm:px-2 py-1.5 rounded-lg text-center tracking-wide shrink-0">
                GURU MATA PELAJARAN
              </div>

              {mapelGroups.length > 0 ? (
                mapelGroups.map((group) => (
                  <div
                    key={group.label}
                    className="border border-emerald-500 rounded-xl overflow-hidden bg-white shadow-sm"
                  >
                    <div className="bg-emerald-600 text-white font-extrabold text-[10px] sm:text-xs uppercase px-2 py-1 text-center">
                      {group.label}
                    </div>
                    <div className="p-2 flex flex-col gap-1 bg-emerald-50/30">
                      {group.teachers.map((t, idx) => (
                        <React.Fragment key={t.id}>
                          {idx > 0 && (
                            <div className="text-[10px] font-extrabold text-emerald-800 text-center uppercase py-0.5">&</div>
                          )}
                          <div 
                            onClick={() => onMapelGroupClick(t)}
                            className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-lg hover:bg-emerald-100 cursor-pointer group transition-colors"
                          >
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0 group-hover:bg-emerald-200 group-hover:border-emerald-500 transition-colors">
                              <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </div>
                            <div className="font-extrabold text-[10px] sm:text-xs text-slate-800 uppercase leading-snug break-words group-hover:text-emerald-700 transition-colors">
                              {t.name}
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-[10px] sm:text-[11px] text-slate-400 italic py-3">
                  Belum ada data
                </div>
              )}
            </div>

            {/* COLUMN 3: GURU KELAS (2 SUB-COLUMNS) */}
            <div className="border-2 border-emerald-700 rounded-xl sm:rounded-2xl overflow-hidden bg-emerald-50/40 p-2 sm:p-2.5 flex flex-col gap-2.5 sm:gap-3 shadow-sm w-full col-span-1">
              <div className="bg-emerald-800 text-white font-black text-[11px] sm:text-xs uppercase px-1 sm:px-2 py-1.5 rounded-lg text-center tracking-wide shrink-0">
                GURU KELAS
              </div>

              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                {/* Left Column (1A - 6A) */}
                <div className="flex flex-col gap-1.5 sm:gap-2">
                  {KELAS_A_LIST.map((item) => (
                    <div
                      key={item.label}
                      onClick={() => onCardClick(item.code, item.default)}
                      className="border border-emerald-400 rounded-lg sm:rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <div className="bg-emerald-600 text-white font-extrabold text-[10px] sm:text-[11px] uppercase py-1 px-1 text-center">
                        {item.label}
                      </div>
                      <div className="p-1 sm:p-1.5 flex items-center gap-1 sm:gap-1.5 bg-emerald-50/20">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                          <User className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                        </div>
                        <div className="font-extrabold text-[9px] sm:text-[11px] text-slate-800 uppercase leading-tight break-words">
                          {getName(item.code, item.default)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Column (1B - 6B) */}
                <div className="flex flex-col gap-1.5 sm:gap-2">
                  {KELAS_B_LIST.map((item) => (
                    <div
                      key={item.label}
                      onClick={() => onCardClick(item.code, item.default)}
                      className="border border-emerald-400 rounded-lg sm:rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <div className="bg-emerald-600 text-white font-extrabold text-[10px] sm:text-[11px] uppercase py-1 px-1 text-center">
                        {item.label}
                      </div>
                      <div className="p-1 sm:p-1.5 flex items-center gap-1 sm:gap-1.5 bg-emerald-50/20">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                          <User className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                        </div>
                        <div className="font-extrabold text-[9px] sm:text-[11px] text-slate-800 uppercase leading-tight break-words">
                          {getName(item.code, item.default)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUMN 4: TENAGA KEPENDIDIKAN */}
            <div className="border-2 border-amber-400 rounded-xl sm:rounded-2xl overflow-hidden bg-amber-50/40 p-2 sm:p-2.5 flex flex-col gap-2.5 sm:gap-3 shadow-sm w-full">
              <div className="bg-amber-400 text-slate-900 font-black text-[11px] sm:text-xs uppercase px-1 sm:px-2 py-1.5 rounded-lg text-center tracking-wide shrink-0">
                TENAGA KEPENDIDIKAN
              </div>

              <div
                onClick={() => onCardClick('penjaga', 'ABDUL MUJIB')}
                className="border border-amber-300 rounded-xl overflow-hidden bg-white hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
              >
                <div className="bg-amber-300 text-slate-900 font-extrabold text-[10px] sm:text-xs uppercase px-2 py-1 text-center">
                  PENJAGA
                </div>
                <div className="p-2 sm:p-2.5 flex items-center gap-1.5 sm:gap-2 bg-amber-50/30">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="font-extrabold text-[10px] sm:text-xs text-slate-800 uppercase leading-snug break-words">
                    {getName('penjaga', 'ABDUL MUJIB')}
                  </div>
                </div>
              </div>

              <div
                onClick={() => onCardClick('tenaga kebersihan', 'MARSUDI')}
                className="border border-amber-300 rounded-xl overflow-hidden bg-white hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
              >
                <div className="bg-amber-300 text-slate-900 font-extrabold text-[10px] sm:text-xs uppercase px-2 py-1 text-center">
                  TENAGA KEBERSIHAN
                </div>
                <div className="p-2 sm:p-2.5 flex items-center gap-1.5 sm:gap-2 bg-amber-50/30">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="font-extrabold text-[10px] sm:text-xs text-slate-800 uppercase leading-snug break-words">
                    {getName('tenaga kebersihan', 'MARSUDI')}
                  </div>
                </div>
              </div>

              <div
                onClick={() => onCardClick('tenaga keamanan', 'AGUS SUKOCO')}
                className="border border-amber-300 rounded-xl overflow-hidden bg-white hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
              >
                <div className="bg-amber-300 text-slate-900 font-extrabold text-[10px] sm:text-xs uppercase px-2 py-1 text-center">
                  TENAGA KEAMANAN
                </div>
                <div className="p-2 sm:p-2.5 flex items-center gap-1.5 sm:gap-2 bg-amber-50/30">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="font-extrabold text-[10px] sm:text-xs text-slate-800 uppercase leading-snug break-words">
                    {getName('tenaga keamanan', 'AGUS SUKOCO')}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};