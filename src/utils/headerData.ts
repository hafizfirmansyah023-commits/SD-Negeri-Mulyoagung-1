import { NavTab } from '../types';

export interface NavItem {
  id: NavTab;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'profile', label: 'Profile' },
  { id: 'directory', label: 'Directory' },
  { id: 'inovasi', label: 'Inovasi' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'news', label: 'Berita' },
  { id: 'akademik', label: 'Akademik' },
  { id: 'contact', label: 'Contact' },
];

