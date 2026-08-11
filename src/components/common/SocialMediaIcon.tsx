import React from 'react';
import { Facebook, Instagram, Youtube, Twitter, Globe, Send, MessageCircle, Link, Linkedin, Share2 } from 'lucide-react';
import tiktokLogo from '../../assets/logotiktok.png';

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
        <Instagram className={iconClassName} />
      </span>
    );
  }

  if (effectiveIcon.includes('facebook') || effectiveIcon === 'fb') {
    return (
      <span className={`${className} hover:bg-[#1877F2]`}>
        <Facebook className={iconClassName} />
      </span>
    );
  }

  if (effectiveIcon.includes('youtube') || effectiveIcon === 'yt') {
    return (
      <span className={`${className} hover:bg-[#FF0000]`}>
        <Youtube className={iconClassName} />
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
        <Twitter className={iconClassName} />
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
        <Linkedin className={iconClassName} />
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
