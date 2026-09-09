import React from 'react';
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react';

interface KontakSectionProps {
  emailSekolah: string;
  setEmailSekolah: (val: string) => void;
  teleponSekolah: string;
  setTeleponSekolah: (val: string) => void;
  whatsappSekolah: string;
  setWhatsappSekolah: (val: string) => void;
  whatsappAdmin: string;
  setWhatsappAdmin: (val: string) => void;
  alamatSekolah: string;
  setAlamatSekolah: (val: string) => void;
}

export const KontakSection: React.FC<KontakSectionProps> = ({
  emailSekolah,
  setEmailSekolah,
  teleponSekolah,
  setTeleponSekolah,
  whatsappSekolah,
  setWhatsappSekolah,
  whatsappAdmin,
  setWhatsappAdmin,
  alamatSekolah,
  setAlamatSekolah,
}) => {
  // Helper filter: cegah pengetikan huruf alfabet (a-z, A-Z), izinkan angka dan simbol (+, -, (, ), space, ., /)
  const filterNonAlphabet = (val: string) => {
    return val.replace(/[a-zA-Z]/g, '');
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <Phone className="w-5 h-5 text-teal-600" />
        <h3 className="font-bold text-slate-800 text-base">Informasi Kontak &amp; Alamat Sekolah</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-2">
              <Mail size={15} className="text-teal-600" />
              Email Resmi Sekolah
            </label>
            <input
              type="email"
              value={emailSekolah}
              onChange={(e) => setEmailSekolah(e.target.value)}
              placeholder="sdnmulyoagung01@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-2">
              <Phone size={15} className="text-teal-600" />
              Telepon Sekolah
            </label>
            <input
              type="text"
              value={teleponSekolah}
              onChange={(e) => setTeleponSekolah(filterNonAlphabet(e.target.value))}
              placeholder="(0341) 466-730"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-semibold text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-2">
              <MessageCircle size={15} className="text-emerald-600" />
              WhatsApp Sekolah (Pengaduan &amp; Publik)
            </label>
            <input
              type="text"
              value={whatsappSekolah}
              onChange={(e) => setWhatsappSekolah(filterNonAlphabet(e.target.value))}
              placeholder="Contoh: 081234567890 / +62 812-3456-7890"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-semibold text-slate-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Ditampilkan pada halaman kontak publik untuk layanan pengaduan dan pertanyaan masyarakat.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-2">
              <MessageCircle size={15} className="text-teal-600" />
              WhatsApp Admin (Pengumpulan Dokumen Guru)
            </label>
            <input
              type="text"
              value={whatsappAdmin}
              onChange={(e) => setWhatsappAdmin(filterNonAlphabet(e.target.value))}
              placeholder="Contoh: 081234567890 / +62 812-3456-7890"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-semibold text-slate-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Nomor WhatsApp tujuan untuk menu Panduan pengumpulan dokumen pembelajaran Akun Guru.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-2">
            <MapPin size={15} className="text-teal-600" />
            Alamat Lengkap Sekolah
          </label>
          <textarea
            rows={2}
            value={alamatSekolah}
            onChange={(e) => setAlamatSekolah(e.target.value)}
            placeholder="Jl. Raya Mulyoagung No. 121 ..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-semibold text-slate-800"
          />
        </div>
      </div>
    </div>
  );
};
