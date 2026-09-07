import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getApiBaseUrl } from '../config/api';

export const ModulRedirect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
        navigate(modulItem ? `/akademik/${modulItem.id}` : '/akademik', { replace: true, state: location.state });
      } catch {
        if (!cancelled) navigate('/akademik', { replace: true, state: location.state });
      }
    };
    resolve();
    return () => { cancelled = true; };
  }, [navigate, location.state]);

  return null;
};