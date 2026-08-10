import React from 'react';
import { NavTab } from '../../types';
import { NavItem } from '../../utils/headerData';

interface DesktopNavProps {
  navItems: NavItem[];
  activeTab: NavTab;
  onNavClick: (tab: NavTab) => void;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({ navItems, activeTab, onNavClick }) => (
  <nav className="hidden md:flex gap-7 items-center h-full">
    {navItems.map((item) => {
      const isActive = activeTab === item.id;
      return (
        <button
          key={item.id}
          onClick={() => onNavClick(item.id)}
          className={`h-full flex items-center px-1 font-semibold text-sm transition-all relative ${
            isActive
              ? 'text-[#028C84] dark:text-teal-400 border-b-2 border-[#028C84] dark:border-teal-400'
              : 'text-slate-600 dark:text-slate-300 hover:text-[#028C84] dark:hover:text-teal-400'
          }`}
        >
          {item.label}
        </button>
      );
    })}
  </nav>
);
