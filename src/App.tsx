/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
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

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [ppdbOpen, setPpdbOpen] = useState(false);

  // Ensure dark mode class is removed from <html> element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    localStorage.removeItem('theme');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-900 transition-colors duration-300 font-sans selection:bg-teal-600 selection:text-white">
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
            <Hero
              onOpenPpdb={() => setPpdbOpen(true)}
              setActiveTab={setActiveTab}
            />
            <Stats />
            <PrincipalGreeting />
            <NewsSection onViewAllClick={() => setActiveTab('news')} />
            <VideoProfileSection />
            <SchoolProfileSection />
            <ContactSection />
          </>
        )}

        {activeTab === 'profile' && (
          <div className="pt-4 animate-fade-in">
            <SchoolProfileSection />
            <VideoProfileSection />
          </div>
        )}

        {activeTab === 'directory' && (
          <div className="pt-4 animate-fade-in">
            <DirectorySection />
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="pt-4 animate-fade-in">
            <GallerySection />
          </div>
        )}

        {activeTab === 'news' && (
          <div className="pt-4 animate-fade-in">
            <NewsSection />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="pt-4 animate-fade-in">
            <ContactSection />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenPpdb={() => setPpdbOpen(true)}
      />

      {/* PPDB Registration Modal */}
      <PpdbModal isOpen={ppdbOpen} onClose={() => setPpdbOpen(false)} />

      {/* Floating Back to Top Button */}
      <BackToTop />
    </div>
  );
}
