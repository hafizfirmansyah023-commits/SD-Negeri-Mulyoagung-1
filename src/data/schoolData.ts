import { Article, Teacher, GalleryItem, Facility, StatItem } from '../types';

export const SCHOOL_STATS: StatItem[] = [
  {
    id: 'stat-siswa',
    number: '250+',
    label: 'Siswa Aktif',
    icon: 'Users',
    colorClass: 'text-blue-600',
    bgClass: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-400/30 liquid-glass-badge',
  },
  {
    id: 'stat-guru',
    number: '16',
    label: 'Guru & Tendik',
    icon: 'GraduationCap',
    colorClass: 'text-teal-600',
    bgClass: 'bg-gradient-to-br from-teal-500/20 to-emerald-500/10 border border-teal-400/30 liquid-glass-badge',
  },
  {
    id: 'stat-alumni',
    number: '500+',
    label: 'Alumni',
    icon: 'Award',
    colorClass: 'text-amber-600',
    bgClass: 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-400/30 liquid-glass-badge',
  },
  {
    id: 'stat-akreditasi',
    number: 'A',
    label: 'Akreditasi',
    icon: 'CheckCircle2',
    colorClass: 'text-emerald-600',
    bgClass: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-400/30 liquid-glass-badge',
  },
];

export const PRINCIPAL_INFO = {
  name: 'Amalia Dyah Erviana, S.Pd.',
  title: 'Kepala SD Negeri 1 Mulyoagung',
  photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600',
  greeting: `"Assalamu'alaikum Wr. Wb.

Selamat datang di website resmi SD Negeri Mulyoagung 1. Kami berkomitmen memberikan pendidikan terbaik bagi putra-putri Anda, membimbing mereka menjadi generasi yang tidak hanya cerdas secara akademik, namun juga memiliki karakter dan budi pekerti yang luhur. 

Melalui semangat kebersamaan, inovasi pembelajaran berbasis digital, dan penguatan Profil Pelajar Pancasila, kami yakin dapat membentuk peserta didik yang siap menghadapi tantangan masa depan dengan tetap memegang teguh nilai-nilai keagamaan dan budaya bangsa. Melalui website ini, kami berharap dapat menjalin komunikasi yang lebih erat dengan seluruh masyarakat dan orang tua wali murid."`,
};

