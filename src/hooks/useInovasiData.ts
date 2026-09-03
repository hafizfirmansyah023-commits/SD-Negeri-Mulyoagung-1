import { useState, useEffect, useCallback } from 'react';
import { getApiBaseUrl } from '../config/api';
import { InovasiItem } from '../types';

const API_BASE = getApiBaseUrl();

export function useInovasiData() {
  const [inovasiList, setInovasiList] = useState<InovasiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInovasi = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/backend/API/inovasi.php?_t=${Date.now()}`);
      const result = await res.json();
      if (result.status === 'success') {
        setInovasiList(result.data || []);
      } else {
        setError(result.message || 'Gagal memuat inovasi');
      }
    } catch {
      setError('Gagal memuat data inovasi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInovasi();
  }, [fetchInovasi]);

  return { inovasiList, loading, error, refetch: fetchInovasi };
}

export function useInovasiDetail(id: string | number | undefined) {
  const [inovasi, setInovasi] = useState<InovasiItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/backend/API/inovasi.php?id=${id}&_t=${Date.now()}`);
      const result = await res.json();
      if (result.status === 'success') {
        setInovasi(result.data || null);
      } else {
        setError(result.message || 'Inovasi tidak ditemukan');
      }
    } catch {
      setError('Gagal mengambil data inovasi');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { inovasi, loading, error, refetch: fetchDetail };
}
