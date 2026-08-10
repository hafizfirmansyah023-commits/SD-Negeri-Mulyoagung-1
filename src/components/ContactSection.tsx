import React, { useState } from 'react';
import { MapPin, Mail, Phone, Clock, ExternalLink, MessageCircle, Send, User, Tag } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    nama: '',
    noHp: '',
    kategori: 'Saran & Kritik',
    pesan: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.pesan.trim()) return;

    const text =
      `*FORM PENGADUAN MASYARAKAT*\n` +
      `*SD NEGERI 1 MULYOAGUNG*\n\n` +
      `Nama Pelapor : ${formData.nama.trim()}\n` +
      `Nomor HP/WhatsApp : ${formData.noHp.trim() || '-'}\n` +
      `Kategori Pengaduan : ${formData.kategori}\n` +
      `Isi Pengaduan :\n${formData.pesan.trim()}`;

    const waUrl = `https://wa.me/6289513301256?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact-section" className="w-full py-10 sm:py-24 bg-[#0D4A46] transition-colors relative overflow-hidden">
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
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 flex flex-col">
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
                      <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                        Alamat Sekolah:
                      </span>
                      <p className="text-[11px] sm:text-sm text-slate-600 leading-relaxed mt-0.5">
                        JL. RAYA MULYOAGUNG NO.121 RT. 1 RW. 10 DUSUN MULYOAGUNG , Kec. Dau, Kab. Malang, Prov. Jawa Timur
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-teal-50 text-[#028C84] shrink-0">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                        Email Resmi:
                      </span>
                      <a
                        href="mailto:sdnmulyoagung01@gmail.com"
                        className="text-[11px] sm:text-sm text-teal-600 hover:underline break-all"
                      >
                        sdnmulyoagung01@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-teal-50 text-[#028C84] shrink-0">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                        Telepon Sekolah:
                      </span>
                      <p className="text-[11px] sm:text-sm text-slate-600">
                        (0341) 466-730
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                        WhatsApp Pengaduan:
                      </span>
                      <a
                        href="https://wa.me/6289513301256"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] sm:text-sm text-emerald-600 hover:underline font-bold"
                      >
                        089513301256
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
                      <p className="text-[11px] sm:text-sm text-slate-600">
                        Senin - Jumat: 07.00 - 14.15 WIB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-5 sm:pt-6 border-t border-slate-100 mt-6 sm:mt-8">
                <a
                  href="https://maps.app.goo.gl/4ekhNxNWhTuH1VEV6"
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
          </div>

          {/* Right: Form Pengaduan Card */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border border-white/60 flex flex-col justify-between h-full">
              <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full space-y-5 sm:space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-emerald-500 text-white shadow-md shrink-0">
                      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                        Form Pengaduan Masyarakat
                      </h3>
                      <p className="text-[11px] sm:text-sm text-slate-500 mt-0.5 leading-snug">
                        Tulis laporan/masukan Anda di bawah ini untuk dikirim langsung ke WhatsApp pengaduan.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <input
                          type="text"
                          name="nama"
                          required
                          value={formData.nama}
                          onChange={handleChange}
                          placeholder="Nama Anda"
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        No. WhatsApp / HP
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <input
                          type="text"
                          name="noHp"
                          value={formData.noHp}
                          onChange={handleChange}
                          placeholder="081234567890"
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Kategori Pengaduan
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <select
                        name="kategori"
                        value={formData.kategori}
                        onChange={handleChange}
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
                      >
                        <option value="Saran & Kritik">Saran & Kritik</option>
                        <option value="Layanan Sekolah">Layanan Sekolah</option>
                        <option value="Sarana & Prasarana">Sarana & Prasarana</option>
                        <option value="PPDB & Informasi">PPDB & Informasi</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Pesan Pengaduan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="pesan"
                      required
                      rows={3}
                      value={formData.pesan}
                      onChange={handleChange}
                      placeholder="Tuliskan pesan pengaduan atau masukan Anda di sini..."
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 sm:pt-6 border-t border-slate-100 mt-auto">
                  <button
                    type="submit"
                    className="w-full bg-[#028C84] hover:bg-[#006a64] text-white font-bold py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl transition-all shadow-md hover:shadow-teal-700/20 flex items-center justify-center gap-2 group cursor-pointer text-xs sm:text-base leading-snug"
                  >
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform group-hover:translate-x-1" />
                    <span>Kirim Pengaduan via WhatsApp</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Map Preview Card (Full Width) */}
        <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/60 overflow-hidden">
          <div className="flex items-center justify-between px-1 mb-2.5 sm:mb-3">
            <h3 className="text-base sm:text-xl font-bold text-[#1E3A8A]">
              Peta Lokasi Sekolah
            </h3>
            <a
              href="https://maps.app.goo.gl/4ekhNxNWhTuH1VEV6"
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.527376383637!2d112.58555027588324!3d-7.917209398863617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78818ec3f74a4f%3A0x5b041b813175a4e6!2sSDN%20Mulyoagung%2001!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};