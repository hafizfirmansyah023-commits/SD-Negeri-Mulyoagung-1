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
  linkPpdb?: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenPpdb, linkPpdb }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 10) {
        setIsScrollingDown(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (Math.abs(currentScrollY - lastScrollY.current) < 10) {
        return;
      }

      if (currentScrollY > lastScrollY.current) {
        setIsScrollingDown(true);
      } else {
        setIsScrollingDown(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Auto-close mobile menu instantly when user scrolls
  useEffect(() => {
    if (!mobileMenuOpen) return;

    let startY = window.scrollY;

    const handleScrollClose = () => {
      const currentY = window.scrollY;
      if (Math.abs(currentY - startY) > 2) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScrollClose, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollClose);
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
        className={`sticky top-0 z-50 shadow-lg bg-gradient-to-r from-[#073632]/100 to-[#103632]/100 transition-all duration-300 ${
          isScrollingDown ? 'opacity-75 hover:opacity-100' : 'opacity-100'
        }`}
      >
        <div className="flex justify-between items-center px-4 sm:px-8 lg:px-12 w-full h-20 max-w-7xl mx-auto">
          <HeaderLogo onClick={handleNavClick} />

          <DesktopNav navItems={NAV_ITEMS} activeTab={activeTab} onNavClick={handleNavClick} />

          <HeaderActions activeTab={activeTab} onCmsClick={() => handleNavClick('cms')} onOpenPpdb={onOpenPpdb} linkPpdb={linkPpdb} />

          <MobileMenuButton isOpen={mobileMenuOpen} onToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
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
            linkPpdb={linkPpdb}
          />
        )}
      </header>
    </>
  );
};
