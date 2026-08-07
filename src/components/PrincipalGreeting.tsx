import React, { useState, useEffect } from 'react';
import { PRINCIPAL_INFO } from '../data/schoolData';
import { Quote } from 'lucide-react';
import { getApiBaseUrl, getImageUrl } from '../config/api';

export const PrincipalGreeting: React.FC = () => {
  const [data, setData] = useState({
    name: PRINCIPAL_INFO.name,
    greeting: PRINCIPAL_INFO.greeting,
    photo: PRINCIPAL_INFO.photo
  });

  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/backend/API/sambutan.php`);
        const result = await response.json();
        if (result.status === 'success' && result.data) {
          setData({
            name: result.data.nama || PRINCIPAL_INFO.name,
            greeting: result.data.sambutan || PRINCIPAL_INFO.greeting,
            photo: result.data.foto ? getImageUrl(result.data.foto) : PRINCIPAL_INFO.photo
          });
        }
      } catch (err) {
        console.error('Failed to fetch principal greeting:', err);
      }
    };
    fetchGreeting();
  }, []);

  return (
    <section className="relative bg-[#FAFAFA] py-12 overflow-hidden">
  
  {/* --- Background Orbs (Kunci agar efek kaca terlihat) --- */}
  {/* Bulatan ini akan di-blur oleh card kaca di depannya */}
  <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/60 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
  <div className="absolute top-10 right-1/4 w-96 h-96 bg-teal-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
  <div className="absolute -bottom-10 left-1/3 w-96 h-96 bg-slate-200/60 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

  <div className="relative max-w-6xl mx-auto px-4">
    {/* --- CARD LIQUID GLASS APPLE --- */}
    <div className="bg-white/40 backdrop-blur-2xl backdrop-saturate-150 border border-white/90 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-6 sm:p-10 lg:p-12 relative overflow-hidden transition-all duration-300">
      
      {/* Specular Gloss Reflection (Cahaya pantulan di ujung atas kaca) */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-white/70 via-white/10 to-transparent pointer-events-none rounded-t-[2.5rem]" />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Principal Image */}
        <div className="lg:w-1/3 flex flex-col items-center justify-center shrink-0">
          {/* Frame foto juga dibuat bertekstur kaca */}
          <div className="relative w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-white/80 p-2 bg-white/50 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] transition-transform hover:scale-105 duration-300">
            <img
              src={data.photo}
              alt={data.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="mt-5 text-center">
            <p className="font-extrabold text-lg sm:text-xl text-slate-800 tracking-tight drop-shadow-sm">
              {data.name}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
              Kepala SD Negeri 1 Mulyoagung
            </p>
          </div>
        </div>

        {/* Principal Message */}
        <div className="lg:w-2/3 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-white shadow-sm text-slate-700">
              <Quote className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight drop-shadow-sm">
              Sambutan Kepala Sekolah
            </h2>
          </div>

          {/* Kotak Pesan dengan Efek Kaca Kedalaman */}
          <div className="relative pl-6 p-5 sm:p-6 rounded-2xl bg-white/40 backdrop-blur-md border border-white/70 shadow-[inset_0_2px_10px_rgba(255,255,255,0.5),0_4px_15px_-5px_rgba(0,0,0,0.05)]">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-slate-400 to-slate-200 rounded-l-2xl opacity-80"></div>
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line font-medium">
              {data.greeting}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-500 font-medium">
              SD Negeri 1 Mulyoagung - Kecamatan Dau, Kab. Malang
            </span>
            <span className="text-xs font-semibold text-slate-700 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white shadow-sm">
              MA ONE Bergelora!
            </span>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</section>
  );
};
