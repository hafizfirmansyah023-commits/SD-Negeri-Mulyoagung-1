import React, { useState, useEffect, useRef } from 'react';
import { NavTab } from '../types';
import { NAV_ITEMS } from '../utils/headerData';
import { TopContactStrip } from './header/TopContactStrip';
import { HeaderLogo } from './header/HeaderLogo';
import { DesktopNav } from './header/DesktopNav';
import { HeaderActions } from './header/HeaderActions';
import { MobileMenuButton } from './header/MobileMenuButton';
import { MobileNavDrawer } from './header/MobileNavDrawer';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenPpdb: () => void;
  onOpenSearch?: () => void;
  linkPpdb?: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenPpdb, onOpenSearch, linkPpdb }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Tutup menu navigasi mobile otomatis ketika user melakukan scroll
      if (mobileMenuOpen && Math.abs(currentScrollY - lastScrollY.current) > 4) {
        setMobileMenuOpen(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mobileMenuOpen]);

  // Clean up listeners on resize/orientation/escape
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <TopContactStrip />

      {/* Main Top Header */}
      <header
        className="sticky top-0 z-50 shadow-lg bg-gradient-to-r from-[#073632] to-[#103632] transition-all duration-300"
      >
        <div className="flex justify-between items-center px-3 sm:px-6 lg:px-8 xl:px-10 w-full h-16 sm:h-20 max-w-[1440px] mx-auto gap-2 sm:gap-6 lg:gap-8 relative">
          <HeaderLogo onClick={handleNavClick} />

          <DesktopNav navItems={NAV_ITEMS} activeTab={activeTab} onNavClick={handleNavClick} />

          <HeaderActions
            activeTab={activeTab}
            onCmsClick={() => handleNavClick('cms')}
            onOpenPpdb={onOpenPpdb}
            onOpenSearch={onOpenSearch}
            linkPpdb={linkPpdb}
          />

          <MobileMenuButton
            isOpen={mobileMenuOpen}
            onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            onOpenSearch={onOpenSearch}
          />
        </div>

        {mobileMenuOpen && (
          <MobileNavDrawer
            navItems={NAV_ITEMS}
            activeTab={activeTab}
            onNavClick={handleNavClick}
            onClose={() => setMobileMenuOpen(false)}
            onOpenPpdb={() => {
              setMobileMenuOpen(false);
              onOpenPpdb();
            }}
            onOpenSearch={onOpenSearch}
            linkPpdb={linkPpdb}
          />
        )}
      </header>
    </>
  );
};
