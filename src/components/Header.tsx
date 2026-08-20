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

  // Lock body scroll when mobile navigation menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
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