export const NEWS_ARTICLES: Article[] = [
  {
    id: 'news-1',
    title: 'Outing Class ke Kebun Binatang Yogyakarta',
    category: 'Kegiatan',
    date: '25 Oktober 2025',
    summary: 'Hari yang penuh keceriaan bagi siswa SD Negeri Mulyoagung 1 saat mengikuti kegiatan belajar di luar kelas.',
    content: `Seluruh siswa kelas 1 hingga kelas 6 SD Negeri Mulyoagung 1 mengeksplorasi keanekaragaman satwa dan alam dalam kegiatan Outing Class tahunan. Kegiatan ini dirancang untuk memberikan pengalaman belajar langsung di luar lingkungan sekolah.

Para siswa diajak mengenal spesies satwa langka Indonesia, habitat alami mereka, serta pentingnya pelestarian keanekaragaman hayati. Kegiatan dipandu oleh para guru pendamping dan edukator profesional. Selain memperluas wawasan keilmuan IPA dan Lingkungan Hidup, kegiatan ini juga melatih kemandirian, kedisiplinan, serta kerja sama antar siswa dalam kelompok.

Orang tua wali murid menyambut positif kegiatan ini karena anak-anak tidak hanya belajar teori di dalam kelas tetapi juga mengalami pembelajaran konseptual secara nyata dan menyenangkan.`,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
    imageAlt: 'Siswa SD kegiatan outing class luar ruangan',
    author: 'Tim Humas SDN Mulyoagung 1',
    readTime: '3 menit',
    featured: true,
  },
  {
    id: 'news-2',
    title: 'Penyerahan Bantuan Teknologi Pembelajaran Digital',
    category: 'Prestasi',
    date: '21 Oktober 2025',
    summary: 'SD Negeri Mulyoagung 1 kembali menerima dukungan sarana pembelajaran digital dari pemerintah daerah.',
    content: `Pemerintah Kabupaten Malang melalui Dinas Pendidikan secara resmi menyerahkan bantuan berupa Interactive Flat Panel (Layar Interaktif Digital) dan perangkat Chromebook terbaru untuk menunjang kegiatan Pembelajaran Berbasis TIK di SD Negeri Mulyoagung 1.

Kepala Sekolah, Ibu Amalia Dyah Erviana, S.Pd.SD, S.Pd., menyampaikan rasa syukur dan terima kasih mendalam atas perhatian pemerintah daerah. Penambahan sarana ini diharapkan dapat mempercepat akselerasi digitalisasi sekolah, memudahkan guru menghadirkan metode belajar multimedia interaktif, serta melatih literasi digital siswa sejak usia dini.

Fasilitas baru ini akan langsung ditempatkan di ruang laboratorium multimedia dan kelas-kelas utama untuk mendukung Kurikulum Merdeka secara optimal.`,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    imageAlt: 'Perangkat laboratorium TIK sekolah',
    author: 'Admin Sekolah',
    readTime: '4 menit',
    featured: true,
  },
  {
    id: 'news-3',
    title: 'Siswa SDN Mulyoagung 1 Ikuti Edukasi Konservasi Alam',
    category: 'Edukasi',
    date: '30 September 2025',
    summary: 'Antusiasme siswa siswi saat mendengarkan paparan dari tim konservasi alam tentang pentingnya menjaga lingkungan.',
    content: `Bekerja sama dengan Balai Konservasi Sumber Daya Alam (BKSDA) Jawa Timur, SD Negeri Mulyoagung 1 menggelar workshop "Generasi Muda Peduli Konservasi Lingkungan". 

Siswa diajak memilah sampah plastik, menanam bibit pohon edukasi di area sekolah, serta membuat kompos sederhana. Kegiatan ini membakar semangat para siswa untuk mempraktikkan gaya hidup ramah lingkungan baik di lingkungan sekolah maupun di rumah masing-masing.

Melalui program Green School ini, SD Negeri Mulyoagung 1 berkomitmen mewujudkan sekolah adiwiyata yang bersih, asri, dan berwawasan lingkungan berkelanjutan.`,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
    imageAlt: 'Siswa menanam pohon dan belajar konservasi',
    author: 'Guru Pembina Adiwiyata',
    readTime: '3 menit',
    featured: true,
  },
  {
    id: 'news-4',
    title: 'Siswa SDN Mulyoagung 1 Raih Medali Emas O2SN Tingkat Kecamatan',
    category: 'Prestasi',
    date: '15 September 2025',
    summary: 'Selamat kepada ananda Rizky Pratama dari kelas 5 yang berhasil meraih juara 1 cabang olahraga Bulutangkis.',
    content: `Prestasi membanggakan kembali diraih oleh siswa SD Negeri Mulyoagung 1 dalam ajang Olimpiade Olahraga Siswa Nasional (O2SN) tingkat Kecamatan Dau. Ananda Rizky Pratama tampil mengesankan dan berhasil membawa pulang medali emas cabang olahraga bulutangkis putra.

Keberhasilan ini tidak lepas dari latihan rutin dan bimbingan berkesinambungan dari Guru Olahraga Bapak Budi Santoso, M.Pd. Selanjutnya, ananda Rizky akan mewakili kecamatan Dau ke tingkat Kabupaten Malang. Seluruh civitas akademika mendoakan yang terbaik untuk perjuangan berikutnya.`,
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800',
    imageAlt: 'Siswa membawa piala kejuaraan olahraga',
    author: 'Tim Kesiswaan',
    readTime: '2 menit',
  },
  {
    id: 'news-5',
    title: 'Pentas Seni Budaya dan Gelar Karya P5 Khas Jawa Timur',
    category: 'Kegiatan',
    date: '28 Agustus 2025',
    summary: 'Kemeriahan pameran karya kreasi siswa dan tarian tradisional dalam rangka Pesta Panen Hasil Belajar P5.',
    content: `Suasana meriah memenuhi halaman SD Negeri Mulyoagung 1 pada penyelenggaraan Gelar Karya Projek Penguatan Profil Pelajar Pancasila (P5). Dengan mengusung tema "Kearifan Lokal dan Budaya Nusantara", para siswa menampilkan pertunjukan Tari Remo, Tari Reog Anak, serta pameran hasil kerajinan tangan dari barang bekas.

Acara dibuka langsung oleh Kepala Sekolah dan dihadiri oleh pengawas sekolah, komite sekolah, serta ratusan orang tua murid. Kegiatan ini menjadi wadah aktualisasi bakat seni, percaya diri, dan apresiasi nilai-nilai kebudayaan sejak dini.`,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    imageAlt: 'Pentas seni tarian siswa sekolah',
    author: 'Panitia P5',
    readTime: '4 menit',
  },
  {
    id: 'news-6',
    title: 'Jadwal Pendaftaran PPDB Online Tahun Ajaran 2025/2026',
    category: 'Pengumuman',
    date: '10 Agustus 2025',
    summary: 'Pendaftaran Siswa Baru (PPDB) resmi dibuka melalui portal sistem pendaftaran online SDN Mulyoagung 1.',
    content: `Pemerintah Kabupaten Malang bersama SDN Mulyoagung 1 mengumumkan pembukaan Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2025/2026. 

Pendaftaran dapat dilakukan secara mandiri melalui website resmi ini dengan mengisi formulir digital PPDB Online. Jalur pendaftaran meliputi Jalur Zonasi, Jalur Afirmasi (KIP/PKH), Jalur Prestasi Akademik/Non-Akademik, serta Perpindahan Tugas Orang Tua. Bagi calon wali murid yang membutuhkan pendampingan teknis, panitia PPDB siap melayani secara langsung di sekretariat pendaftaran sekolah setiap hari kerja pukul 08.00 - 12.00 WIB.`,
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    imageAlt: 'Formulir pendaftaran dan dokumen sekolah',
    author: 'Panitia PPDB 2025',
    readTime: '3 menit',
  },
];

