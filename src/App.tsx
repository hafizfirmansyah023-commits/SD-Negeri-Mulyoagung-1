/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  useNavigationType,
  Navigate
} from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import { NavTab } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { PrincipalGreeting } from './components/PrincipalGreeting';
import { NewsSection } from './components/NewsSection';
import { VideoProfileSection } from './components/VideoProfileSection';
import { DirectorySection } from './components/DirectorySection';

import { GallerySection } from './components/GallerySection';
import { SchoolProfileSection } from './components/SchoolProfileSection';
import { ContactSection } from './components/ContactSection';
import { PpdbModal } from './components/PpdbModal';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { AnnouncementBar } from './components/AnnouncementBar';
import { AnnouncementPopup } from './components/AnnouncementPopup';

import Dashboard from './CMS/Dashboard';
import { LoadingProvider } from './context/LoadingContext';

import { getApiBaseUrl } from './config/api';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const [ppdbOpen, setPpdbOpen] = useState(false);
  const [linkPpdb, setLinkPpdb] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/backend/API/pengaturan.php`);
        const data = await response.json();
        if (data.status === 'success' && data.link_ppdb) {
          setLinkPpdb(data.link_ppdb.trim());
        }
      } catch (err) {
        // Fallback
      }
    };
    fetchSettings();
  }, []);

  const handleOpenPpdb = () => {
    if (linkPpdb && linkPpdb !== '') {
      window.open(linkPpdb, '_blank', 'noopener,noreferrer');
    } else {
      setPpdbOpen(true);
    }
  };


  // Menyimpan posisi scroll per halaman (posisi Y terakhir untuk setiap route)
  const scrollPositions = useRef<Record<string, number>>({});

  // Mengambil current path untuk menentukan tab mana yang aktif (untuk Header/Footer)
  const path = location.pathname.replace('/', '');
  const activeTab = (path === '' ? 'home' : path) as NavTab;

  const setActiveTab = (tab: NavTab) => {
    if (tab === 'home') {
      navigate('/');
    } else {
      navigate(`/${tab}`);
    }
  };

  // AOS dan pengaturan mode terang
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    localStorage.removeItem('theme');

    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 50,
    });
  }, []);

  // Simpan posisi scroll secara real-time untuk halaman yang sedang aktif
  useEffect(() => {
    const handleScroll = () => {
      scrollPositions.current[location.pathname] = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  // Restore posisi scroll saat pindah halaman
  useLayoutEffect(() => {
    if (navigationType === 'POP') {
      // Jika user klik tombol Back, kembalikan posisi scroll terakhir
      const savedY = scrollPositions.current[location.pathname] ?? 0;
      window.scrollTo({ top: savedY, behavior: 'instant' as ScrollBehavior });
    } else {
      // Jika navigasi baru (PUSH), scroll ke paling atas
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
    
    // Refresh animasi AOS
    const timer = setTimeout(() => {
      AOS.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, navigationType]);

  if (location.pathname.startsWith('/cms')) {
    return <Dashboard onBackToHome={() => navigate('/')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-900 transition-colors duration-300 font-sans selection:bg-teal-600 selection:text-white">
      
      <AnnouncementBar />

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPpdb={handleOpenPpdb}
        linkPpdb={linkPpdb}
      />

      {/* Main Page Content */}
      <main className="flex-grow overflow-x-hidden">
        <Routes>

          <Route
            path="/"
            element={
              <>
                <div data-aos="fade-down">
                  <Hero onOpenPpdb={handleOpenPpdb} setActiveTab={setActiveTab} linkPpdb={linkPpdb} />
                </div>
                <div data-aos="fade-up" data-aos-delay="100">
                  <Stats />
                </div>
                <div data-aos="fade-up" data-aos-delay="200">
                  <PrincipalGreeting />
                </div>
                <div data-aos="fade-right" data-aos-delay="100">
                  <NewsSection onViewAllClick={() => setActiveTab('news')} />
                </div>
                <div data-aos="fade-left" data-aos-delay="100">
                  <SchoolProfileSection />
                </div>
                <div data-aos="zoom-in" data-aos-delay="100">
                  <VideoProfileSection />
                </div>
                <div data-aos="fade-up" data-aos-delay="100">
                  <ContactSection />
                </div>
              </>
            }
          />

          <Route
            path="/profile"
            element={
              <div className="pt-4" data-aos="fade-in">
                <div data-aos="fade-right">
                  <SchoolProfileSection />
                </div>
                <div data-aos="zoom-in" data-aos-delay="200">
                  <VideoProfileSection />
                </div>
              </div>
            }
          />

          <Route
            path="/directory"
            element={
              <div className="pt-4" data-aos="fade-up">
                <DirectorySection />
              </div>
            }
          />

          <Route
            path="/gallery"
            element={
              <div className="pt-4" data-aos="zoom-in">
                <GallerySection />
              </div>
            }
          />

          <Route
            path="/news"
            element={
              <div className="pt-4" data-aos="fade-right">
                <NewsSection />
              </div>
            }
          />

          <Route
            path="/contact"
            element={
              <div data-aos="fade-up">
                <ContactSection />
              </div>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <div data-aos="fade-up" data-aos-anchor-placement="top-bottom">
        <Footer
          setActiveTab={setActiveTab}
          onOpenPpdb={handleOpenPpdb}
          linkPpdb={linkPpdb}
        />
      </div>



      <PpdbModal isOpen={ppdbOpen} onClose={() => setPpdbOpen(false)} />

      <BackToTop />

      <AnnouncementPopup />
      
    </div>
  );
}
export default function App() {
  return (
    <Router>
      <LoadingProvider>
        <AppContent />
      </LoadingProvider>
    </Router>
  );
}