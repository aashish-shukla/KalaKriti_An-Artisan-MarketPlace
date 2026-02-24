// artisan/src/components/layout/SearchBar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { productService } from '@/lib/api/services';
import type { Product } from '@/types';
import Image from 'next/image';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { useDebounce } from '@/lib/hooks/useDebounce';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await productService.searchProducts({ query: debouncedQuery, limit: 5 });
        const products = (response as any).data || [];
        setSuggestions(products.slice(0, 5));
        setIsOpen(true);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6b5e54]/60 w-4 h-4" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search handcrafted products..."
          className="w-full pl-11 pr-11 py-2.5 bg-[#f0ebe4]/50 border border-[#f0ebe4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e]/40 focus:bg-white text-sm placeholder:text-[#6b5e54]/50 transition-all duration-300"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6b5e54]/50 hover:text-[#6b5e54] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Search Suggestions Dropdown */}
      {isOpen && (query.length >= 2 || suggestions.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#f0ebe4] max-h-96 overflow-y-auto z-50 animate-fade-in-up" style={{ animationDuration: '0.15s' }}>
          {isLoading ? (
            <div className="p-4 text-center text-[#6b5e54]">Searching...</div>
          ) : suggestions.length > 0 ? (
            <>
              <div className="p-2">
                <p className="text-xs text-[#6b5e54] px-3 py-2 font-medium uppercase tracking-wider">Products</p>
                {suggestions.map((product) => (
                  <a
                    key={product._id}
                    href={`/products/${product.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-[#faf6f1] rounded-xl transition-colors"
                  >
                    <div className="relative w-12 h-12 flex-shrink-0 bg-[#f0ebe4] rounded-lg overflow-hidden">
                      <Image
                        src={getImageUrl(product.images[0]?.url)}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2d3436] truncate">{product.name}</p>
                      <p className="text-sm text-[#c2703e] font-semibold">{formatPrice(product.price)}</p>
                    </div>
                  </a>
                ))}
              </div>
              <div className="border-t border-[#f0ebe4] p-2">
                <button
                  onClick={() => {
                    router.push(`/products?q=${encodeURIComponent(query)}`);
                    setIsOpen(false);
                  }}
                  className="w-full text-center text-sm text-[#c2703e] font-medium py-2 hover:bg-[#faf6f1] rounded-xl transition-colors"
                >
                  View all results for &ldquo;{query}&rdquo;
                </button>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-[#6b5e54]">No products found</div>
          )}
        </div>
      )}
    </div>
  );
}