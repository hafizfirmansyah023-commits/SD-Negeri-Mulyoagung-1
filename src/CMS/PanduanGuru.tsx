import React, { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  ArrowRight,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Info
} from 'lucide-react';
import { UserSession } from './types';
import { useSchoolSettings } from '../hooks/useSchoolSetting';
import { PANDUAN_CATEGORIES, PanduanCategory } from './panduan/panduanData';
import { PanduanModal } from './panduan/PanduanModal';

interface PanduanGuruProps {
  currentUser: UserSession;
}

export default function PanduanGuru({ currentUser }: PanduanGuruProps) {
  const settings = useSchoolSettings();
  const [selectedCategory, setSelectedCategory] = useState<PanduanCategory | null>(null);

  const adminWhatsApp = settings.whatsappAdmin || settings.whatsappSekolah || '';

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#073632] via-[#0b4843] to-[#103632] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={14} /> Pusat Panduan &amp; Pengumpulan Administrasi Guru
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Panduan Pengumpulan Dokumen Pembelajaran
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              Pilih jenis dokumen administrasi pembelajaran di bawah ini untuk melihat ketentuan format penamaan, serta langsung mengirimkan pengumpulan dokumen secara terstruktur via WhatsApp Admin.
            </p>
          </div>

          {/* Admin Contact Info Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3.5 shrink-0">
            <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-400/30">
              <MessageCircle size={22} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-teal-200 uppercase tracking-wider">
                WhatsApp Admin Penerima
              </p>
              <p className="text-sm sm:text-base font-extrabold text-white">
                {adminWhatsApp && adminWhatsApp !== 'Belum ada' ? adminWhatsApp : 'Belum diatur di Kontak Resmi'}
              </p>
              <p className="text-[10px] text-teal-100/70 mt-0.5">Tujuan pesan WhatsApp otomatis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid 7 Kategori Panduan */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            <BookOpen size={20} className="text-teal-600" />
            Daftar Panduan &amp; Tata Cara Pengumpulan
          </h2>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            7 Kategori Dokumen
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {PANDUAN_CATEGORIES.map((cat, index) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className="group bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-teal-500/50 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden"
              >
                {/* Accent Top Border Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${cat.gradientBg}`} />

                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 group-hover:bg-teal-600 group-hover:text-white text-teal-700 flex items-center justify-center transition-all duration-300 shadow-sm shrink-0">
                      <IconComponent size={24} />
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${cat.badgeColor}`}>
                      {cat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                      {index + 1}. {cat.judul}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {cat.subjudul}
                    </p>
                  </div>

                  {/* Format file chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cat.formatFile.map((fmt, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-600 group-hover:text-teal-700">
                  <span className="flex items-center gap-1.5">
                    <MessageCircle size={14} className="text-emerald-500" />
                    Kirim via WhatsApp
                  </span>
                  <div className="w-7 h-7 rounded-full bg-teal-50 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Card Pengumpulan */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-teal-100 text-teal-800 rounded-xl shrink-0">
            <Info size={22} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Prinsip Pengumpulan Berkas</h4>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Pastikan format penamaan file sudah sesuai dengan pedoman tiap kategori agar dokumen Anda dapat diverifikasi dengan cepat dan tertata rapi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0 font-medium">
          <ShieldCheck size={16} className="text-teal-600" />
          <span>SD Negeri 1 Mulyoagung</span>
        </div>
      </div>

      {/* Modal Detail & Kirim WhatsApp */}
      {selectedCategory && (
        <PanduanModal
          category={selectedCategory}
          namaGuru={currentUser.nama_penanggung_jawab}
          adminWhatsApp={adminWhatsApp}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
}
