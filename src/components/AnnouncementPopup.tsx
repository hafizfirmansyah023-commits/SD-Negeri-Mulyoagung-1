import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

  // Lock body & html scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      const prevBody = document.body.style.overflow;
      const prevHtml = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          handleClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = prevBody;
        document.documentElement.style.overflow = prevHtml;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

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

  const photoSrc = data.foto ? getImageUrl(data.foto) : '';

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto overscroll-contain">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal Card Pengumuman */}
      <div className="relative bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl w-full max-h-[88vh] overflow-hidden transform transition-all duration-300 flex flex-col md:flex-row z-10 animate-in fade-in zoom-in-95 my-auto">
        
        {/* Close Button Top Right */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 bg-white/80 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-full transition-all cursor-pointer shadow-md backdrop-blur-sm border border-slate-200/50"
          aria-label="Tutup"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Photo Column / Container */}
        {data.show_photo && photoSrc && (
          <div className="md:w-1/2 p-4 sm:p-5 bg-gradient-to-br from-slate-50 via-teal-50/20 to-slate-50 flex items-center justify-center shrink-0 border-b md:border-b-0 md:border-r border-slate-100/80">
            {data.photo_link ? (
              <a 
                href={data.photo_link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full flex items-center justify-center group relative overflow-hidden rounded-2xl"
              >
                <img
                  src={photoSrc}
                  alt={data.judul}
                  className="w-full h-auto max-h-[250px] sm:max-h-[320px] md:max-h-[380px] object-contain rounded-2xl shadow-sm border border-slate-200/60 group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                  <div className="bg-black/75 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <ExternalLink size={13} /> Buka Tautan
                  </div>
                </div>
              </a>
            ) : (
              <div className="w-full flex items-center justify-center">
                <img
                  src={photoSrc}
                  alt={data.judul}
                  className="w-full h-auto max-h-[250px] sm:max-h-[320px] md:max-h-[380px] object-contain rounded-2xl shadow-sm border border-slate-200/60"
                />
              </div>
            )}
          </div>
        )}

        {/* Content Column */}
        <div className={`p-5 sm:p-6 md:p-8 flex flex-col justify-between overflow-y-auto space-y-4 ${data.show_photo && photoSrc ? 'md:w-1/2' : 'w-full'}`}>
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-extrabold tracking-wider bg-teal-50 text-teal-700 border border-teal-200/60 uppercase">
              Pengumuman Penting
            </span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight leading-snug">
              {data.judul}
            </h2>
            <div 
              className="text-slate-600 text-xs sm:text-sm leading-relaxed prose prose-slate max-w-none break-words"
              dangerouslySetInnerHTML={{ __html: data.isi }}
            />
          </div>

          {/* Button Action */}
          {data.show_button && data.button_link && (
            <div className="pt-2">
              <a
                href={data.button_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-extrabold rounded-xl shadow-md shadow-teal-700/20 hover:shadow-lg hover:scale-[1.01] transition-all text-xs sm:text-sm text-center"
              >
                {data.button_text || 'Lihat Selengkapnya'}
              </a>
            </div>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
};
