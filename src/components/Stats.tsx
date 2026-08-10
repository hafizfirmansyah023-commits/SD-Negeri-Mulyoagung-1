import React from 'react';
import { Users, GraduationCap, Award, CheckCircle2 } from 'lucide-react';
import { SCHOOL_STATS } from '../data/schoolData';

export const Stats: React.FC = () => {
  // Ditambahkan parameter className agar ukuran icon bisa responsive (mengecil di mobile)
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
        return <Award className={className} />;
    }
  };

  return (
    // Mengurangi margin bawah (mb-10) di mobile agar jarak ke section selanjutnya lebih rapat
    <section className="relative z-20 -mt-6 sm:-mt-8 lg:-mt-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mb-10 sm:mb-20">
      {/* Colorful Mesh Gradient Glow behind glass for real refraction */}
      <div className="absolute inset-0 max-w-6xl mx-auto -z-10 flex justify-between items-center opacity-70 pointer-events-none blur-3xl">
        <div className="w-32 h-24 sm:w-48 sm:h-32 bg-blue-400/40 rounded-full" />
        <div className="w-32 h-24 sm:w-48 sm:h-32 bg-teal-400/40 rounded-full" />
        <div className="w-32 h-24 sm:w-48 sm:h-32 bg-amber-400/30 rounded-full" />
        <div className="w-32 h-24 sm:w-48 sm:h-32 bg-emerald-400/40 rounded-full" />
      </div>

      {/* Main Liquid Glass Container Shelf */}
      {/* Border radius diperkecil (rounded-3xl) dan padding diturunkan (p-3) di mobile */}
      <div className="glass-card rounded-3xl sm:rounded-[2.5rem] p-3 sm:p-6 lg:p-7 relative overflow-hidden">
        {/* Specular Light Reflection Strip on top */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/70 via-white/20 to-transparent pointer-events-none rounded-t-3xl sm:rounded-t-[2.5rem]" />

        {/* Gap antar card diperkecil menjadi gap-3 untuk mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-center relative z-10">
          {SCHOOL_STATS.map((stat) => (
            <div
              key={stat.id}
              // Padding dalam card diperkecil dari p-5 ke p-3 agar tinggi card tidak lonjong
              className="apple-glass-card rounded-2xl sm:rounded-3xl p-3 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer"
            >
              {/* Card glossy inner highlight */}
              <div className="absolute top-0 left-0 right-0 h-8 sm:h-10 bg-gradient-to-b from-white/80 to-transparent pointer-events-none rounded-t-2xl sm:rounded-t-3xl" />

              {/* Icon Pill */}
              {/* Ukuran kotak icon diperkecil (w-10 h-10) di mobile, margin bottom juga dirapatkan (mb-1.5) */}
              <div
                className={`w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl ${stat.bgClass} flex items-center justify-center mb-1.5 sm:mb-4 ${stat.colorClass} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
              >
                {getIcon(stat.icon, "w-4 h-4 sm:w-6 sm:h-6")}
              </div>

              {/* Number */}
              {/* Ukuran teks angka diperkecil ke text-2xl di mobile */}
              <span className="text-2xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent tracking-tight drop-shadow-sm leading-tight">
                {stat.number}
              </span>

              {/* Label */}
              <span className="text-[10px] sm:text-sm font-bold text-slate-600 mt-0.5 sm:mt-1.5 tracking-wide leading-tight">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};