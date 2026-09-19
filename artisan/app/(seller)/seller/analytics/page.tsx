// artisan/app/(seller)/seller/analytics/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Eye, Star, ShoppingBag, IndianRupee, Package, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { shopService, productService } from '@/lib/api/services';
import { formatPrice } from '@/lib/utils';

export default function SellerAnalyticsPage() {
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [analytics, setAnalytics] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const shopId = typeof user?.shop === 'object' ? user?.shop?._id : user?.shop;

    useEffect(() => {
        if (shopId) fetchAnalytics();
    }, [shopId]);

    const fetchAnalytics = async () => {
        if (!shopId) return;
        setIsLoading(true);
        try {
            const [analyticsRes, productsRes] = await Promise.allSettled([
                shopService.getShopAnalytics(shopId),
                productService.getProducts({ shop: shopId, limit: 50 }),
            ]);

            if (analyticsRes.status === 'fulfilled') {
                setAnalytics((analyticsRes.value as any).analytics || analyticsRes.value);
            }
            if (productsRes.status === 'fulfilled') {
                setProducts((productsRes.value as any).data || []);
            }
        } catch (err) {
            console.error('Failed to load analytics:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!shopId) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No Shop Found</h2>
                    <p className="text-gray-600">Create a shop first to view analytics.</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
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

    const stats = analytics?.stats || {};
    const ratings = analytics?.ratings || {};
    const productStats = analytics?.products || {};

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-gray-600 mt-1">Track your shop's performance</p>
                </div>
                <button
                    onClick={fetchAnalytics}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <IndianRupee className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue || 0)}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <ShoppingBag className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders || 0}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <Package className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{productStats.total || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {productStats.active || 0} active · {productStats.outOfStock || 0} out of stock
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                        <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {(ratings.average || 0).toFixed(1)} ★
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{ratings.count || 0} reviews</p>
                </div>
            </div>

            {/* Product Performance */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Product Performance</h2>
                {products.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Product</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Price</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Sales</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Revenue</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Views</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{product.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{formatPrice(product.price)}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{product.sales?.count || 0}</td>
                                        <td className="py-3 px-4 text-sm text-gray-900">{formatPrice(product.sales?.revenue || 0)}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{product.views || 0}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            {(product.ratings?.average || 0).toFixed(1)} ★ ({product.ratings?.count || 0})
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        <Package className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                        <p>No products yet. Add products to see performance data.</p>
                    </div>
                )}
            </div>

            {/* Views Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-gray-900">Views Summary</h2>
                </div>
                <p className="text-3xl font-bold text-gray-900">{(analytics?.totalViews || 0).toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">Total product views across your shop</p>
            </div>
        </div>
    );
}
