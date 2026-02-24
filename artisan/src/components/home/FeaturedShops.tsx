// artisan/src/components/home/FeaturedShops.tsx
'use client';

import Link from 'next/link';
import { Star, MapPin, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const featuredShops = [
  {
    id: '1',
    name: 'Ceramic Dreams',
    owner: 'Maria Santos',
    description: 'Handcrafted pottery and ceramic art inspired by nature',
    rating: 4.9,
    reviews: 245,
    products: 87,
    location: 'Portland, OR',
    logo: 'CD',
    gradient: 'from-[#c2703e] via-[#d4915f] to-[#daa520]',
  },
  {
    id: '2',
    name: 'Woodwork Wonders',
    owner: 'James Miller',
    description: 'Sustainable wooden furniture and home decor',
    rating: 4.8,
    reviews: 189,
    products: 54,
    location: 'Austin, TX',
    logo: 'WW',
    gradient: 'from-[#2d3436] via-[#6b5e54] to-[#a85a30]',
  },
  {
    id: '3',
    name: 'Artisan Threads',
    owner: 'Lisa Chen',
    description: 'Hand-woven textiles and unique fabric designs',
    rating: 5.0,
    reviews: 302,
    products: 126,
    location: 'Seattle, WA',
    logo: 'AT',
    gradient: 'from-[#daa520] via-[#c2703e] to-[#a85a30]',
  },
];

export function FeaturedShops() {
  return (
    <section className="py-20 bg-[#faf6f1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#c2703e]/10 rounded-full px-4 py-2 mb-4">
              <Package className="w-4 h-4 text-[#c2703e]" />
              <span className="text-sm font-semibold text-[#c2703e] uppercase tracking-wider">Featured Shops</span>
            </div>
            <h2 className="text-4xl font-bold text-[#2d3436] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
              Meet Our Top Artisans
            </h2>
            <p className="text-lg text-[#6b5e54]">
              Discover talented creators and their amazing collections
            </p>
          </div>
          <Link href="/shops" className="hidden md:block">
            <Button variant="outline">
              View All Shops
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Shops Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredShops.map((shop, index) => (
            <Link
              key={shop.id}
              href={`/shops/${shop.id}`}
              className="group block"
              style={{
                animation: 'fadeInUp 0.6s ease-out',
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both',
              }}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-[#f0ebe4] transform hover:-translate-y-2">
                {/* Banner */}
                <div className={`relative h-32 bg-gradient-to-br ${shop.gradient}`}>
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                  {/* Logo */}
                  <div className="absolute -bottom-8 left-6">
                    <div className="w-16 h-16 rounded-xl bg-white shadow-lg flex items-center justify-center border-4 border-white">
                      <span className="text-xl font-bold gradient-text">
                        {shop.logo}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-12 px-6 pb-6">
                  <h3 className="text-xl font-bold text-[#2d3436] mb-1 group-hover:text-[#c2703e] transition-colors">
                    {shop.name}
                  </h3>
                  <p className="text-sm text-[#6b5e54] mb-3">by {shop.owner}</p>
                  <p className="text-sm text-[#6b5e54] mb-4 line-clamp-2">
                    {shop.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#daa520] fill-[#daa520]" />
                      <span className="font-semibold text-[#2d3436]">{shop.rating}</span>
                      <span className="text-[#6b5e54]">({shop.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#6b5e54]">
                      <Package className="w-4 h-4" />
                      <span>{shop.products} items</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-sm text-[#6b5e54]">
                    <MapPin className="w-4 h-4" />
                    <span>{shop.location}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="md:hidden mt-8 text-center">
          <Link href="/shops">
            <Button variant="outline" size="lg">
              View All Shops
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
