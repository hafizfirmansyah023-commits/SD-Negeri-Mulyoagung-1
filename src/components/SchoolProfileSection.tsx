import React, { useState, useEffect } from 'react';
import { SCHOOL_FACILITIES } from '../data/schoolData';
import { Target, Compass, History, Monitor, BookOpen, Activity, HeartPulse, Coffee, Trees, CheckCircle2, Sparkles, Building } from 'lucide-react';
import { getApiBaseUrl, getImageUrl } from '../config/api';

interface DynamicFacility {
  id: string | number;
  judul: string;
  deskripsi: string;
  foto?: string;
  image?: string;
}

const API_BASE = getApiBaseUrl();

export const SchoolProfileSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visi-misi' | 'sejarah' | 'fasilitas'>('visi-misi');
  const [facilities, setFacilities] = useState<DynamicFacility[]>(
    SCHOOL_FACILITIES.map((f) => ({
      id: f.id,
      judul: f.name,
      deskripsi: f.description,
      image: f.image,
    }))
  );

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await fetch(`${API_BASE}/backend/API/fasilitas.php`);
        const result = await response.json();
        if (result.status === 'success' && Array.isArray(result.data) && result.data.length > 0) {
          setFacilities(result.data);
        }
      } catch (err) {
        // Fallback remains SCHOOL_FACILITIES
      }
    };
    fetchFacilities();
  }, []);

  const getFacilityIconByTitle = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('lab') || t.includes('komputer') || t.includes('tik') || t.includes('coding') || t.includes('multimedia')) {
      return <Monitor className="w-5 h-5 text-[#028C84]" />;
    }
    if (t.includes('pustaka') || t.includes('buku') || t.includes('baca') || t.includes('literasi')) {
      return <BookOpen className="w-5 h-5 text-[#028C84]" />;
    }
    if (t.includes('lapangan') || t.includes('olahraga') || t.includes('futsal') || t.includes('basket') || t.includes('senam') || t.includes('fisik')) {
      return <Activity className="w-5 h-5 text-[#028C84]" />;
    }
    if (t.includes('uks') || t.includes('sehat') || t.includes('kesehatan') || t.includes('poliklinik') || t.includes('medis')) {
      return <HeartPulse className="w-5 h-5 text-[#028C84]" />;
    }
    if (t.includes('kantin') || t.includes('makan') || t.includes('gizi') || t.includes('kuliner') || t.includes('minum')) {
      return <Coffee className="w-5 h-5 text-[#028C84]" />;
    }
    if (t.includes('taman') || t.includes('green') || t.includes('kebun') || t.includes('adiwiyata') || t.includes('pohon') || t.includes('hidroponik')) {
      return <Trees className="w-5 h-5 text-[#028C84]" />;
    }
    if (t.includes('musa') || t.includes('masjid') || t.includes('agama') || t.includes('ibadah')) {
      return <Sparkles className="w-5 h-5 text-[#028C84]" />;
    }
    return <Building className="w-5 h-5 text-[#028C84]" />;
  };

  return (
    <section id="profile-section" className="relative w-full py-16 sm:py-24 bg-gradient-to-b from-white via-teal-50/30 to-white overflow-hidden transition-colors">
      {/* Decorative subtle ambient glows for white background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-[#028C84] font-bold text-xs uppercase tracking-wider bg-teal-50/80 border border-teal-200/80 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-md">
            <Compass className="w-4 h-4 text-[#028C84]" />
            Mengenal Sekolah Kami
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[black] tracking-tight">
            Profil SD Negeri 1 Mulyoagung
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Landasan visi pendidik, kilasan sejarah pengabdian, serta fasilitas sarana pendukung pembelajaran
          </p>
        </div>

        {/* Liquid Glass Pill Tab Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-full bg-white/70 backdrop-blur-xl border border-teal-100 shadow-[0_4px_20px_0_rgba(2,140,132,0.08)] space-x-1">
            <button
              onClick={() => setActiveTab('visi-misi')}
              className={`py-2.5 px-6 text-xs sm:text-sm font-bold rounded-full transition-all duration-300 cursor-pointer ${activeTab === 'visi-misi'
                ? 'bg-gradient-to-r from-[#028C84] to-[#156B63] text-white shadow-md shadow-teal-700/20 scale-[1.02]'
                : 'text-slate-600 hover:text-[#028C84] hover:bg-teal-50/50'
                }`}
            >
              Visi & Misi
            </button>
            <button
              onClick={() => setActiveTab('sejarah')}
              className={`py-2.5 px-6 text-xs sm:text-sm font-bold rounded-full transition-all duration-300 cursor-pointer ${activeTab === 'sejarah'
                ? 'bg-gradient-to-r from-[#028C84] to-[#156B63] text-white shadow-md shadow-teal-700/20 scale-[1.02]'
                : 'text-slate-600 hover:text-[#028C84] hover:bg-teal-50/50'
                }`}
            >
              Sejarah Sekolah
            </button>
            <button
              onClick={() => setActiveTab('fasilitas')}
              className={`py-2.5 px-6 text-xs sm:text-sm font-bold rounded-full transition-all duration-300 cursor-pointer ${activeTab === 'fasilitas'
                ? 'bg-gradient-to-r from-[#028C84] to-[#156B63] text-white shadow-md shadow-teal-700/20 scale-[1.02]'
                : 'text-slate-600 hover:text-[#028C84] hover:bg-teal-50/50'
                }`}
            >
              Fasilitas Pembelajaran
            </button>
          </div>
        </div>

        {/* Tab 1: Visi & Misi */}
        {activeTab === 'visi-misi' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-fade-in">
            {/* Visi Liquid Glass Card */}
            <div className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(2,140,132,0.12)] hover:border-teal-200/80 transition-all duration-300 space-y-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-100/40 to-transparent rounded-tr-3xl pointer-events-none" />
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#1e40af] text-white shadow-md shadow-blue-950/20">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Arah Pendirian</span>
                  <h3 className="text-xl font-extrabold text-[#1E3A8A]">
                    Visi Sekolah
                  </h3>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-teal-50/90 via-white/80 to-teal-50/40 border border-teal-100/80 shadow-inner">
                <p className="text-base sm:text-lg text-slate-800 font-bold leading-relaxed border-l-4 border-[#028C84] pl-4">
                  "Terwujudnya murid yang beriman dan bertakwa, bernalar kritis, berkarakter mulia,
                  sehat jasmani, dan unggul dalam digitalisasi."
                </p>
              </div>
            </div>

            {/* Misi Liquid Glass Card */}
            <div className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(2,140,132,0.12)] hover:border-teal-200/80 transition-all duration-300 space-y-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-100/40 to-transparent rounded-tr-3xl pointer-events-none" />
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#028C84] to-[#156B63] text-white shadow-md shadow-teal-900/20">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Langkah Strategis</span>
                  <h3 className="text-xl font-extrabold text-[#1E3A8A]">
                    Misi Utama Sekolah
                  </h3>
                </div>
              </div>
              <ul className="space-y-3.5 text-sm sm:text-base text-slate-700">
                <li className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50/60 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-[#028C84] shrink-0 mt-0.5" />
                  <span>Melaksanakan pembiasaan keagamaan serta menanamkan nilai-nilai keimanan, ketakwaan, dan akhlak mulia melalui kegiatan intrakurikuler, kokurikuler, dan ekstrakurikuler dalam kehidupan sehari-hari.</span>
                </li>
                <li className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50/60 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-[#028C84] shrink-0 mt-0.5" />
                  <span>Menyelenggarakan pembelajaran yang berpusat pada murid melalui pendekatan berbasis masalah, proyek, dan pembelajaran mendalam (deep learning) untuk mengembangkan kemampuan bernalar kritis, berpikir reflektif, serta memecahkan masalah.</span>
                </li>
                <li className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50/60 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-[#028C84] shrink-0 mt-0.5" />
                  <span>Menumbuhkan karakter mulia murid melalui pembiasaan budaya positif, penguatan disiplin, tanggung jawab, kepedulian, gotong royong, integritas, dan sikap saling menghormati sesuai nilai-nilai Profil Lulusan.</span>
                </li>
                <li className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50/60 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-[#028C84] shrink-0 mt-0.5" />
                  <span>Mewujudkan lingkungan sekolah yang sehat, aman, nyaman, dan ramah anak melalui pembiasaan hidup bersih dan sehat, kegiatan olahraga, serta pemanfaatan lingkungan sebagai sumber belajar untuk meningkatkan kesehatan jasmani.</span>
                </li>
                <li className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50/60 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-[#028C84] shrink-0 mt-0.5" />
                  <span>Mengembangkan budaya digital di lingkungan sekolah melalui pemanfaatan teknologi informasi dan komunikasi dalam pembelajaran, pengelolaan sekolah, serta penguatan literasi digital secara bijaksana, kreatif, dan bertanggung jawab dengan dukungan kemitraan berbagai pihak.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Sejarah */}
        {activeTab === 'sejarah' && (
          <div className="relative bg-white/75 backdrop-blur-xl rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(2,140,132,0.12)] hover:border-teal-200/80 transition-all duration-300 space-y-6 animate-fade-in overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-100/40 to-transparent rounded-tr-3xl pointer-events-none" />

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md shadow-amber-900/20">
                <History className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Perjalanan Pengabdian</span>
                <h3 className="text-2xl font-extrabold text-[#1E3A8A]">
                  Sejarah Singkat SD Negeri 1 Mulyoagung
                </h3>
              </div>
            </div>

            <div className="prose max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 pt-2">
              <p className="p-4 bg-teal-50/40 rounded-2xl border border-teal-100/60 font-medium">
                SD Negeri 1 Mulyoagung didirikan pada tahun 1970-an di pusat Kecamatan Dau, Kabupaten Malang. Terletak di kawasan strategis yang dekat dengan wilayah wisata, industri, dan lembaga pemerintahan, sekolah ini hadir untuk memenuhi kebutuhan pendidikan masyarakat dengan latar belakang siswa yang beragam.
              </p>

              <p>
                Pada bulan <strong>Desember 2018</strong>, sekolah mengalami babak penting dalam perjalanannya melalui proses <em>merger</em> (penggabungan) dua lembaga, yaitu SD Negeri 1 Mulyoagung dan SD Negeri 3 Mulyoagung. Penggabungan ini semakin memperkuat sinergi fasilitas, tenaga pendidik, dan manajemen sekolah dalam menghadirkan layanan pendidikan dasar yang makin berkualitas.
              </p>

              <p>
                Ciri khas lain yang menjadi kebanggaan sekolah adalah keberadaan <strong>Ikon Patung Semar</strong> di area sekolah, yang menyimbolkan komitmen kuat SDN 1 Mulyoagung dalam melestarikan nilai-nilai budaya dan kearifan lokal Jawa.
              </p>

              <p>
                Kini, di bawah kepemimpinan yang berdedikasi serta didukung fasilitator dan Guru Penggerak, SD Negeri 1 Mulyoagung terus bertransformasi menerapkan Kurikulum Merdeka. Sekolah berkomitmen membentuk generasi unggul yang beriman dan bertakwa, berakhlak mulia, bernalar kritis, mandiri, kreatif, serta berkebinekaan global sesuai nilai-nilai Profil Pelajar Pancasila.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Fasilitas */}
        {activeTab === 'fasilitas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {facilities.map((fac) => {
              const imageSrc = fac.foto ? getImageUrl(fac.foto) : (fac.image || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=600');
              return (
                <div
                  key={fac.id}
                  className="group relative bg-white/75 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/80 shadow-[0_8px_25px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_35px_rgba(2,140,132,0.14)] hover:border-teal-200/80 transition-all duration-300 flex flex-col hover:-translate-y-1"
                >
                  <div className="h-48 w-full overflow-hidden relative">
                    <img
                      src={imageSrc}
                      alt={fac.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/85 backdrop-blur-md p-2.5 rounded-2xl shadow-md border border-white/60">
                      {getFacilityIconByTitle(fac.judul)}
                    </div>
                  </div>

                  <div className="p-6 space-y-2 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-lg text-[#1E3A8A] group-hover:text-[#028C84] transition-colors">
                        {fac.judul}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                        {fac.deskripsi}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};