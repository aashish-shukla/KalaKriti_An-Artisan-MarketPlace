// artisan/app/(seller)/seller/settings/page.tsx
'use client';

import { Bell, Shield } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { useSettingsStore } from '@/lib/store/settingsStore';

export default function SellerSettingsPage() {
    const { user } = useAuthStore();
    const { notifications, setNotification } = useSettingsStore();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage your seller account preferences</p>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                </div>
                <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                        <div>
                            <p className="font-medium text-gray-900">Order Updates</p>
                            <p className="text-sm text-gray-500">Get notified when you receive a new order</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications.orderUpdates}
                            onChange={(e) => setNotification('orderUpdates', e.target.checked)}
                            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                        <div>
                            <p className="font-medium text-gray-900">New Products</p>
                            <p className="text-sm text-gray-500">Get notified about marketplace product updates</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications.newProducts}
                            onChange={(e) => setNotification('newProducts', e.target.checked)}
                            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                        <div>
                            <p className="font-medium text-gray-900">Price Drops</p>
                            <p className="text-sm text-gray-500">Get alerts when product prices change</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications.priceDrops}
                            onChange={(e) => setNotification('priceDrops', e.target.checked)}
                            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                        <div>
                            <p className="font-medium text-gray-900">Promotions</p>
                            <p className="text-sm text-gray-500">Receive promotional offers and updates</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications.promotions}
                            onChange={(e) => setNotification('promotions', e.target.checked)}
                            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                    </label>
                </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-bold text-gray-900">Account</h2>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Email</span>
                        <span className="text-sm font-medium text-gray-900">{user?.email}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Role</span>
                        <span className="text-sm font-medium text-gray-900 capitalize">{user?.role}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">Shop Name</span>
                        <span className="text-sm font-medium text-gray-900">
                            {typeof user?.shop === 'object' ? user?.shop?.name : 'Not set'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
