import React, { useEffect, useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { useSchoolSettings } from '../../hooks/useSchoolSettings';
import { getApiBaseUrl } from '../../config/api';

interface StatData {
  id: number;
  judul: string;
  jumlah: string;
  label: string;
}

export const TopContactStrip: React.FC = () => {
  const { emailSekolah, teleponSekolah } = useSchoolSettings();
  const [akreditasi, setAkreditasi] = useState('A');

  useEffect(() => {
    const fetchAkreditasi = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/backend/API/statistik.php`);
        const result = await response.json();

        if (result.status === 'success' && Array.isArray(result.data)) {
          const row = result.data.find((item: StatData) => item.judul.toLowerCase().includes('akreditasi'));
          if (row && row.jumlah) {
            setAkreditasi(row.jumlah);
          }
        }
      } catch (err) {
        console.error('Gagal mengambil data akreditasi:', err);
      }
    };

    fetchAkreditasi();
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#0D4A46]/100 to-[#156B63]/100">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-1.5 sm:gap-2 px-4 py-1.5 sm:px-0 sm:py-0">
        <div className="flex items-center gap-4 text-slate-300 min-w-0">
          <a
            href={`mailto:${emailSekolah}`}
            className="flex items-center gap-1 min-w-0 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="truncate max-w-[170px] sm:max-w-none">{emailSekolah}</span>
          </a>
          <a
            href={`tel:${teleponSekolah.replace(/[^0-9+]/g, '')}`}
            className="hidden sm:flex items-center gap-1 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-teal-400" />
            <span>{teleponSekolah}</span>
          </a>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded text-[11px] font-medium border border-teal-400/30 whitespace-nowrap">
            Akreditasi {akreditasi}
          </span>
          <span className="hidden sm:inline text-slate-300 text-[11px] whitespace-nowrap">
            Kec. Dau, Kab. Malang
          </span>
        </div>
      </div>
    </div>
  );
};

