/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
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
import 'aos/dist/aos.css'; // Mengimpor CSS AOS

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

// Komponen utama yang dibungkus oleh Router agar bisa menggunakan useLocation, useNavigate, dan useNavigationType
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const [ppdbOpen, setPpdbOpen] = useState(false);

  // Menyimpan posisi scroll per halaman (posisi Y terakhir untuk setiap route)
  const scrollPositions = useRef<Record<string, number>>({});

  // Mengambil current path untuk menentukan tab mana yang aktif (untuk Header/Footer)
  const path = location.pathname.replace('/', '');
  const activeTab = (path === '' ? 'home' : path) as NavTab;

  // Adaptasi setActiveTab agar merubah URL alih-alih merubah state secara langsung
  const setActiveTab = (tab: NavTab) => {
    if (tab === 'home') {
      navigate('/');
    } else {
      navigate(`/${tab}`);
    }
  };

  // Inisialisasi AOS dan pengaturan mode terang
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

  // Pengelolaan posisi scroll saat navigasi antar halaman (restore posisi scroll jika tombol Back 'POP' ditekan)
  useEffect(() => {
    if (navigationType === 'POP') {
      // Navigasi Kembali (Back) -> pulihkan posisi scroll terakhir dari lokasi tersebut
      const savedY = scrollPositions.current[location.pathname] ?? 0;
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedY, behavior: 'instant' as ScrollBehavior });
        setTimeout(() => {
          AOS.refresh();
        }, 100);
      });
    } else {
      // Navigasi Baru (PUSH / REPLACE) -> scroll ke paling atas
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }
  }, [location.pathname, navigationType]);

  if (activeTab === 'cms') {
    return <Dashboard onBackToHome={() => navigate('/')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-900 transition-colors duration-300 font-sans selection:bg-teal-600 selection:text-white overflow-hidden">
      {/* Running Text Info Penting */}
      <AnnouncementBar />

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPpdb={() => setPpdbOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-grow">
        <Routes>
          {/* Halaman Home */}
          <Route
            path="/"
            element={
              <>
                <div data-aos="fade-down">
                  <Hero onOpenPpdb={() => setPpdbOpen(true)} setActiveTab={setActiveTab} />
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

          {/* Halaman Profile */}
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

          {/* Halaman Directory */}
          <Route
            path="/directory"
            element={
              <div className="pt-4" data-aos="fade-up">
                <DirectorySection />
              </div>
            }
          />

          {/* Halaman Gallery */}
          <Route
            path="/gallery"
            element={
              <div className="pt-4" data-aos="zoom-in">
                <GallerySection />
              </div>
            }
          />

          {/* Halaman News */}
          <Route
            path="/news"
            element={
              <div className="pt-4" data-aos="fade-right">
                <NewsSection />
              </div>
            }
          />

          {/* Halaman Contact */}
          <Route
            path="/contact"
            element={
              <div data-aos="fade-up">
                <ContactSection />
              </div>
            }
          />

          {/* Fallback route: Jika URL tidak dikenali, arahkan ke Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <div data-aos="fade-up" data-aos-anchor-placement="top-bottom">
        <Footer
          setActiveTab={setActiveTab}
          onOpenPpdb={() => setPpdbOpen(true)}
        />
      </div>

      {/* PPDB Registration Modal */}
      <PpdbModal isOpen={ppdbOpen} onClose={() => setPpdbOpen(false)} />

      {/* Floating Back to Top Button */}
      <BackToTop />

      {/* Announcement Pop-up */}
      <AnnouncementPopup />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}