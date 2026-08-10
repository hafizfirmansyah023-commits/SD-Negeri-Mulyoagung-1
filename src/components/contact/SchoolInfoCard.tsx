import React from 'react';
import { Clock, ExternalLink, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { GOOGLE_MAPS_URL, SCHOOL_CONTACT_INFO, WHATSAPP_NUMBER } from '../../utils/contactHelpers';

export const SchoolInfoCard: React.FC = () => (
  <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border border-white/60 flex flex-col justify-between h-full">
    <div className="space-y-5 sm:space-y-6">
      <h3 className="text-lg sm:text-xl font-bold text-[#1E3A8A] flex items-center gap-2">
        <span>Informasi Sekretariat</span>
      </h3>

      <div className="space-y-4 sm:space-y-5 text-xs sm:text-sm text-slate-700">
        <div className="flex items-start gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-teal-50 text-[#028C84] shrink-0">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block text-xs sm:text-sm">Alamat Sekolah:</span>
            <p className="text-[11px] sm:text-sm text-slate-600 leading-relaxed mt-0.5">
              {SCHOOL_CONTACT_INFO.alamat}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-teal-50 text-[#028C84] shrink-0">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block text-xs sm:text-sm">Email Resmi:</span>
            <a
              href={`mailto:${SCHOOL_CONTACT_INFO.email}`}
              className="text-[11px] sm:text-sm text-teal-600 hover:underline break-all"
            >
              {SCHOOL_CONTACT_INFO.email}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-teal-50 text-[#028C84] shrink-0">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block text-xs sm:text-sm">Telepon Sekolah:</span>
            <p className="text-[11px] sm:text-sm text-slate-600">{SCHOOL_CONTACT_INFO.telepon}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block text-xs sm:text-sm">WhatsApp Pengaduan:</span>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] sm:text-sm text-emerald-600 hover:underline font-bold"
            >
              {SCHOOL_CONTACT_INFO.whatsappDisplay}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-teal-50 text-[#028C84] shrink-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block text-xs sm:text-sm">
              Jam Pelayanan Sekretariat:
            </span>
            <p className="text-[11px] sm:text-sm text-slate-600">{SCHOOL_CONTACT_INFO.jamPelayanan}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="pt-5 sm:pt-6 border-t border-slate-100 mt-6 sm:mt-8">
      <a
        href={GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-[#028C84] hover:bg-[#006a64] text-white font-bold py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-base cursor-pointer"
      >
        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
        <span>Petunjuk Arah (Google Maps)</span>
        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ml-0.5 sm:ml-1" />
      </a>
    </div>
  </div>
);
