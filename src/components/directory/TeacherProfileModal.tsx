import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BadgeCheck, BookOpen, GraduationCap, Sparkles, VenusAndMars, X, ArrowRight } from 'lucide-react';
import { Teacher } from '../../types';

interface TeacherProfileModalProps {
  teacher: Teacher | null;
  onClose: () => void;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({ teacher, onClose }) => {
  // Mengunci scroll pada body website saat modal terbuka
  useEffect(() => {
    if (teacher) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [teacher]);

  if (!teacher) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg lg:max-w-xl max-h-[90vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-teal-100 animate-scale-up my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Gradient */}
        {/* shrink-0 agar header tidak ikut mengecil saat isi kontennya di-scroll */}
        <div className="bg-gradient-to-r from-[#028C84] to-[#1E3A8A] p-4 sm:p-5 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            <h3 className="font-extrabold text-sm sm:text-lg">Ringkasan Profil</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Tutup Profil"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Body (Bisa di-scroll jika layar kecil) */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-teal-500/40 shadow-md shrink-0 bg-slate-100">
              <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1">
              <span className="inline-block bg-teal-50 border border-teal-200 text-[#028C84] text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-0.5 rounded-full">
                {teacher.role || teacher.title}
              </span>
              <h4 className="text-lg sm:text-xl font-extrabold text-[#1E3A8A] leading-snug">{teacher.name}</h4>
              <p className="text-[11px] sm:text-xs font-mono text-slate-500">NIP. {teacher.nip || '-'}</p>
            </div>
          </div>

          <div className="space-y-2.5 sm:space-y-3 pt-4 border-t border-slate-100 text-slate-700">
            <div className="flex items-start gap-2.5 sm:gap-3 bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-100">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#028C84] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block text-[10px] sm:text-xs uppercase tracking-wide">
                  Tugas / Mata Pelajaran
                </span>
                <span className="text-slate-600 font-medium text-[11px] sm:text-sm">{teacher.subject}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 sm:gap-3 bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-100">
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#028C84] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block text-[10px] sm:text-xs uppercase tracking-wide">
                  Riwayat Pendidikan
                </span>
                <span className="text-slate-600 font-medium text-[11px] sm:text-sm">{teacher.education}</span>
              </div>
            </div>

            {teacher.gender && (
              <div className="flex items-center gap-2.5 sm:gap-3 bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-100">
                <VenusAndMars className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#028C84] shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block text-[10px] sm:text-xs uppercase tracking-wide">
                    Jenis Kelamin
                  </span>
                  <span className="text-slate-600 font-medium text-[11px] sm:text-sm">{teacher.gender}</span>
                </div>
              </div>
            )}

            {teacher.status && (
              <div className="flex items-center gap-2.5 sm:gap-3 bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-100">
                <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#028C84] shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block text-[10px] sm:text-xs uppercase tracking-wide">
                    Status Pegawai
                  </span>
                  <span className="text-slate-600 font-medium text-[11px] sm:text-sm">{teacher.status}</span>
                </div>
              </div>
            )}
          </div>

          {teacher.quote && (
            <div className="bg-teal-50/70 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-teal-200/80 text-[11px] sm:text-sm text-slate-700 italic">
              "{teacher.quote}"
            </div>
          )}
        </div>

        {/* Footer */}
        {/* shrink-0 memastikan tombol tutup selalu ada di bagian bawah card */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-[#028C84] hover:bg-[#156B63] text-white rounded-full sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <span>Tutup Profil</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};