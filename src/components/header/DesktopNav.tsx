import React, { useState, useRef, useEffect } from 'react';
import { NavTab } from '../../types';
import { NavItem } from '../../utils/headerData';

interface DesktopNavProps {
  navItems: NavItem[];
  activeTab: NavTab;
  onNavClick: (tab: NavTab) => void;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({ navItems, activeTab, onNavClick }) => {
  const [hoveredTab, setHoveredTab] = useState<NavTab | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const targetTab = hoveredTab || activeTab;

  useEffect(() => {
    if (!navRef.current) return;
    const targetElement = navRef.current.querySelector<HTMLElement>(`[data-tab-id="${targetTab}"]`);

    if (targetElement) {
      setPillStyle({
        left: targetElement.offsetLeft,
        width: targetElement.offsetWidth,
        opacity: 1,
      });
    } else {
      setPillStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [targetTab, navItems]);

  return (
    <nav
      ref={navRef}
      onMouseLeave={() => setHoveredTab(null)}
      className="hidden md:flex relative items-center bg-slate-950/30 backdrop-blur-md p-1.5 rounded-full border border-teal-500/20 shadow-inner"
    >
      {/* Sliding Pill Background Indicator */}
      <div
        className="absolute top-1.5 bottom-1.5 bg-gradient-to-r from-teal-500 to-[#028C84] rounded-full transition-all duration-300 ease-out shadow-md shadow-teal-500/25 pointer-events-none"
        style={{
          left: `${pillStyle.left}px`,
          width: `${pillStyle.width}px`,
          opacity: pillStyle.opacity,
        }}
      />

      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const isHovered = hoveredTab === item.id;
        const isHighlighted = isHovered || (!hoveredTab && isActive);

        return (
          <button
            key={item.id}
            data-tab-id={item.id}
            onClick={() => onNavClick(item.id)}
            onMouseEnter={() => setHoveredTab(item.id)}
            className={`relative z-10 px-5 py-2 rounded-full font-medium text-sm transition-colors duration-200 cursor-pointer ${
              isHighlighted
                ? 'text-white font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
};

