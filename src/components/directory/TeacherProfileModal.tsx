import React from 'react';
import { BadgeCheck, BookOpen, GraduationCap, Sparkles, VenusAndMars, X } from 'lucide-react';
import { Teacher } from '../../types';

interface TeacherProfileModalProps {
  teacher: Teacher | null;
  onClose: () => void;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({ teacher, onClose }) => {
  if (!teacher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-teal-100 animate-scale-up">
        {/* Header Gradient */}
        <div className="bg-gradient-to-r from-[#028C84] to-[#1E3A8A] p-5 text-white flex justify-between items-center relative">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h3 className="font-extrabold text-base sm:text-lg">Ringkasan Profil Guru / Tendik</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-teal-500/40 shadow-md shrink-0 bg-slate-100">
              <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1">
              <span className="inline-block bg-teal-50 border border-teal-200 text-[#028C84] text-xs font-bold px-3 py-0.5 rounded-full">
                {teacher.role || teacher.title}
              </span>
              <h4 className="text-xl font-extrabold text-[#1E3A8A]">{teacher.name}</h4>
              <p className="text-xs font-mono text-slate-500">NIP. {teacher.nip || '-'}</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 text-sm text-slate-700">
            <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <BookOpen className="w-4 h-4 text-[#028C84] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block text-xs uppercase tracking-wide">
                  Tugas / Mata Pelajaran
                </span>
                <span className="text-slate-600 font-medium text-xs sm:text-sm">{teacher.subject}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <GraduationCap className="w-4 h-4 text-[#028C84] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block text-xs uppercase tracking-wide">
                  Riwayat Pendidikan
                </span>
                <span className="text-slate-600 font-medium text-xs sm:text-sm">{teacher.education}</span>
              </div>
            </div>

            {teacher.gender && (
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <VenusAndMars className="w-4 h-4 text-[#028C84] shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block text-xs uppercase tracking-wide">
                    Jenis Kelamin
                  </span>
                  <span className="text-slate-600 font-medium text-xs sm:text-sm">{teacher.gender}</span>
                </div>
              </div>
            )}

            {teacher.status && (
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <BadgeCheck className="w-4 h-4 text-[#028C84] shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block text-xs uppercase tracking-wide">
                    Status Pegawai
                  </span>
                  <span className="text-slate-600 font-medium text-xs sm:text-sm">{teacher.status}</span>
                </div>
              </div>
            )}
          </div>

          {teacher.quote && (
            <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-200/80 text-xs sm:text-sm text-slate-700 italic">
              "{teacher.quote}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#028C84] hover:bg-[#156B63] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Tutup Detail
          </button>
        </div>
      </div>
    </div>
  );
};
