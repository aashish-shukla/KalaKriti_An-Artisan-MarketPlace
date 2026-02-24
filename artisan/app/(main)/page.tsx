// artisan/app/(main)/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { Testimonials, FeaturedShops, Newsletter } from '@/components/home';
import { ProductCardSkeleton, CategoryCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { productService, categoryService } from '@/lib/api/services';
import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, Star, ShoppingBag, Palette, Gift } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Product, Category } from '@/types';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [featuredRes, trendingRes, categoryRes] = await Promise.allSettled([
          productService.getProducts({ featured: true, limit: 4 }),
          productService.getProducts({ sort: '-sales.count', limit: 4 }),
          categoryService.getCategories(),
        ]);

        if (featuredRes.status === 'fulfilled') {
          const data = featuredRes.value;
          setFeatured(Array.isArray(data) ? data : (data as any).data || []);
        }
        if (trendingRes.status === 'fulfilled') {
          const data = trendingRes.value;
          setTrending(Array.isArray(data) ? data : (data as any).data || []);
        }
        if (categoryRes.status === 'fulfilled') {
          const data = categoryRes.value;
          setCategories(Array.isArray(data) ? data.slice(0, 6) : []);
        }
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const categoryIcons = [Palette, Gift, ShoppingBag, Star, Sparkles, TrendingUp];
  const categoryColors = [
    'from-[#c2703e] to-[#daa520]',
    'from-[#daa520] to-[#f0c75e]',
    'from-[#a85a30] to-[#c2703e]',
    'from-[#2d3436] to-[#6b5e54]',
    'from-[#c2703e] to-[#d4915f]',
    'from-[#daa520] to-[#c2703e]',
  ];

  return (
    <div className="min-h-screen">
      {/* ─── Hero Section ──────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[620px] flex items-center" style={{ background: 'var(--gradient-hero)' }}>
        {/* Decorative organic blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#c2703e]/10 animate-morph blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#daa520]/10 animate-morph blur-2xl" style={{ animationDelay: '4s' }} />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-[#c2703e]/5 animate-float blur-xl" style={{ animationDelay: '2s' }} />
          {/* Subtle dot pattern */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(218,165,32,0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8 border border-white/10">
              <Sparkles className="w-4 h-4 text-[#daa520]" />
              <span className="text-sm font-medium text-white/80 tracking-wide">Handcrafted with Passion</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white leading-[1.1]" style={{ fontFamily: 'var(--font-serif)' }}>
              Discover Unique{' '}
              <span className="relative inline-block">
                <span className="text-shimmer">KalaKriti</span>
              </span>{' '}
              Treasures
            </h1>
            <p className="text-xl sm:text-2xl mb-10 text-white/70 leading-relaxed max-w-2xl font-light">
              Support local artisans and find one-of-a-kind products made with passion, skill, and sustainable materials.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-white text-[#c2703e] hover:bg-[#faf6f1] shadow-xl hover:shadow-2xl transition-all duration-300 text-base font-semibold px-8 border-0">
                  Explore Products
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm text-base px-8">
                  Become a Seller
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {[
              { value: '2K+', label: 'Artisans' },
              { value: '10K+', label: 'Products' },
              { value: '50K+', label: 'Happy Buyers' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categories ────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[#2d3436]" style={{ fontFamily: 'var(--font-serif)' }}>Shop by Category</h2>
              <p className="text-[#6b5e54] mt-2">Browse our curated collections</p>
            </div>
            <Link href="/products" className="text-[#c2703e] hover:text-[#a85a30] font-medium flex items-center gap-1 group">
              View All
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {categories.length > 0 ? categories.map((category, index) => {
              const IconComponent = categoryIcons[index % categoryIcons.length];
              const colorClass = categoryColors[index % categoryColors.length];
              return (
                <Link
                  key={category._id}
                  href={`/products?category=${category._id}`}
                  className="group bg-gradient-to-br from-[#faf6f1] to-white rounded-2xl p-6 text-center card-hover border border-[#f0ebe4] animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-[#2d3436] group-hover:text-[#c2703e] transition-colors">{category.name}</h3>
                </Link>
              );
            }) : (
              ['Pottery', 'Jewelry', 'Textiles', 'Woodwork', 'Art', 'Gifts'].map((name, index) => {
                const IconComponent = categoryIcons[index];
                const colorClass = categoryColors[index];
                return (
                  <Link
                    key={name}
                    href={`/products`}
                    className="group bg-gradient-to-br from-[#faf6f1] to-white rounded-2xl p-6 text-center card-hover border border-[#f0ebe4] animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-[#2d3436] group-hover:text-[#c2703e] transition-colors">{name}</h3>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ─────────────────────────────── */}
      <section className="py-20 bg-[#faf6f1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-[#daa520] fill-[#daa520]" />
                <span className="text-sm font-semibold text-[#daa520] uppercase tracking-wider">Hand-picked</span>
              </div>
              <h2 className="text-3xl font-bold text-[#2d3436]" style={{ fontFamily: 'var(--font-serif)' }}>Featured Products</h2>
            </div>
            <Link href="/products?featured=true" className="text-[#c2703e] hover:text-[#a85a30] font-medium flex items-center gap-1 group">
              View All
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="aspect-square animate-shimmer" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 animate-shimmer rounded w-3/4" />
                    <div className="h-4 animate-shimmer rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#6b5e54]">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-[#f0ebe4]" />
              <p>No featured products available yet</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── Trending Now ──────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-[#2d9f6f]" />
                <span className="text-sm font-semibold text-[#2d9f6f] uppercase tracking-wider">Popular</span>
              </div>
              <h2 className="text-3xl font-bold text-[#2d3436]" style={{ fontFamily: 'var(--font-serif)' }}>Trending Now</h2>
            </div>
            <Link href="/products?sort=-sales.count" className="text-[#c2703e] hover:text-[#a85a30] font-medium flex items-center gap-1 group">
              View All
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          {!isLoading && trending.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trending.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : !isLoading ? (
            <div className="text-center py-12 text-[#6b5e54]">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-[#f0ebe4]" />
              <p>No trending products available yet</p>
            </div>
          ) : null}
        </div>
      </section>

      {/* ─── Featured Shops ────────────────────────────────── */}
      <FeaturedShops />

      {/* ─── Testimonials ──────────────────────────────────── */}
      <Testimonials />

      {/* ─── Newsletter ────────────────────────────────────── */}
      <Newsletter />

      {/* ─── CTA Section ───────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden" style={{ background: 'var(--gradient-dark)' }}>
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#c2703e]/10 blur-3xl animate-morph" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[#daa520]/10 blur-3xl animate-morph" style={{ animationDelay: '5s' }} />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(rgba(218,165,32,0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 mb-6 border border-white/10">
                <Sparkles className="w-4 h-4 text-[#daa520]" />
                <span className="text-sm font-medium text-white/80 tracking-wide">For Artisans</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                Start Your KalaKriti Journey
              </h2>
              <p className="text-xl mb-8 text-white/60 leading-relaxed font-light">
                Join thousands of artisans selling their unique creations to buyers worldwide. Set up your shop in minutes and start earning today.
              </p>
              <ul className="space-y-4 mb-8">
                {['Easy setup in 5 minutes', 'Low commission fees', 'Dedicated seller support', 'Global marketplace reach'].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-white/70">
                    <div className="w-6 h-6 rounded-full bg-[#2d9f6f]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#2d9f6f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button size="lg" className="bg-white text-[#c2703e] hover:bg-[#faf6f1] shadow-xl text-base font-semibold px-10 border-0">
                  Open Your Shop Today
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Right side - Stats */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '2,500+', label: 'Active Sellers' },
                { value: '50K+', label: 'Happy Customers' },
                { value: '$2M+', label: 'Total Sales' },
                { value: '4.9/5', label: 'Average Rating' },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-[#c2703e]/20 transition-all duration-300"
                  style={{
                    animation: 'fadeInUp 0.6s ease-out',
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'both',
                  }}
                >
                  <p className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-serif)' }}>{stat.value}</p>
                  <p className="text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}