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
  gender?: string;
  status?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
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

export interface AkademikMenuItem {
  id: number;
  label: string;
  deskripsi?: string | null;
  parent_id?: number | null;
  parent_label?: string | null;
  link_gdrive: string;
  is_modul: number;
  urutan: number;
  aktif: number;
  created_at?: string;
  updated_at?: string;
}

export interface InovasiItem {
  id: string | number;
  judul: string;
  kategori: string;
  inovator?: string | null;
  deskripsi?: string | null;
  link_drive: string;
  foto_cover?: string | null;
  foto_cover_crop?: string | null;
  foto?: string | null;
  foto_original?: string | null;
  status: 'Draft' | 'Published';
  status_verifikasi: 'Pending' | 'Verified' | 'Rejected';
  uploaded_by?: number | null;
  uploader?: string;
  uploader_role?: string;
  created_at?: string;
  updated_at?: string;
}

export type NavTab = 'home' | 'profile' | 'directory' | 'akademik' | 'gallery' | 'news' | 'modul' | 'inovasi' | 'contact' | 'ppdb' | 'cms';