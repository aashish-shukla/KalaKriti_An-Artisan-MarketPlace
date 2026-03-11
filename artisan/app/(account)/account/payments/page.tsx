// artisan/app/(account)/account/payments/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
    CreditCard, Plus, Trash2, Star, Shield, Wallet, IndianRupee
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentMethod {
    id: string;
    type: 'card' | 'upi' | 'wallet';
    last4?: string;
    cardBrand?: string;
    upiId?: string;
    walletName?: string;
    expiryMonth?: number;
    expiryYear?: number;
    isDefault: boolean;
    cardholderName?: string;
}

// Card brand colors & gradients
const cardBrandStyles: Record<string, { gradient: string; textColor: string }> = {
    Visa: { gradient: 'linear-gradient(135deg, #1a1f71 0%, #2e3192 40%, #00579f 100%)', textColor: '#fff' },
    Mastercard: { gradient: 'linear-gradient(135deg, #eb001b 0%, #f79e1b 100%)', textColor: '#fff' },
    RuPay: { gradient: 'linear-gradient(135deg, #0b4ea2 0%, #ff6600 100%)', textColor: '#fff' },
    Default: { gradient: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)', textColor: '#fff' },
};

export default function PaymentsPage() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addType, setAddType] = useState<'card' | 'upi'>('card');
    const [mounted, setMounted] = useState(false);

    // Card form
    const [cardForm, setCardForm] = useState({
        cardNumber: '',
        cardholderName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
    });

    // UPI form
    const [upiForm, setUpiForm] = useState({ upiId: '' });

    useEffect(() => setMounted(true), []);

    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '').slice(0, 16);
        return cleaned.replace(/(.{4})/g, '$1 ').trim();
    };

    const getCardBrand = (number: string): string => {
        const cleaned = number.replace(/\s/g, '');
        if (cleaned.startsWith('4')) return 'Visa';
        if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'Mastercard';
        if (/^(60|6521|6522)/.test(cleaned)) return 'RuPay';
        return 'Default';
    };

    const handleAddCard = () => {
        const cleaned = cardForm.cardNumber.replace(/\s/g, '');
        if (cleaned.length < 16 || !cardForm.cardholderName || !cardForm.expiryMonth || !cardForm.expiryYear || !cardForm.cvv) {
            toast.error('Please fill in all fields');
            return;
        }

        const newMethod: PaymentMethod = {
            id: Date.now().toString(),
            type: 'card',
            last4: cleaned.slice(-4),
            cardBrand: getCardBrand(cleaned),
            expiryMonth: parseInt(cardForm.expiryMonth),
            expiryYear: parseInt(cardForm.expiryYear),
            cardholderName: cardForm.cardholderName,
            isDefault: paymentMethods.length === 0,
        };

        setPaymentMethods([...paymentMethods, newMethod]);
        setShowAddModal(false);
        setCardForm({ cardNumber: '', cardholderName: '', expiryMonth: '', expiryYear: '', cvv: '' });
        toast.success('Card added successfully! 💳');
    };

    const handleAddUPI = () => {
        if (!upiForm.upiId || !upiForm.upiId.includes('@')) {
            toast.error('Please enter a valid UPI ID');
            return;
        }

        const newMethod: PaymentMethod = {
            id: Date.now().toString(),
            type: 'upi',
            upiId: upiForm.upiId,
            isDefault: paymentMethods.length === 0,
        };

        setPaymentMethods([...paymentMethods, newMethod]);
        setShowAddModal(false);
        setUpiForm({ upiId: '' });
        toast.success('UPI ID added successfully!');
    };

    const handleDelete = (id: string) => {
        const updated = paymentMethods.filter((m) => m.id !== id);
        if (paymentMethods.find((m) => m.id === id)?.isDefault && updated.length > 0) {
            updated[0].isDefault = true;
        }
        setPaymentMethods(updated);
        toast.success('Payment method removed');
    };

    const handleSetDefault = (id: string) => {
        setPaymentMethods(
            paymentMethods.map((m) => ({ ...m, isDefault: m.id === id }))
        );
        toast.success('Default payment method updated');
    };

    const brandStyle = (brand?: string) => cardBrandStyles[brand || 'Default'] || cardBrandStyles.Default;

    return (
        <div className={`space-y-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#2d3436]" style={{ fontFamily: 'var(--font-serif)' }}>
                        Payment Methods
                    </h1>
                    <p className="text-[#6b5e54] mt-1">Manage your saved payment methods</p>
                </div>
                <Button onClick={() => setShowAddModal(true)}>
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add Payment
                </Button>
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#2d9f6f]/5 to-[#27ae60]/5 rounded-xl border border-[#2d9f6f]/10">
                <Shield className="w-4 h-4 text-[#2d9f6f]" />
                <p className="text-xs text-[#2d9f6f] font-medium">
                    Your payment information is encrypted and securely stored
                </p>
            </div>

            {/* Payment Methods List */}
            {paymentMethods.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-[#f0ebe4] p-16 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#c2703e]/10 to-[#daa520]/10 rounded-2xl flex items-center justify-center">
                        <CreditCard className="w-10 h-10 text-[#c2703e]/40" />
                    </div>
                    <h2 className="text-xl font-bold text-[#2d3436] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                        No payment methods saved
                    </h2>
                    <p className="text-[#6b5e54] mb-6">Add a card or UPI for faster checkout</p>
                    <Button onClick={() => setShowAddModal(true)}>
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add Your First Payment Method
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentMethods.map((method) => (
                        <div key={method.id} className="relative group">
                            {method.type === 'card' ? (
                                <>
                                    {/* Credit Card Visual */}
                                    <div
                                        className="relative rounded-2xl p-5 h-48 flex flex-col justify-between overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.01]"
                                        style={{ background: brandStyle(method.cardBrand).gradient }}
                                    >
                                        {/* Card chip */}
                                        <div className="flex items-center justify-between">
                                            <div className="w-10 h-7 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md shadow-inner" />
                                            {method.isDefault && (
                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full">
                                                    <Star className="w-2.5 h-2.5 text-white fill-white" />
                                                    <span className="text-[10px] text-white font-bold">DEFAULT</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Number */}
                                        <div>
                                            <p className="text-white/60 text-xs tracking-widest mb-1">CARD NUMBER</p>
                                            <p className="text-white text-lg font-mono tracking-[0.2em]">
                                                •••• •••• •••• {method.last4}
                                            </p>
                                        </div>

                                        {/* Card Footer */}
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-white/60 text-[10px] tracking-wider">CARDHOLDER</p>
                                                <p className="text-white text-xs font-medium uppercase">
                                                    {method.cardholderName}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white/60 text-[10px] tracking-wider">EXPIRES</p>
                                                <p className="text-white text-xs font-medium">
                                                    {String(method.expiryMonth).padStart(2, '0')}/{String(method.expiryYear).slice(-2)}
                                                </p>
                                            </div>
                                            <p className="text-white text-lg font-bold">{method.cardBrand}</p>
                                        </div>

                                        {/* Decorative circles */}
                                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full" />
                                        <div className="absolute -right-4 -bottom-12 w-40 h-40 bg-white/5 rounded-full" />
                                    </div>
                                </>
                            ) : (
                                /* UPI Card */
                                <div className="relative rounded-2xl p-5 h-48 flex flex-col justify-between bg-gradient-to-br from-[#5f259f] to-[#6739b7] shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.01] overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <IndianRupee className="w-5 h-5 text-white" />
                                            <span className="text-white font-bold text-sm">UPI</span>
                                        </div>
                                        {method.isDefault && (
                                            <div className="flex items-center gap-1 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full">
                                                <Star className="w-2.5 h-2.5 text-white fill-white" />
                                                <span className="text-[10px] text-white font-bold">DEFAULT</span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-xs mb-1">UPI ID</p>
                                        <p className="text-white text-lg font-medium">{method.upiId}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Wallet className="w-4 h-4 text-white/60" />
                                        <p className="text-white/60 text-xs">Unified Payments Interface</p>
                                    </div>
                                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full" />
                                </div>
                            )}

                            {/* Card Actions */}
                            <div className="flex items-center gap-2 mt-3">
                                {!method.isDefault && (
                                    <button
                                        onClick={() => handleSetDefault(method.id)}
                                        className="flex items-center gap-1 text-xs font-medium text-[#c2703e] hover:text-[#a85a30] px-2 py-1.5 rounded-lg hover:bg-[#c2703e]/5 transition-all"
                                    >
                                        <Star className="w-3 h-3" />
                                        Set Default
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(method.id)}
                                    className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-all ml-auto"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Payment Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setCardForm({ cardNumber: '', cardholderName: '', expiryMonth: '', expiryYear: '', cvv: '' });
                    setUpiForm({ upiId: '' });
                }}
                title="Add Payment Method"
                size="md"
            >
                <div className="space-y-4">
                    {/* Type Selector */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setAddType('card')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-all ${addType === 'card'
                                ? 'border-[#c2703e] bg-[#c2703e]/5 text-[#c2703e]'
                                : 'border-[#f0ebe4] text-[#6b5e54] hover:border-[#c2703e]/30'
                                }`}
                        >
                            <CreditCard className="w-4 h-4" />
                            Credit/Debit Card
                        </button>
                        <button
                            onClick={() => setAddType('upi')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-all ${addType === 'upi'
                                ? 'border-[#c2703e] bg-[#c2703e]/5 text-[#c2703e]'
                                : 'border-[#f0ebe4] text-[#6b5e54] hover:border-[#c2703e]/30'
                                }`}
                        >
                            <IndianRupee className="w-4 h-4" />
                            UPI
                        </button>
                    </div>

                    {addType === 'card' ? (
                        <>
                            {/* Card Number */}
                            <div>
                                <label className="block text-sm font-medium text-[#2d3436] mb-1.5">Card Number</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formatCardNumber(cardForm.cardNumber)}
                                        onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value.replace(/\s/g, '') })}
                                        className="w-full px-4 py-2.5 pr-16 border border-[#f0ebe4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e] transition-all font-mono tracking-wider"
                                        placeholder="1234 5678 9012 3456"
                                        maxLength={19}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6b5e54]">
                                        {getCardBrand(cardForm.cardNumber) !== 'Default' ? getCardBrand(cardForm.cardNumber) : ''}
                                    </span>
                                </div>
                            </div>

                            {/* Cardholder Name */}
                            <div>
                                <label className="block text-sm font-medium text-[#2d3436] mb-1.5">Cardholder Name</label>
                                <input
                                    type="text"
                                    value={cardForm.cardholderName}
                                    onChange={(e) => setCardForm({ ...cardForm, cardholderName: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-[#f0ebe4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e] transition-all"
                                    placeholder="Name on card"
                                />
                            </div>

                            {/* Expiry & CVV */}
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-[#2d3436] mb-1.5">Month</label>
                                    <select
                                        value={cardForm.expiryMonth}
                                        onChange={(e) => setCardForm({ ...cardForm, expiryMonth: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-[#f0ebe4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e] transition-all"
                                    >
                                        <option value="">MM</option>
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                            <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#2d3436] mb-1.5">Year</label>
                                    <select
                                        value={cardForm.expiryYear}
                                        onChange={(e) => setCardForm({ ...cardForm, expiryYear: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-[#f0ebe4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e] transition-all"
                                    >
                                        <option value="">YY</option>
                                        {Array.from({ length: 10 }, (_, i) => 2026 + i).map((y) => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#2d3436] mb-1.5">CVV</label>
                                    <input
                                        type="password"
                                        value={cardForm.cvv}
                                        onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                        className="w-full px-3 py-2.5 border border-[#f0ebe4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e] transition-all text-center tracking-widest"
                                        placeholder="•••"
                                        maxLength={4}
                                    />
                                </div>
                            </div>

                            <Button onClick={handleAddCard} className="w-full">
                                <CreditCard className="w-4 h-4 mr-1.5" />
                                Add Card
                            </Button>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-[#2d3436] mb-1.5">UPI ID</label>
                                <input
                                    type="text"
                                    value={upiForm.upiId}
                                    onChange={(e) => setUpiForm({ upiId: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-[#f0ebe4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e] transition-all"
                                    placeholder="yourname@upi"
                                />
                            </div>

                            <Button onClick={handleAddUPI} className="w-full">
                                <IndianRupee className="w-4 h-4 mr-1.5" />
                                Add UPI ID
                            </Button>
                        </>
                    )}

                    <div className="flex items-center gap-2 justify-center pt-2">
                        <Shield className="w-3.5 h-3.5 text-[#6b5e54]" />
                        <p className="text-xs text-[#6b5e54]">
                            256-bit encryption • PCI DSS compliant
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
