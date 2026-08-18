export interface MedsosItem {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export interface HeroCarouselItem {
  id: number;
  foto: string;
  foto_original?: string;
  caption: string;
  tag: string;
  urutan: number;
  is_active: number;
}

export type SettingsFilter = 'all' | 'ppdb' | 'hero' | 'contact' | 'medsos' | 'homepage' | 'konten';

export interface HomepageSection {
  key: string;
  judul: string;
  subjudul: string;
  is_active: boolean;
}
