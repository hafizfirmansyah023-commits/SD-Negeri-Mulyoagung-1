import React from 'react';
import { Mail } from 'lucide-react';
import { useComplaintForm } from '../hooks/useComplaintForm';
import { SchoolInfoCard } from './contact/SchoolInfoCard';
import { ComplaintForm } from './contact/ComplaintForm';
import { MapPreviewCard } from './contact/MapPreviewCard';

export const ContactSection: React.FC = () => {
  const { formData, handleChange, handleSubmit } = useComplaintForm();

  return (
    <section
      id="contact-section"
      className="w-full py-10 sm:py-24 bg-[#0D4A46] transition-colors relative overflow-hidden"
    >
      {/* Decorative ambient glows */}
      <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-[#20C997]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 sm:w-[420px] h-72 sm:h-[420px] bg-[#79EEDE]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-6 sm:space-y-8 relative z-10">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 text-teal-100 font-semibold text-[11px] sm:text-xs uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full border border-white/25 backdrop-blur-md">
            <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Layanan & Informasi Kontak
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            Hubungi Kami & Layanan Pengaduan
          </h2>
          <p className="text-teal-50/90 text-xs sm:text-base leading-relaxed px-2">
            Silakan kirimkan pengaduan, masukan, atau informasi kontak SD Negeri Mulyoagung 1 di bawah ini
          </p>
        </div>

        {/* Top Grid: Informasi Sekretariat (Kiri) & Form Pengaduan (Kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          <div className="lg:col-span-5 flex flex-col">
            <SchoolInfoCard />
          </div>

          <div className="lg:col-span-7 flex flex-col">
            <ComplaintForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} />
          </div>
        </div>

        {/* Map Preview Card (Full Width) */}
        <MapPreviewCard />
      </div>
    </section>
  );
};
