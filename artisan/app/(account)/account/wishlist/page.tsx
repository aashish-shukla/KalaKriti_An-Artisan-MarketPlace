// artisan/app/(account)/account/wishlist/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { userService } from '@/lib/api/services';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/types';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await userService.getWishlist();
      setProducts(response.wishlist || []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await userService.removeFromWishlist(productId);
      setProducts(products.filter((p) => p._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-600">Save your favorite items for later</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onWishlistToggle={handleRemoveFromWishlist}
            isInWishlist={true}
          />
        ))}
      </div>
    </div>
  );
}