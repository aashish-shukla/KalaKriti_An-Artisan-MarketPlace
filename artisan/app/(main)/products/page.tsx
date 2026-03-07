// artisan/app/(main)/products/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/products/ProductCard';
import { Pagination } from '@/components/ui/Pagination';
import { Dropdown } from '@/components/ui/Dropdown';
import { productService, categoryService } from '@/lib/api/services';
import type { Product, Category, SearchFilters } from '@/types';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'relevance',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await productService.searchProducts(filters);
      setProducts((response as any).data || []);
      if ((response as any).pagination) {
        setPagination((response as any).pagination);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      // Ensure we always get an array
      const cats = Array.isArray(response) ? response : [];
      setCategories(cats);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handleClearFilters = () => {
    setFilters({
      query: '',
      sortBy: 'relevance',
      page: 1,
    });
  };

  const sortOptions = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'Most Popular', value: 'popular' },
    { label: 'Newest', value: 'newest' },
  ];

  return (
    <div className="min-h-screen bg-[#fdf8f4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2d3436] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            {filters.query ? `Results for "${filters.query}"` : 'All Products'}
          </h1>
          <p className="text-[#6b5e54]">
            {pagination.total} {pagination.total === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#f0ebe4] bg-white rounded-xl hover:border-[#c2703e]/30 transition-all md:hidden"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#6b5e54]" />
            <span className="text-[#2d3436] text-sm font-medium">Filters</span>
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <Dropdown
              options={sortOptions}
              value={filters.sortBy}
              onChange={(value) => handleFilterChange('sortBy', value)}
              placeholder="Sort by"
              className="w-48"
            />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-2xl p-6 sticky top-20 shadow-sm border border-[#f0ebe4]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[#2d3436]">Filters</h3>
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-[#c2703e] hover:text-[#a85a30] font-medium"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-[#2d3436] mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#f0ebe4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e] bg-white text-sm transition-all"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-[#2d3436] mb-2">
                    Price Range
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice || ''}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2.5 border border-[#f0ebe4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e] text-sm transition-all"
                    />
                    <span className="text-[#6b5e54]">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2.5 border border-[#f0ebe4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e] text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-[#2d3436] mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating || ''}
                    onChange={(e) => handleFilterChange('rating', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-4 py-2.5 border border-[#f0ebe4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e] bg-white text-sm transition-all"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4★ & above</option>
                    <option value="3">3★ & above</option>
                    <option value="2">2★ & above</option>
                    <option value="1">1★ & above</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#f0ebe4]">
                    <div className="aspect-square animate-shimmer" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 animate-shimmer rounded w-3/4" />
                      <div className="h-4 animate-shimmer rounded w-1/2" />
                      <div className="h-10 animate-shimmer rounded mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-10">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.pages}
                      onPageChange={(page) => handleFilterChange('page', page)}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl p-16 text-center border border-[#f0ebe4]">
                <Search className="w-16 h-16 text-[#f0ebe4] mx-auto mb-4" />
                <p className="text-[#6b5e54] text-lg mb-2">No products found</p>
                <p className="text-[#6b5e54]/70 text-sm mb-6">Try adjusting your search or filter criteria</p>
                <Button onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}