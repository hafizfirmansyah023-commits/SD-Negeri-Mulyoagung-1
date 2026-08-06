/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
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

import Dashboard from './CMS/Dashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [ppdbOpen, setPpdbOpen] = useState(false);

  // Inisialisasi AOS dan pengaturan mode terang
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    localStorage.removeItem('theme');

    // Inisialisasi konfigurasi dasar AOS
    AOS.init({
      duration: 800, // Durasi animasi (ms)
      easing: 'ease-in-out', // Efek transisi
      once: true, // Animasi hanya berjalan satu kali
      offset: 50, // Jarak scroll sebelum animasi dimulai (px)
    });
  }, []);

  // Me-refresh AOS dan scroll ke paling atas setiap kali tab berganti
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    AOS.refresh();
  }, [activeTab]);

  if (activeTab === 'cms') {
    return <Dashboard onBackToHome={() => setActiveTab('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-900 transition-colors duration-300 font-sans selection:bg-teal-600 selection:text-white overflow-hidden">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPpdb={() => setPpdbOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <>
            <div data-aos="fade-down">
              <Hero
                onOpenPpdb={() => setPpdbOpen(true)}
                setActiveTab={setActiveTab}
              />
            </div>
            <div data-aos="fade-up" data-aos-delay="100">
              <Stats />
            </div>
            <div data-aos="fade-up" data-aos-delay="200">
              <PrincipalGreeting />
            </div>
            <div data-aos="fade-right" data-aos-delay="100">
              <NewsSection onViewAllClick={() => {
                setActiveTab('news');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />
            </div>
            <div data-aos="zoom-in" data-aos-delay="100">
              <VideoProfileSection />
            </div>
            <div data-aos="fade-left" data-aos-delay="100">
              <SchoolProfileSection />
            </div>
            <div data-aos="fade-up" data-aos-delay="100">
              <ContactSection />
            </div>
          </>
        )}

        {activeTab === 'profile' && (
          <div className="pt-4" data-aos="fade-in">
            <div data-aos="fade-right">
              <SchoolProfileSection />
            </div>
            <div data-aos="zoom-in" data-aos-delay="200">
              <VideoProfileSection />
            </div>
          </div>
        )}

        {activeTab === 'directory' && (
          <div className="pt-4" data-aos="fade-up">
            <DirectorySection />
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="pt-4" data-aos="zoom-in">
            <GallerySection />
          </div>
        )}

        {activeTab === 'news' && (
          <div className="pt-4" data-aos="fade-right">
            <NewsSection />
          </div>
        )}

        {activeTab === 'contact' && (
          <div data-aos="fade-up">
            <ContactSection />
          </div>
        )}
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
    </div>
  );
}