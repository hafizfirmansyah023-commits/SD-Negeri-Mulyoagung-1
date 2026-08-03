import React, { useState } from 'react';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { NEWS_ARTICLES } from '../data/schoolData';
import { Article } from '../types';
import { NewsDetailModal } from './NewsDetailModal';

interface NewsSectionProps {
  onViewAllClick?: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ onViewAllClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const categories = ['Semua', 'Kegiatan', 'Prestasi', 'Edukasi', 'Pengumuman'];

  const filteredArticles =
    selectedCategory === 'Semua'
      ? NEWS_ARTICLES
      : NEWS_ARTICLES.filter((a) => a.category === selectedCategory);

  return (
    <section id="news-section" className="w-full bg-[#f3f4f5] dark:bg-slate-900/60 py-16 sm:py-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#028C84] dark:text-teal-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Tag className="w-3.5 h-3.5" />
              Kabar & Pengumuman Sekolah
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E3A8A] dark:text-blue-300">
              Berita & Informasi Terkini
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
              Ikuti update terbaru seputar kegiatan, kejuaraan, dan pengumuman sekolah
            </p>
          </div>

          <button
            onClick={onViewAllClick}
            className="hidden md:flex items-center gap-2 text-[#028C84] dark:text-teal-400 font-bold text-sm hover:text-[#006a64] dark:hover:text-teal-300 transition-colors cursor-pointer group"
          >
            <span>Lihat Semua Berita</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1E3A8A] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.slice(0, 6).map((article) => (
            <article
              key={article.id}
              className={`bg-white dark:bg-slate-800 rounded-3xl overflow-hidden hover-lift flex flex-col h-full border border-slate-200/80 dark:border-slate-700/80 transition-all ${
                article.category === 'Prestasi'
                  ? 'border-t-4 border-t-[#F9A825]'
                  : article.category === 'Pengumuman'
                  ? 'border-t-4 border-t-blue-600'
                  : 'border-t-4 border-t-[#028C84]'
              }`}
            >
              {/* Image & Badge */}
              <div className="relative h-48 overflow-hidden group">
                <img
                  src={article.image}
                  alt={article.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-[#028C84]/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                  {article.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <time>{article.date}</time>
                </div>

                <h3
                  onClick={() => setActiveArticle(article)}
                  className="text-lg font-bold text-[#1E3A8A] dark:text-blue-200 mb-3 line-clamp-2 hover:text-[#028C84] dark:hover:text-teal-300 transition-colors cursor-pointer"
                >
                  {article.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-300 text-sm mb-5 line-clamp-3 flex-grow leading-relaxed">
                  {article.summary}
                </p>

                <button
                  onClick={() => setActiveArticle(article)}
                  className="text-[#1E3A8A] dark:text-blue-300 border border-[#1E3A8A]/30 dark:border-blue-400/40 hover:bg-[#1E3A8A] hover:text-white dark:hover:bg-blue-600 font-semibold text-xs py-2 px-4 rounded-xl transition-colors w-fit flex items-center gap-1.5"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-10 flex justify-center md:hidden">
          <button
            onClick={onViewAllClick}
            className="flex items-center gap-2 text-[#028C84] dark:text-teal-400 font-bold text-sm bg-white dark:bg-slate-800 py-3 px-6 rounded-full shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <span>Lihat Semua Berita</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal View */}
      <NewsDetailModal
        article={activeArticle}
        onClose={() => setActiveArticle(null)}
      />
    </section>
  );
};
