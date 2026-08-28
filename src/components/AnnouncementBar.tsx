import React, { useState, useEffect } from 'react';
import { Megaphone, X } from 'lucide-react';
import { getApiBaseUrl } from '../config/api';

export const AnnouncementBar: React.FC = () => {
  const [runningText, setRunningText] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/backend/API/pengumuman.php`);
        const result = await response.json();
        if (result.status === 'success' && result.data) {
          const isActivePublic = result.data.public_active !== undefined 
            ? parseInt(result.data.public_active) === 1 
            : parseInt(result.data.is_active) === 1;
          setIsActive(isActivePublic);
          setRunningText(result.data.running_text || '');
        }
      } catch (err) {
        console.error('Failed to fetch important announcement for bar:', err);
      }
    };
    fetchAnnouncement();
  }, []);

  if (!isActive || !runningText || !visible) return null;

  return (
    <div className="w-full bg-gradient-to-r from-teal-900 via-slate-900 to-teal-900 text-white py-1.5 sm:py-2 px-3 sm:px-4 flex items-center relative overflow-hidden text-xs sm:text-sm font-semibold select-none border-b border-teal-800 shadow-md">
      {/* Styles for Marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(100%, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Prefix Badge */}
      <div className="flex items-center gap-1 bg-teal-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shrink-0 z-10 shadow-sm mr-2 sm:mr-4">
        <Megaphone className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-bounce" />
        <span className="whitespace-nowrap">INFO PENTING</span>
      </div>

      {/* Marquee Content */}
      <div className="flex-grow overflow-hidden relative cursor-pointer min-w-0">
        <div className="animate-marquee text-amber-300 hover:text-white transition-colors text-xs sm:text-sm">
          {runningText}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => setVisible(false)}
        className="text-slate-400 hover:text-white shrink-0 ml-2 sm:ml-4 p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        aria-label="Tutup Pengumuman"
      >
        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>
    </div>
  );
};
