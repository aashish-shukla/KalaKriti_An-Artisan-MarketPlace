// artisan/app/(account)/account/settings/page.tsx
'use client';

import { useState } from 'react';
import {
    Sun, Moon, Monitor, Bell, BellOff, Shield, Lock, Globe, Trash2,
    Eye, EyeOff, Smartphone, Mail, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useThemeStore, type Theme } from '@/lib/store/themeStore';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const { theme, setTheme } = useThemeStore();
    const { user } = useAuthStore();

    // Notification preferences
    const [notifications, setNotifications] = useState({
        orderUpdates: true,
        promotions: false,
        newProducts: true,
        priceDrops: true,
        newsletter: false,
        smsAlerts: false,
    });

    // Privacy settings
    const [privacy, setPrivacy] = useState({
        showProfile: true,
        showWishlist: false,
        showOrders: false,
        allowAnalytics: true,
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const themeOptions: { value: Theme; label: string; icon: React.ElementType; description: string }[] = [
        { value: 'light', label: 'Light', icon: Sun, description: 'Warm and bright interface' },
        { value: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes at night' },
        { value: 'system', label: 'System', icon: Monitor, description: 'Follows your device settings' },
    ];

    const handleNotificationChange = (key: keyof typeof notifications) => {
        setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
        toast.success('Notification preference updated');
    };

    const handlePrivacyChange = (key: keyof typeof privacy) => {
        setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));
        toast.success('Privacy setting updated');
    };

    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);
        toast.success(`Theme changed to ${newTheme}`);
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold text-[#2d3436]">Settings</h1>
                <p className="text-[#6b5e54] mt-1">Manage your preferences and account settings</p>
            </div>

            {/* ─── Appearance / Theme ──────────────────────────── */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#f0ebe4] overflow-hidden">
                <div className="p-6 border-b border-[#f0ebe4]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                            <Sun className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-[#2d3436]">Appearance</h2>
                            <p className="text-sm text-[#6b5e54]">Choose how the app looks for you</p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {themeOptions.map((option) => {
                            const Icon = option.icon;
                            const isActive = theme === option.value;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => handleThemeChange(option.value)}
                                    className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200 ${isActive
                                            ? 'border-[#c2703e] bg-gradient-to-br from-[#c2703e]/5 to-[#daa520]/5 shadow-md'
                                            : 'border-[#f0ebe4] hover:border-[#c2703e]/30 hover:bg-[#faf6f1]'
                                        }`}
                                >
                                    {isActive && (
                                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isActive ? 'bg-[#c2703e]/10' : 'bg-[#f0ebe4]'
                                        }`}>
                                        <Icon className={`w-6 h-6 ${isActive ? 'text-[#c2703e]' : 'text-[#6b5e54]'}`} />
                                    </div>
                                    <div className="text-center">
                                        <p className={`font-semibold text-sm ${isActive ? 'text-[#c2703e]' : 'text-[#2d3436]'}`}>
                                            {option.label}
                                        </p>
                                        <p className="text-xs text-[#6b5e54] mt-0.5">{option.description}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ─── Notification Preferences ──────────────────── */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#f0ebe4] overflow-hidden">
                <div className="p-6 border-b border-[#f0ebe4]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-[#2d3436]">Notifications</h2>
                            <p className="text-sm text-[#6b5e54]">Choose what you want to be notified about</p>
                        </div>
                    </div>
                </div>
                <div className="divide-y divide-[#f0ebe4]">
                    {[
                        { key: 'orderUpdates' as const, label: 'Order Updates', desc: 'Get notified about order status changes', icon: Mail },
                        { key: 'promotions' as const, label: 'Promotions & Offers', desc: 'Receive exclusive deals and discounts', icon: Bell },
                        { key: 'newProducts' as const, label: 'New Products', desc: 'Be the first to know about new arrivals', icon: Bell },
                        { key: 'priceDrops' as const, label: 'Price Drop Alerts', desc: 'Get alerted when wishlist items go on sale', icon: Bell },
                        { key: 'newsletter' as const, label: 'Weekly Newsletter', desc: 'Curated artisan stories and product picks', icon: Mail },
                        { key: 'smsAlerts' as const, label: 'SMS Notifications', desc: 'Receive updates via text message', icon: Smartphone },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between px-6 py-4">
                            <div className="flex items-center gap-3">
                                <item.icon className="w-4 h-4 text-[#6b5e54]" />
                                <div>
                                    <p className="font-medium text-[#2d3436] text-sm">{item.label}</p>
                                    <p className="text-xs text-[#6b5e54]">{item.desc}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleNotificationChange(item.key)}
                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${notifications[item.key] ? 'bg-[#c2703e]' : 'bg-[#f0ebe4]'
                                    }`}
                            >
                                <span
                                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${notifications[item.key] ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Privacy & Security ────────────────────────── */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#f0ebe4] overflow-hidden">
                <div className="p-6 border-b border-[#f0ebe4]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-[#2d3436]">Privacy & Security</h2>
                            <p className="text-sm text-[#6b5e54]">Control your data and visibility</p>
                        </div>
                    </div>
                </div>
                <div className="divide-y divide-[#f0ebe4]">
                    {[
                        { key: 'showProfile' as const, label: 'Public Profile', desc: 'Allow others to see your profile', icon: Eye },
                        { key: 'showWishlist' as const, label: 'Public Wishlist', desc: 'Let others see your saved items', icon: Eye },
                        { key: 'showOrders' as const, label: 'Order History Visibility', desc: 'Show your past purchases on profile', icon: Eye },
                        { key: 'allowAnalytics' as const, label: 'Usage Analytics', desc: 'Help us improve with anonymous usage data', icon: Globe },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between px-6 py-4">
                            <div className="flex items-center gap-3">
                                <item.icon className="w-4 h-4 text-[#6b5e54]" />
                                <div>
                                    <p className="font-medium text-[#2d3436] text-sm">{item.label}</p>
                                    <p className="text-xs text-[#6b5e54]">{item.desc}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handlePrivacyChange(item.key)}
                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${privacy[item.key] ? 'bg-[#c2703e]' : 'bg-[#f0ebe4]'
                                    }`}
                            >
                                <span
                                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${privacy[item.key] ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Change Password */}
                <div className="px-6 py-4 border-t border-[#f0ebe4]">
                    <button className="flex items-center justify-between w-full group">
                        <div className="flex items-center gap-3">
                            <Lock className="w-4 h-4 text-[#6b5e54]" />
                            <div className="text-left">
                                <p className="font-medium text-[#2d3436] text-sm">Change Password</p>
                                <p className="text-xs text-[#6b5e54]">Update your account password</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#6b5e54] group-hover:text-[#c2703e] transition-colors" />
                    </button>
                </div>
            </section>

            {/* ─── Region & Language ──────────────────────────── */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#f0ebe4] overflow-hidden">
                <div className="p-6 border-b border-[#f0ebe4]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-[#2d3436]">Region & Language</h2>
                            <p className="text-sm text-[#6b5e54]">Configure your locale preferences</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#2d3436] mb-1.5">Language</label>
                        <select className="w-full px-4 py-2.5 border border-[#f0ebe4] rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e] transition-all">
                            <option value="en">English</option>
                            <option value="hi">हिन्दी (Hindi)</option>
                            <option value="bn">বাংলা (Bengali)</option>
                            <option value="ta">தமிழ் (Tamil)</option>
                            <option value="te">తెలుగు (Telugu)</option>
                            <option value="mr">मराठी (Marathi)</option>
                            <option value="gu">ગુજરાતી (Gujarati)</option>
                            <option value="kn">ಕನ್ನಡ (Kannada)</option>
                            <option value="ml">മലയാളം (Malayalam)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#2d3436] mb-1.5">Currency</label>
                        <select
                            className="w-full px-4 py-2.5 border border-[#f0ebe4] rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e] transition-all"
                            defaultValue="INR"
                        >
                            <option value="INR">₹ Indian Rupee (INR)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#2d3436] mb-1.5">Time Zone</label>
                        <select
                            className="w-full px-4 py-2.5 border border-[#f0ebe4] rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e] transition-all"
                            defaultValue="IST"
                        >
                            <option value="IST">India Standard Time (IST, UTC+5:30)</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* ─── Danger Zone ────────────────────────────────── */}
            <section className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden">
                <div className="p-6 border-b border-red-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-red-700">Danger Zone</h2>
                            <p className="text-sm text-red-500">Irreversible actions — proceed with caution</p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    {!showDeleteConfirm ? (
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-[#2d3436] text-sm">Delete Account</p>
                                <p className="text-xs text-[#6b5e54]">
                                    Permanently delete your account and all associated data
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                                Delete Account
                            </Button>
                        </div>
                    ) : (
                        <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                            <p className="text-sm text-red-700 font-medium mb-3">
                                Are you sure? This action cannot be undone. All your data, orders, and reviews will be permanently deleted.
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        toast.error('Account deletion is not available in this version');
                                    }}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Yes, Delete My Account
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
