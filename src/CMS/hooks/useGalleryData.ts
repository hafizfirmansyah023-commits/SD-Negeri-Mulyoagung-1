import { useState, useEffect, useCallback } from 'react';
import { getApiBaseUrl } from '../../config/api';

export interface GalleryItem {
  id: number;
  judul: string;
  deskripsi: string;
  foto: string;
  kategori: string;
  tanggal: string;
  status_verifikasi: 'Pending' | 'Verified' | 'Rejected';
  uploader: string;
  uploaded_by: number;
}

const API_BASE = getApiBaseUrl();

export function useGalleryData() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchGallery = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/backend/API/galeri.php?status=all`);
      const result = await response.json();
      if (result.status === 'success') {
        setItems(result.data || []);
      } else {
        setError(result.message || 'Gagal memuat data galeri.');
      }
    } catch {
      setError('Gagal menghubungi server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const deleteGalleryItem = async (id: number) => {
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', id.toString());

    try {
      const response = await fetch(`${API_BASE}/backend/API/galeri.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message);
        fetchGallery();
        return true;
      } else {
        setError(result.message || 'Gagal menghapus foto galeri.');
        return false;
      }
    } catch {
      setError('Terjadi kesalahan saat menghapus data.');
      return false;
    }
  };

  return {
    items,
    loading,
    error,
    setError,
    success,
    setSuccess,
    fetchGallery,
    deleteGalleryItem,
  };
}
