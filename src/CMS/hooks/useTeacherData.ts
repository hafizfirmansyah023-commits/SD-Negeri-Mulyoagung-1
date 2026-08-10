import { useState, useEffect, useCallback } from 'react';
import { getApiBaseUrl } from '../../config/api';

export interface Teacher {
  id: number;
  nama: string;
  nip: string;
  jabatan: string;
  tugas: string;
  foto: string;
  riwayat_pendidikan: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  status: string;
  motto: string;
}

const API_BASE = getApiBaseUrl();

export function useTeacherData() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/backend/API/guru.php`);
      const result = await response.json();
      if (result.status === 'success') {
        setTeachers(result.data || []);
      } else {
        setError(result.message || 'Gagal memuat data guru.');
      }
    } catch {
      setError('Gagal menghubungi server backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const deleteTeacher = async (id: number) => {
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', id.toString());

    try {
      const response = await fetch(`${API_BASE}/backend/API/guru.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message);
        fetchTeachers();
        return true;
      } else {
        setError(result.message || 'Gagal menghapus data guru.');
        return false;
      }
    } catch {
      setError('Terjadi kesalahan saat menghapus data.');
      return false;
    }
  };

  return {
    teachers,
    loading,
    error,
    setError,
    success,
    setSuccess,
    fetchTeachers,
    deleteTeacher,
  };
}
