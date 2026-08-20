import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Calendar, Tag, Share2 } from 'lucide-react';
import { NEWS_ARTICLES } from '../data/schoolData';
import { Article } from '../types';
import { NewsDetailModal } from './NewsDetailModal';
import { getApiBaseUrl, getImageUrl } from '../config/api';
import { useHomepageConfig } from '../hooks/useHomepageConfig';
import { stripHtml } from '../utils/helpers';

interface NewsSectionProps {
  onViewAllClick?: () => void;
}

let cachedArticles: Article[] | null = null;

export const NewsSection: React.FC<NewsSectionProps> = ({ onViewAllClick }) => {
  const [articles, setArticles] = useState<Article[]>(cachedArticles || []);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const homepageConfig = useHomepageConfig();

  const handleShare = (e: React.MouseEvent, article: Article) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan berita berhasil disalin!');
    }
  };

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
          const mapped: Article[] = result.data.map((art: any) => {
            return {
              id: art.id.toString(),
              title: art.judul,
              category: art.kategori as 'Kegiatan' | 'Prestasi' | 'Edukasi' | 'Pengumuman',
              date: art.tanggal,
              summary: art.isi,
              content: art.isi,
              image: art.foto ? getImageUrl(art.foto) : 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
              imageAlt: art.judul,
              author: art.uploader || 'Admin Sekolah',
              readTime: '3 menit',
              featured: true
            };
          });
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


        </div>

        {/* Category Filters */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredArticles.slice(0, 6).map((article) => (
            <article
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className={`group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-200/80 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1 ${
                article.category === 'Prestasi'
                  ? 'border-t-[3px] sm:border-t-4 border-t-[#F9A825]'
                  : article.category === 'Pengumuman'
                  ? 'border-t-[3px] sm:border-t-4 border-t-blue-600'
                  : 'border-t-[3px] sm:border-t-4 border-t-[#028C84]'
              }`}
            >
              <div>
                {/* Image & Badge */}
                <div className="relative h-44 sm:h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className={`absolute bottom-3 right-3 text-white px-2.5 py-1 rounded-full text-xs font-medium shadow-sm backdrop-blur-md ${
                      article.category === 'Prestasi'
                        ? 'bg-amber-500/90'
                        : article.category === 'Pengumuman'
                        ? 'bg-blue-600/90'
                        : 'bg-[#028C84]/90'
                    }`}
                  >
                    {article.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 space-y-2">
                  <h3 className="font-bold text-slate-800 text-base sm:text-lg leading-tight line-clamp-1 group-hover:text-[#028C84] transition-colors">
                    {article.title}
                  </h3>
                  {article.summary && (
                    <p 
                      className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: article.summary }}
                    />
                  )}
                </div>
              </div>

              {/* Footer Tanggal & Aksi Bagikan + Lihat Detail (Konsisten dengan Galeri) */}
              <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-teal-600 shrink-0" />
                  <span>{article.date}</span>
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => handleShare(e, article)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#028C84] transition-colors p-1 rounded hover:bg-slate-100 cursor-pointer"
                    title="Bagikan Berita"
                  >
                    <Share2 size={13} />
                    <span>Bagikan</span>
                  </button>
                  <span className="text-[11px] text-teal-600 font-semibold group-hover:underline">Baca Selengkapnya</span>
                </div>
              </div>
            </article>
          ))}
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