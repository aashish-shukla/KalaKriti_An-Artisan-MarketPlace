// artisan/app/(main)/cart/page.tsx
'use client';

import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal, isLoading } = useCartStore();

  const subtotal = getTotal();
  const shipping = subtotal > 0 ? (subtotal >= 50 ? 0 : 5.99) : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fdf8f4] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-md p-16 text-center border border-[#f0ebe4]">
            <ShoppingBag className="w-20 h-20 text-[#f0ebe4] mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[#2d3436] mb-3" style={{ fontFamily: 'var(--font-serif)' }}>Your cart is empty</h2>
            <p className="text-[#6b5e54] mb-8 max-w-md mx-auto">Discover unique handcrafted items and add them to your cart</p>
            <Link href="/products">
              <Button size="lg">
                Continue Shopping
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f4] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#2d3436] mb-8" style={{ fontFamily: 'var(--font-serif)' }}>Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product._id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0ebe4] hover:shadow-md transition-shadow">
                <div className="flex gap-5">
                  {/* Product Image */}
                  <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#f0ebe4] to-[#faf6f1] rounded-xl overflow-hidden">
                      <Image
                        src={getImageUrl(item.product.images[0]?.url)}
                        alt={item.product.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-semibold text-[#2d3436] hover:text-[#c2703e] line-clamp-2 transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    {typeof item.product.shop === 'object' && (
                      <p className="text-sm text-[#6b5e54] mt-1">{item.product.shop.name}</p>
                    )}
                    <p className="text-lg font-bold text-[#c2703e] mt-2">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.product._id)}
                      disabled={isLoading}
                      className="text-[#6b5e54]/50 hover:text-[#c0392b] transition-colors p-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        disabled={isLoading || item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center border border-[#f0ebe4] rounded-lg hover:bg-[#faf6f1] hover:border-[#c2703e]/30 disabled:opacity-50 transition-all"
                      >
                        <Minus className="w-4 h-4 text-[#6b5e54]" />
                      </button>
                      <span className="w-12 text-center font-medium text-[#2d3436]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        disabled={isLoading || item.quantity >= item.product.inventory.stock}
                        className="w-8 h-8 flex items-center justify-center border border-[#f0ebe4] rounded-lg hover:bg-[#faf6f1] hover:border-[#c2703e]/30 disabled:opacity-50 transition-all"
                      >
                        <Plus className="w-4 h-4 text-[#6b5e54]" />
                      </button>
                    </div>

                    <p className="text-lg font-bold text-[#2d3436]">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md sticky top-20 border border-[#f0ebe4]">
              <h2 className="text-xl font-bold text-[#2d3436] mb-6" style={{ fontFamily: 'var(--font-serif)' }}>Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[#6b5e54]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#2d3436]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#6b5e54]">
                  <span>Shipping</span>
                  <span className="font-medium text-[#2d3436]">
                    {shipping === 0 ? <span className="text-[#2d9f6f] font-semibold">FREE</span> : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-[#6b5e54]">
                  <span>Tax</span>
                  <span className="font-medium text-[#2d3436]">{formatPrice(tax)}</span>
                </div>
                {subtotal > 0 && subtotal < 50 && (
                  <div className="flex items-center gap-2 bg-[#c2703e]/5 rounded-xl p-3">
                    <Truck className="w-4 h-4 text-[#c2703e]" />
                    <p className="text-sm text-[#c2703e] font-medium">
                      Add {formatPrice(50 - subtotal)} more for free shipping!
                    </p>
                  </div>
                )}
                <div className="border-t border-[#f0ebe4] pt-4">
                  <div className="flex justify-between text-lg font-bold text-[#2d3436]">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => router.push('/checkout')}
                className="w-full mb-3"
                size="lg"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Button>

              <Link href="/products">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}