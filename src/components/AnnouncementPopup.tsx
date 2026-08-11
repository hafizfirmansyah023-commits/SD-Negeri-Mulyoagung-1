import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { getApiBaseUrl, getImageUrl } from '../config/api';

export const AnnouncementPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<{
    judul: string;
    isi: string;
    show_popup: boolean;
    show_button: boolean;
    button_text: string;
    button_link: string;
    show_photo: boolean;
    foto: string;
    photo_link: string;
    is_active: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/backend/API/pengumuman.php`);
        const result = await response.json();
        if (result.status === 'success' && result.data) {
          const isActivePublic = result.data.public_active !== undefined 
            ? parseInt(result.data.public_active) === 1 
            : parseInt(result.data.is_active) === 1;

          const config = {
            judul: result.data.judul,
            isi: result.data.isi,
            show_popup: parseInt(result.data.show_popup) === 1,
            show_button: parseInt(result.data.show_button) === 1,
            button_text: result.data.button_text,
            button_link: result.data.button_link,
            show_photo: parseInt(result.data.show_photo) === 1,
            foto: result.data.foto,
            photo_link: result.data.photo_link,
            is_active: isActivePublic,
          };
          setData(config);

          // Check if user has already dismissed this specific announcement in this session
          const hasSeen = sessionStorage.getItem(`seen_announcement_${result.data.id || '1'}`);
          if (config.is_active && config.show_popup && !hasSeen) {
            // Short delay to let the page load nicely
            setTimeout(() => {
              setIsOpen(true);
            }, 800);
          }
        }
      } catch (err) {
        console.error('Failed to fetch important announcement for popup:', err);
      }
    };
    fetchAnnouncement();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem(`seen_announcement_1`, 'true');
  };

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl border border-slate-100 max-w-4xl w-full overflow-hidden transform transition-all duration-300 flex flex-col md:flex-row z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button Top Right */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-black rounded-full transition-all cursor-pointer shadow-sm"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Photo Column */}
        {data.show_photo && data.foto && (
          <div className="md:w-1/2 bg-slate-50 relative flex items-center justify-center min-h-[250px] md:min-h-[400px]">
            {data.photo_link ? (
              <a 
                href={data.photo_link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full h-full block group relative overflow-hidden"
              >
                <img
                  src={getImageUrl(data.foto)}
                  alt={data.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                  <div className="bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <ExternalLink size={12} /> Buka Tautan
                  </div>
                </div>
              </a>
            ) : (
              <img
                src={getImageUrl(data.foto)}
                alt={data.judul}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}

        {/* Content Column */}
        <div className={`p-8 md:p-12 flex flex-col justify-center ${data.show_photo && data.foto ? 'md:w-1/2' : 'w-full'}`}>
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold tracking-wider bg-rose-50 text-rose-600 border border-rose-100 uppercase">
              Pemberitahuan
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
              {data.judul}
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
              {data.isi}
            </p>
          </div>

          {/* Button Action */}
          {data.show_button && data.button_link && (
            <div className="mt-8">
              <a
                href={data.button_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-extrabold rounded-xl shadow-lg shadow-teal-700/20 hover:shadow-xl hover:scale-[1.02] transition-all text-sm text-center"
              >
                {data.button_text || 'Lihat Selengkapnya'}
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
