import { useState, useEffect } from 'react';
import { getApiBaseUrl } from '../config/api';

export interface SocialMediaItem {
  id: string;
  name: string;
  url: string;
  icon: string; // 'auto' | 'Instagram' | 'Facebook' | 'YouTube' | 'TikTok' | 'Twitter' | 'WhatsApp' | 'Telegram' | 'Globe' | 'Link'
}

export interface SchoolSettings {
  tahunAjaran: string;
  linkPpdb: string;
  emailSekolah: string;
  teleponSekolah: string;
  whatsappSekolah: string;
  alamatSekolah: string;
  medsosLinks: SocialMediaItem[];
}

const DEFAULT_SETTINGS: SchoolSettings = {
  tahunAjaran: '2025/2026',
  linkPpdb: '',
  emailSekolah: 'sdnmulyoagung01@gmail.com',
  teleponSekolah: '(0341) 466-730',
  whatsappSekolah: '08123456789',
  alamatSekolah: 'JL. RAYA MULYOAGUNG NO.121 RT. 1 RW. 10 DUSUN MULYOAGUNG , Kec. Dau, Kab. Malang, Prov. Jawa Timur',
  medsosLinks: [
    { id: '1', name: 'YouTube', url: 'https://www.youtube.com/@mulyoagungsatu3851', icon: 'auto' },
    { id: '2', name: 'Instagram', url: 'https://www.instagram.com/mulyoagung1_dau', icon: 'auto' },
    { id: '3', name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=100085140035121', icon: 'auto' },
    { id: '4', name: 'TikTok', url: 'https://www.tiktok.com/@mulyoagung.1', icon: 'auto' },
  ],
};

let cachedSettings: SchoolSettings | null = null;

export const useSchoolSettings = (): SchoolSettings => {
  const [settings, setSettings] = useState<SchoolSettings>(cachedSettings || DEFAULT_SETTINGS);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/backend/API/pengaturan.php`);
        const result = await response.json();

        if (result.status === 'success') {
          const loaded: SchoolSettings = {
            tahunAjaran: result.tahun_ajaran || DEFAULT_SETTINGS.tahunAjaran,
            linkPpdb: result.link_ppdb || '',
            emailSekolah: result.email_sekolah || DEFAULT_SETTINGS.emailSekolah,
            teleponSekolah: result.telepon_sekolah || DEFAULT_SETTINGS.teleponSekolah,
            whatsappSekolah: result.whatsapp_sekolah || DEFAULT_SETTINGS.whatsappSekolah,
            alamatSekolah: result.alamat_sekolah || DEFAULT_SETTINGS.alamatSekolah,
            medsosLinks: Array.isArray(result.medsos_links) && result.medsos_links.length > 0
              ? result.medsos_links
              : DEFAULT_SETTINGS.medsosLinks,
          };
          cachedSettings = loaded;
          setSettings(loaded);
        }
      } catch (err) {
        if (!cachedSettings) {
          cachedSettings = DEFAULT_SETTINGS;
          setSettings(DEFAULT_SETTINGS);
        }
      }
    };

    fetchSettings();
  }, []);

  return settings;
};
