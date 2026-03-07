// artisan/app/(seller)/seller/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { IndianRupee, ShoppingBag, Package, TrendingUp, Eye, Star, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/authStore';
import { shopService, orderService, productService } from '@/lib/api/services';
import type { Order, Product } from '@/types';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeProducts: number;
  averageRating: number;
  totalViews: number;
}

export default function SellerDashboardPage() {
  const { user } = useAuthStore();
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    activeProducts: 0,
    averageRating: 0,
    totalViews: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);

  const shopId = typeof user?.shop === 'object' ? user?.shop?._id : user?.shop;

  useEffect(() => {
    if (shopId) {
      fetchDashboardData();
    }
  }, [shopId]);

  const fetchDashboardData = async () => {
    if (!shopId) return;

    setIsLoading(true);
    setError(null);
    try {
      // Fetch analytics, products, and orders in parallel
      const [analyticsRes, productsRes, ordersRes] = await Promise.allSettled([
        shopService.getShopAnalytics(shopId),
        productService.getProducts({ shop: shopId, limit: 10 }),
        orderService.getOrders({ limit: 10 }),
      ]);

      // Process analytics
      if (analyticsRes.status === 'fulfilled') {
        const analytics = (analyticsRes.value as any).analytics;
        setStats({
          totalRevenue: analytics?.stats?.totalRevenue || 0,
          totalOrders: analytics?.stats?.totalOrders || 0,
          activeProducts: analytics?.products?.active || 0,
          averageRating: analytics?.ratings?.average || 0,
          totalViews: analytics?.totalViews || 0,
        });
      }

      // Process products (top selling)
      if (productsRes.status === 'fulfilled') {
        const products = (productsRes.value as any).data || [];
        // Sort by sales count to get top sellers
        const sorted = [...products].sort(
          (a: Product, b: Product) => (b.sales?.count || 0) - (a.sales?.count || 0)
        );
        setTopProducts(sorted.slice(0, 4));
      }

      // Process orders
      if (ordersRes.status === 'fulfilled') {
        const orders = (ordersRes.value as any).data || [];
        setRecentOrders(orders.slice(0, 5));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    const variants: Record<string, any> = {
      pending: 'warning',
      confirmed: 'default',
      processing: 'default',
      shipped: 'default',
      delivered: 'success',
      cancelled: 'danger',
    };
    return variants[status] || 'default';
  };

  if (!shopId) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Shop Found</h2>
          <p className="text-gray-600">You need to create a shop before accessing the dashboard.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Loading your shop data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your shop.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <Badge>Active</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">Active Products</p>
          <p className="text-2xl font-bold text-gray-900">{stats.activeProducts}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Average Rating</p>
          <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)} ★</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Views</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Top Selling Products</h2>
        {topProducts.length > 0 ? (
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product._id || index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm font-medium">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales?.count || 0} sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatPrice(product.sales?.revenue || 0)}</p>
                  <p className="text-sm text-gray-500">{formatPrice(product.price)} each</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <Package className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p>No products yet. Start adding products to see stats here.</p>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Orders</h2>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Items</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900 font-mono">
                      {order.orderNumber || `#${order._id.slice(-6).toUpperCase()}`}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {formatPrice(order.pricing?.total || 0)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p>No orders yet. When customers place orders, they'll appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}