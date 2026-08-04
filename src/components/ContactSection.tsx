import React from 'react';
import { MapPin, Mail, Phone, Clock, ExternalLink } from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact-section" className="w-full py-16 sm:py-24 bg-[#0D4A46] transition-colors relative overflow-hidden">
      {/* Decorative ambient glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#20C997]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-[#79EEDE]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-12 relative z-10">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-teal-100 font-bold text-xs uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full border border-white/25 backdrop-blur-md">
            <Mail className="w-4 h-4" />
            Layanan & Informasi Kontak
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Hubungi Kami
          </h2>
          <p className="text-teal-50/90 text-sm sm:text-base">
            Silakan temukan lokasi dan informasi kontak SD Negeri Mulyoagung 1 di bawah ini
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60 space-y-6 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#1E3A8A] mb-6">
                  Informasi Sekretariat
                </h3>

                <div className="space-y-5 text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-teal-50 text-[#028C84] shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">
                        Alamat Sekolah:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
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
                        className="text-xs sm:text-sm text-teal-600 hover:underline"
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
                      <p className="text-xs sm:text-sm text-slate-600">
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
                        Senin - Jumat: 07.00 - 14.15 WIB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <a
                  href="https://maps.app.goo.gl/4ekhNxNWhTuH1VEV6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#028C84] hover:bg-[#006a64] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Petunjuk Arah (Google Maps)</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </div>

          {/* Right: Map Preview */}
          <div className="lg:col-span-7 bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-xl border border-white/60 overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between px-1 mb-3">
              <h3 className="text-xl font-bold text-[#1E3A8A]">
                Peta Lokasi Sekolah
              </h3>
              <a
                href="https://maps.app.goo.gl/4ekhNxNWhTuH1VEV6"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-teal-600 hover:text-teal-700 font-semibold underline flex items-center gap-1 transition-colors"
              >
                <span>Buka di Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="w-full h-80 sm:h-96 lg:h-[400px] rounded-2xl overflow-hidden bg-slate-200 relative">
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
      </div>
    </section>
  );
};
