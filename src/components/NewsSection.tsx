import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { NEWS_ARTICLES } from '../data/schoolData';
import { Article } from '../types';
import { NewsDetailModal } from './NewsDetailModal';
import { getApiBaseUrl, getImageUrl } from '../config/api';
import { useHomepageConfig } from '../hooks/useHomepageConfig';

interface NewsSectionProps {
  onViewAllClick?: () => void;
}

let cachedArticles: Article[] | null = null;

export const NewsSection: React.FC<NewsSectionProps> = ({ onViewAllClick }) => {
  const [articles, setArticles] = useState<Article[]>(cachedArticles || []);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const homepageConfig = useHomepageConfig();

  useEffect(() => {
    if (cachedArticles) {
      setArticles(cachedArticles);
      return;
    }

    const loadNews = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/backend/API/newsAPI.php`);
        const result = await response.json();
        if (result.status === 'success' && result.data && result.data.length > 0) {
          const mapped: Article[] = result.data.map((art: any) => ({
            id: art.id.toString(),
            title: art.judul,
            category: art.kategori as 'Kegiatan' | 'Prestasi' | 'Edukasi' | 'Pengumuman',
            date: art.tanggal,
            summary: art.isi.length > 120 ? art.isi.substring(0, 120) + '...' : art.isi,
            content: art.isi,
            image: art.foto ? getImageUrl(art.foto) : 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
            imageAlt: art.judul,
            author: art.uploader || 'Admin Sekolah',
            readTime: '3 menit',
            featured: true
          }));
          cachedArticles = mapped;
          setArticles(mapped);
        } else {
          cachedArticles = NEWS_ARTICLES;
          setArticles(NEWS_ARTICLES);
        }
      } catch (e) {
        cachedArticles = NEWS_ARTICLES;
        setArticles(NEWS_ARTICLES);
      }
    };
    loadNews();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(articles.map((a) => a.category).filter(Boolean)));
    return ['Semua', ...unique];
  }, [articles]);

  const filteredArticles =
    selectedCategory === 'Semua'
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  const newsSection = homepageConfig.sections.find(s => s.key === 'berita');
  const sectionTitle = newsSection ? newsSection.judul : 'Berita & Informasi Terkini';
  const sectionSubtitle = newsSection ? newsSection.subjudul : 'Ikuti update terbaru seputar kegiatan, kejuaraan, dan pengumuman sekolah';

  return (
    // Padding Y diturunkan untuk mobile (py-10)
    <section id="news-section" className="w-full bg-white py-10 sm:py-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 sm:mb-10 gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[#028C84] font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-1 sm:mb-2 bg-teal-50/80 border border-teal-200/80 px-2.5 py-1 sm:px-0 sm:py-0 sm:bg-transparent sm:border-0 rounded-full">
              <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Kabar & Pengumuman Sekolah
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[black] leading-tight">
              {sectionTitle}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base mt-1.5 sm:mt-2">
              {sectionSubtitle}
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
        {/* Gap diperkecil dan mb (margin bottom) dikurangi untuk mobile */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold transition-all ${
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
        {/* Gap dikurangi untuk mobile (gap-4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredArticles.slice(0, 6).map((article) => (
            <article
              key={article.id}
              className={`bg-slate-50/90 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col h-full border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ${
                article.category === 'Prestasi'
                  ? 'border-t-[3px] sm:border-t-4 border-t-[#F9A825]'
                  : article.category === 'Pengumuman'
                  ? 'border-t-[3px] sm:border-t-4 border-t-blue-600'
                  : 'border-t-[3px] sm:border-t-4 border-t-[#028C84]'
              }`}
            >
              {/* Image & Badge */}
              {/* Tinggi gambar diturunkan di mobile (h-40) agar card tidak memanjang */}
              <div className="relative h-40 sm:h-48 overflow-hidden group">
                <img
                  src={article.image}
                  alt={article.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  className={`absolute top-3 left-3 sm:top-4 sm:left-4 text-white px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-md backdrop-blur-md ${
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
              {/* Padding dikurangi di mobile (p-4) */}
              <div className="p-4 sm:p-6 flex flex-col flex-grow bg-white">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500 mb-1.5 sm:mb-2 font-medium">
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-600" />
                  <time>{article.date}</time>
                </div>

                <h3
                  onClick={() => setActiveArticle(article)}
                  className="text-base sm:text-lg font-bold text-[#1E3A8A] mb-2 sm:mb-3 line-clamp-2 hover:text-[#028C84] transition-colors cursor-pointer leading-tight"
                >
                  {article.title}
                </h3>

                <p className="text-slate-600 text-[11px] sm:text-sm mb-3 sm:mb-5 line-clamp-2 sm:line-clamp-3 flex-grow leading-snug sm:leading-relaxed">
                  {article.summary}
                </p>

                <button
                  onClick={() => setActiveArticle(article)}
                  className="bg-teal-50 hover:bg-[#028C84] text-[#028C84] hover:text-white border border-teal-200/80 font-bold text-[10px] sm:text-xs py-2 px-3 sm:py-2.5 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-200 w-fit flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-sm mt-auto"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile View All Button */}
        {/* Margin atas dikurangi untuk mobile */}
        <div className="mt-6 sm:mt-10 flex justify-center md:hidden">
          <button
            onClick={onViewAllClick}
            className="flex items-center justify-center gap-1.5 text-[#028C84] font-bold text-xs sm:text-sm bg-slate-100 py-2.5 px-5 rounded-full shadow-sm border border-slate-200 w-full sm:w-auto"
          >
            <span>Lihat Semua Berita</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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