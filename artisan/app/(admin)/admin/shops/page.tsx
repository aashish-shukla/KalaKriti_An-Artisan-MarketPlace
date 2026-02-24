// artisan/app/(admin)/admin/shops/page.tsx
'use client';

import { useState } from 'react';
import { Search, Eye, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

// Mock data
const mockShops = [
  { id: 1, name: 'Artisan Pottery Studio', owner: 'Jane Smith', status: 'pending_approval', createdAt: '2026-02-15' },
  { id: 2, name: 'Handmade Jewelry Co', owner: 'Mike Johnson', status: 'active', createdAt: '2026-01-20' },
  { id: 3, name: 'Wooden Crafts', owner: 'Sarah Williams', status: 'pending_approval', createdAt: '2026-02-17' },
  { id: 4, name: 'Textile Arts', owner: 'David Brown', status: 'active', createdAt: '2026-01-10' },
  { id: 5, name: 'Glass Works', owner: 'Emma Davis', status: 'suspended', createdAt: '2026-01-05' },
];

export default function AdminShopsPage() {
  const [shops, setShops] = useState(mockShops);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleApprove = async (shopId: number) => {
    toast.success('Shop approved successfully');
    setShops(shops.map(shop => 
      shop.id === shopId ? { ...shop, status: 'active' } : shop
    ));
  };

  const handleReject = async (shopId: number) => {
    toast.success('Shop rejected');
    setShops(shops.filter(shop => shop.id !== shopId));
  };

  const handleSuspend = async (shopId: number) => {
    toast.success('Shop suspended');
    setShops(shops.map(shop => 
      shop.id === shopId ? { ...shop, status: 'suspended' } : shop
    ));
  };

  const getStatusVariant = (status: string) => {
    const variants: Record<string, any> = {
      active: 'success',
      pending_approval: 'warning',
      suspended: 'danger',
      inactive: 'default',
    };
    return variants[status] || 'default';
  };

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shop.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Shop Management</h1>
        <p className="text-gray-600 mt-1">Approve, manage, and moderate shops</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search shops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Shops Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Shop Name</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Owner</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Created</th>
                <th className="text-right py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShops.map((shop) => (
                <tr key={shop.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600 font-bold">{shop.name.charAt(0)}</span>
                      </div>
                      <p className="font-medium text-gray-900">{shop.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{shop.owner}</td>
                  <td className="py-4 px-6">
                    <Badge variant={getStatusVariant(shop.status)}>
                      {shop.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{formatDate(shop.createdAt)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      {shop.status === 'pending_approval' && (
                        <>
                          <button
                            onClick={() => handleApprove(shop.id)}
                            className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </button>
                          <button
                            onClick={() => handleReject(shop.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      )}
                      {shop.status === 'active' && (
                        <button
                          onClick={() => handleSuspend(shop.id)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Suspend
                        </button>
                      )}
                    </div>
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