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
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [ppdbOpen, setPpdbOpen] = useState(false);

  // Sync dark mode class on <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-teal-600 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
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
