import React from 'react';
import { NavTab } from '../../types';
import logoImg from '../../assets/logo.png';
import { useSchoolSettings } from '../../hooks/useSchoolSettings';
import { useHomepageConfig } from '../../hooks/useHomepageConfig';
import { SocialMediaIcon } from '../common/SocialMediaIcon';

interface BrandInfoProps {
  onNavClick: (tab: NavTab) => void;
}

export const BrandInfo: React.FC<BrandInfoProps> = ({ onNavClick }) => {
  const { medsosLinks } = useSchoolSettings();
  const { heroSubtitle } = useHomepageConfig();

  return (
    <div className="md:col-span-5 space-y-3 sm:space-y-4">
      <div onClick={() => onNavClick('home')} className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group">
        <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
          <img
            src={logoImg}
            className="w-full h-full object-contain drop-shadow-md"
            alt="Logo SD Negeri 1 Mulyoagung"
          />
        </div>
        <span className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
          SD Negeri 1 Mulyoagung
        </span>
      </div>

      <p className="text-xs sm:text-sm text-slate-200 dark:text-slate-400 max-w-md leading-relaxed">
        {heroSubtitle}
      </p>

      <div className="space-y-2 pt-1 sm:pt-2">
        <span className="text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Media Sosial Resmi:
        </span>
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {medsosLinks.map((item) => (
            <a
              key={item.id || item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              title={item.name}
            >
              <SocialMediaIcon name={item.name} icon={item.icon} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

