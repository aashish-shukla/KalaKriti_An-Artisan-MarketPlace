// artisan/app/(seller)/seller/products/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X, Upload, Package, IndianRupee, Tag, Truck, Save, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { productService, categoryService } from '@/lib/api/services';
import type { Category } from '@/types';
import toast from 'react-hot-toast';

export default function NewProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tagInput, setTagInput] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        shortDescription: '',
        price: '',
        compareAtPrice: '',
        category: '',
        status: 'active',
        inventory: {
            sku: '',
            stock: '0',
            lowStockThreshold: '5',
            trackInventory: true,
        },
        images: [{ url: '', alt: '', isPrimary: true }],
        tags: [] as string[],
        shipping: {
            isFreeShipping: false,
            shippingCost: '0',
            processingTime: '3-5 business days',
        },
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const cats = await categoryService.getCategories();
            setCategories(cats as Category[]);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const updateField = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const updateInventory = (key: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            inventory: { ...prev.inventory, [key]: value },
        }));
    };

    const updateShipping = (key: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            shipping: { ...prev.shipping, [key]: value },
        }));
    };

    const addImage = () => {
        if (formData.images.length >= 5) {
            toast.error('Maximum 5 images allowed');
            return;
        }
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, { url: '', alt: '', isPrimary: false }],
        }));
    };

    const removeImage = (index: number) => {
        if (formData.images.length <= 1) return;
        const newImages = formData.images.filter((_, i) => i !== index);
        // Ensure at least one image is primary
        if (!newImages.some((img) => img.isPrimary) && newImages.length > 0) {
            newImages[0].isPrimary = true;
        }
        setFormData((prev) => ({ ...prev, images: newImages }));
    };

    const updateImage = (index: number, key: string, value: any) => {
        const newImages = [...formData.images];
        if (key === 'isPrimary' && value) {
            newImages.forEach((img) => (img.isPrimary = false));
        }
        newImages[index] = { ...newImages[index], [key]: value };
        setFormData((prev) => ({ ...prev, images: newImages }));
    };

    const addTag = () => {
        const tag = tagInput.trim().toLowerCase();
        if (tag && !formData.tags.includes(tag)) {
            setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t !== tag),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.description || !formData.price || !formData.category) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        try {
            const productData = {
                name: formData.name,
                description: formData.description,
                shortDescription: formData.shortDescription || undefined,
                price: parseFloat(formData.price),
                compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
                category: formData.category,
                status: formData.status as any,
                inventory: {
                    sku: formData.inventory.sku || undefined,
                    stock: parseInt(formData.inventory.stock) || 0,
                    lowStockThreshold: parseInt(formData.inventory.lowStockThreshold) || 5,
                    trackInventory: formData.inventory.trackInventory,
                },
                images: formData.images.filter((img) => img.url),
                tags: formData.tags,
                shipping: {
                    isFreeShipping: formData.shipping.isFreeShipping,
                    shippingCost: formData.shipping.isFreeShipping ? 0 : parseFloat(formData.shipping.shippingCost) || 0,
                    processingTime: formData.shipping.processingTime,
                },
            };

            await productService.createProduct(productData);
            toast.success('Product created successfully!');
            router.push('/seller/products');
        } catch (error: any) {
            toast.error(error.message || 'Failed to create product');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/seller/products">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                    <p className="text-gray-600 mt-1">Fill in the details to list a new product</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Package className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
                    </div>
                    <div className="space-y-4">
                        <Input
                            label="Product Name *"
                            value={formData.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            placeholder="e.g. Handcrafted Ceramic Bowl"
                            required
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => updateField('description', e.target.value)}
                                placeholder="Describe your product in detail..."
                                rows={4}
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Short Description
                            </label>
                            <textarea
                                value={formData.shortDescription}
                                onChange={(e) => updateField('shortDescription', e.target.value)}
                                placeholder="Brief summary shown in product listings..."
                                rows={2}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Category *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => updateField('category', e.target.value)}
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all"
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => updateField('status', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all"
                            >
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <IndianRupee className="w-5 h-5 text-green-600" />
                        <h2 className="text-lg font-bold text-gray-900">Pricing</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Price (₹) *"
                            type="number"
                            value={formData.price}
                            onChange={(e) => updateField('price', e.target.value)}
                            placeholder="0.00"
                            required
                        />
                        <Input
                            label="Compare at Price (₹)"
                            type="number"
                            value={formData.compareAtPrice}
                            onChange={(e) => updateField('compareAtPrice', e.target.value)}
                            placeholder="0.00 (original price for showing discount)"
                        />
                    </div>
                </div>

                {/* Inventory */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Package className="w-5 h-5 text-orange-600" />
                        <h2 className="text-lg font-bold text-gray-900">Inventory</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="SKU"
                                value={formData.inventory.sku}
                                onChange={(e) => updateInventory('sku', e.target.value)}
                                placeholder="e.g. CB-001"
                            />
                            <Input
                                label="Stock Quantity *"
                                type="number"
                                value={formData.inventory.stock}
                                onChange={(e) => updateInventory('stock', e.target.value)}
                                placeholder="0"
                                required
                            />
                            <Input
                                label="Low Stock Alert"
                                type="number"
                                value={formData.inventory.lowStockThreshold}
                                onChange={(e) => updateInventory('lowStockThreshold', e.target.value)}
                                placeholder="5"
                            />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.inventory.trackInventory}
                                onChange={(e) => updateInventory('trackInventory', e.target.checked)}
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">Track inventory for this product</span>
                        </label>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-purple-600" />
                            <h2 className="text-lg font-bold text-gray-900">Images</h2>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addImage}
                            disabled={formData.images.length >= 5}
                        >
                            <Plus className="w-4 h-4" />
                            Add Image
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {formData.images.map((image, index) => (
                            <div key={index} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                                <div className="flex-1 space-y-2">
                                    <Input
                                        label={`Image URL ${index + 1}`}
                                        value={image.url}
                                        onChange={(e) => updateImage(index, 'url', e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <Input
                                        label="Alt Text"
                                        value={image.alt}
                                        onChange={(e) => updateImage(index, 'alt', e.target.value)}
                                        placeholder="Describe the image"
                                    />
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="primaryImage"
                                            checked={image.isPrimary}
                                            onChange={() => updateImage(index, 'isPrimary', true)}
                                            className="w-4 h-4 text-indigo-600"
                                        />
                                        <span className="text-sm text-gray-700">Primary image</span>
                                    </label>
                                </div>
                                {formData.images.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-6"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Up to 5 images. Provide direct URLs to your product images.</p>
                </div>

                {/* Tags */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Tag className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-bold text-gray-900">Tags</h2>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            placeholder="Type a tag and press Enter"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                        <Button type="button" variant="outline" size="sm" onClick={addTag}>
                            Add
                        </Button>
                    </div>
                    {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="p-0.5 hover:bg-indigo-100 rounded-full"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Shipping */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Truck className="w-5 h-5 text-teal-600" />
                        <h2 className="text-lg font-bold text-gray-900">Shipping</h2>
                    </div>
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.shipping.isFreeShipping}
                                onChange={(e) => updateShipping('isFreeShipping', e.target.checked)}
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">Free shipping</span>
                        </label>
                        {!formData.shipping.isFreeShipping && (
                            <Input
                                label="Shipping Cost (₹)"
                                type="number"
                                value={formData.shipping.shippingCost}
                                onChange={(e) => updateShipping('shippingCost', e.target.value)}
                                placeholder="0.00"
                            />
                        )}
                        <Input
                            label="Processing Time"
                            value={formData.shipping.processingTime}
                            onChange={(e) => updateShipping('processingTime', e.target.value)}
                            placeholder="e.g. 3-5 business days"
                        />
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end gap-3 bg-white rounded-xl shadow-sm p-6">
                    <Link href="/seller/products">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" isLoading={isLoading} size="lg">
                        <Save className="w-5 h-5" />
                        Create Product
                    </Button>
                </div>
            </form>
        </div>
    );
}
