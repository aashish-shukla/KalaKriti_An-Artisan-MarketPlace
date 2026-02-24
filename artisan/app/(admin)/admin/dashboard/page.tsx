// artisan/app/(admin)/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Users, Store, Package, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, formatDate } from '@/lib/utils';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data
const mockStats = {
  totalUsers: 4523,
  totalShops: 342,
  totalProducts: 8234,
  totalOrders: 12456,
  totalRevenue: 234567.89,
  platformFee: 18456.23,
};

const mockGrowthData = [
  { month: 'Jan', users: 320, shops: 25, orders: 850 },
  { month: 'Feb', users: 420, shops: 32, orders: 1120 },
  { month: 'Mar', users: 580, shops: 45, orders: 1450 },
  { month: 'Apr', users: 720, shops: 58, orders: 1780 },
  { month: 'May', users: 880, shops: 72, orders: 2100 },
];

const mockPendingShops = [
  { id: 1, name: 'Artisan Pottery Studio', owner: 'Jane Smith', date: '2026-02-15' },
  { id: 2, name: 'Handmade Jewelry Co', owner: 'Mike Johnson', date: '2026-02-16' },
  { id: 3, name: 'Wooden Crafts', owner: 'Sarah Williams', date: '2026-02-17' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of platform performance and metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <Badge variant="success">+15.3%</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{mockStats.totalUsers.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-purple-600" />
            </div>
            <Badge variant="success">+8.7%</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">Active Shops</p>
          <p className="text-2xl font-bold text-gray-900">{mockStats.totalShops}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-indigo-600" />
            </div>
            <Badge variant="success">+12.1%</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Products</p>
          <p className="text-2xl font-bold text-gray-900">{mockStats.totalProducts.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
            <Badge variant="success">+18.5%</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{mockStats.totalOrders.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <Badge variant="success">+22.3%</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(mockStats.totalRevenue)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Platform Fees</p>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(mockStats.platformFee)}</p>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Platform Growth</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockGrowthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} name="Users" />
            <Line type="monotone" dataKey="shops" stroke="#8B5CF6" strokeWidth={2} name="Shops" />
            <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2} name="Orders" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pending Shop Approvals */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Pending Shop Approvals</h2>
          <Badge variant="warning">{mockPendingShops.length}</Badge>
        </div>
        <div className="space-y-3">
          {mockPendingShops.map((shop) => (
            <div key={shop.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{shop.name}</p>
                <p className="text-sm text-gray-500">Owner: {shop.owner}</p>
                <p className="text-xs text-gray-400">Submitted: {formatDate(shop.date)}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Approve
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Users</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">U{i}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">User {i}</p>
                  <p className="text-sm text-gray-500">user{i}@example.com</p>
                </div>
                <Badge>Buyer</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">#ORD-{1000 + i}</p>
                  <p className="text-sm text-gray-500">Customer {i}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatPrice(45.99 * i)}</p>
                  <Badge variant="success">Completed</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}