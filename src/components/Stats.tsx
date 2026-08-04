import React from 'react';
import { Users, GraduationCap, Award, CheckCircle2 } from 'lucide-react';
import { SCHOOL_STATS } from '../data/schoolData';

export const Stats: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users':
        return <Users className="w-6 h-6" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6" />;
      case 'Award':
        return <Award className="w-6 h-6" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  return (
    <section className="relative z-20 -mt-6 sm:-mt-8 lg:-mt-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mb-16 sm:mb-20">
      {/* Colorful Mesh Gradient Glow behind glass for real refraction */}
      <div className="absolute inset-0 max-w-6xl mx-auto -z-10 flex justify-between items-center opacity-70 pointer-events-none blur-3xl">
        <div className="w-48 h-32 bg-blue-400/40 rounded-full" />
        <div className="w-48 h-32 bg-teal-400/40 rounded-full" />
        <div className="w-48 h-32 bg-amber-400/30 rounded-full" />
        <div className="w-48 h-32 bg-emerald-400/40 rounded-full" />
      </div>

      {/* Main Liquid Glass Container Shelf */}
      <div className="glass-card rounded-[2.5rem] p-4 sm:p-6 lg:p-7 relative overflow-hidden">
        {/* Specular Light Reflection Strip on top */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/70 via-white/20 to-transparent pointer-events-none rounded-t-[2.5rem]" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center relative z-10">
          {SCHOOL_STATS.map((stat) => (
            <div
              key={stat.id}
              className="apple-glass-card rounded-3xl p-5 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer"
            >
              {/* Card glossy inner highlight */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/80 to-transparent pointer-events-none rounded-t-3xl" />

              {/* Icon Pill */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${stat.bgClass} flex items-center justify-center mb-4 ${stat.colorClass} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
              >
                {getIcon(stat.icon)}
              </div>

              {/* Number */}
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
                {stat.number}
              </span>

              {/* Label */}
              <span className="text-xs sm:text-sm font-bold text-slate-600 mt-1.5 tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
