import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { NavTab, AkademikMenuItem } from '../../types';
import { NavItem } from '../../utils/headerData';

interface DesktopNavProps {
  navItems: NavItem[];
  activeTab: NavTab;
  onNavClick: (tab: NavTab) => void;
  akademikMenu?: AkademikMenuItem[];
  onAkademikItemClick?: (item: AkademikMenuItem) => void;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({
  navItems,
  activeTab,
  onNavClick,
  akademikMenu = [],
  onAkademikItemClick,
}) => {
  const [hoveredTab, setHoveredTab] = useState<NavTab | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openCats, setOpenCats] = useState<Record<number, boolean>>({});
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
      const navRect = navRef.current.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      setPillStyle({
        left: targetRect.left - navRect.left,
        width: targetRect.width,
        opacity: 1,
      });
    } else {
      setPillStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [targetTab, navItems]);


  const handleAkademikMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setHoveredTab('akademik');
    setDropdownOpen(true);
  };

  const handleAkademikMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
      setHoveredTab(null);
    }, 180);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setHoveredTab(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <nav
      ref={navRef}
      onMouseLeave={() => {
        if (!dropdownOpen) setHoveredTab(null);
      }}
      className="hidden min-[1200px]:flex relative items-center bg-slate-950/35 backdrop-blur-md p-1 2xl:p-1.5 rounded-full border border-teal-500/25 shadow-inner gap-0.5 shrink-0"
    >
      {/* Sliding Pill Background Indicator */}
      <div
        className="absolute top-1 bottom-1 2xl:top-1.5 2xl:bottom-1.5 bg-gradient-to-r from-teal-500 to-[#028C84] rounded-full transition-all duration-300 ease-out shadow-md shadow-teal-500/25 pointer-events-none"
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
        const isAkademik = item.id === 'akademik';

        if (isAkademik) {
          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={handleAkademikMouseEnter}
              onMouseLeave={handleAkademikMouseLeave}
            >
              <button
                data-tab-id={item.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDropdownOpen((prev) => !prev);
                  setHoveredTab('akademik');
                }}
                className={`relative z-10 px-2.5 min-[1280px]:px-3 min-[1360px]:px-3.5 2xl:px-4 py-1.5 2xl:py-2 rounded-full font-medium text-[12px] min-[1280px]:text-[12.5px] min-[1360px]:text-[13px] 2xl:text-[14px] transition-colors duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  isHighlighted ? 'text-white font-bold' : 'text-slate-200 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-teal-300' : 'text-slate-300'}`}
                />
              </button>

              {/* Dropdown Menu - group items by category & standalone items */}
              {dropdownOpen && akademikMenu.length > 0 && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-[#073632]/95 backdrop-blur-xl border border-teal-500/30 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex flex-col gap-1.5 max-h-80 overflow-y-auto px-0.5">
                    {akademikMenu
                      .filter((s) => !s.parent_id || Number(s.parent_id) === 0)
                      .map((rootItem) => {
                        const children = akademikMenu.filter((s) => Number(s.parent_id) === Number(rootItem.id));
                        const isPureCategory = children.length > 0 || (!rootItem.link_gdrive || rootItem.link_gdrive.trim() === '');
                        const isOpen = !!openCats[rootItem.id];

                        // Jika item mandiri (di luar kategori & memiliki link Google Drive)
                        if (!isPureCategory) {
                          return (
                            <button
                              key={rootItem.id}
                              onClick={() => {
                                setDropdownOpen(false);
                                setHoveredTab(null);
                                if (onAkademikItemClick) {
                                  onAkademikItemClick(rootItem);
                                }
                              }}
                              className="text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-100 hover:text-white hover:bg-teal-500/25 transition-all cursor-pointer flex items-center justify-between gap-2"
                              title={rootItem.label}
                            >
                              <span className="truncate">{rootItem.label}</span>
                            </button>
                          );
                        }

                        // Jika kategori grup (default tertutup / hide sampai diklik)
                        return (
                          <div key={rootItem.id} className="flex flex-col">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOpenCats((prev) => ({ ...prev, [rootItem.id]: !prev[rootItem.id] }));
                              }}
                              className="text-left px-3.5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider text-teal-300 hover:bg-teal-500/10 transition-all flex items-center justify-between gap-2 cursor-pointer"
                              title={children.length > 0 ? (isOpen ? 'Ciutkan kategori' : 'Buka kategori') : 'Kategori'}
                            >
                              <span className="truncate">{rootItem.label}</span>
                              {children.length > 0 && (
                                <ChevronDown
                                  size={13}
                                  className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-200' : '-rotate-90 text-teal-400/80'}`}
                                />
                              )}
                            </button>
                            {/* Item / sub-item turunan hanya muncul jika kategori diklik / isOpen */}
                            {children.length > 0 && isOpen && (
                              <div className="flex flex-col gap-0.5 mt-0.5 pl-2 border-l border-teal-500/30 ml-2 animate-in fade-in slide-in-from-top-1 duration-150">
                                {children.map((subItem) => (
                                  <button
                                    key={subItem.id}
                                    onClick={() => {
                                      setDropdownOpen(false);
                                      setHoveredTab(null);
                                      if (onAkademikItemClick) {
                                        onAkademikItemClick(subItem);
                                      }
                                    }}
                                    className="text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white hover:bg-teal-500/20 transition-all cursor-pointer truncate"
                                    title={subItem.label}
                                  >
                                    {subItem.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          );
        }

        return (
          <button
            key={item.id}
            data-tab-id={item.id}
            onClick={() => onNavClick(item.id)}
            onMouseEnter={() => setHoveredTab(item.id)}
            className={`relative z-10 px-2.5 min-[1280px]:px-3 min-[1360px]:px-3.5 2xl:px-4 py-1.5 2xl:py-2 rounded-full font-medium text-[12px] min-[1280px]:text-[12.5px] min-[1360px]:text-[13px] 2xl:text-[14px] transition-colors duration-200 cursor-pointer whitespace-nowrap ${
              isHighlighted ? 'text-white font-bold' : 'text-slate-200 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
};
