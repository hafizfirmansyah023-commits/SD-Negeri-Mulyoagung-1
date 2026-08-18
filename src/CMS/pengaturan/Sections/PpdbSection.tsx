import React from 'react';
import { Calendar, Link as LinkIcon, ExternalLink, Sparkles } from 'lucide-react';

interface PpdbSectionProps {
  tahunAjaran: string;
  setTahunAjaran: (val: string) => void;
  linkPpdb: string;
  setLinkPpdb: (val: string) => void;
}

export const PpdbSection: React.FC<PpdbSectionProps> = ({
  tahunAjaran,
  setTahunAjaran,
  linkPpdb,
  setLinkPpdb,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <Sparkles className="w-5 h-5 text-teal-600" />
        <h3 className="font-bold text-slate-800 text-base">Konfigurasi Halaman PPDB &amp; Tahun Ajaran</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
            <Calendar size={16} className="text-teal-600" />
            Tahun Ajaran Aktif (Hero Badge)
          </label>
          <input
            type="text"
            required
            value={tahunAjaran}
            onChange={(e) => setTahunAjaran(e.target.value)}
            placeholder="Contoh: 2025/2026 atau 2026/2027"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-semibold text-slate-800"
          />
          <p className="text-xs text-slate-500 mt-1.5">
            Ditampilkan otomatis pada badge bagian atas Hero Section.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
            <LinkIcon size={16} className="text-teal-600" />
            Link / URL PPDB Online
          </label>
          <div className="relative">
            <input
              type="url"
              value={linkPpdb}
              onChange={(e) => setLinkPpdb(e.target.value)}
              placeholder="Contoh: https://ppdb.malangkab.go.id atau link Google Form"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-semibold text-slate-800 pr-10"
            />
            {linkPpdb && (
              <a
                href={linkPpdb}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-600 hover:text-teal-800 p-1"
                title="Uji coba buka link PPDB"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1.5">
            Digunakan pada tombol PPDB di Header, Hero, dan Footer. Jika dikosongkan, akan membuka formulir pop-up internal.
          </p>
        </div>
      </div>
    </div>
  );
};
