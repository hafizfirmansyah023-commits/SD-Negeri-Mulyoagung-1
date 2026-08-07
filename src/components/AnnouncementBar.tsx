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
          setIsActive(parseInt(result.data.is_active) === 1);
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
    <div className="w-full bg-gradient-to-r from-teal-900 via-slate-900 to-teal-900 text-white py-2 px-4 flex items-center relative overflow-hidden text-xs sm:text-sm font-semibold select-none border-b border-teal-800 shadow-md">
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
      <div className="flex items-center gap-1.5 bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold shrink-0 z-10 shadow-sm mr-4">
        <Megaphone className="w-3.5 h-3.5 animate-bounce" />
        <span>INFO PENTING</span>
      </div>

      {/* Marquee Content */}
      <div className="flex-grow overflow-hidden relative cursor-pointer">
        <div className="animate-marquee text-amber-300 hover:text-white transition-colors">
          {runningText}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => setVisible(false)}
        className="text-slate-400 hover:text-white shrink-0 ml-4 p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        aria-label="Tutup Pengumuman"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
