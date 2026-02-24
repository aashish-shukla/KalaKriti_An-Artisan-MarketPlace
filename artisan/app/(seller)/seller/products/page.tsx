// artisan/app/(seller)/seller/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { formatPrice } from '@/lib/utils';
import { productService } from '@/lib/api/services';
import type { Product } from '@/types';

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // This should be updated to fetch seller's products only
      const response = await productService.getProducts({ page: 1, limit: 50 });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    const variants: Record<string, any> = {
      active: 'success',
      inactive: 'default',
      out_of_stock: 'danger',
      draft: 'warning',
    };
    return variants[status] || 'default';
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <Link href="/seller/products/new">
          <Button size="lg">
            <Plus className="w-5 h-5" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">Loading...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Product</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Price</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Stock</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Sales</th>
                  <th className="text-right py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">SKU: {product.inventory.sku || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-900">{formatPrice(product.price)}</td>
                    <td className="py-4 px-6">
                      <span className={product.inventory.stock <= product.inventory.lowStockThreshold ? 'text-red-600 font-medium' : 'text-gray-900'}>
                        {product.inventory.stock}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={getStatusVariant(product.status)}>
                        {product.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-gray-900">{product.sales.count}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/products/${product.slug}`}>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                        </Link>
                        <Link href={`/seller/products/${product._id}/edit`}>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                        </Link>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}