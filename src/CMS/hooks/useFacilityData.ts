import { useState, useEffect, useCallback } from 'react';
import { getApiBaseUrl } from '../../config/api';

export interface FasilitasItem {
  id: number;
  judul: string;
  deskripsi: string;
  foto: string;
  foto_original?: string;
}

const API_BASE = getApiBaseUrl();

export function useFacilityData() {
  const [items, setItems] = useState<FasilitasItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchFacilities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/backend/API/fasilitas.php`);
      const result = await response.json();
      if (result.status === 'success') {
        setItems(result.data || []);
      } else {
        setError(result.message || 'Gagal memuat data fasilitas.');
      }
    } catch {
      setError('Gagal menghubungi server backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const deleteFacility = async (id: number) => {
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', id.toString());

    try {
      const response = await fetch(`${API_BASE}/backend/API/fasilitas.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message || 'Fasilitas berhasil dihapus.');
        fetchFacilities();
        return true;
      } else {
        setError(result.message || 'Gagal menghapus fasilitas.');
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
    fetchFacilities,
    deleteFacility,
  };
}
