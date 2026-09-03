import { useState, useEffect, useCallback } from 'react';
import { getApiBaseUrl } from '../../config/api';
import { InovasiItem } from '../../types';

const API_BASE = getApiBaseUrl();

export function useInovasiData() {
  const [inovasiList, setInovasiList] = useState<InovasiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchInovasi = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/backend/API/inovasi.php?status=all&_t=${Date.now()}`, {
        cache: 'no-store',
      });
      const result = await response.json();
      if (result.status === 'success') {
        setInovasiList(result.data || []);
      } else {
        setError(result.message || 'Gagal memuat data inovasi.');
      }
    } catch {
      setError('Gagal menghubungi server backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInovasi();
  }, [fetchInovasi]);

  const deleteInovasi = async (id: number | string, userId?: number, role?: string) => {
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', id.toString());
    if (userId) formData.append('user_id', userId.toString());
    if (role) formData.append('role', role);

    try {
      const response = await fetch(`${API_BASE}/backend/API/inovasi.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message);
        fetchInovasi();
        return true;
      } else {
        setError(result.message || 'Gagal menghapus inovasi.');
        return false;
      }
    } catch {
      setError('Terjadi kesalahan saat menghapus data.');
      return false;
    }
  };

  const updateInovasiStatus = async (id: number | string, newStatus: 'Draft' | 'Published', userId?: number, role?: string) => {
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('action', 'toggle_status');
    formData.append('id', id.toString());
    formData.append('status', newStatus);
    if (userId) formData.append('user_id', userId.toString());
    if (role) formData.append('role', role);

    try {
      const response = await fetch(`${API_BASE}/backend/API/inovasi.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message);
        fetchInovasi();
        return true;
      } else {
        setError(result.message || 'Gagal mengubah status inovasi.');
        return false;
      }
    } catch {
      setError('Terjadi kesalahan saat mengubah status.');
      return false;
    }
  };

  const verifyInovasi = async (id: number | string, statusVerifikasi: 'Verified' | 'Rejected') => {
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('action', 'verify');
    formData.append('id', id.toString());
    formData.append('status_verifikasi', statusVerifikasi);

    try {
      const response = await fetch(`${API_BASE}/backend/API/inovasi.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message);
        fetchInovasi();
        return true;
      } else {
        setError(result.message || 'Gagal memverifikasi inovasi.');
        return false;
      }
    } catch {
      setError('Terjadi kesalahan saat memverifikasi data.');
      return false;
    }
  };

  return {
    inovasiList,
    loading,
    error,
    setError,
    success,
    setSuccess,
    fetchInovasi,
    deleteInovasi,
    updateInovasiStatus,
    verifyInovasi,
  };
}
