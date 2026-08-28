import { useState, useEffect, useCallback } from 'react';
import { getApiBaseUrl } from '../../config/api';

export interface ModulItem {
  id: number;
  judul: string;
  deskripsi: string;
  mata_pelajaran: string;
  kelas: string;
  semester: string;
  tahun_ajaran: string;
  kategori: string;
  sumber_tipe: 'upload' | 'gdrive';
  file_pdf?: string | null;
  link_gdrive?: string | null;
  foto?: string | null;
  foto_cover?: string | null;
  foto_cover_crop?: string | null;
  foto_original?: string | null;
  status: 'Draft' | 'Published';
  status_verifikasi: 'Pending' | 'Verified' | 'Rejected';
  uploaded_by: number;
  uploader?: string;
  uploader_role?: string;
  created_at?: string;
}

const API_BASE = getApiBaseUrl();

export function useModulData() {
  const [modules, setModules] = useState<ModulItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchModules = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/backend/API/modul_pembelajaran.php?status=all&_t=${Date.now()}`, {
        cache: 'no-store',
      });
      const result = await response.json();
      if (result.status === 'success') {
        setModules(result.data || []);
      } else {
        setError(result.message || 'Gagal memuat modul pembelajaran.');
      }
    } catch {
      setError('Gagal menghubungi server backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const deleteModule = async (id: number, userId?: number, role?: string) => {
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', id.toString());
    if (userId) formData.append('user_id', userId.toString());
    if (role) formData.append('role', role);

    try {
      const response = await fetch(`${API_BASE}/backend/API/modul_pembelajaran.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message);
        fetchModules();
        return true;
      } else {
        setError(result.message || 'Gagal menghapus modul.');
        return false;
      }
    } catch {
      setError('Terjadi kesalahan saat menghapus data.');
      return false;
    }
  };

  const updateModulStatus = async (id: number, newStatus: 'Draft' | 'Published', userId?: number, role?: string) => {
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('action', 'toggle_status');
    formData.append('id', id.toString());
    formData.append('status', newStatus);
    if (userId) formData.append('user_id', userId.toString());
    if (role) formData.append('role', role);

    try {
      const response = await fetch(`${API_BASE}/backend/API/modul_pembelajaran.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message);
        fetchModules();
        return true;
      } else {
        setError(result.message || 'Gagal mengubah status modul.');
        return false;
      }
    } catch {
      setError('Terjadi kesalahan saat mengubah status.');
      return false;
    }
  };

  return {
    modules,
    loading,
    error,
    setError,
    success,
    setSuccess,
    fetchModules,
    deleteModule,
    updateModulStatus,
  };
}
