// artisan/app/(seller)/seller/reviews/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { productService } from '@/lib/api/services';
import { formatDate } from '@/lib/utils';
import type { Product } from '@/types';

export default function SellerReviewsPage() {
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const shopId = typeof user?.shop === 'object' ? user?.shop?._id : user?.shop;

    useEffect(() => {
        if (shopId) fetchProducts();
    }, [shopId]);

    const fetchProducts = async () => {
        if (!shopId) return;
        setIsLoading(true);
        try {
            const res = await productService.getProducts({ shop: shopId, limit: 50 });
            setProducts((res as any).data || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const productsWithRatings = products.filter(
        (p) => p.ratings && p.ratings.count > 0
    );

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
                <p className="text-gray-600 mt-1">See how customers rate your products</p>
            </div>

            {productsWithRatings.length > 0 ? (
                <div className="space-y-4">
                    {productsWithRatings.map((product) => (
                        <div key={product._id} className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${
                                                        star <= (product.ratings?.average || 0)
                                                            ? 'text-yellow-400 fill-yellow-400'
                                                            : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {(product.ratings?.average || 0).toFixed(1)} ({product.ratings?.count || 0} reviews)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h2>
                    <p className="text-gray-600">When customers review your products, they'll appear here.</p>
                </div>
            )}
        </div>
    );
}
