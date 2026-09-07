import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiBaseUrl } from '../config/api';

export const ModulRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const resolve = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/backend/API/akademik_menu.php`);
        const json = await res.json();
        if (cancelled) return;
        const modulItem = json.status === 'success' && Array.isArray(json.data)
          ? (json.data.find((item: { is_modul?: number | string }) => Number(item.is_modul) === 1)
            || json.data.find((item: { label?: string }) => /modul ajar/i.test(item.label || '')))
          : null;
        navigate(modulItem ? `/akademik/${modulItem.id}` : '/akademik', { replace: true });
      } catch {
        if (!cancelled) navigate('/akademik', { replace: true });
      }
    };
    resolve();
    return () => { cancelled = true; };
  }, [navigate]);

  return null;
};