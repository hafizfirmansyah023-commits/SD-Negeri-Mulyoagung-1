import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, BookOpen, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { NavTab } from '../types';
import heroImg from '../assets/images/img1.webp';
import heroImg1 from '../assets/images/img2.webp';
import { getApiBaseUrl, getImageUrl } from '../config/api';
import { ShinyText } from './common/ShinyText';
import { useHomepageConfig } from '../hooks/useHomepageConfig';

interface HeroProps {
  onOpenPpdb: () => void;
  setActiveTab: (tab: NavTab) => void;
  linkPpdb?: string;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenPpdb,
  setActiveTab,
  linkPpdb,
}) => {
  const homepageConfig = useHomepageConfig();
  const [tahunAjaran, setTahunAjaran] = useState('2025/2026');
  const [customLinkPpdb, setCustomLinkPpdb] = useState('');

  // Default fallback slides
  const defaultSlides = [
    {
      image: heroImg,
      caption: 'MA ONE BERGELORAA!!!',
      tag: 'Kegiatan Utama',
    },
    {
      image: heroImg1,
      caption: 'Lingkungan Belajar Asri & Nyaman',
      tag: 'Fasilitas Sekolah',
    },
    {
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800',
      caption: 'Ruang Kelas Modern & Inovatif',
      tag: 'Suasana Belajar',
    },
    {
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
      caption: 'Pembentukan Karakter & Prestasi',
      tag: 'Karakter Mulia',
    },
  ];

  const [slides, setSlides] = useState(defaultSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Swipe Gesture Handling for Hero Slider
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        // Swiped Left -> Next slide
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      } else {
        // Swiped Right -> Previous slide
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  useEffect(() => {
    const fetchTahunAjaran = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/backend/API/pengaturan.php`);
        const data = await response.json();
        if (data.status === 'success') {
          if (data.tahun_ajaran) setTahunAjaran(data.tahun_ajaran);
          if (data.link_ppdb) setCustomLinkPpdb(data.link_ppdb.trim());
        }
      } catch (err) {
        // Keep default fallback
      }
    };

    const fetchHeroPhotos = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/backend/API/hero_carousel.php`);
        const json = await res.json();
        if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
          const customSlides = json.data.map((item: any) => ({
            image: getImageUrl(item.foto),
            caption: item.caption || 'MA ONE BERGELORAA!!!',
            tag: item.tag || 'Kegiatan Utama',
          }));
          setSlides(customSlides);
        }
      } catch (e) {
        // Keep default slides
      }
    };

    fetchTahunAjaran();
    fetchHeroPhotos();
  }, []);

  // Auto-play Slider Timer (3.8 seconds interval)
  useEffect(() => {
    if (isHovered || slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3800);

    return () => clearInterval(timer);
  }, [slides.length, isHovered]);

  const activePpdbUrl = linkPpdb || customLinkPpdb;

  return (
    <section className="relative w-full min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-[#0D4A46]">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="bg-cover bg-center w-full h-full opacity-30 scale-105"
          style={{
            backgroundImage: `url(${homepageConfig.heroBg ? getImageUrl(homepageConfig.heroBg) : heroImg1})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D4A46]/0 to-[#156B63]/50" />
      </div>

      {/* Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-[#20C997]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] bg-[#79EEDE]/10 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 lg:pb-24 flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-12">

        {/* LEFT */}
        <div className="w-full lg:w-3/5 text-center lg:text-left space-y-4 sm:space-y-6">

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#20C997]/15 border border-[#20C997]/40 text-[#E8F3F2] px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full backdrop-blur-md shadow-lg">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#79EEDE]" />
            <span className="text-[11px] sm:text-sm font-semibold">
              Tahun Ajaran {tahunAjaran}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-extrabold leading-[1.18] tracking-tight">
            {(() => {
              const cleanTitle = homepageConfig.heroTitle.replace(/selamat datang di\s*/i, '').trim();
              if (cleanTitle.includes('SD Negeri 1 Mulyoagung')) {
                const prefix = cleanTitle.replace('SD Negeri 1 Mulyoagung', '').trim();
                return (
                  <>
                    {prefix && (
                      <>
                        {prefix} <br className="hidden sm:block" />
                      </>
                    )}
                    <ShinyText text="SD Negeri 1 Mulyoagung" speed={4} className="drop-shadow-sm" />
                  </>
                ) : (<>
                  Selamat Datang di <br />
                </>)}
                <ShinyText text="SD Negeri 1 Mulyoagung" speed={4} className="drop-shadow-sm" />
              </>
            ) : (
              <ShinyText text={homepageConfig.heroTitle} speed={4} className="drop-shadow-sm" />
            )}
          </h1>

          <p className="text-xs sm:text-base lg:text-lg text-slate-100 dark:text-slate-200 max-w-2xl leading-relaxed opacity-95 mx-auto lg:mx-0">
            {homepageConfig.heroSubtitle}
          </p>

          {/* Buttons */}
          <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">

            {/* PPDB */}
            {activePpdbUrl ? (
              <a
                href={activePpdbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-[#156B63] hover:bg-[#20C997] text-white text-sm sm:text-base font-semibold transition-all duration-300 shadow-xl hover:scale-105 hover:shadow-[#20C997]/30"
              >
                PPDB Online
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            ) : (
              <button
                onClick={onOpenPpdb}
                className="group flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-[#156B63] hover:bg-[#20C997] text-white text-sm sm:text-base font-semibold transition-all duration-300 shadow-xl hover:scale-105 hover:shadow-[#20C997]/30"
              >
                PPDB Online
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {/* Profil */}
            <button
              onClick={() => {
                setActiveTab('profile');
                const el = document.getElementById('profile-section');
                if (el) {
                  el.scrollIntoView({
                    behavior: 'smooth',
                  });
                }
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-full border-2 border-[#79EEDE] bg-white/5 hover:bg-[#79EEDE]/10 text-[#E8F3F2] text-sm sm:text-base backdrop-blur-md transition-all duration-300 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#79EEDE]" />
              Profil Sekolah
            </button>

          </div>

        </div>

        {/* RIGHT - Auto Playing Landscape Photo Slider with Touch Swipe Gesture */}
        <div className="flex w-full lg:w-1/2 justify-center">
          <div
            className="relative max-w-[540px] w-full group touch-pan-y"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-[#79EEDE]/15 rounded-3xl blur-3xl"></div>

            {/* Card Outer */}
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-2.5 sm:p-3 shadow-2xl rotate-1 group-hover:rotate-0 transition-all duration-500 overflow-hidden">

              {/* Slide Image Container (Landscape Aspect Ratio) */}
              <div className="relative w-full aspect-video h-[230px] sm:h-[300px] md:h-[340px] rounded-2xl overflow-hidden bg-slate-950">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.caption}
                      className={`w-full h-full object-cover rounded-2xl transform transition-transform duration-[6000ms] ease-out ${index === currentSlide ? 'scale-110' : 'scale-100'
                        }`}
                    />
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />
                  </div>
                ))}

                {/* Prev / Next Navigation Arrows */}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 cursor-pointer shadow-lg"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 cursor-pointer shadow-lg"
                  aria-label="Next slide"
                >
                  <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>

                {/* Dot Navigation Indicators */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 flex items-center gap-1.5 bg-slate-950/50 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/20">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === currentSlide
                        ? 'w-5 sm:w-6 bg-[#79EEDE]'
                        : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Sleek Glassmorphic Caption Badge */}
              <div className="absolute bottom-2.5 left-2.5 sm:bottom-4 sm:left-4 z-20 bg-slate-950/75 dark:bg-slate-900/85 backdrop-blur-md text-white p-2 sm:p-2.5 px-3 sm:px-3.5 rounded-xl shadow-lg border border-white/20 flex items-center gap-2 sm:gap-2.5 transition-all duration-300 max-w-[calc(100%-6.5rem)] sm:max-w-xs md:max-w-sm">
                <div className="w-2 h-2 rounded-full bg-[#79EEDE] animate-pulse shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] sm:text-xs font-semibold block leading-tight text-slate-100 truncate tracking-wide">
                    {slides[currentSlide]?.caption}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </section>
  );
};