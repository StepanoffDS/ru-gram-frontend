'use client';

import { useEffect, useState } from 'react';

import { COOKIE_NAME, defaultLanguage, Language, languages } from '@/shared/libs/i18n/config';

import { cn } from '../libs/utils';

interface LanguageButtonsProps {
  className?: string;
}

export function LanguageButtons({ className }: LanguageButtonsProps) {
  const [currentLocale, setCurrentLocale] = useState<Language>(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get current locale from cookie
    const cookies = document.cookie.split(';');
    const languageCookie = cookies.find((cookie) => cookie.trim().startsWith(`${COOKIE_NAME}=`));
    if (languageCookie) {
      const value = languageCookie.split('=')[1];
      if (languages.includes(value as Language)) {
        setCurrentLocale(value as Language);
      }
    }
  }, []);

  const handleLanguageChange = (language: Language) => {
    if (language === currentLocale) return;

    // Set cookie directly
    document.cookie = `${COOKIE_NAME}=${language}; path=/; max-age=31536000`;
    globalThis.location.reload();
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={cn('flex gap-2', className)}>
      {languages.map((lang) => {
        const isActive = lang === currentLocale;
        return (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={`flex-1 rounded-md px-2 py-1 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-accent text-accent-foreground hover:bg-accent/80'
            }`}
            aria-label={`Switch to ${lang.toUpperCase()}`}
          >
            {lang.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
