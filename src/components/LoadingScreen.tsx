import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import logoImg from '../assets/logo.png';

interface LoadingScreenProps {
  isLoading: boolean;
  isSlowNetwork?: boolean;
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  isSlowNetwork = false,
  message = 'Memuat Halaman...',
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[999999] bg-[#092e2b]/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 transition-all duration-500 animate-fadeIn">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Main Container */}
      <div className="relative flex flex-col items-center text-center max-w-sm w-full">
        {/* Animated Rings & Logo Container */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-6">
          {/* Outer Spin Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#79EEDE] border-r-teal-400 border-b-[#028C84] animate-spin shadow-lg" />
          
          {/* Reverse Outer Dashed Ring */}
          <div className="absolute -inset-2 rounded-full border-2 border-dashed border-teal-300/30 animate-spin-reverse" />
          
          {/* Inner Glowing Badge */}
          <div className="w-24 h-24 rounded-full bg-slate-900/80 border border-teal-500/40 p-3.5 flex items-center justify-center shadow-2xl backdrop-blur-md">
            <img
              src={logoImg}
              alt="Logo SD Negeri 1 Mulyoagung"
              className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(121,238,222,0.6)] animate-pulse"
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-wider uppercase drop-shadow-sm">
          SD Negeri 1 Mulyoagung
        </h2>

        {/* Dynamic Status / Slow Internet Indicator */}
        {isSlowNetwork ? (
          <div className="mt-3 px-4 py-2 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-200 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce shadow-md backdrop-blur-md">
            <WifiOff size={16} className="text-amber-300 shrink-0" />
            <span>Koneksi internet lambat. Sedang memuat...</span>
          </div>
        ) : (
          <p className="text-teal-200/90 text-xs sm:text-sm mt-2 font-medium flex items-center gap-2">
            <RefreshCw size={14} className="animate-spin text-teal-400" />
            <span>{message}</span>
          </p>
        )}

        {/* Shimmering Progress Bar */}
        <div className="w-48 h-1.5 bg-teal-950/80 rounded-full overflow-hidden mt-5 border border-teal-500/30 shadow-inner">
          <div className="h-full w-full bg-gradient-to-r from-teal-500 via-[#79EEDE] to-emerald-400 animate-loading-bar rounded-full" />
        </div>
      </div>
    </div>
  );
};
