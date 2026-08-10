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
      className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-3xl border-2 border-sky-300/60 shadow-[0_15px_40px_rgba(2,140,132,0.08)] space-y-6 scroll-mt-24"
    >
      {/* Header Banner Bagan */}
      <div className="relative bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 rounded-2xl p-4 sm:p-5 text-center text-white shadow-lg overflow-hidden border border-sky-400">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 px-2 sm:px-6">
          <div className="hidden sm:flex items-center gap-2 text-yellow-300 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
            <BookOpen className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-lg sm:text-2xl font-black tracking-wide text-white uppercase drop-shadow-md">
              BAGAN STRUKTUR ORGANISASI SD NEGERI 1 MULYOAGUNG
            </h3>
            <p className="text-xs sm:text-base font-extrabold text-amber-300 tracking-wider mt-0.5 flex items-center justify-center gap-1.5">
              <span>TAHUN AJARAN 2025/2026</span>
              <span className="text-white/80 font-normal text-xs bg-white/20 px-2 py-0.5 rounded-full">
                (Klik kotak untuk ringkasan profil)
              </span>
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-yellow-300 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
            <School className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Org Chart Flow Diagram Container (Scrollable on small screens) */}
      <div className="overflow-x-auto pb-4 pt-2">
        <div className="min-w-[1000px] space-y-6 px-4">
          {/* TOP LEVEL: KOMITE SEKOLAH <---> KEPALA SEKOLAH */}
          <div className="flex justify-center items-center gap-10 relative">
            {/* Komite Sekolah */}
            <div
              onClick={() => onCardClick('komite sekolah', 'SOLEH')}
              className="w-72 border-2 border-sky-500 rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
            >
              <div className="bg-sky-600 text-white font-extrabold text-xs uppercase px-3 py-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-white" />
                  <span>KOMITE SEKOLAH</span>
                </span>
                <Eye className="w-3.5 h-3.5 text-sky-200 group-hover:text-white" />
              </div>
              <div className="p-3 bg-gradient-to-b from-sky-50 to-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 border border-red-400 flex items-center justify-center text-red-500 shrink-0 shadow-sm">
                  <User className="w-6 h-6" />
                </div>
                <div className="font-extrabold text-xs text-slate-800 uppercase leading-snug break-words">
                  {getName('komite sekolah', 'SOLEH')}
                </div>
              </div>
            </div>

            {/* Double Arrow Connector */}
            <div className="flex items-center justify-center text-slate-700 bg-slate-100 border border-slate-300 p-2.5 rounded-full shadow-sm">
              <ArrowLeftRight className="w-5 h-5 text-slate-800 stroke-[2.5]" />
            </div>

            {/* Kepala Sekolah */}
            <div
              onClick={() => onCardClick('kepala sekolah', 'AMALIA DYAH ERVIANA, S.Pd.')}
              className="w-80 border-2 border-blue-700 rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
            >
              <div className="bg-blue-800 text-white font-extrabold text-xs uppercase px-3 py-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-white" />
                  <span>KEPALA SEKOLAH</span>
                </span>
                <Eye className="w-3.5 h-3.5 text-blue-200 group-hover:text-white" />
              </div>
              <div className="p-3 bg-gradient-to-b from-blue-50 to-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 border border-red-400 flex items-center justify-center text-red-500 shrink-0 shadow-sm">
                  <User className="w-6 h-6" />
                </div>
                <div className="font-extrabold text-xs text-slate-800 uppercase leading-snug break-words">
                  {getName('kepala sekolah', 'AMALIA DYAH ERVIANA, S.Pd.')}
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Trunk Line from Kepala Sekolah down to tree */}
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-6 bg-slate-800" />
            <div className="w-[85%] h-0.5 bg-slate-800 relative">
              <div className="absolute top-0 left-0 -translate-x-1/2 w-0.5 h-5 bg-slate-800" />
              <div className="absolute top-0 left-[24%] -translate-x-1/2 w-0.5 h-5 bg-slate-800" />
              <div className="absolute top-0 left-[62%] -translate-x-1/2 w-0.5 h-5 bg-slate-800" />
              <div className="absolute top-0 right-0 translate-x-1/2 w-0.5 h-5 bg-slate-800" />
            </div>
          </div>

          {/* 4 MAIN BRANCH COLUMNS */}
          <div className="grid grid-cols-4 gap-4 items-start pt-3">
            {/* COLUMN 1: TATA USAHA & UNIT PERPUSTAKAAN */}
            <div className="space-y-4">
              <div
                onClick={() => onCardClick('tata usaha', 'ANISA CHOIRINA, S.Pd.')}
                className="border border-orange-400 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
              >
                <div className="bg-orange-500 text-white font-black text-xs uppercase px-2 py-1.5 text-center">
                  TATA USAHA
                </div>
                <div className="p-2.5 bg-orange-50/50 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="font-extrabold text-xs text-slate-800 uppercase leading-snug break-words">
                    {getName('tata usaha', 'ANISA CHOIRINA, S.Pd.')}
                  </div>
                </div>
              </div>

              <div
                onClick={() => onCardClick('unit perpustakaan', 'ANISA CHOIRINA, S.Pd.')}
                className="border border-orange-400 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
              >
                <div className="bg-orange-500 text-white font-black text-xs uppercase px-2 py-1.5 text-center">
                  UNIT PERPUSTAKAAN
                </div>
                <div className="p-2.5 bg-orange-50/50 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="font-extrabold text-xs text-slate-800 uppercase leading-snug break-words">
                    {getName('unit perpustakaan', 'ANISA CHOIRINA, S.Pd.')}
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: GURU MATA PELAJARAN (DINAMIS dari data guru_tendik) */}
            <div className="border-2 border-emerald-600 rounded-2xl overflow-hidden bg-emerald-50/40 p-2.5 space-y-3 shadow-sm">
              <div className="bg-emerald-700 text-white font-black text-xs uppercase px-2 py-1.5 rounded-lg text-center tracking-wide">
                GURU MATA PELAJARAN
              </div>

              {mapelGroups.length > 0 ? (
                mapelGroups.map((group) => (
                  <div
                    key={group.label}
                    onClick={() => onMapelGroupClick(group.teachers[0])}
                    className="border border-emerald-500 rounded-xl overflow-hidden bg-white hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    <div className="bg-emerald-600 text-white font-extrabold text-xs uppercase px-2 py-1 text-center">
                      {group.label}
                    </div>
                    <div className="p-2.5 space-y-1.5 bg-emerald-50/30">
                      {group.teachers.map((t, idx) => (
                        <React.Fragment key={t.id}>
                          {idx > 0 && (
                            <div className="text-[11px] font-extrabold text-emerald-800 text-center uppercase">&</div>
                          )}
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                              <User className="w-3.5 h-3.5" />
                            </div>
                            <div className="font-extrabold text-xs text-slate-800 uppercase leading-snug break-words">
                              {t.name}
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-[11px] text-slate-400 italic py-3">
                  Belum ada data Guru Mata Pelajaran
                </div>
              )}
            </div>

            {/* COLUMN 3: GURU KELAS (2 SUB-COLUMNS) */}
            <div className="border-2 border-emerald-700 rounded-2xl overflow-hidden bg-emerald-50/40 p-2.5 space-y-3 shadow-sm col-span-1">
              <div className="bg-emerald-800 text-white font-black text-xs uppercase px-2 py-1.5 rounded-lg text-center tracking-wide">
                GURU KELAS
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Left Column (1A - 6A) */}
                <div className="space-y-2">
                  {KELAS_A_LIST.map((item) => (
                    <div
                      key={item.label}
                      onClick={() => onCardClick(item.code, item.default)}
                      className="border border-emerald-400 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <div className="bg-emerald-600 text-white font-extrabold text-[11px] uppercase py-1 px-1 text-center">
                        {item.label}
                      </div>
                      <div className="p-1.5 flex items-center gap-1.5 bg-emerald-50/20">
                        <div className="w-5 h-5 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div className="font-extrabold text-[11px] text-slate-800 uppercase leading-snug break-words">
                          {getName(item.code, item.default)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Column (1B - 6B) */}
                <div className="space-y-2">
                  {KELAS_B_LIST.map((item) => (
                    <div
                      key={item.label}
                      onClick={() => onCardClick(item.code, item.default)}
                      className="border border-emerald-400 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <div className="bg-emerald-600 text-white font-extrabold text-[11px] uppercase py-1 px-1 text-center">
                        {item.label}
                      </div>
                      <div className="p-1.5 flex items-center gap-1.5 bg-emerald-50/20">
                        <div className="w-5 h-5 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div className="font-extrabold text-[11px] text-slate-800 uppercase leading-snug break-words">
                          {getName(item.code, item.default)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUMN 4: TENAGA KEPENDIDIKAN */}
            <div className="border-2 border-amber-400 rounded-2xl overflow-hidden bg-amber-50/40 p-2.5 space-y-3 shadow-sm">
              <div className="bg-amber-400 text-slate-900 font-black text-xs uppercase px-2 py-1.5 rounded-lg text-center tracking-wide">
                TENAGA KEPENDIDIKAN
              </div>

              <div
                onClick={() => onCardClick('penjaga', 'ABDUL MUJIB')}
                className="border border-amber-300 rounded-xl overflow-hidden bg-white hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
              >
                <div className="bg-amber-300 text-slate-900 font-extrabold text-xs uppercase px-2 py-1 text-center">
                  PENJAGA
                </div>
                <div className="p-2.5 flex items-center gap-2 bg-amber-50/30">
                  <div className="w-7 h-7 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="font-extrabold text-xs text-slate-800 uppercase leading-snug break-words">
                    {getName('penjaga', 'ABDUL MUJIB')}
                  </div>
                </div>
              </div>

              <div
                onClick={() => onCardClick('tenaga kebersihan', 'MARSUDI')}
                className="border border-amber-300 rounded-xl overflow-hidden bg-white hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
              >
                <div className="bg-amber-300 text-slate-900 font-extrabold text-xs uppercase px-2 py-1 text-center">
                  TENAGA KEBERSIHAN
                </div>
                <div className="p-2.5 flex items-center gap-2 bg-amber-50/30">
                  <div className="w-7 h-7 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="font-extrabold text-xs text-slate-800 uppercase leading-snug break-words">
                    {getName('tenaga kebersihan', 'MARSUDI')}
                  </div>
                </div>
              </div>

              <div
                onClick={() => onCardClick('tenaga keamanan', 'AGUS SUKOCO')}
                className="border border-amber-300 rounded-xl overflow-hidden bg-white hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
              >
                <div className="bg-amber-300 text-slate-900 font-extrabold text-xs uppercase px-2 py-1 text-center">
                  TENAGA KEAMANAN
                </div>
                <div className="p-2.5 flex items-center gap-2 bg-amber-50/30">
                  <div className="w-7 h-7 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-600 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="font-extrabold text-xs text-slate-800 uppercase leading-snug break-words">
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
