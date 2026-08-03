export interface Article {
  id: string;
  title: string;
  category: 'Kegiatan' | 'Prestasi' | 'Edukasi' | 'Pengumuman';
  date: string;
  summary: string;
  content: string;
  image: string;
  imageAlt: string;
  author: string;
  readTime: string;
  featured?: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  title: string;
  role: string;
  nip: string;
  subject: string;
  image: string;
  education: string;
  quote?: string;
  email?: string;
  experienceYears?: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Kegiatan' | 'Pembelajaran' | 'Prestasi' | 'Fasilitas';
  date: string;
  image: string;
  description: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  iconName: string;
  image: string;
}

export interface StatItem {
  id: string;
  number: string;
  label: string;
  icon: string;
  colorClass: string;
  bgClass: string;
}

export interface PpdbApplication {
  id: string;
  regNumber: string;
  studentName: string;
  nik: string;
  birthPlaceDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  parentName: string;
  parentPhone: string;
  address: string;
  track: 'Zonasi' | 'Afirmasi' | 'Prestasi' | 'Perpindahan Orang Tua';
  previousSchool?: string;
  submittedAt: string;
  status: 'Menunggu Verifikasi' | 'Diterima' | 'Berkas Kurang';
}

export type NavTab = 'home' | 'profile' | 'directory' | 'gallery' | 'news' | 'contact' | 'ppdb';
