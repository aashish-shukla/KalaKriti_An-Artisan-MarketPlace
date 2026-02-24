// artisan/app/(main)/checkout/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import { orderService } from '@/lib/api/services';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CreditCard, Banknote, Lock, Shield, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash_on_delivery'>('card');

  const subtotal = getTotal();
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod,
      };

      const response = await orderService.createOrder(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/account/orders/${response.order._id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f4] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#2d3436] mb-8" style={{ fontFamily: 'var(--font-serif)' }}>Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0ebe4]">
                <h2 className="text-xl font-bold text-[#2d3436] mb-6 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#c2703e]" />
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={shippingAddress.firstName}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Last Name"
                    value={shippingAddress.lastName}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, email: e.target.value })
                    }
                    required
                    className="md:col-span-2"
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, phone: e.target.value })
                    }
                    required
                    className="md:col-span-2"
                  />
                  <Input
                    label="Street Address"
                    value={shippingAddress.street}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, street: e.target.value })
                    }
                    required
                    className="md:col-span-2"
                  />
                  <Input
                    label="City"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, city: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="State"
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, state: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="ZIP Code"
                    value={shippingAddress.zipCode}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, zipCode: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Country"
                    value={shippingAddress.country}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, country: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0ebe4]">
                <h2 className="text-xl font-bold text-[#2d3436] mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#c2703e]" />
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all duration-300 ${paymentMethod === 'card'
                      ? 'border-[#c2703e] bg-[#c2703e]/5'
                      : 'border-[#f0ebe4] hover:border-[#c2703e]/30'
                      }`}
                  >
                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-[#c2703e]' : 'text-[#6b5e54]'}`} />
                    <div className="text-left flex-1">
                      <p className={`font-medium ${paymentMethod === 'card' ? 'text-[#c2703e]' : 'text-[#2d3436]'}`}>
                        Credit/Debit Card
                      </p>
                      <p className="text-sm text-[#6b5e54]">Pay securely with your card</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all duration-300 ${paymentMethod === 'cash_on_delivery'
                      ? 'border-[#c2703e] bg-[#c2703e]/5'
                      : 'border-[#f0ebe4] hover:border-[#c2703e]/30'
                      }`}
                  >
                    <Banknote className={`w-6 h-6 ${paymentMethod === 'cash_on_delivery' ? 'text-[#c2703e]' : 'text-[#6b5e54]'}`} />
                    <div className="text-left flex-1">
                      <p className={`font-medium ${paymentMethod === 'cash_on_delivery' ? 'text-[#c2703e]' : 'text-[#2d3436]'}`}>
                        Cash on Delivery
                      </p>
                      <p className="text-sm text-[#6b5e54]">Pay when you receive</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-md sticky top-20 border border-[#f0ebe4]">
                <h2 className="text-xl font-bold text-[#2d3436] mb-6" style={{ fontFamily: 'var(--font-serif)' }}>Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={item.product._id} className="flex gap-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#f0ebe4] to-[#faf6f1] rounded-xl flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#2d3436] line-clamp-2">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-[#6b5e54]">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-[#2d3436]">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#f0ebe4] pt-4 space-y-3 mb-6">
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
                  <div className="border-t border-[#f0ebe4] pt-4">
                    <div className="flex justify-between text-lg font-bold text-[#2d3436]">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                  <Lock className="w-5 h-5" />
                  Place Order
                </Button>

                <div className="flex items-center gap-2 justify-center mt-4">
                  <Shield className="w-4 h-4 text-[#6b5e54]" />
                  <p className="text-xs text-[#6b5e54]">
                    Secure checkout • Buyer protection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}