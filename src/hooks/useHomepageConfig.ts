import { useState, useEffect } from 'react';
import { getApiBaseUrl } from '../config/api';

export interface HomepageSection {
  key: string;
  judul: string;
  subjudul: string;
  is_active: boolean;
}

export interface HomepageConfig {
  sections: HomepageSection[];
  heroTitle: string;
  heroSubtitle: string;
  heroBg: string;
  videoUrl: string;
  visi: string;
  misi: string[];
  sejarah: string;
}

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSection[] = [
  { key: 'hero', judul: 'Hero', subjudul: '', is_active: true },
  { key: 'stats', judul: 'Statistik Sekolah', subjudul: '', is_active: true },
  { key: 'sambutan', judul: 'Sambutan Kepala Sekolah', subjudul: '', is_active: true },
  {
    key: 'berita',
    judul: 'Berita & Kegiatan Terbaru',
    subjudul: 'Ikuti terus perkembangan informasi dan aktivitas menarik di sekolah kami.',
    is_active: true,
  },
  {
    key: 'profil',
    judul: 'Profil Sekolah',
    subjudul: 'Mengenal lebih dekat visi, misi, dan sejarah panjang SD Negeri 1 Mulyoagung.',
    is_active: true,
  },
  {
    key: 'video',
    judul: 'Profil Video Sekolah',
    subjudul: 'Tonton video profil sekolah kami untuk mengenal lingkungan belajar, fasilitas, dan kegiatan siswa secara visual.',
    is_active: true,
  },
  {
    key: 'kontak',
    judul: 'Kontak Kami',
    subjudul: 'Hubungi kami atau kunjungi lokasi sekolah dasar kami melalui detail kontak di bawah ini.',
    is_active: true,
  },
];

export const DEFAULT_HOMEPAGE_CONFIG: HomepageConfig = {
  sections: DEFAULT_HOMEPAGE_SECTIONS,
  heroTitle: 'SD Negeri 1 Mulyoagung',
  heroSubtitle:
    'Selamat datang di SD Negeri 1 Mulyoagung, sekolah yang berkomitmen menciptakan lingkungan belajar yang aman, nyaman, dan inspiratif. Kami menghadirkan pendidikan berkualitas untuk membentuk peserta didik yang beriman, berakhlak mulia, berprestasi, kreatif, serta siap menghadapi perkembangan ilmu pengetahuan dan teknologi di masa depan.',
  heroBg: '',
  videoUrl: 'https://www.youtube.com/embed/5T2k922_Z8Q',
  visi: 'Terwujudnya murid yang beriman dan bertakwa, bernalar kritis, berkarakter mulia, sehat jasmani, dan unggul dalam digitalisasi.',
  misi: [
    'Melaksanakan pembiasaan keagamaan serta menanamkan nilai-nilai keimanan, ketakwaan, dan akhlak mulia melalui kegiatan intrakurikuler, kokurikuler, dan ekstrakurikuler dalam kehidupan sehari-hari.',
    'Menyelenggarakan pembelajaran yang berpusat pada murid melalui pendekatan berbasis masalah, proyek, dan pembelajaran mendalam (deep learning) untuk mengembangkan kemampuan bernalar kritis, berpikir reflektif, serta memecahkan masalah.',
    'Menumbuhkan karakter mulia murid melalui pembiasaan budaya positif, penguatan disiplin, tanggung jawab, kepedulian, gotong royong, integritas, dan sikap saling menghormati sesuai nilai-nilai Profil Lulusan.',
    'Mewujudkan lingkungan sekolah yang sehat, aman, nyaman, dan ramah anak melalui pembiasaan hidup bersih dan sehat, kegiatan olahraga, serta pemanfaatan lingkungan sebagai sumber belajar untuk meningkatkan kesehatan jasmani.',
    'Mengembangkan budaya digital di lingkungan sekolah melalui pemanfaatan teknologi informasi dan komunikasi dalam pembelajaran, pengelolaan sekolah, serta penguatan literasi digital secara bijaksana, kreatif, dan bertanggung jawab dengan dukungan kemitraan berbagai pihak.',
  ],
  sejarah:
    'Didirikan pada tahun 1970-an di pusat Kecamatan Dau, Malang, sekolah ini hadir untuk memenuhi kebutuhan pendidikan masyarakat di kawasan strategis yang dekat dengan wilayah wisata dan industri.\n\nPada bulan Desember 2018, sekolah mengalami babak penting melalui proses merger antara SDN 1 Mulyoagung and SDN 3 Mulyoagung, memperkuat sinergi fasilitas dan manajemen sekolah.\n\nCiri khas kebanggaan sekolah adalah Ikon Patung Semar, menyimbolkan komitmen kelestarian budaya kearifan lokal Jawa.\n\nKini, didukung fasilitator dan Guru Penggerak, SDN 1 Mulyoagung bertransformasi menerapkan Kurikulum Merdeka untuk membentuk generasi unggul sesuai Profil Pelajar Pancasila.',
};

let cachedConfig: HomepageConfig | null = null;

export const useHomepageConfig = (): HomepageConfig => {
  const [config, setConfig] = useState<HomepageConfig>(cachedConfig || DEFAULT_HOMEPAGE_CONFIG);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/backend/API/pengaturan.php`);
        const result = await response.json();

        if (result.status === 'success') {
          const loaded: HomepageConfig = {
            sections: Array.isArray(result.homepage_sections) && result.homepage_sections.length > 0
              ? result.homepage_sections
              : DEFAULT_HOMEPAGE_CONFIG.sections,
            heroTitle: result.hero_title || DEFAULT_HOMEPAGE_CONFIG.heroTitle,
            heroSubtitle: result.hero_subtitle || DEFAULT_HOMEPAGE_CONFIG.heroSubtitle,
            heroBg: result.hero_bg || '',
            videoUrl: result.video_url || DEFAULT_HOMEPAGE_CONFIG.videoUrl,
            visi: result.profil_visi || DEFAULT_HOMEPAGE_CONFIG.visi,
            misi: Array.isArray(result.profil_misi) && result.profil_misi.length > 0
              ? result.profil_misi
              : DEFAULT_HOMEPAGE_CONFIG.misi,
            sejarah: result.profil_sejarah || DEFAULT_HOMEPAGE_CONFIG.sejarah,
          };
          cachedConfig = loaded;
          setConfig(loaded);
        }
      } catch (err) {
        if (!cachedConfig) {
          cachedConfig = DEFAULT_HOMEPAGE_CONFIG;
          setConfig(DEFAULT_HOMEPAGE_CONFIG);
        }
      }
    };

    fetchConfig();
  }, []);

  return config;
};
