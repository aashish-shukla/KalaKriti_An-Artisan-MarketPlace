// artisan/app/(account)/account/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
    Sun, Moon, Monitor, Bell, Shield, Lock, Globe, Trash2,
    Eye, Smartphone, Mail, ChevronRight, Download, Link2, Unlink,
    KeyRound, Fingerprint, MonitorSmartphone, LogOut,
    Check, X, AlertTriangle, Sparkles, EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useThemeStore, type Theme } from '@/lib/store/themeStore';
import { useAuthStore } from '@/lib/store/authStore';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { authService } from '@/lib/api/services';
import toast from 'react-hot-toast';

// ─── Password Strength Checker ─────────────────────────────────
function getPasswordStrength(password: string): { score: number; label: string; color: string } {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score, label: 'Weak', color: '#e74c3c' };
    if (score <= 2) return { score, label: 'Fair', color: '#e67e22' };
    if (score <= 3) return { score, label: 'Good', color: '#f39c12' };
    if (score <= 4) return { score, label: 'Strong', color: '#2d9f6f' };
    return { score, label: 'Excellent', color: '#27ae60' };
}

// ─── Toggle Switch Component ───────────────────────────────────
function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <button
            onClick={onChange}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 ${checked
                ? 'bg-gradient-to-r from-[#c2703e] to-[#daa520] shadow-[0_0_12px_rgba(194,112,62,0.3)]'
                : 'bg-[#e8e3dc]'
                }`}
        >
            <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${checked ? 'translate-x-5 scale-110' : 'translate-x-0'
                    }`}
            />
        </button>
    );
}

