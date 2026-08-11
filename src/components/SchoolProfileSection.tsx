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
      return <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-[#028C84]" />;
    }
    if (t.includes('pustaka') || t.includes('buku') || t.includes('baca') || t.includes('literasi')) {
      return <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#028C84]" />;
    }
    if (t.includes('lapangan') || t.includes('olahraga') || t.includes('futsal') || t.includes('basket') || t.includes('senam') || t.includes('fisik')) {
      return <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#028C84]" />;
    }
    if (t.includes('uks') || t.includes('sehat') || t.includes('kesehatan') || t.includes('poliklinik') || t.includes('medis')) {
      return <HeartPulse className="w-4 h-4 sm:w-5 sm:h-5 text-[#028C84]" />;
    }
    if (t.includes('kantin') || t.includes('makan') || t.includes('gizi') || t.includes('kuliner') || t.includes('minum')) {
      return <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-[#028C84]" />;
    }
    if (t.includes('taman') || t.includes('green') || t.includes('kebun') || t.includes('adiwiyata') || t.includes('pohon') || t.includes('hidroponik')) {
      return <Trees className="w-4 h-4 sm:w-5 sm:h-5 text-[#028C84]" />;
    }
    if (t.includes('musa') || t.includes('masjid') || t.includes('agama') || t.includes('ibadah')) {
      return <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#028C84]" />;
    }
    return <Building className="w-4 h-4 sm:w-5 sm:h-5 text-[#028C84]" />;
  };

  return (
    <section id="profile-section" className="relative w-full py-10 sm:py-24 bg-gradient-to-b from-white via-teal-50/30 to-white overflow-hidden transition-colors">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-8 lg:px-12 space-y-6 sm:space-y-12 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[#028C84] font-bold text-[9px] sm:text-xs uppercase tracking-wider bg-teal-50/80 border border-teal-200/80 px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-sm">
            <Compass className="w-3 h-3 sm:w-4 sm:h-4 text-[#028C84]" />
            Mengenal Sekolah Kami
          </div>
          <h2 className="text-xl sm:text-4xl font-extrabold text-[black] tracking-tight leading-tight">
            Profil SD Negeri 1 Mulyoagung
          </h2>
          <p className="text-slate-600 text-[11px] sm:text-base leading-snug px-1">
            Landasan visi pendidik, kilasan sejarah pengabdian, serta fasilitas pendukung.
          </p>
        </div>

        {/* Tab Buttons - Dirampingkan untuk mobile */}
        <div className="flex justify-center w-full">
          <div className="flex w-full sm:w-auto p-1 rounded-xl sm:rounded-full bg-white/70 backdrop-blur-xl border border-teal-100 shadow-sm">
            <button
              onClick={() => setActiveTab('visi-misi')}
              className={`flex-1 sm:flex-none py-1.5 sm:py-2 px-1 sm:px-6 text-[10px] sm:text-sm font-bold rounded-lg sm:rounded-full transition-all duration-300 ${
                activeTab === 'visi-misi'
                  ? 'bg-gradient-to-r from-[#028C84] to-[#156B63] text-white shadow-md shadow-teal-700/20 scale-[1.02]'
                  : 'text-slate-600 hover:text-[#028C84] hover:bg-teal-50/50'
              }`}
            >
              Visi & Misi
            </button>
            <button
              onClick={() => setActiveTab('sejarah')}
              className={`flex-1 sm:flex-none py-1.5 sm:py-2 px-1 sm:px-6 text-[10px] sm:text-sm font-bold rounded-lg sm:rounded-full transition-all duration-300 ${
                activeTab === 'sejarah'
                  ? 'bg-gradient-to-r from-[#028C84] to-[#156B63] text-white shadow-md shadow-teal-700/20 scale-[1.02]'
                  : 'text-slate-600 hover:text-[#028C84] hover:bg-teal-50/50'
              }`}
            >
              Sejarah
            </button>
            <button
              onClick={() => setActiveTab('fasilitas')}
              className={`flex-1 sm:flex-none py-1.5 sm:py-2 px-1 sm:px-6 text-[10px] sm:text-sm font-bold rounded-lg sm:rounded-full transition-all duration-300 ${
                activeTab === 'fasilitas'
                  ? 'bg-gradient-to-r from-[#028C84] to-[#156B63] text-white shadow-md shadow-teal-700/20 scale-[1.02]'
                  : 'text-slate-600 hover:text-[#028C84] hover:bg-teal-50/50'
              }`}
            >
              Fasilitas
            </button>
          </div>
        </div>

        {/* Tab 1: Visi & Misi */}
        {activeTab === 'visi-misi' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-start animate-fade-in">
            {/* Visi Card */}
            <div className="group relative bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-white/80 shadow-sm transition-all space-y-3 sm:space-y-5">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="p-2 sm:p-3 rounded-lg sm:rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#1e40af] text-white">
                  <Target className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <span className="text-[9px] sm:text-xs font-bold text-teal-600 uppercase tracking-wider">Arah Pendirian</span>
                  <h3 className="text-sm sm:text-xl font-extrabold text-[#1E3A8A] leading-none mt-0.5">
                    Visi Sekolah
                  </h3>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-xl p-3 sm:p-5 bg-gradient-to-r from-teal-50/90 to-teal-50/40 border border-teal-100/80">
                <p className="text-[11px] sm:text-lg text-slate-800 font-bold leading-snug sm:leading-relaxed border-l-2 sm:border-l-4 border-[#028C84] pl-2.5 sm:pl-4">
                  "Terwujudnya murid yang beriman dan bertakwa, bernalar kritis, berkarakter mulia, sehat jasmani, dan unggul dalam digitalisasi."
                </p>
              </div>
            </div>

            {/* Misi Card */}
            <div className="group relative bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-white/80 shadow-sm transition-all space-y-3 sm:space-y-5">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="p-2 sm:p-3 rounded-lg sm:rounded-2xl bg-gradient-to-br from-[#028C84] to-[#156B63] text-white">
                  <Compass className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <span className="text-[9px] sm:text-xs font-bold text-teal-600 uppercase tracking-wider">Langkah Strategis</span>
                  <h3 className="text-sm sm:text-xl font-extrabold text-[#1E3A8A] leading-none mt-0.5">
                    Misi Utama Sekolah
                  </h3>
                </div>
              </div>
              <ul className="space-y-1.5 sm:space-y-3.5 text-[11px] sm:text-base text-slate-700 leading-snug">
                <li className="flex items-start gap-2 sm:gap-3 p-1.5 sm:p-2.5 rounded-lg hover:bg-teal-50/60">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#028C84] shrink-0 mt-0.5" />
                  <span>Melaksanakan pembiasaan keagamaan serta menanamkan nilai-nilai keimanan, ketakwaan, 
                    dan akhlak mulia melalui kegiatan intrakurikuler, kokurikuler, dan ekstrakurikuler dalam kehidupan sehari-hari.</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 p-1.5 sm:p-2.5 rounded-lg hover:bg-teal-50/60">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#028C84] shrink-0 mt-0.5" />
                  <span>Menyelenggarakan pembelajaran yang berpusat pada murid melalui pendekatan berbasis masalah,
                     proyek, dan pembelajaran mendalam (deep learning) untuk mengembangkan kemampuan bernalar kritis,
                      berpikir reflektif, serta memecahkan masalah.</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 p-1.5 sm:p-2.5 rounded-lg hover:bg-teal-50/60">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#028C84] shrink-0 mt-0.5" />
                  <span>Menumbuhkan karakter mulia murid melalui pembiasaan budaya positif, penguatan disiplin,
                     tanggung jawab, kepedulian, gotong royong, integritas, dan sikap saling menghormati
                      sesuai nilai-nilai Profil Lulusan.</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 p-1.5 sm:p-2.5 rounded-lg hover:bg-teal-50/60">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#028C84] shrink-0 mt-0.5" />
                  <span>Mewujudkan lingkungan sekolah yang sehat, aman, nyaman, dan ramah anak melalui pembiasaan
                     hidup bersih dan sehat, kegiatan olahraga, serta pemanfaatan lingkungan sebagai sumber belajar
                      untuk meningkatkan kesehatan jasmani.</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 p-1.5 sm:p-2.5 rounded-lg hover:bg-teal-50/60">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#028C84] shrink-0 mt-0.5" />
                  <span>Mengembangkan budaya digital di lingkungan sekolah melalui pemanfaatan teknologi informasi
                     dan komunikasi dalam pembelajaran, pengelolaan sekolah, serta penguatan literasi digital
                      secara bijaksana, kreatif, dan bertanggung jawab dengan dukungan kemitraan berbagai pihak.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Sejarah */}
        {activeTab === 'sejarah' && (
          <div className="relative bg-white/75 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-10 lg:p-12 border border-white/80 shadow-sm space-y-3 sm:space-y-6 animate-fade-in">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                <History className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="text-[9px] sm:text-xs font-bold text-amber-600 uppercase tracking-wider">Perjalanan Pengabdian</span>
                <h3 className="text-sm sm:text-2xl font-extrabold text-[#1E3A8A] leading-none mt-0.5">
                  Sejarah SDN 1 Mulyoagung
                </h3>
              </div>
            </div>

            <div className="prose max-w-none text-slate-700 text-[11px] sm:text-base leading-snug sm:leading-relaxed space-y-2.5 sm:space-y-4">
              <p className="p-2.5 sm:p-4 bg-teal-50/40 rounded-lg sm:rounded-2xl border border-teal-100/60 font-medium">
                Didirikan pada tahun 1970-an di pusat Kecamatan Dau, Malang, sekolah ini hadir untuk memenuhi kebutuhan pendidikan masyarakat di kawasan strategis yang dekat dengan wilayah wisata dan industri.
              </p>
              <p>
                Pada bulan <strong>Desember 2018</strong>, sekolah mengalami babak penting melalui proses <em>merger</em> antara SDN 1 Mulyoagung dan SDN 3 Mulyoagung, memperkuat sinergi fasilitas dan manajemen sekolah.
              </p>
              <p>
                Ciri khas kebanggaan sekolah adalah <strong>Ikon Patung Semar</strong>, menyimbolkan komitmen kelestarian budaya kearifan lokal Jawa.
              </p>
              <p>
                Kini, didukung fasilitator dan Guru Penggerak, SDN 1 Mulyoagung bertransformasi menerapkan Kurikulum Merdeka untuk membentuk generasi unggul sesuai Profil Pelajar Pancasila.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Fasilitas */}
        {activeTab === 'fasilitas' && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 animate-fade-in">
            {facilities.map((fac) => {
              const imageSrc = fac.foto ? getImageUrl(fac.foto) : (fac.image || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=600');
              return (
                <div
                  key={fac.id}
                  className="group relative bg-white/75 backdrop-blur-xl rounded-xl sm:rounded-3xl overflow-hidden border border-white/80 shadow-sm flex flex-col"
                >
                  {/* Tinggi gambar diperkecil pada mobile agar tidak lonjong */}
                  <div className="h-28 sm:h-52 w-full overflow-hidden relative">
                    <img
                      src={imageSrc}
                      alt={fac.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md p-1.5 sm:p-2.5 rounded-lg sm:rounded-2xl shadow-sm">
                      {getFacilityIconByTitle(fac.judul)}
                    </div>
                  </div>

                  <div className="p-3 sm:p-6 flex-grow flex flex-col">
                    <h4 className="font-bold text-[12px] sm:text-lg text-[#1E3A8A] leading-tight line-clamp-1 sm:line-clamp-none">
                      {fac.judul}
                    </h4>
                    {/* Line-clamp memastikan deskripsi tidak memanjang ke bawah */}
                    <p className="text-[10px] sm:text-sm text-slate-600 leading-snug mt-1 sm:mt-2 line-clamp-2 sm:line-clamp-3">
                      {fac.deskripsi}
                    </p>
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