import React from 'react';

interface GalleryCategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const GalleryCategoryFilter: React.FC<GalleryCategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => (
  <div className="flex justify-center">
    <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-teal-50/60 border border-teal-100/80 justify-center">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
            selectedCategory === cat
              ? 'bg-gradient-to-r from-[#028C84] to-[#156B63] text-white shadow-md shadow-teal-700/20 scale-[1.02]'
              : 'text-slate-600 hover:text-[#028C84] hover:bg-white/60'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  </div>
);
