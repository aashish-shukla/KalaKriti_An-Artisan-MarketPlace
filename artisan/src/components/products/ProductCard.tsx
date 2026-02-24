// artisan/src/components/products/ProductCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice, getImageUrl, calculateDiscount } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/store/cartStore';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  onWishlistToggle?: (productId: string) => void;
  isInWishlist?: boolean;
}

export function ProductCard({ product, onWishlistToggle, isInWishlist }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const discount = calculateDiscount(product.price, product.compareAtPrice);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAddingToCart(true);
    try {
      await addItem(product, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onWishlistToggle?.(product._id);
  };

  return (
    <Link href={`/products/${product.slug || product._id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-[#f0ebe4]/80 transform hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#f0ebe4] to-[#faf6f1]">
          <Image
            src={getImageUrl(primaryImage?.url)}
            alt={primaryImage?.alt || product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.featured && (
              <span className="text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, #daa520 0%, #c2703e 100%)' }}>
                ✨ Featured
              </span>
            )}
            {discount > 0 && (
              <span className="bg-gradient-to-r from-[#c0392b] to-[#e74c3c] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                {discount}% OFF
              </span>
            )}
            {product.inventory?.stock === 0 && (
              <span className="bg-[#2d3436]/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                Out of Stock
              </span>
            )}
            {product.inventory?.stock > 0 && product.inventory?.stock <= product.inventory?.lowStockThreshold && (
              <span className="bg-[#e67e22]/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                Only {product.inventory.stock} left!
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
            <button
              onClick={handleWishlistToggle}
              className="p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Add to wishlist"
            >
              <Heart className={`w-4 h-4 transition-colors ${isInWishlist ? 'fill-[#c0392b] text-[#c0392b]' : 'text-[#6b5e54] hover:text-[#c0392b]'}`} />
            </button>
            {product.inventory?.stock > 0 && (
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="p-2.5 backdrop-blur-sm rounded-full shadow-lg hover:opacity-90 transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
                style={{ background: 'var(--gradient-primary)' }}
                aria-label="Quick add to cart"
              >
                <ShoppingCart className="w-4 h-4 text-white" />
              </button>
            )}
          </div>

          {/* Quick View on Hover */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-xl border border-[#f0ebe4]">
              <p className="text-xs text-[#6b5e54] line-clamp-2">{product.shortDescription || product.description}</p>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5">
          {/* Shop Name */}
          {typeof product.shop === 'object' && product.shop && (
            <p className="text-xs text-[#c2703e] font-medium mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c2703e]"></span>
              {product.shop.name}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-[#2d3436] mb-1.5 line-clamp-2 group-hover:text-[#c2703e] transition-colors duration-300">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${star <= Math.round(product.ratings?.average || 0)
                    ? 'fill-[#daa520] text-[#daa520]'
                    : 'text-[#f0ebe4]'
                    }`}
                />
              ))}
            </div>
            <span className="text-xs text-[#6b5e54]">
              ({product.ratings?.count || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-[#2d3436] group-hover:text-[#c2703e] transition-colors">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="text-sm text-[#6b5e54]/60 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
                <span className="text-xs font-semibold text-[#c0392b] bg-red-50 px-2 py-0.5 rounded-full">
                  Save {formatPrice(product.compareAtPrice - product.price)}
                </span>
              </>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={product.inventory?.stock === 0 || isAddingToCart}
            isLoading={isAddingToCart}
            className="w-full group/btn transition-all"
            size="md"
            variant={product.inventory?.stock === 0 ? 'secondary' : 'primary'}
          >
            <ShoppingCart className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
            {product.inventory?.stock === 0 ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </Link>
  );
}