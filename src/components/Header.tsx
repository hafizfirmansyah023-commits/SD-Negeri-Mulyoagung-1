import React, { useState } from 'react';
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
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenPpdb }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <TopContactStrip />

      {/* Main Top Header */}
      <header className="bg-gradient-to-r from-[#073632]/100 to-[#103632]/100">
        <div className="flex justify-between items-center px-4 sm:px-8 lg:px-12 w-full h-20 max-w-7xl mx-auto">
          <HeaderLogo onClick={handleNavClick} />

          <DesktopNav navItems={NAV_ITEMS} activeTab={activeTab} onNavClick={handleNavClick} />

          <HeaderActions activeTab={activeTab} onCmsClick={() => handleNavClick('cms')} onOpenPpdb={onOpenPpdb} />

          <MobileMenuButton isOpen={mobileMenuOpen} onToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        </div>

        {mobileMenuOpen && (
          <MobileNavDrawer
            navItems={NAV_ITEMS}
            activeTab={activeTab}
            onNavClick={handleNavClick}
            onOpenPpdb={() => {
              setMobileMenuOpen(false);
              onOpenPpdb();
            }}
          />
        )}
      </header>
    </>
  );
};
