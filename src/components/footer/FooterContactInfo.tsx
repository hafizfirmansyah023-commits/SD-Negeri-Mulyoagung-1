import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { FOOTER_CONTACT_INFO } from '../../utils/footerData';

export const FooterContactInfo: React.FC = () => (
  <div className="md:col-span-4 space-y-3 sm:space-y-4">
    <h3 className="text-sm sm:text-base font-bold text-white tracking-wide border-b border-blue-800/80 pb-1.5 sm:pb-2">
      Kontak Kami
    </h3>
    <ul className="space-y-2.5 sm:space-y-3.5 text-[11px] sm:text-sm text-slate-200 dark:text-slate-400">
      <li className="flex items-start gap-2.5 sm:gap-3">
        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400 shrink-0 mt-0.5 sm:mt-1" />
        <span className="leading-snug">{FOOTER_CONTACT_INFO.alamat}</span>
      </li>
      <li className="flex items-center gap-2.5 sm:gap-3">
        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400 shrink-0" />
        <a href={`mailto:${FOOTER_CONTACT_INFO.email}`} className="hover:text-white transition-colors">
          {FOOTER_CONTACT_INFO.email}
        </a>
      </li>
      <li className="flex items-center gap-2.5 sm:gap-3">
        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400 shrink-0" />
        <a href={FOOTER_CONTACT_INFO.teleponHref} className="hover:text-white transition-colors">
          {FOOTER_CONTACT_INFO.teleponDisplay}
        </a>
      </li>
    </ul>
  </div>
);