// ─── Section Header ────────────────────────────────────────────
function SectionHeader({
    icon: Icon,
    title,
    description,
    gradient,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    gradient: string;
}) {
    return (
        <div className="p-6 border-b border-[#f0ebe4]">
            <div className="flex items-center gap-3">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ background: gradient }}
                >
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="font-bold text-[#2d3436]">{title}</h2>
                    <p className="text-sm text-[#6b5e54]">{description}</p>
                </div>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const { theme, setTheme } = useThemeStore();
    const { user, logout } = useAuthStore();
    const {
        notifications,
        privacy,
        locale,
        connectedAccounts,
        twoFactor,
        setNotification,
        setPrivacy,
        setLocale,
        setConnectedAccount,
        setTwoFactor,
    } = useSettingsStore();

    // ─── Change Password Modal ─────────────────────────────────
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // ─── Delete Account Modal ──────────────────────────────────
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    // ─── 2FA Modal ─────────────────────────────────────────────
    const [show2FAModal, setShow2FAModal] = useState(false);

    // Animation entry state
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const passwordStrength = getPasswordStrength(passwordForm.newPassword);

    const themeOptions: { value: Theme; label: string; icon: React.ElementType; description: string; preview: string }[] = [
        { value: 'light', label: 'Light', icon: Sun, description: 'Warm and bright', preview: 'linear-gradient(135deg, #fdf8f4 0%, #f0ebe4 100%)' },
        { value: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes', preview: 'linear-gradient(135deg, #1a1a24 0%, #252530 100%)' },
        { value: 'system', label: 'System', icon: Monitor, description: 'Auto-detect', preview: 'linear-gradient(135deg, #fdf8f4 0%, #1a1a24 100%)' },
    ];

    // ─── Handle Password Change ────────────────────────────────
    const handlePasswordChange = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (passwordForm.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }
        setIsChangingPassword(true);
        try {
            await authService.changePassword(
                passwordForm.currentPassword,
                passwordForm.newPassword
            );
            toast.success('Password changed successfully! 🔒');
            setShowPasswordModal(false);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            toast.error(error.message || 'Failed to change password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    // ─── Handle Theme Change ───────────────────────────────────
    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);
        toast.success(`Theme changed to ${newTheme}`);
    };

    // ─── Handle Data Export ────────────────────────────────────
    const handleDataExport = () => {
        const exportData = {
            profile: {
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
                phone: user?.phone,
                role: user?.role,
                createdAt: user?.createdAt,
            },
            preferences: {
                notifications,
                privacy,
                locale,
                theme,
            },
            exportedAt: new Date().toISOString(),
            platform: 'KalaKriti Artisan Marketplace',
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kalakriti-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Your data has been downloaded! 📦');
    };

    // ─── Handle Delete Account ─────────────────────────────────
    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') {
            toast.error('Please type DELETE to confirm');
            return;
        }
        if (!deletePassword) {
            toast.error('Please enter your password');
            return;
        }
        setIsDeletingAccount(true);
        try {
            // The backend doesn't have this endpoint yet, but the UI flow is complete
            toast.error('Account deletion requires backend support. Please contact support.');
            setShowDeleteModal(false);
        } finally {
            setIsDeletingAccount(false);
            setDeletePassword('');
            setDeleteConfirmText('');
        }
    };

    // Mock session data
    const activeSessions = [
        {
            id: '1',
            device: 'This Device',
            browser: typeof navigator !== 'undefined' ? navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Safari' : 'Browser',
            location: 'Current Session',
            lastActive: 'Now',
            isCurrent: true,
        },
        {
            id: '2',
            device: 'iPhone 15 Pro',
            browser: 'Safari Mobile',
            location: 'Mumbai, India',
            lastActive: '2 hours ago',
            isCurrent: false,
        },
        {
            id: '3',
            device: 'iPad Air',
            browser: 'Safari',
            location: 'Delhi, India',
            lastActive: '3 days ago',
            isCurrent: false,
        },
    ];

    const [sessions, setSessions] = useState(activeSessions);

    const handleRevokeSession = (sessionId: string) => {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        toast.success('Session revoked');
    };

    const handleRevokeAllSessions = () => {
        setSessions((prev) => prev.filter((s) => s.isCurrent));
        toast.success('All other sessions have been revoked');
    };

    return (
        <div className={`space-y-6 max-w-3xl transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#2d3436]" style={{ fontFamily: 'var(--font-serif)' }}>
                        Settings
                    </h1>
                    <p className="text-[#6b5e54] mt-1">Manage your preferences and account security</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#c2703e]/5 to-[#daa520]/5 rounded-xl border border-[#c2703e]/10">
                    <Sparkles className="w-4 h-4 text-[#c2703e]" />
                    <span className="text-sm font-medium text-[#c2703e]">Pro Settings</span>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════
                1. APPEARANCE / THEME
            ═══════════════════════════════════════════════════════ */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#f0ebe4] overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
                <SectionHeader
                    icon={Sun}
                    title="Appearance"
                    description="Choose how the app looks for you"
                    gradient="var(--gradient-primary)"
                />
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {themeOptions.map((option) => {
                            const Icon = option.icon;
                            const isActive = theme === option.value;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => handleThemeChange(option.value)}
                                    className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-300 group ${isActive
                                        ? 'border-[#c2703e] shadow-[0_0_20px_rgba(194,112,62,0.12)] scale-[1.02]'
                                        : 'border-[#f0ebe4] hover:border-[#c2703e]/30 hover:shadow-md'
                                        }`}
                                >
                                    {isActive && (
                                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                    <div
                                        className="w-14 h-14 rounded-xl shadow-inner border border-[#f0ebe4] transition-transform duration-300 group-hover:scale-105"
                                        style={{ background: option.preview }}
                                    />
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

            {/* ═══════════════════════════════════════════════════════
                2. SECURITY
            ═══════════════════════════════════════════════════════ */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#f0ebe4] overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <SectionHeader
                    icon={Shield}
                    title="Security"
                    description="Protect your account with advanced security"
                    gradient="linear-gradient(135deg, #2d9f6f 0%, #27ae60 100%)"
                />

                {/* Change Password */}
                <div className="px-6 py-4 border-b border-[#f0ebe4]">
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="flex items-center justify-between w-full group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#c2703e]/10 flex items-center justify-center">
                                <KeyRound className="w-4 h-4 text-[#c2703e]" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-[#2d3436] text-sm">Change Password</p>
                                <p className="text-xs text-[#6b5e54]">Update your account password</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#6b5e54] group-hover:text-[#c2703e] group-hover:translate-x-0.5 transition-all" />
                    </button>
                </div>

                {/* Two-Factor Authentication */}
                <div className="px-6 py-4 border-b border-[#f0ebe4]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Fingerprint className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-[#2d3436] text-sm">Two-Factor Authentication</p>
                                    {twoFactor.enabled && (
                                        <span className="px-1.5 py-0.5 bg-[#2d9f6f]/10 text-[#2d9f6f] text-[10px] font-bold rounded-md uppercase">Active</span>
                                    )}
                                </div>
                                <p className="text-xs text-[#6b5e54]">Add an extra layer of security</p>
                            </div>
                        </div>
                        <ToggleSwitch
                            checked={twoFactor.enabled}
                            onChange={() => {
                                if (twoFactor.enabled) {
                                    setTwoFactor({ enabled: false, method: null });
                                    toast.success('Two-factor authentication disabled');
                                } else {
                                    setShow2FAModal(true);
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Active Sessions */}
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                                <MonitorSmartphone className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-[#2d3436] text-sm">Active Sessions</p>
                                <p className="text-xs text-[#6b5e54]">{sessions.length} device{sessions.length !== 1 ? 's' : ''} logged in</p>
                            </div>
                        </div>
                        {sessions.length > 1 && (
                            <button
                                onClick={handleRevokeAllSessions}
                                className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                            >
                                Sign out all others
                            </button>
                        )}
                    </div>
                    <div className="space-y-2 ml-12">
                        {sessions.map((session) => (
                            <div key={session.id} className="flex items-center justify-between p-3 bg-[#faf6f1] rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${session.isCurrent ? 'bg-[#2d9f6f]' : 'bg-[#6b5e54]'}`} />
                                    <div>
                                        <p className="text-sm font-medium text-[#2d3436]">
                                            {session.device}
                                            {session.isCurrent && <span className="text-[#2d9f6f] text-xs ml-1">(current)</span>}
                                        </p>
                                        <p className="text-xs text-[#6b5e54]">{session.browser} • {session.lastActive}</p>
                                    </div>
                                </div>
                                {!session.isCurrent && (
                                    <button
                                        onClick={() => handleRevokeSession(session.id)}
                                        className="text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        Revoke
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                3. NOTIFICATION PREFERENCES  (persisted)
            ═══════════════════════════════════════════════════════ */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#f0ebe4] overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                <SectionHeader
                    icon={Bell}
                    title="Notifications"
                    description="Choose what you want to be notified about"
                    gradient="linear-gradient(135deg, #3498db 0%, #2980b9 100%)"
                />
                <div className="divide-y divide-[#f0ebe4]">
                    {([
                        { key: 'orderUpdates' as const, label: 'Order Updates', desc: 'Get notified about order status changes', icon: Mail },
                        { key: 'promotions' as const, label: 'Promotions & Offers', desc: 'Exclusive deals and discounts', icon: Bell },
                        { key: 'newProducts' as const, label: 'New Products', desc: 'Be the first to know about new arrivals', icon: Sparkles },
                        { key: 'priceDrops' as const, label: 'Price Drop Alerts', desc: 'Get alerted when wishlist items go on sale', icon: Bell },
                        { key: 'newsletter' as const, label: 'Weekly Newsletter', desc: 'Curated artisan stories and picks', icon: Mail },
                        { key: 'smsAlerts' as const, label: 'SMS Notifications', desc: 'Receive updates via text message', icon: Smartphone },
                    ]).map((item) => (
                        <div key={item.key} className="flex items-center justify-between px-6 py-4 hover:bg-[#faf6f1]/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <item.icon className="w-4 h-4 text-[#6b5e54]" />
                                <div>
                                    <p className="font-medium text-[#2d3436] text-sm">{item.label}</p>
                                    <p className="text-xs text-[#6b5e54]">{item.desc}</p>
                                </div>
                            </div>
                            <ToggleSwitch
                                checked={notifications[item.key]}
                                onChange={() => {
                                    setNotification(item.key, !notifications[item.key]);
                                    toast.success(
                                        `${item.label} ${!notifications[item.key] ? 'enabled' : 'disabled'}`,
                                        { icon: !notifications[item.key] ? '🔔' : '🔕' }
                                    );
                                }}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                4. PRIVACY & VISIBILITY  (persisted)
            ═══════════════════════════════════════════════════════ */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#f0ebe4] overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <SectionHeader
                    icon={Eye}
                    title="Privacy & Visibility"
                    description="Control your data and who can see what"
                    gradient="linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%)"
                />
                <div className="divide-y divide-[#f0ebe4]">
                    {([
                        { key: 'showProfile' as const, label: 'Public Profile', desc: 'Allow others to see your profile', icon: Eye },
                        { key: 'showWishlist' as const, label: 'Public Wishlist', desc: 'Let others see your saved items', icon: Eye },
                        { key: 'showOrders' as const, label: 'Order History Visibility', desc: 'Show your past purchases on profile', icon: EyeOff },
                        { key: 'allowAnalytics' as const, label: 'Usage Analytics', desc: 'Help us improve with anonymous data', icon: Globe },
                    ]).map((item) => (
                        <div key={item.key} className="flex items-center justify-between px-6 py-4 hover:bg-[#faf6f1]/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <item.icon className="w-4 h-4 text-[#6b5e54]" />
                                <div>
                                    <p className="font-medium text-[#2d3436] text-sm">{item.label}</p>
                                    <p className="text-xs text-[#6b5e54]">{item.desc}</p>
                                </div>
                            </div>
                            <ToggleSwitch
                                checked={privacy[item.key]}
                                onChange={() => {
                                    setPrivacy(item.key, !privacy[item.key]);
                                    toast.success(`${item.label} ${!privacy[item.key] ? 'enabled' : 'disabled'}`);
                                }}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                5. CONNECTED ACCOUNTS
            ═══════════════════════════════════════════════════════ */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#f0ebe4] overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                <SectionHeader
                    icon={Link2}
                    title="Connected Accounts"
                    description="Link your social accounts for easier sign-in"
                    gradient="linear-gradient(135deg, #e67e22 0%, #d35400 100%)"
                />
                <div className="divide-y divide-[#f0ebe4]">
                    {connectedAccounts.map((account) => (
                        <div key={account.provider} className="flex items-center justify-between px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${account.provider === 'google'
                                    ? 'bg-red-50'
                                    : 'bg-blue-50'
                                    }`}>
                                    {account.provider === 'google' ? (
                                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-[#2d3436] text-sm capitalize">{account.provider}</p>
                                    {account.connected ? (
                                        <p className="text-xs text-[#2d9f6f]">Connected{account.email ? ` • ${account.email}` : ''}</p>
                                    ) : (
                                        <p className="text-xs text-[#6b5e54]">Not connected</p>
                                    )}
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant={account.connected ? 'outline' : 'primary'}
                                onClick={() => {
                                    if (account.connected) {
                                        setConnectedAccount(account.provider, false);
                                        toast.success(`${account.provider} disconnected`);
                                    } else {
                                        setConnectedAccount(
                                            account.provider,
                                            true,
                                            `user@${account.provider}.com`
                                        );
                                        toast.success(`${account.provider} connected!`);
                                    }
                                }}
                                className={account.connected ? 'text-red-500 border-red-200 hover:bg-red-50' : ''}
                            >
                                {account.connected ? (
                                    <><Unlink className="w-3 h-3 mr-1" /> Disconnect</>
                                ) : (
                                    <><Link2 className="w-3 h-3 mr-1" /> Connect</>
                                )}
                            </Button>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                6. REGION & LANGUAGE  (persisted)
            ═══════════════════════════════════════════════════════ */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#f0ebe4] overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <SectionHeader
                    icon={Globe}
                    title="Region & Language"
                    description="Configure your locale preferences"
                    gradient="linear-gradient(135deg, #16a085 0%, #1abc9c 100%)"
                />
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#2d3436] mb-1.5">Language</label>
                        <select
                            value={locale.language}
                            onChange={(e) => {
                                setLocale({ language: e.target.value });
                                toast.success('Language updated');
                            }}
                            className="w-full px-4 py-2.5 border border-[#f0ebe4] rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e] transition-all"
                        >
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
                            value={locale.currency}
                            onChange={(e) => {
                                setLocale({ currency: e.target.value });
                                toast.success('Currency updated');
                            }}
                            className="w-full px-4 py-2.5 border border-[#f0ebe4] rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e] transition-all"
                        >
                            <option value="INR">₹ Indian Rupee (INR)</option>
                            <option value="USD">$ US Dollar (USD)</option>
                            <option value="EUR">€ Euro (EUR)</option>
                            <option value="GBP">£ British Pound (GBP)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#2d3436] mb-1.5">Time Zone</label>
                        <select
                            value={locale.timezone}
                            onChange={(e) => {
                                setLocale({ timezone: e.target.value });
                                toast.success('Time zone updated');
                            }}
                            className="w-full px-4 py-2.5 border border-[#f0ebe4] rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e] transition-all"
                        >
                            <option value="IST">India Standard Time (IST, UTC+5:30)</option>
                            <option value="UTC">Coordinated Universal Time (UTC)</option>
                            <option value="EST">Eastern Standard Time (EST, UTC-5)</option>
                            <option value="PST">Pacific Standard Time (PST, UTC-8)</option>
                            <option value="GMT">Greenwich Mean Time (GMT)</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                7. DATA EXPORT
            ═══════════════════════════════════════════════════════ */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#f0ebe4] overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
                <SectionHeader
                    icon={Download}
                    title="Data & Privacy"
                    description="Download or manage your personal data"
                    gradient="linear-gradient(135deg, #2c3e50 0%, #34495e 100%)"
                />
                <div className="p-6">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#faf6f1] to-[#f0ebe4]/50 rounded-xl">
                        <div>
                            <p className="font-medium text-[#2d3436] text-sm">Download Your Data</p>
                            <p className="text-xs text-[#6b5e54] mt-0.5">
                                Get a copy of your profile, preferences, and activity in JSON format
                            </p>
                        </div>
                        <Button size="sm" variant="outline" onClick={handleDataExport}>
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            Export
                        </Button>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                8. DANGER ZONE
            ═══════════════════════════════════════════════════════ */}
            <section className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="p-6 border-b border-red-100 bg-gradient-to-r from-red-50/50 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-red-700">Danger Zone</h2>
                            <p className="text-sm text-red-500">Irreversible actions — proceed with extreme caution</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 border border-red-100 rounded-xl">
                        <div>
                            <p className="font-medium text-[#2d3436] text-sm">Deactivate Account</p>
                            <p className="text-xs text-[#6b5e54]">Temporarily disable your account</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toast('Account deactivation coming soon', { icon: '⏸️' })}
                            className="text-[#e67e22] border-[#e67e22]/30 hover:bg-[#e67e22]/5"
                        >
                            Deactivate
                        </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-xl bg-red-50/30">
                        <div>
                            <p className="font-medium text-red-700 text-sm">Delete Account</p>
                            <p className="text-xs text-red-500">Permanently delete your account and all data</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowDeleteModal(true)}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            Delete Account
                        </Button>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                MODALS
            ═══════════════════════════════════════════════════════ */}

            {/* Change Password Modal */}
            <Modal
                isOpen={showPasswordModal}
                onClose={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                title="Change Password"
                size="md"
            >
                <div className="space-y-4">
                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-medium text-[#2d3436] mb-1.5">Current Password</label>
                        <div className="relative">
                            <input
                                type={showPasswords.current ? 'text' : 'password'}
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                className="w-full px-4 py-2.5 pr-10 border border-[#f0ebe4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e] transition-all"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b5e54] hover:text-[#c2703e]"
                            >
                                {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-[#2d3436] mb-1.5">New Password</label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? 'text' : 'password'}
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                className="w-full px-4 py-2.5 pr-10 border border-[#f0ebe4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e] transition-all"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b5e54] hover:text-[#c2703e]"
                            >
                                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {/* Password Strength Indicator */}
                        {passwordForm.newPassword && (
                            <div className="mt-2">
                                <div className="flex gap-1 mb-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div
                                            key={i}
                                            className="h-1.5 flex-1 rounded-full transition-all duration-300"
                                            style={{
                                                backgroundColor: i <= passwordStrength.score ? passwordStrength.color : '#f0ebe4',
                                            }}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs font-medium" style={{ color: passwordStrength.color }}>
                                    {passwordStrength.label}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-[#2d3436] mb-1.5">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                className="w-full px-4 py-2.5 pr-10 border border-[#f0ebe4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e] transition-all"
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b5e54] hover:text-[#c2703e]"
                            >
                                {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <X className="w-3 h-3" /> Passwords do not match
                            </p>
                        )}
                        {passwordForm.confirmPassword && passwordForm.newPassword === passwordForm.confirmPassword && (
                            <p className="text-xs text-[#2d9f6f] mt-1 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Passwords match
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowPasswordModal(false);
                                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                            }}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePasswordChange}
                            isLoading={isChangingPassword}
                            disabled={
                                !passwordForm.currentPassword ||
                                !passwordForm.newPassword ||
                                passwordForm.newPassword !== passwordForm.confirmPassword ||
                                passwordForm.newPassword.length < 8
                            }
                            className="flex-1"
                        >
                            <Lock className="w-4 h-4 mr-1" />
                            Update Password
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* 2FA Setup Modal */}
            <Modal
                isOpen={show2FAModal}
                onClose={() => setShow2FAModal(false)}
                title="Enable Two-Factor Authentication"
                size="md"
            >
                <div className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl text-center">
                        <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-2xl shadow-md flex items-center justify-center">
                            <Fingerprint className="w-8 h-8 text-purple-600" />
                        </div>
                        <p className="text-sm text-[#2d3436] font-medium">Secure Your Account</p>
                        <p className="text-xs text-[#6b5e54] mt-1">
                            Two-factor authentication adds an extra layer of security to your account
                        </p>
                    </div>

                    <div className="space-y-2">
                        <button
                            onClick={() => {
                                setTwoFactor({ enabled: true, method: 'app' });
                                setShow2FAModal(false);
                                toast.success('2FA enabled via authenticator app! 🔐');
                            }}
                            className="w-full flex items-center gap-3 p-3 border border-[#f0ebe4] rounded-xl hover:bg-[#faf6f1] transition-colors text-left"
                        >
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <KeyRound className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="font-medium text-sm text-[#2d3436]">Authenticator App</p>
                                <p className="text-xs text-[#6b5e54]">Use Google Authenticator or similar</p>
                            </div>
                        </button>
                        <button
                            onClick={() => {
                                setTwoFactor({ enabled: true, method: 'sms' });
                                setShow2FAModal(false);
                                toast.success('2FA enabled via SMS! 📱');
                            }}
                            className="w-full flex items-center gap-3 p-3 border border-[#f0ebe4] rounded-xl hover:bg-[#faf6f1] transition-colors text-left"
                        >
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Smartphone className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-sm text-[#2d3436]">SMS Verification</p>
                                <p className="text-xs text-[#6b5e54]">Receive codes via text message</p>
                            </div>
                        </button>
                    </div>

                    <Button variant="outline" onClick={() => setShow2FAModal(false)} className="w-full">
                        Cancel
                    </Button>
                </div>
            </Modal>

            {/* Delete Account Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setDeletePassword('');
                    setDeleteConfirmText('');
                }}
                title="Delete Account"
                size="md"
            >
                <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-red-700">This action is permanent</p>
                                <p className="text-xs text-red-600 mt-1">
                                    Your account, orders, reviews, and all personal data will be permanently deleted.
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#2d3436] mb-1.5">
                            Enter your password to confirm
                        </label>
                        <input
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            className="w-full px-4 py-2.5 border border-red-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all"
                            placeholder="Your password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#2d3436] mb-1.5">
                            Type <span className="font-bold text-red-600">DELETE</span> to confirm
                        </label>
                        <input
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            className="w-full px-4 py-2.5 border border-red-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all"
                            placeholder="Type DELETE"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowDeleteModal(false);
                                setDeletePassword('');
                                setDeleteConfirmText('');
                            }}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteAccount}
                            isLoading={isDeletingAccount}
                            disabled={deleteConfirmText !== 'DELETE' || !deletePassword}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete Forever
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
