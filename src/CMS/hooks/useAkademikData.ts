import { useState, useEffect, useCallback } from 'react';
import { getApiBaseUrl } from '../../config/api';
import { AkademikMenuItem } from '../../types';

const API_BASE = getApiBaseUrl();

export function useAkademikData(status: 'all' | 'active_only' = 'active_only') {
  const [items, setItems] = useState<AkademikMenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/backend/API/akademik_menu.php?status=${status}&_t=${Date.now()}`, {
        cache: 'no-store',
      });
      const result = await response.json();
      if (result.status === 'success') {
        setItems(result.data || []);
      } else {
        setError(result.message || 'Gagal memuat menu akademik.');
      }
    } catch {
      setError('Gagal menghubungi server backend.');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const deleteItem = async (id: number, role: string = 'ADMIN') => {
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', id.toString());
    formData.append('role', role);

    try {
      const response = await fetch(`${API_BASE}/backend/API/akademik_menu.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message);
        fetchItems();
        return true;
      } else {
        setError(result.message || 'Gagal menghapus menu.');
        return false;
      }
    } catch {
      setError('Terjadi kesalahan saat menghapus data.');
      return false;
    }
  };

  const reorderItems = async (newItems: { id: number; parent_id?: number | null; urutan?: number }[], role: string = 'ADMIN') => {
    try {
      const payload = newItems.map((it, idx) => ({
        id: it.id,
        parent_id: it.parent_id && Number(it.parent_id) > 0 ? Number(it.parent_id) : null,
        urutan: it.urutan ?? idx,
      }));
      const formData = new FormData();
      formData.append('action', 'reorder');
      formData.append('items', JSON.stringify(payload));
      formData.append('role', role);

      const response = await fetch(`${API_BASE}/backend/API/akademik_menu.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message);
        fetchItems();
        return true;
      } else {
        setError(result.message || 'Gagal mengubah urutan menu.');
        fetchItems();
        return false;
      }
    } catch {
      setError('Terjadi kesalahan saat mengubah urutan menu.');
      fetchItems();
      return false;
    }
  };

  return {
    items,
    setItems,
    loading,
    error,
    setError,
    success,
    setSuccess,
    fetchItems,
    deleteItem,
    reorderItems,
  };
}
