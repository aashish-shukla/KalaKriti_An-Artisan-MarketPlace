// artisan/src/components/products/ProductDetail.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, ArrowLeft } from 'lucide-react';
import type { Product, Review } from '@/types';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import { useCartStore } from '@/lib/store/cartStore';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ProductDetailProps {
  product: Product;
  initialReviews: { data: Review[]; pagination: any };
}

export function ProductDetail({ product, initialReviews }: ProductDetailProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addItem(product, quantity);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    setIsAddingToCart(true);
    try {
      await addItem(product, quantity);
      router.push('/checkout');
    } catch (error) {
      toast.error('Failed to proceed to checkout');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const images = product.images?.length
    ? product.images.map(img => typeof img === 'string' ? img : img.url)
    : ['/placeholder-product.jpg'];

  const stock = product.stock ?? product.inventory.stock;

  return (
    <div className="min-h-screen bg-[#fdf8f4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-[#6b5e54] hover:text-[#c2703e] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#f0ebe4]">
          <div className="grid md:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#f0ebe4] to-[#faf6f1]">
                <Image
                  src={getImageUrl(images[selectedImage])}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square relative rounded-xl overflow-hidden transition-all duration-200 ${selectedImage === index ? 'ring-2 ring-[#c2703e] ring-offset-2' : 'hover:opacity-80'
                        }`}
                    >
                      <Image
                        src={getImageUrl(image)}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-[#2d3436] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                  {product.name}
                </h1>
                {typeof product.shop === 'object' && product.shop && (
                  <Link
                    href={`/shops/${product.shop.slug}`}
                    className="text-[#c2703e] hover:text-[#a85a30] font-medium transition-colors"
                  >
                    {product.shop.name}
                  </Link>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <Rating value={product.ratings?.average || 0} readonly />
                <span className="text-sm text-[#6b5e54]">
                  {product.ratings?.count || 0} reviews
                </span>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-[#2d3436]">
                    {formatPrice(product.price)}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-xl text-[#6b5e54]/60 line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                </div>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <Badge variant="success">
                    Save {Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                  </Badge>
                )}
              </div>

              {/* Stock Status */}
              <div>
                {stock > 0 ? (
                  <Badge variant="success">In Stock ({stock} available)</Badge>
                ) : (
                  <Badge variant="danger">Out of Stock</Badge>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-[#2d3436] mb-2">Description</h3>
                <p className="text-[#6b5e54] leading-relaxed">{product.description}</p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <label className="font-medium text-[#2d3436]">Quantity:</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium text-[#2d3436]">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                    disabled={quantity >= stock}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={stock === 0 || isAddingToCart}
                  className="flex-1"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={stock === 0 || isAddingToCart}
                  variant="secondary"
                  className="flex-1"
                >
                  Buy Now
                </Button>
              </div>

              {/* Additional Info */}
              <div className="border-t border-[#f0ebe4] pt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-[#6b5e54]">
                  <Truck className="w-5 h-5 text-[#c2703e]" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#6b5e54]">
                  <Shield className="w-5 h-5 text-[#c2703e]" />
                  <span>Secure payment & buyer protection</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-md p-6 lg:p-8 border border-[#f0ebe4]">
          <h2 className="text-2xl font-bold text-[#2d3436] mb-6" style={{ fontFamily: 'var(--font-serif)' }}>Customer Reviews</h2>

          {initialReviews.data.length > 0 ? (
            <div className="space-y-6">
              {initialReviews.data.map((review) => (
                <div key={review._id} className="border-b border-[#f0ebe4] pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-[#2d3436]">
                        {typeof review.user === 'object' && review.user
                          ? (review.user.name || `${review.user.firstName} ${review.user.lastName}`)
                          : 'Anonymous'}
                      </p>
                      <Rating value={review.rating} readonly size="sm" />
                    </div>
                    <span className="text-sm text-[#6b5e54]">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.title && (
                    <h4 className="font-medium text-[#2d3436] mb-1">{review.title}</h4>
                  )}
                  <p className="text-[#6b5e54]">{review.comment}</p>
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {review.images.map((image, index) => (
                        <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden">
                          <Image
                            src={getImageUrl(image)}
                            alt={`Review image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#6b5e54] text-center py-8">No reviews yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
