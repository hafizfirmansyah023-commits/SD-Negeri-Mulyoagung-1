import { NavTab } from '../types';

export const SOCIAL_LINKS = {
  youtube: 'https://www.youtube.com/@mulyoagungsatu3851',
  instagram: 'https://www.instagram.com/mulyoagung1_dau',
  facebook: 'https://www.facebook.com/profile.php?id=100085140035121',
  tiktok: 'https://www.tiktok.com/@mulyoagung.1',
};

export const FOOTER_CONTACT_INFO = {
  alamat: 'JL. RAYA MULYOAGUNG NO.121 RT. 1 RW. 10 DUSUN MULYOAGUNG , Kec. Dau, Kab. Malang, Prov. Jawa Timur',
  email: 'sdnmulyoagung01@gmail.com',
  teleponDisplay: '(0341) 466-730',
  teleponHref: 'tel:08123456789',
};

export interface QuickLink {
  label: string;
  tab: NavTab;
  // Kelas warna teks default sedikit berbeda untuk item CMS di desain asli
  textClass?: string;
}

export const QUICK_LINKS: QuickLink[] = [
  { label: 'Beranda', tab: 'home' },
  { label: 'Profil Sekolah', tab: 'profile' },
  { label: 'Direktori Guru & Tendik', tab: 'directory' },
  { label: 'Akademik', tab: 'akademik' },
  { label: 'Galeri Kegiatan', tab: 'gallery' },
  { label: 'Berita & Artikel', tab: 'news' },
  { label: 'Contact', tab: 'contact' },
  { label: 'CMS Portal Admin', tab: 'cms', textClass: 'text-slate-300' },
];

export const LEGAL_LINKS = [
  { label: 'Kebijakan Privasi', message: 'Kebijakan Privasi SD Negeri Mulyoagung 1' },
  { label: 'Syarat & Ketentuan', message: 'Syarat & Ketentuan Penggunaan Website' },
  { label: 'Peta Situs', message: 'Peta Situs SD Negeri Mulyoagung 1' },
];
