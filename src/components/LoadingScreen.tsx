import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
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
  const [shouldRender, setShouldRender] = useState(isLoading);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
      setIsFadingOut(false);
    } else {
      setIsFadingOut(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsFadingOut(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div
      role="status"
      aria-label="Memuat SD Negeri 1 Mulyoagung"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 select-none transition-opacity duration-600 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      style={{
        backgroundColor: 'rgba(46, 125, 50, 0.15)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Konten Diposisikan di Tengah Layar (Vertikal & Horizontal Center) */}
      <div className="flex flex-col items-center text-center animate-scale-in max-w-sm sm:max-w-md w-full">
        {/* Logo Sekolah: Lingkaran/perisai dengan outline hijau tua, ukuran sedang (~120px) */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="w-[110px] h-[110px] sm:w-[125px] sm:h-[125px] rounded-full p-2.5 bg-white/70 border-2 border-emerald-800 shadow-lg shadow-emerald-900/10 backdrop-blur-sm flex items-center justify-center transition-transform">
            <img
              src={logoImg}
              alt="Logo SD Negeri 1 Mulyoagung"
              className="w-full h-full object-contain animate-soft-pulse drop-shadow-sm"
              loading="eager"
            />
          </div>
        </div>

        {/* Teks dengan Font Modern Sans-serif, Jarak Antar Huruf Sedikit Renggang, dan Efek Shiny Text Berwarna Hijau Tua */}
        <h1 className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-wider font-sans uppercase shiny-text-green select-none">
          SD Negeri 1 Mulyoagung
        </h1>

        {/* Status Indikator Jika Jaringan Lambat */}
        {isSlowNetwork && (
          <div className="mt-4 px-3.5 py-1.5 bg-amber-500/20 border border-amber-600/30 rounded-full text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm backdrop-blur-sm animate-pulse">
            <WifiOff size={15} className="text-amber-700 dark:text-amber-300 shrink-0" />
            <span>Koneksi lambat, sedang menghubungkan...</span>
          </div>
        )}

        {/* Accessibility Screen Reader Text */}
        <span className="sr-only">{message || 'Memuat Halaman...'}</span>
      </div>
    </div>
  );
};


