import React, { useState, useEffect, useMemo } from 'react';
import { Tag, Calendar, Share2, Search, ArrowUpDown, X } from 'lucide-react';
import { NEWS_ARTICLES } from '../data/schoolData';
import { Article } from '../types';
import { NewsDetailModal } from './NewsDetailModal';
import { Pagination } from './common/Pagination';
import { getApiBaseUrl, getImageUrl } from '../config/api';
import { useHomepageConfig } from '../hooks/useHomepageConfig';

interface NewsSectionProps {
  onViewAllClick?: () => void;
}

let cachedArticles: Article[] | null = null;
const ITEMS_PER_PAGE = 6;

export const NewsSection: React.FC<NewsSectionProps> = () => {
  const [articles, setArticles] = useState<Article[]>(cachedArticles || []);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'terbaru' | 'terlama'>('terbaru');
  const [currentPage, setCurrentPage] = useState<number>(1);
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

  // Filter & Search & Sort
  const filteredAndSortedArticles = useMemo(() => {
    let result = articles;

    // Filter Kategori
    if (selectedCategory !== 'Semua') {
      result = result.filter((a) => a.category === selectedCategory);
    }

    // Filter Pencarian
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.summary && a.summary.toLowerCase().includes(q)) ||
          (a.author && a.author.toLowerCase().includes(q))
      );
    }

    // Pengurutan Tanggal & ID
    return [...result].sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      if (sortOrder === 'terlama') {
        return dateA - dateB;
      }
      return dateB - dateA;
    });
  }, [articles, selectedCategory, searchTerm, sortOrder]);

  // Reset pagination on filter / search / sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortOrder]);

  // Adjust page if current page exceeds max page
  useEffect(() => {
    const maxPage = Math.ceil(filteredAndSortedArticles.length / ITEMS_PER_PAGE) || 1;
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [filteredAndSortedArticles.length, currentPage]);

  // Paginated Slice
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedArticles, currentPage]);

  const newsSection = homepageConfig.sections.find(s => s.key === 'berita');
  const sectionTitle = newsSection ? newsSection.judul : 'Berita & Informasi Terkini';
  const sectionSubtitle = newsSection ? newsSection.subjudul : 'Ikuti update terbaru seputar kegiatan, kejuaraan, dan pengumuman sekolah';

  return (
    <section id="news-section" className="w-full bg-white py-10 sm:py-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div>
            <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[#028C84] font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-1 sm:mb-2 bg-teal-50/80 border border-teal-200/80 px-2.5 py-1 sm:px-0 sm:py-0 sm:bg-transparent sm:border-0 rounded-full">
              <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Kabar &amp; Pengumuman Sekolah
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[black] leading-tight">
              {sectionTitle}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base mt-1.5 sm:mt-2">
              {sectionSubtitle}
            </p>
          </div>
        </div>

        {/* Filter, Search, and Sort Toolbar */}
        <div className="bg-slate-50/80 p-3 sm:p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-4 shadow-sm">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berita atau pengumuman..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-xs sm:text-sm text-slate-700 placeholder-slate-400 shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                title="Hapus pencarian"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort Order Selector */}
          <div className="flex items-center justify-between sm:justify-start gap-2 self-stretch md:self-center">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium shrink-0">
              <ArrowUpDown size={14} className="text-teal-600" />
              <span>Urutan:</span>
            </div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'terbaru' | 'terlama')}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer shadow-sm flex-1 sm:flex-none"
            >
              <option value="terbaru">Terbaru Dahulu</option>
              <option value="terlama">Terlama Dahulu</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold transition-all cursor-pointer ${
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
          {paginatedArticles.map((article) => (
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
                    loading="lazy"
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
                      className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed break-words"
                      dangerouslySetInnerHTML={{ __html: article.summary }}
                    />
                  )}
                </div>
              </div>

              {/* Footer Tanggal & Aksi Bagikan + Lihat Detail */}
              <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-slate-50 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 shrink-0">
                  <Calendar size={13} className="text-teal-600 shrink-0" />
                  <span className="text-[11px] sm:text-xs">{article.date}</span>
                </span>
                <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
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

        {/* Empty state */}
        {filteredAndSortedArticles.length === 0 && (
          <div className="bg-slate-50 p-8 sm:p-12 rounded-3xl text-center border border-slate-100 space-y-2">
            <p className="text-slate-600 font-semibold text-base">Tidak ada berita yang ditemukan</p>
            <p className="text-slate-400 text-xs sm:text-sm">Coba ubah kata kunci pencarian atau kategori filter.</p>
          </div>
        )}

        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredAndSortedArticles.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={(page) => {
            setCurrentPage(page);
            const el = document.getElementById('news-section');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        />

      </div>

      {/* Modal View */}
      <NewsDetailModal
        article={activeArticle}
        onClose={() => setActiveArticle(null)}
      />
    </section>
  );
};
