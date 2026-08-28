import { useState, useEffect, useCallback } from 'react';
import { getApiBaseUrl } from '../../config/api';

export interface NewsArticle {
  id: number;
  judul: string;
  isi: string;
  foto: string;
  foto_original?: string;
  kategori: string;
  tanggal: string;
  status_verifikasi: 'Pending' | 'Verified' | 'Rejected';
  uploader: string;
  uploaded_by: number;
}

const API_BASE = getApiBaseUrl();

export function useNewsData() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/backend/API/newsAPI.php?status=all&_t=${Date.now()}`, {
        cache: 'no-store',
      });
      const result = await response.json();
      if (result.status === 'success') {
        setArticles(result.data || []);
      } else {
        setError(result.message || 'Gagal memuat data berita.');
      }
    } catch {
      setError('Gagal menghubungkan ke server backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const deleteArticle = async (id: number) => {
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', id.toString());

    try {
      const response = await fetch(`${API_BASE}/backend/API/newsAPI.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message);
        fetchArticles();
        return true;
      } else {
        setError(result.message || 'Gagal menghapus berita.');
        return false;
      }
    } catch {
      setError('Terjadi kesalahan saat menghapus data.');
      return false;
    }
  };

  return {
    articles,
    loading,
    error,
    setError,
    success,
    setSuccess,
    fetchArticles,
    deleteArticle,
  };
}
