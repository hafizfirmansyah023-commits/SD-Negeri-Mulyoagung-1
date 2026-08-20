import React from 'react';
import { Globe, Send, MessageCircle, Link } from 'lucide-react';
import tiktokLogo from '../../assets/logotiktok.png';

// Brand icon SVGs (removed from lucide-react 1.x)
const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface SocialMediaIconProps {
  name: string;
  icon?: string; // 'auto' or icon key
  className?: string;
  iconClassName?: string;
}

export const SocialMediaIcon: React.FC<SocialMediaIconProps> = ({
  name = '',
  icon = 'auto',
  className = 'w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-md',
  iconClassName = 'w-4 h-4 sm:w-5 sm:h-5',
}) => {
  const normName = (name || '').toLowerCase();
  const normIcon = (icon || 'auto').toLowerCase();

  // Determine effective icon type:
  // If icon is NOT 'auto', use icon. Otherwise match based on name.
  let effectiveIcon = normIcon !== 'auto' ? normIcon : normName;

  if (effectiveIcon.includes('instagram') || effectiveIcon === 'ig') {
    return (
      <span className={`${className} hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600`}>
        <InstagramIcon className={iconClassName} />
      </span>
    );
  }

  if (effectiveIcon.includes('facebook') || effectiveIcon === 'fb') {
    return (
      <span className={`${className} hover:bg-[#1877F2]`}>
        <FacebookIcon className={iconClassName} />
      </span>
    );
  }

  if (effectiveIcon.includes('youtube') || effectiveIcon === 'yt') {
    return (
      <span className={`${className} hover:bg-[#FF0000]`}>
        <YoutubeIcon className={iconClassName} />
      </span>
    );
  }

  if (effectiveIcon.includes('tiktok') || effectiveIcon === 'tt') {
    return (
      <span className={`${className} hover:bg-black p-1.5 sm:p-2 overflow-hidden`}>
        <img src={tiktokLogo} alt={name} className="w-full h-full object-contain" />
      </span>
    );
  }

  if (effectiveIcon.includes('twitter') || effectiveIcon.includes('x')) {
    return (
      <span className={`${className} hover:bg-[#1DA1F2]`}>
        <TwitterIcon className={iconClassName} />
      </span>
    );
  }

  if (effectiveIcon.includes('whatsapp') || effectiveIcon === 'wa') {
    return (
      <span className={`${className} hover:bg-[#25D366]`}>
        <MessageCircle className={iconClassName} />
      </span>
    );
  }

  if (effectiveIcon.includes('telegram') || effectiveIcon === 'tg') {
    return (
      <span className={`${className} hover:bg-[#0088cc]`}>
        <Send className={iconClassName} />
      </span>
    );
  }

  if (effectiveIcon.includes('linkedin')) {
    return (
      <span className={`${className} hover:bg-[#0A66C2]`}>
        <LinkedinIcon className={iconClassName} />
      </span>
    );
  }

  if (effectiveIcon.includes('globe') || effectiveIcon.includes('website')) {
    return (
      <span className={`${className} hover:bg-teal-600`}>
        <Globe className={iconClassName} />
      </span>
    );
  }

  // Fallback / default Link icon
  return (
    <span className={`${className} hover:bg-teal-600`}>
      <Link className={iconClassName} />
    </span>
  );
};
