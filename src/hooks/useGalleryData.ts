import { useEffect, useState } from 'react';
import { GALLERY_ITEMS } from '../data/schoolData';
import { GalleryItem } from '../types';
import { getApiBaseUrl, getImageUrl } from '../config/api';
import { DEFAULT_GALLERY_IMAGE, mapApiGalleryCategory } from '../utils/galleryHelpers';

/**
 * Mengambil data galeri dari backend (galeri.php).
 * Jika API gagal atau mengembalikan data kosong, otomatis fallback
 * ke GALLERY_ITEMS (data statis lokal).
 */
let cachedGalleryItems: GalleryItem[] | null = null;

export const useGalleryData = (): GalleryItem[] => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(cachedGalleryItems || []);

  useEffect(() => {
    if (cachedGalleryItems) {
      setGalleryItems(cachedGalleryItems);
      return;
    }

    const loadGallery = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/backend/API/galeri.php`);
        const result = await response.json();

        if (result.status === 'success' && result.data && result.data.length > 0) {
          const mapped: GalleryItem[] = result.data.map((item: any) => ({
            id: item.id.toString(),
            title: item.judul,
            category: mapApiGalleryCategory(item.kategori) as any,
            date: item.tanggal,
            image: item.foto ? getImageUrl(item.foto) : DEFAULT_GALLERY_IMAGE,
            description: item.deskripsi,
          }));
          cachedGalleryItems = mapped;
          setGalleryItems(mapped);
        } else {
          cachedGalleryItems = GALLERY_ITEMS;
          setGalleryItems(GALLERY_ITEMS);
        }
      } catch (e) {
        cachedGalleryItems = GALLERY_ITEMS;
        setGalleryItems(GALLERY_ITEMS);
      }
    };

    loadGallery();
  }, []);

  return galleryItems;
};

