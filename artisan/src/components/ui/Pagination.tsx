// artisan/src/components/ui/Pagination.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl hover:bg-[#f0ebe4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-[#6b5e54]" />
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={cn(
            'min-w-[40px] h-10 rounded-xl font-medium transition-all duration-200',
            page === currentPage
              ? 'bg-gradient-to-r from-[#c2703e] to-[#daa520] text-white shadow-md'
              : 'hover:bg-[#f0ebe4] text-[#6b5e54]',
            page === '...' && 'cursor-default'
          )}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl hover:bg-[#f0ebe4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-[#6b5e54]" />
      </button>
    </div>
  );
}