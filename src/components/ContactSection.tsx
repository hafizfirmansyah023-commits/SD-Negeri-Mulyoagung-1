import React, { useState } from 'react';
import { MapPin, Mail, Phone, Clock, Send, CheckCircle2 } from 'lucide-react';
import { div } from 'motion/react-client';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 5000);
  };

  return (
    <section id="contact-section" className="w-full py-16 sm:py-20 bg-gradient-to-br from-[#0D4A46] via-[#105e58] to-[#028C84] transition-colors relative overflow-hidden">
      {/* Decorative ambient glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-12 relative z-10">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-teal-100 font-bold text-xs uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full border border-white/25 backdrop-blur-md">
            <Mail className="w-4 h-4" />
            Layanan & Layanan Informasi
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Hubungi Kami
          </h2>
          <p className="text-teal-50/90 text-sm sm:text-base">
            Silakan kirimkan pertanyaan, saran, atau informasi seputar SD Negeri Mulyoagung 1
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60 space-y-6">
              <h3 className="text-xl font-bold text-[#1E3A8A]">
                Informasi Sekretariat
              </h3>

              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-50 text-[#028C84] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Alamat Sekolah:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      JL. RAYA MULYOAGUNG NO.121 RT. 1 RW. 10 DUSUN MULYOAGUNG , Kec. Dau, Kab. Malang, Prov. Jawa Timur
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-50 text-[#028C84] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Email Resmi:
                    </span>
                    <a
                      href="mailto:sdnmulyoagung01@gmail.com"
                      className="text-xs sm:text-sm text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      sdnmulyoagung01@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-50 text-[#028C84] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Telepon:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      (0341) 466-730
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-50 text-[#028C84] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Jam Pelayanan Sekretariat:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Senin - Sabtu: 07.00 - 13.00 WIB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Preview */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-xl border border-white/60 overflow-hidden">
              <span className="text-xs font-bold text-slate-600 px-2 block mb-2">
                Peta Lokasi Google Maps:
              </span>
              <div className="w-full h-48 rounded-2xl overflow-hidden bg-slate-200 relative">
                <iframe
                  title="Lokasi SD Negeri Mulyoagung 1"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.4984189392686!2d112.5768295!3d-7.9473007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e788220f18bdc6d%3A0x67390a8a614d95b5!2sSD Negeri%20Mulyoagung%201!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60">
            <h3 className="text-xl font-bold text-[#1E3A8A] mb-6">
              Kirim Pesan / Pertanyaan Mandiri
            </h3>

            {submitted ? (
              <div className="p-6 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-2xl text-center space-y-3 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-lg text-teal-900 dark:text-teal-200">
                  Pesan Anda Berhasil Terkirim!
                </h4>
                <p className="text-xs sm:text-sm text-teal-700 dark:text-teal-300">
                  Terima kasih telah menghubungi SD Negeri Mulyoagung 1. Tim sekretariat akan segera merespons pesan Anda.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama Anda..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="nama@email.com..."
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nomor Telepon / WA
                    </label>
                    <input
                      type="tel"
                      placeholder="0812xxxx..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Subjek Pesan
                    </label>
                    <input
                      type="text"
                      placeholder="Misal: Info PPDB / Kunjungan"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Isi Pesan *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan pesan atau pertanyaan Anda di sini..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#028C84] hover:bg-[#006a64] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Pesan Sekarang</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
