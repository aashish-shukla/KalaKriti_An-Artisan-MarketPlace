// artisan/app/(seller)/seller/shop/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Store, Save, MapPin, Phone, Mail, Globe, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/lib/store/authStore';
import { shopService } from '@/lib/api/services';
import toast from 'react-hot-toast';

export default function SellerShopPage() {
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [shopData, setShopData] = useState<any>(null);
    const shopId = typeof user?.shop === 'object' ? user?.shop?._id : user?.shop;

    useEffect(() => {
        if (shopId) fetchShop();
    }, [shopId]);

    const fetchShop = async () => {
        if (!shopId) return;
        setIsLoading(true);
        try {
            const res = await shopService.getShop(shopId);
            setShopData((res as any).shop || res);
        } catch (error: any) {
            console.error('Failed to fetch shop:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!shopId || !shopData) return;
        setIsSaving(true);
        try {
            await shopService.updateShop(shopId, {
                name: shopData.name,
                description: shopData.description,
                contactInfo: shopData.contactInfo,
                address: shopData.address,
                policies: shopData.policies,
                socialMedia: shopData.socialMedia,
            });
            toast.success('Shop updated successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update shop');
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = (key: string, value: any) => {
        setShopData((prev: any) => ({ ...prev, [key]: value }));
    };

    const updateNestedField = (parent: string, key: string, value: any) => {
        setShopData((prev: any) => ({
            ...prev,
            [parent]: { ...prev?.[parent], [key]: value },
        }));
    };

    if (!shopId) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <Store className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No Shop Found</h2>
                    <p className="text-gray-600">You need to create a shop to manage it here.</p>
                </div>
            </div>
        );
    }

    if (isLoading || !shopData) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">My Shop</h1>
                <div className="grid grid-cols-1 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                            <div className="h-10 bg-gray-200 rounded w-full" />
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
                    <h1 className="text-3xl font-bold text-gray-900">My Shop</h1>
                    <p className="text-gray-600 mt-1">Manage your shop profile and settings</p>
                </div>
                <Button onClick={handleSave} isLoading={isSaving}>
                    <Save className="w-4 h-4" />
                    Save Changes
                </Button>
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Store className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-gray-900">Shop Details</h2>
                </div>
                <div className="space-y-4">
                    <Input
                        label="Shop Name"
                        value={shopData.name || ''}
                        onChange={(e) => updateField('name', e.target.value)}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <textarea
                            value={shopData.description || ''}
                            onChange={(e) => updateField('description', e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Logo URL"
                            value={shopData.logo || ''}
                            onChange={(e) => updateField('logo', e.target.value)}
                            placeholder="https://example.com/logo.png"
                        />
                        <Input
                            label="Banner URL"
                            value={shopData.banner || ''}
                            onChange={(e) => updateField('banner', e.target.value)}
                            placeholder="https://example.com/banner.png"
                        />
                    </div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Phone className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        label="Email"
                        value={shopData.contactInfo?.email || ''}
                        onChange={(e) => updateNestedField('contactInfo', 'email', e.target.value)}
                        placeholder="shop@example.com"
                    />
                    <Input
                        label="Phone"
                        value={shopData.contactInfo?.phone || ''}
                        onChange={(e) => updateNestedField('contactInfo', 'phone', e.target.value)}
                        placeholder="+91 9876543210"
                    />
                    <Input
                        label="Website"
                        value={shopData.contactInfo?.website || ''}
                        onChange={(e) => updateNestedField('contactInfo', 'website', e.target.value)}
                        placeholder="https://yourshop.com"
                    />
                </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <h2 className="text-lg font-bold text-gray-900">Address</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Street"
                        value={shopData.address?.street || ''}
                        onChange={(e) => updateNestedField('address', 'street', e.target.value)}
                    />
                    <Input
                        label="City"
                        value={shopData.address?.city || ''}
                        onChange={(e) => updateNestedField('address', 'city', e.target.value)}
                    />
                    <Input
                        label="State"
                        value={shopData.address?.state || ''}
                        onChange={(e) => updateNestedField('address', 'state', e.target.value)}
                    />
                    <Input
                        label="ZIP Code"
                        value={shopData.address?.zipCode || ''}
                        onChange={(e) => updateNestedField('address', 'zipCode', e.target.value)}
                    />
                </div>
            </div>

            {/* Policies */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <ExternalLink className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-bold text-gray-900">Shop Policies</h2>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Return Policy</label>
                        <textarea
                            value={shopData.policies?.returnPolicy || ''}
                            onChange={(e) => updateNestedField('policies', 'returnPolicy', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
                            placeholder="Describe your return policy..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Shipping Policy</label>
                        <textarea
                            value={shopData.policies?.shippingPolicy || ''}
                            onChange={(e) => updateNestedField('policies', 'shippingPolicy', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
                            placeholder="Describe your shipping policy..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
