// artisan/app/(account)/account/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { orderService } from '@/lib/api/services';
import type { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    const variants: Record<string, any> = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'info',
      shipped: 'info',
      delivered: 'success',
      cancelled: 'danger',
    };
    return variants[status] || 'default';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-shimmer rounded-lg" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#f0ebe4] p-6">
            <div className="space-y-3">
              <div className="h-4 w-32 animate-shimmer rounded" />
              <div className="h-4 w-48 animate-shimmer rounded" />
              <div className="h-12 animate-shimmer rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-[#f0ebe4]">
        <Package className="w-16 h-16 text-[#f0ebe4] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#2d3436] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>No orders yet</h2>
        <p className="text-[#6b5e54] mb-6">Start shopping to see your orders here</p>
        <Link href="/products" className="inline-flex items-center gap-2 text-[#c2703e] hover:text-[#a85a30] font-medium transition-colors">
          Browse Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[#2d3436] mb-6" style={{ fontFamily: 'var(--font-serif)' }}>My Orders</h1>

      {orders.map((order) => (
        <Link
          key={order._id}
          href={`/account/orders/${order._id}`}
          className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-[#f0ebe4] hover:border-[#c2703e]/20 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-[#c2703e]">Order #{order.orderNumber}</p>
              <p className="text-sm text-[#6b5e54]">{formatDate(order.createdAt)}</p>
            </div>
            <Badge variant={getStatusVariant(order.status)}>
              {order.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          <div className="space-y-2 mb-4">
            {order.items.slice(0, 2).map((item) => (
              <div key={item._id} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f0ebe4] to-[#faf6f1] rounded-xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2d3436] line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-xs text-[#6b5e54]">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-[#2d3436]">
                  {formatPrice(item.total)}
                </p>
              </div>
            ))}
            {order.items.length > 2 && (
              <p className="text-sm text-[#6b5e54] ml-15">
                +{order.items.length - 2} more items
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#f0ebe4]">
            <p className="text-sm text-[#6b5e54]">
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
            </p>
            <div className="flex items-center gap-3">
              <p className="text-lg font-bold text-[#2d3436]">
                {formatPrice(order.pricing.total)}
              </p>
              <ArrowRight className="w-4 h-4 text-[#6b5e54] group-hover:text-[#c2703e] transition-colors" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}