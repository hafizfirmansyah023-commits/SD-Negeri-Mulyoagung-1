import React, { useState, useEffect, useRef } from 'react';
import { Users, GraduationCap, Award, CheckCircle2 } from 'lucide-react';
import { getApiBaseUrl } from '../config/api'; 

// 1. Definisikan tipe data
interface StatData {
  id: number;
  judul: string;
  jumlah: string;
  label: string;
}

// =========================================================================
// KOMPONEN BARU: AnimatedCounter (Untuk efek angka berjalan / Count Up)
// =========================================================================
const AnimatedCounter: React.FC<{ value: string | number }> = ({ value }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Memisahkan angka dengan teks/simbol (Contoh "1.500+" -> prefix: "", angka: 1500, suffix: "+")
  const strValue = String(value);
  const match = strValue.match(/^([^\d]*)([\d.,]+)([^\d]*)$/);
  const prefix = match ? match[1] : '';
  const numStr = match ? match[2].replace(/[.,]/g, '') : '0'; 
  const suffix = match ? match[3] : '';
  
  const target = parseInt(numStr, 10) || 0;

  // Mendeteksi apakah angka sudah terlihat di layar (Scroll)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 } // Memicu animasi ketika 10% elemen terlihat
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Logika Animasi Count Up
  useEffect(() => {
    if (!isVisible || target === 0) return;

    let animationFrameId: number;
    const duration = 2000; // Durasi animasi (2000ms = 2 detik)
    const startTime = performance.now();

    const updateCount = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Efek Ease-Out (Kencang di awal, lambat di akhir)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(ease * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setCount(target); // Pastikan hasil akhir tepat
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, isVisible]);

  // Fallback jika datanya bukan angka (misal "Banyak")
  if (isNaN(target) || target === 0) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref}>
      {prefix}
      {/* toLocaleString('id-ID') akan otomatis menambahkan titik, misal 1500 jadi 1.500 */}
      {count.toLocaleString('id-ID')}
      {suffix}
    </span>
  );
};
// =========================================================================

export const Stats: React.FC = () => {
  const [stats, setStats] = useState<StatData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [responseStats, responseGuru] = await Promise.all([
          fetch(`${getApiBaseUrl()}/backend/API/statistik.php`),
          fetch(`${getApiBaseUrl()}/backend/API/guru.php`) 
        ]);

        const resultStats = await responseStats.json();
        const resultGuru = await responseGuru.json();
        
        let combinedStats: StatData[] = [];

        if (resultStats.status === 'success') {
          combinedStats = [...resultStats.data];
        }

        if (resultGuru.status === 'success') {
          const totalGuru = resultGuru.data.length; 
          
          combinedStats.push({
            id: 9999, 
            judul: "Total", 
            jumlah: totalGuru.toString(), 
            label: "Guru & Tendik"
          });
        }

        setStats(combinedStats);

      } catch (error) {
        console.error("Gagal mengambil data statistik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Users':
        return <Users className={className} />;
      case 'GraduationCap':
        return <GraduationCap className={className} />;
      case 'Award':
        return <Award className={className} />;
      case 'CheckCircle2':
        return <CheckCircle2 className={className} />;
      default:
        return <CheckCircle2 className={className} />;
    }
  };

  const getStyleByJudul = (judul: string, label: string) => {
    const text = `${judul} ${label}`.toLowerCase();

    if (text.includes('siswa') || text.includes('murid') || text.includes('peserta')) {
      return { icon: 'Users', bgClass: 'bg-blue-100', colorClass: 'text-blue-600' };
    }
    if (text.includes('lulus') || text.includes('alumni') || text.includes('tamatan')) {
      return { icon: 'GraduationCap', bgClass: 'bg-emerald-100', colorClass: 'text-emerald-600' };
    }
    if (text.includes('prestasi') || text.includes('juara') || text.includes('penghargaan') || text.includes('piala')) {
      return { icon: 'Award', bgClass: 'bg-amber-100', colorClass: 'text-amber-600' };
    }
    if (text.includes('guru') || text.includes('tendik') || text.includes('staff') || text.includes('pengajar')) {
      return { icon: 'Users', bgClass: 'bg-teal-100', colorClass: 'text-teal-600' }; 
    }
    if (text.includes('fasilitas') || text.includes('kelas') || text.includes('ruang') || text.includes('ekstra')) {
      return { icon: 'CheckCircle2', bgClass: 'bg-indigo-100', colorClass: 'text-indigo-600' };
    }

    return { icon: 'CheckCircle2', bgClass: 'bg-slate-100', colorClass: 'text-slate-600' };
  };

  return (
    <section className="relative z-20 -mt-6 sm:-mt-8 lg:-mt-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mb-10 sm:mb-20">
      <div className="absolute inset-0 max-w-6xl mx-auto -z-10 flex justify-between items-center opacity-70 pointer-events-none blur-3xl">
        <div className="w-32 h-24 sm:w-48 sm:h-32 bg-blue-400/40 rounded-full" />
        <div className="w-32 h-24 sm:w-48 sm:h-32 bg-teal-400/40 rounded-full" />
        <div className="w-32 h-24 sm:w-48 sm:h-32 bg-amber-400/30 rounded-full" />
        <div className="w-32 h-24 sm:w-48 sm:h-32 bg-emerald-400/40 rounded-full" />
      </div>

      <div className="glass-card rounded-3xl sm:rounded-[2.5rem] p-3 sm:p-6 lg:p-7 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/70 via-white/20 to-transparent pointer-events-none rounded-t-3xl sm:rounded-t-[2.5rem]" />

        {loading ? (
          <div className="w-full flex justify-center py-10">
            <span className="text-slate-500 font-medium animate-pulse">Memuat data statistik...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-center relative z-10">
            {stats.map((stat) => {
              const style = getStyleByJudul(stat.judul, stat.label); 

              return (
                <div
                  key={stat.id}
                  className="apple-glass-card rounded-2xl sm:rounded-3xl p-2.5 sm:p-5 lg:p-6 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer"
                >
                  <div className="absolute top-0 left-0 right-0 h-8 sm:h-10 bg-gradient-to-b from-white/80 to-transparent pointer-events-none rounded-t-2xl sm:rounded-t-3xl" />

                  <div
                    className={`w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl ${style.bgClass} flex items-center justify-center mb-1.5 sm:mb-3.5 ${style.colorClass} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    {getIcon(style.icon, "w-4 h-4 sm:w-6 sm:h-6")}
                  </div>

                  <span className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent tracking-tight drop-shadow-sm leading-tight">
                    {/* Menggunakan Komponen AnimatedCounter di sini */}
                    <AnimatedCounter value={stat.jumlah} />
                  </span>

                  <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-slate-600 mt-1 tracking-wide leading-tight line-clamp-2">
                    {stat.judul} {stat.label !== stat.judul ? stat.label : ''}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};