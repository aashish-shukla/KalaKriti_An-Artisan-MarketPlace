// artisan/app/(seller)/seller/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, ShoppingBag, Package, TrendingUp, Eye, Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';

// Mock data - replace with actual API calls
const mockStats = {
  totalRevenue: 12543.50,
  totalOrders: 143,
  activeProducts: 28,
  averageRating: 4.7,
  totalViews: 5420,
  conversionRate: 2.6,
};

const mockRevenueData = [
  { date: '2/1', revenue: 420 },
  { date: '2/2', revenue: 380 },
  { date: '2/3', revenue: 560 },
  { date: '2/4', revenue: 430 },
  { date: '2/5', revenue: 670 },
  { date: '2/6', revenue: 520 },
  { date: '2/7', revenue: 750 },
];

const mockTopProducts = [
  { name: 'Handcrafted Ceramic Bowl', sold: 45, revenue: 1350 },
  { name: 'Leather Wallet', sold: 38, revenue: 1140 },
  { name: 'Wooden Cutting Board', sold: 32, revenue: 640 },
  { name: 'Knitted Scarf', sold: 28, revenue: 840 },
];

export default function SellerDashboardPage() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your shop.</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <Badge variant="success">+12.5%</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(mockStats.totalRevenue)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
            <Badge variant="success">+8.3%</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{mockStats.totalOrders}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <Badge>Active</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">Active Products</p>
          <p className="text-2xl font-bold text-gray-900">{mockStats.activeProducts}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Average Rating</p>
          <p className="text-2xl font-bold text-gray-900">{mockStats.averageRating} ★</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Views</p>
          <p className="text-2xl font-bold text-gray-900">{mockStats.totalViews.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <Badge variant="success">+2.1%</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
          <p className="text-2xl font-bold text-gray-900">{mockStats.conversionRate}%</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => formatPrice(Number(value))} />
            <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Top Selling Products</h2>
        <div className="space-y-4">
          {mockTopProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg" />
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sold} sold</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{formatPrice(product.revenue)}</p>
                <p className="text-sm text-gray-500">Revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Product</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">#ORD-{1000 + i}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">John Doe</td>
                  <td className="py-3 px-4 text-sm text-gray-600">Ceramic Bowl</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{formatPrice(29.99)}</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Delivered</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}