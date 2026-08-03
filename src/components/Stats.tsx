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
    <section className="relative z-20 -mt-12 sm:-mt-16 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mb-16 sm:mb-20">
      <div className="glass-card rounded-2xl p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-200/60 dark:divide-slate-800">
        {SCHOOL_STATS.map((stat, idx) => (
          <div
            key={stat.id}
            className={`flex flex-col items-center p-3 ${
              idx > 0 && idx % 2 === 0 ? 'pt-6 lg:pt-3' : ''
            }`}
          >
            <div
              className={`w-13 h-13 rounded-2xl ${stat.bgClass} flex items-center justify-center mb-3 ${stat.colorClass} shadow-sm`}
            >
              {getIcon(stat.icon)}
            </div>
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E3A8A] dark:text-blue-300 tracking-tight">
              {stat.number}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
