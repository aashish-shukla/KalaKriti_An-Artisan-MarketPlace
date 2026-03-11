// artisan/src/lib/store/settingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NotificationPreferences {
    orderUpdates: boolean;
    promotions: boolean;
    newProducts: boolean;
    priceDrops: boolean;
    newsletter: boolean;
    smsAlerts: boolean;
}

export interface PrivacySettings {
    showProfile: boolean;
    showWishlist: boolean;
    showOrders: boolean;
    allowAnalytics: boolean;
}

export interface ConnectedAccount {
    provider: 'google' | 'facebook';
    connected: boolean;
    email?: string;
    connectedAt?: string;
}

export interface LocaleSettings {
    language: string;
    currency: string;
    timezone: string;
}

export interface TwoFactorSettings {
    enabled: boolean;
    method: 'app' | 'sms' | null;
}

interface SettingsState {
    notifications: NotificationPreferences;
    privacy: PrivacySettings;
    locale: LocaleSettings;
    connectedAccounts: ConnectedAccount[];
    twoFactor: TwoFactorSettings;

    // Actions
    setNotification: (key: keyof NotificationPreferences, value: boolean) => void;
    setPrivacy: (key: keyof PrivacySettings, value: boolean) => void;
    setLocale: (updates: Partial<LocaleSettings>) => void;
    setConnectedAccount: (provider: 'google' | 'facebook', connected: boolean, email?: string) => void;
    setTwoFactor: (updates: Partial<TwoFactorSettings>) => void;
    resetSettings: () => void;
}

const defaultNotifications: NotificationPreferences = {
    orderUpdates: true,
    promotions: false,
    newProducts: true,
    priceDrops: true,
    newsletter: false,
    smsAlerts: false,
};

const defaultPrivacy: PrivacySettings = {
    showProfile: true,
    showWishlist: false,
    showOrders: false,
    allowAnalytics: true,
};

const defaultLocale: LocaleSettings = {
    language: 'en',
    currency: 'INR',
    timezone: 'IST',
};

const defaultConnectedAccounts: ConnectedAccount[] = [
    { provider: 'google', connected: false },
    { provider: 'facebook', connected: false },
];

const defaultTwoFactor: TwoFactorSettings = {
    enabled: false,
    method: null,
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            notifications: { ...defaultNotifications },
            privacy: { ...defaultPrivacy },
            locale: { ...defaultLocale },
            connectedAccounts: [...defaultConnectedAccounts],
            twoFactor: { ...defaultTwoFactor },

            setNotification: (key, value) =>
                set((state) => ({
                    notifications: { ...state.notifications, [key]: value },
                })),

            setPrivacy: (key, value) =>
                set((state) => ({
                    privacy: { ...state.privacy, [key]: value },
                })),

            setLocale: (updates) =>
                set((state) => ({
                    locale: { ...state.locale, ...updates },
                })),

            setConnectedAccount: (provider, connected, email) =>
                set((state) => ({
                    connectedAccounts: state.connectedAccounts.map((account) =>
                        account.provider === provider
                            ? {
                                ...account,
                                connected,
                                email: connected ? email : undefined,
                                connectedAt: connected ? new Date().toISOString() : undefined,
                            }
                            : account
                    ),
                })),

            setTwoFactor: (updates) =>
                set((state) => ({
                    twoFactor: { ...state.twoFactor, ...updates },
                })),

            resetSettings: () =>
                set({
                    notifications: { ...defaultNotifications },
                    privacy: { ...defaultPrivacy },
                    locale: { ...defaultLocale },
                    connectedAccounts: [...defaultConnectedAccounts],
                    twoFactor: { ...defaultTwoFactor },
                }),
        }),
        {
            name: 'kalakriti-settings',
        }
    )
);
