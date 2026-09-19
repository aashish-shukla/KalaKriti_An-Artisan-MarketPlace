// artisan/src/lib/i18n/index.ts
'use client';

import { useEffect, useMemo } from 'react';
import { useSettingsStore } from '@/lib/store/settingsStore';
import en, { type TranslationKeys } from './locales/en';
import hi from './locales/hi';
import bn from './locales/bn';
import ta from './locales/ta';
import te from './locales/te';
import mr from './locales/mr';
import gu from './locales/gu';
import kn from './locales/kn';
import ml from './locales/ml';

const translations: Record<string, TranslationKeys> = {
  en, hi, bn, ta, te, mr, gu, kn, ml,
};

/**
 * Resolve a dot-notation key (e.g. "nav.products") against a translations object.
 * Falls back to English if the key is not found in the current language.
 */
function resolve(obj: any, path: string): string {
  const value = path.split('.').reduce((acc, key) => acc?.[key], obj);
  if (typeof value === 'string') return value;
  // Fallback to English
  const fallback = path.split('.').reduce((acc: any, key: string) => acc?.[key], en);
  return typeof fallback === 'string' ? fallback : path;
}

/**
 * Interpolate variables in a translation string.
 * e.g. "Hello {name}" with { name: "World" } → "Hello World"
 */
function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
    str,
  );
}

/**
 * React hook that provides translation functions.
 * Reads the language from the settings store (persisted in localStorage).
 *
 * Usage:
 *   const { t, lang } = useTranslation();
 *   <p>{t('nav.products')}</p>
 *   <p>{t('common.onlyLeft', { count: 3 })}</p>
 */
export function useTranslation() {
  const language = useSettingsStore((state) => state.locale.language);
  const currentTranslations = translations[language] || en;

  const t = useMemo(() => {
    return (key: string, vars?: Record<string, string | number>): string => {
      const raw = resolve(currentTranslations, key);
      return interpolate(raw, vars);
    };
  }, [currentTranslations]);

  return { t, lang: language };
}

/**
 * Provider component that keeps the <html lang> attribute in sync
 * with the user's chosen language.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSettingsStore((state) => state.locale.language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return <>{children}</>;
}

export type { TranslationKeys };
