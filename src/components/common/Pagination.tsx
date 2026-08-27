import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = '',
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalItems <= itemsPerPage || totalPages <= 1) {
    return (
      <div className={`flex justify-center items-center text-xs text-slate-500 py-3 ${className}`}>
        Menampilkan {totalItems} dari {totalItems} data
      </div>
    );
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 ${className}`}>
      {/* Info data */}
      <div className="text-xs sm:text-sm text-slate-500 font-medium order-2 sm:order-1 text-center sm:text-left">
        Menampilkan <span className="font-semibold text-slate-800">{startItem}–{endItem}</span> dari{' '}
        <span className="font-semibold text-slate-800">{totalItems}</span> data
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5 order-1 sm:order-2 flex-wrap justify-center">
        {/* Tombol Halaman Pertama (Jika lebih dari 4 halaman) */}
        {totalPages > 4 && (
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={`p-1.5 sm:p-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center ${
              currentPage === 1
                ? 'text-slate-300 cursor-not-allowed bg-slate-50 border border-slate-100'
                : 'text-slate-700 bg-white hover:bg-teal-50 hover:text-[#028C84] border border-slate-200 shadow-sm cursor-pointer'
            }`}
            title="Halaman Pertama"
            aria-label="First page"
          >
            <ChevronsLeft size={16} />
          </button>
        )}

        {/* Tombol Sebelumnya */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            currentPage === 1
              ? 'text-slate-300 cursor-not-allowed bg-slate-50 border border-slate-100'
              : 'text-slate-700 bg-white hover:bg-teal-50 hover:text-[#028C84] border border-slate-200 shadow-sm cursor-pointer'
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>

        {/* Nomor Halaman */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-xs text-slate-400 font-bold select-none">
                  ...
                </span>
              );
            }

            const pageNum = Number(page);
            const isActive = currentPage === pageNum;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[34px] sm:min-w-[38px] h-[34px] sm:h-[38px] px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#028C84] to-[#156B63] text-white shadow-md shadow-teal-700/20'
                    : 'text-slate-700 bg-white hover:bg-teal-50 hover:text-[#028C84] border border-slate-200 shadow-sm'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Tombol Berikutnya */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            currentPage === totalPages
              ? 'text-slate-300 cursor-not-allowed bg-slate-50 border border-slate-100'
              : 'text-slate-700 bg-white hover:bg-teal-50 hover:text-[#028C84] border border-slate-200 shadow-sm cursor-pointer'
          }`}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Berikutnya</span>
          <ChevronRight size={16} />
        </button>

        {/* Tombol Halaman Terakhir (Jika lebih dari 4 halaman) */}
        {totalPages > 4 && (
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`p-1.5 sm:p-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center ${
              currentPage === totalPages
                ? 'text-slate-300 cursor-not-allowed bg-slate-50 border border-slate-100'
                : 'text-slate-700 bg-white hover:bg-teal-50 hover:text-[#028C84] border border-slate-200 shadow-sm cursor-pointer'
            }`}
            title="Halaman Terakhir"
            aria-label="Last page"
          >
            <ChevronsRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
