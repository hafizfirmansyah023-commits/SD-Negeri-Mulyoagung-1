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
    <section id="news-section" className="w-full bg-white py-16 sm:py-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#028C84] font-bold text-xs uppercase tracking-wider mb-2">
              <Tag className="w-3.5 h-3.5" />
              Kabar & Pengumuman Sekolah
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[black]">
              Berita & Informasi Terkini
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Ikuti update terbaru seputar kegiatan, kejuaraan, dan pengumuman sekolah
            </p>
          </div>

          <button
            onClick={onViewAllClick}
            className="hidden md:flex items-center gap-2 text-[#028C84] font-bold text-sm hover:text-[#006a64] transition-colors cursor-pointer group"
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
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
              className={`bg-slate-50/90 rounded-3xl overflow-hidden flex flex-col h-full border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ${
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
                <div
                  className={`absolute top-4 left-4 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-md ${
                    article.category === 'Prestasi'
                      ? 'bg-amber-500/95'
                      : article.category === 'Pengumuman'
                      ? 'bg-blue-600/95'
                      : 'bg-[#028C84]/95'
                  }`}
                >
                  {article.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow bg-white">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  <time>{article.date}</time>
                </div>

                <h3
                  onClick={() => setActiveArticle(article)}
                  className="text-lg font-bold text-[#1E3A8A] mb-3 line-clamp-2 hover:text-[#028C84] transition-colors cursor-pointer"
                >
                  {article.title}
                </h3>

                <p className="text-slate-600 text-sm mb-5 line-clamp-3 flex-grow leading-relaxed">
                  {article.summary}
                </p>

                <button
                  onClick={() => setActiveArticle(article)}
                  className="bg-teal-50 hover:bg-[#028C84] text-[#028C84] hover:text-white border border-teal-200/80 font-bold text-xs py-2.5 px-4 rounded-xl transition-all duration-200 w-fit flex items-center gap-1.5 cursor-pointer shadow-sm"
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
            className="flex items-center gap-2 text-[#028C84] font-bold text-sm bg-slate-100 py-3 px-6 rounded-full shadow-sm border border-slate-200"
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
