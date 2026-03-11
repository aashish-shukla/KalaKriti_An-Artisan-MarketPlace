// artisan/app/(account)/account/addresses/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { userService } from '@/lib/api/services';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import type { Address } from '@/types';
import {
    MapPin, Plus, Pencil, Trash2, Check, Home, Building2, Briefcase, Star
} from 'lucide-react';
import toast from 'react-hot-toast';

const addressLabels = [
    { value: 'Home', icon: Home, color: 'text-blue-600 bg-blue-50' },
    { value: 'Work', icon: Briefcase, color: 'text-purple-600 bg-purple-50' },
    { value: 'Office', icon: Building2, color: 'text-green-600 bg-green-50' },
    { value: 'Other', icon: MapPin, color: 'text-orange-600 bg-orange-50' },
];

const emptyAddress: Address = {
    label: 'Home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    isDefault: false,
};

export default function AddressesPage() {
    const { user, setUser } = useAuthStore();
    const [addresses, setAddresses] = useState<Address[]>(user?.address || []);
    const [showModal, setShowModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [formData, setFormData] = useState<Address>({ ...emptyAddress });
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const handleOpenAdd = () => {
        setFormData({ ...emptyAddress, isDefault: addresses.length === 0 });
        setEditingIndex(null);
        setShowModal(true);
    };

    const handleOpenEdit = (index: number) => {
        setFormData({ ...addresses[index] });
        setEditingIndex(index);
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.street || !formData.city || !formData.state || !formData.zipCode) {
            toast.error('Please fill in all required fields');
            return;
        }
        setIsLoading(true);
        try {
            let updatedAddresses: Address[];
            if (editingIndex !== null) {
                updatedAddresses = [...addresses];
                updatedAddresses[editingIndex] = formData;
            } else {
                updatedAddresses = [...addresses, formData];
            }

            // If setting as default, unset others
            if (formData.isDefault) {
                updatedAddresses = updatedAddresses.map((addr, i) => ({
                    ...addr,
                    isDefault: editingIndex !== null ? i === editingIndex : i === updatedAddresses.length - 1,
                }));
            }

            const response = await userService.updateProfile({ address: updatedAddresses });
            setAddresses(updatedAddresses);
            if (response.user) setUser(response.user);
            setShowModal(false);
            toast.success(editingIndex !== null ? 'Address updated!' : 'Address added!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to save address');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (index: number) => {
        setIsLoading(true);
        try {
            const updatedAddresses = addresses.filter((_, i) => i !== index);
            // If we deleted the default, set first as default
            if (addresses[index].isDefault && updatedAddresses.length > 0) {
                updatedAddresses[0].isDefault = true;
            }
            const response = await userService.updateProfile({ address: updatedAddresses });
            setAddresses(updatedAddresses);
            if (response.user) setUser(response.user);
            toast.success('Address deleted');
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete address');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetDefault = async (index: number) => {
        setIsLoading(true);
        try {
            const updatedAddresses = addresses.map((addr, i) => ({
                ...addr,
                isDefault: i === index,
            }));
            const response = await userService.updateProfile({ address: updatedAddresses });
            setAddresses(updatedAddresses);
            if (response.user) setUser(response.user);
            toast.success('Default address updated');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update default');
        } finally {
            setIsLoading(false);
        }
    };

    const getLabelConfig = (label: string) =>
        addressLabels.find((l) => l.value === label) || addressLabels[3];

    return (
        <div className={`space-y-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#2d3436]" style={{ fontFamily: 'var(--font-serif)' }}>
                        My Addresses
                    </h1>
                    <p className="text-[#6b5e54] mt-1">Manage your delivery addresses</p>
                </div>
                <Button onClick={handleOpenAdd}>
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add Address
                </Button>
            </div>

            {/* Address List */}
            {addresses.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-[#f0ebe4] p-16 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#c2703e]/10 to-[#daa520]/10 rounded-2xl flex items-center justify-center">
                        <MapPin className="w-10 h-10 text-[#c2703e]/40" />
                    </div>
                    <h2 className="text-xl font-bold text-[#2d3436] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                        No addresses saved
                    </h2>
                    <p className="text-[#6b5e54] mb-6">Add your first delivery address for faster checkout</p>
                    <Button onClick={handleOpenAdd}>
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add Your First Address
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address, index) => {
                        const labelConfig = getLabelConfig(address.label);
                        const LabelIcon = labelConfig.icon;
                        return (
                            <div
                                key={address._id || index}
                                className={`relative bg-white rounded-2xl shadow-sm border-2 p-5 transition-all duration-300 hover:shadow-md group ${address.isDefault
                                    ? 'border-[#c2703e]/40 bg-gradient-to-br from-[#c2703e]/[0.02] to-[#daa520]/[0.02]'
                                    : 'border-[#f0ebe4] hover:border-[#c2703e]/20'
                                    }`}
                            >
                                {address.isDefault && (
                                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-[#c2703e] to-[#daa520] rounded-full">
                                        <Star className="w-3 h-3 text-white fill-white" />
                                        <span className="text-[10px] text-white font-bold">DEFAULT</span>
                                    </div>
                                )}

                                <div className="flex items-start gap-3 mb-3">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${labelConfig.color}`}>
                                        <LabelIcon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-[#2d3436] text-sm">{address.label}</p>
                                        <p className="text-sm text-[#6b5e54] mt-1 leading-relaxed">
                                            {address.street}
                                            <br />
                                            {address.city}, {address.state} {address.zipCode}
                                            <br />
                                            {address.country}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-3 border-t border-[#f0ebe4]">
                                    <button
                                        onClick={() => handleOpenEdit(index)}
                                        className="flex items-center gap-1 text-xs font-medium text-[#c2703e] hover:text-[#a85a30] px-2 py-1.5 rounded-lg hover:bg-[#c2703e]/5 transition-all"
                                    >
                                        <Pencil className="w-3 h-3" />
                                        Edit
                                    </button>
                                    {!address.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(index)}
                                            className="flex items-center gap-1 text-xs font-medium text-[#6b5e54] hover:text-[#c2703e] px-2 py-1.5 rounded-lg hover:bg-[#faf6f1] transition-all"
                                        >
                                            <Check className="w-3 h-3" />
                                            Set Default
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-all ml-auto"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add/Edit Address Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingIndex !== null ? 'Edit Address' : 'Add New Address'}
                size="lg"
            >
                <div className="space-y-4">
                    {/* Label Selection */}
                    <div>
                        <label className="block text-sm font-medium text-[#2d3436] mb-2">Address Type</label>
                        <div className="flex gap-2">
                            {addressLabels.map((labelOption) => {
                                const Icon = labelOption.icon;
                                const isActive = formData.label === labelOption.value;
                                return (
                                    <button
                                        key={labelOption.value}
                                        onClick={() => setFormData({ ...formData, label: labelOption.value })}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border-2 transition-all ${isActive
                                            ? 'border-[#c2703e] bg-[#c2703e]/5 text-[#c2703e]'
                                            : 'border-[#f0ebe4] text-[#6b5e54] hover:border-[#c2703e]/30'
                                            }`}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {labelOption.value}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <Input
                        label="Street Address"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        placeholder="123 Main Street, Apt 4B"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="City"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="Mumbai"
                            required
                        />
                        <Input
                            label="State"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            placeholder="Maharashtra"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="ZIP / Pin Code"
                            value={formData.zipCode}
                            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                            placeholder="400001"
                            required
                        />
                        <Input
                            label="Country"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            placeholder="India"
                            required
                        />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isDefault}
                            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                            className="w-4 h-4 rounded border-[#f0ebe4] text-[#c2703e] focus:ring-[#c2703e]/20"
                        />
                        <span className="text-sm text-[#2d3436] font-medium">Set as default address</span>
                    </label>

                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} isLoading={isLoading} className="flex-1">
                            {editingIndex !== null ? 'Save Changes' : 'Add Address'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
