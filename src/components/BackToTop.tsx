import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-[#028C84] hover:bg-[#006a64] text-white shadow-xl transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
      aria-label="Kembali ke atas"
      title="Kembali ke atas"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
