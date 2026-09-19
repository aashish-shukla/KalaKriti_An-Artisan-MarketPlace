// artisan/app/(seller)/seller/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, Eye, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatPrice, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/authStore';
import { orderService } from '@/lib/api/services';
import type { Order } from '@/types';
import toast from 'react-hot-toast';

export default function SellerOrdersPage() {
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await orderService.getOrders({ limit: 50 });
            setOrders((res as any).data || []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        setUpdatingStatus(orderId);
        try {
            await orderService.updateOrderStatus(orderId, { status: newStatus });
            toast.success(`Order updated to ${newStatus}`);
            fetchOrders();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update order');
        } finally {
            setUpdatingStatus(null);
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

    const getNextStatus = (current: string) => {
        const flow: Record<string, string> = {
            pending: 'confirmed',
            confirmed: 'processing',
            processing: 'shipped',
            shipped: 'delivered',
        };
        return flow[current];
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-600 mt-1">Manage and fulfill your customer orders</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                    Refresh
                </button>
            </div>

            {orders.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Order ID</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Items</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Total</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => {
                                    const nextStatus = getNextStatus(order.status);
                                    return (
                                        <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm font-mono text-gray-900">
                                                {order.orderNumber || `#${order._id.slice(-6).toUpperCase()}`}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                                            </td>
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                                {formatPrice(order.pricing?.total || 0)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <Badge variant={getStatusVariant(order.status)}>
                                                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4">
                                                {nextStatus && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleStatusUpdate(order._id, nextStatus)}
                                                        isLoading={updatingStatus === order._id}
                                                    >
                                                        Mark {nextStatus}
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
                    <p className="text-gray-600">When customers place orders, they'll appear here.</p>
                </div>
            )}
        </div>
    );
}
