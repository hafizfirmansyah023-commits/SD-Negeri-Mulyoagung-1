import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PengaturanSekolah() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/cms/strukturorganisasi', { replace: true });
  }, [navigate]);

  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-600"></div>
    </div>
  );
}
