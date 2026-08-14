import React from 'react';
import { BadgeCheck, BookOpen, GraduationCap, VenusAndMars } from 'lucide-react';
import { Teacher } from '../../types';

interface TeacherCardProps {
  teacher: Teacher;
  onClick: (teacher: Teacher) => void;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, onClick }) => (
  <div
    onClick={() => onClick(teacher)}
    className="group relative bg-white/75 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/80 shadow-[0_8px_25px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(2,140,132,0.14)] hover:border-teal-200/80 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 overflow-hidden animate-fade-in cursor-pointer"
  >
    {/* Subtle top corner gradient shine */}
    <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-teal-100/40 to-transparent rounded-tr-3xl pointer-events-none" />

    <div className="space-y-4">
      <div className="flex flex-col min-[420px]:flex-row gap-4 sm:gap-5 items-center min-[420px]:items-start sm:items-center text-center min-[420px]:text-left">
        <div className="relative w-28 h-28 min-[420px]:w-24 min-[420px]:h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border-2 border-teal-500/30 shadow-md group-hover:scale-105 transition-transform duration-300">
          <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="inline-block bg-teal-50/90 border border-teal-200/80 text-[#028C84] text-[11px] font-bold px-3 py-0.5 rounded-full mb-1 shadow-xs truncate max-w-full">
            {teacher.role}
          </span>
          <h3 className="font-extrabold text-base text-[#1E3A8A] group-hover:text-[#028C84] transition-colors leading-snug break-words">
            {teacher.name}
          </h3>
          {teacher.nip && teacher.nip !== 'null' && teacher.nip.trim() !== '' ? (
            <p className="text-xs font-mono text-slate-500 mt-0.5 truncate">NIP. {teacher.nip}</p>
          ) : (
            <p className="text-xs font-mono text-slate-400 mt-0.5 italic">NIP. -</p>
          )}
        </div>
      </div>

      <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
        <div className="flex items-start gap-2">
          <BookOpen className="w-3.5 h-3.5 text-[#028C84] shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <span className="font-semibold text-slate-700 mr-1">Tugas:</span>
            <span className="text-slate-600 break-words">{teacher.subject}</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <GraduationCap className="w-3.5 h-3.5 text-[#028C84] shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <span className="text-slate-600 break-words">Riwayat Pendidikan: {teacher.education}</span>
          </div>
        </div>
        {teacher.gender && (
          <div className="flex items-center gap-2">
            <VenusAndMars className="w-3.5 h-3.5 text-[#028C84] shrink-0" />
            <span className="text-slate-600">Jenis Kelamin:</span>
            <span className="truncate text-slate-600">{teacher.gender}</span>
          </div>
        )}
        {teacher.status && (
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-3.5 h-3.5 text-[#028C84] shrink-0" />
            <span className="text-slate-600">Status:</span>
            <span className="truncate text-slate-600">{teacher.status}</span>
          </div>
        )}
      </div>

      {teacher.quote && (
        <p className="text-xs italic text-slate-600 bg-teal-50/50 p-3 rounded-2xl border border-teal-100/60 leading-relaxed">
          "{teacher.quote}"
        </p>
      )}
    </div>
  </div>
);
