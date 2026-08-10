import React from 'react';
import { ExternalLink } from 'lucide-react';
import { GOOGLE_MAPS_EMBED_URL, GOOGLE_MAPS_URL } from '../../utils/contactHelpers';

export const MapPreviewCard: React.FC = () => (
  <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/60 overflow-hidden">
    <div className="flex items-center justify-between px-1 mb-2.5 sm:mb-3">
      <h3 className="text-base sm:text-xl font-bold text-[#1E3A8A]">Peta Lokasi Sekolah</h3>
      <a
        href={GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] sm:text-xs text-teal-600 hover:text-teal-700 font-semibold underline flex items-center gap-1 transition-colors"
      >
        <span>Buka Maps</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
    <div className="w-full h-52 sm:h-96 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-200 relative">
      <iframe
        title="Lokasi SD Negeri Mulyoagung 1"
        src={GOOGLE_MAPS_EMBED_URL}
        className="w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  </div>
);