export const TEACHERS_DIRECTORY: Teacher[] = [
  {
    id: 't-1',
    name: 'Amalia Dyah Erviana, S.Pd.',
    title: 'Kepala Sekolah',
    role: 'Kepala Sekolah',
    nip: '19740512 199803 1 004',
    subject: 'Manajemen Pendidikan',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    education: 'S1 Pendidikan Universitas Negeri Malang',
    quote: 'Mendidik anak bukan sekadar mengisi wadah, tetapi menyalakan api karakter dan pengetahuan.',
    email: 'aris.wibowo@sdnmulyoagung1.sch.id',
    gender: "Perempuan",
    status: "Aktif",
  }
];

export const SCHOOL_FACILITIES: Facility[] = [
  {
    id: 'fac-1',
    name: 'Laboratorium Komputer & TIK Interaktif',
    description: 'Dilengkapi 30 unit komputer terkini, jaringan Wi-Fi sekolah, dan Smart Display untuk pembelajaran coding dasar & literasi digital.',
    iconName: 'Monitor',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'fac-2',
    name: 'Perpustakaan "Taman Ilmu"',
    description: 'Koleksi ribuan buku cerita, modul pembelajaran, koleksi literasi digital e-book, dan sudut baca ramah anak yang nyaman.',
    iconName: 'BookOpen',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'fac-3',
    name: 'Lapangan Olahraga & Upacara',
    description: 'Areal seluas 800m² dilapisi plester berkualitas untuk upacara bendera, senam bersama, bulutangkis, basket, dan futsal.',
    iconName: 'Activity',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'fac-4',
    name: 'Ruang UKS & Poliklinik Sekolah',
    description: 'Fasilitas pertolongan pertama kesehatan dengan tempat tidur bersih, pengukuran TB/BB rutin, dan kerja sama Puskesmas Dau.',
    iconName: 'HeartPulse',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'fac-5',
    name: 'Kantin Sehat Bergizi',
    description: 'Menyediakan makanan dan minuman sehat yang higienis, bebas bahan pengawet berbahaya, dan diawasi oleh tim gizi sekolah.',
    iconName: 'Coffee',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'fac-6',
    name: 'Taman Edukasi & Green House',
    description: 'Area hijau pemanfaatan hidroponik, tanaman toga, dan ruang pengolahan kompos sebagai wahana belajar Adiwiyata.',
    iconName: 'Trees',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Upacara Bendera Hari Kemerdekaan RI',
    category: 'Kegiatan',
    date: '17 Agustus 2025',
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800',
    description: 'Siswa-siswi petugas paski sekolah melaksanakan pengibaran bendera dengan penuh khidmat.',
  },
  {
    id: 'gal-2',
    title: 'Pembelajaran TIK Berbasis Chromebook',
    category: 'Pembelajaran',
    date: '10 September 2025',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
    description: 'Siswa kelas 5 berlatih menggunakan perangkat Chromebook untuk asesmen nasional.',
  },
  {
    id: 'gal-3',
    title: 'Pemberian Piala Juara O2SN Bulutangkis',
    category: 'Prestasi',
    date: '18 September 2025',
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=800',
    description: 'Penyerahan piala oleh Kepala Sekolah saat apel pagi Senin.',
  },
  {
    id: 'gal-4',
    title: 'Kegiatan Dokter Kecil dan Pemeriksaan Gigi',
    category: 'Kegiatan',
    date: '02 Oktober 2025',
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800',
    description: 'Tim Puskesmas Dau memberikan edukasi cara menyikat gigi yang baik dan benar.',
  },
  {
    id: 'gal-5',
    title: 'Taman Edukasi Hidroponik Sekolah',
    category: 'Fasilitas',
    date: '12 Oktober 2025',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    description: 'Panen sayur kangkung dan pakcoy hasil rakitan sistem hidroponik siswa.',
  },
  {
    id: 'gal-6',
    title: 'Kunjungan Edukatif Outing Class',
    category: 'Kegiatan',
    date: '25 Oktober 2025',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
    description: 'Momen kebersamaan para siswa saat menjelajahi edukasi keanekaragaman flora & fauna.',
  },
];