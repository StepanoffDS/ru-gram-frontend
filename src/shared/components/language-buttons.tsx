'use client';

import { useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  COOKIE_NAME,
  defaultLanguage,
  Language,
  languages,
} from '@/shared/libs/i18n/config';
import { cn } from '@/shared/libs/utils';

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
    const languageCookie = cookies.find((cookie) =>
      cookie.trim().startsWith(`${COOKIE_NAME}=`),
    );
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
    <Select
      value={currentLocale}
      onValueChange={(value) => handleLanguageChange(value as Language)}
    >
      <SelectTrigger
        className={cn(className, 'h-8 w-36')}
        aria-label='Language selector'
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align='end'>
        {languages.map((lang) => (
          <SelectItem
            key={lang}
            value={lang}
          >
            {lang === 'ru' ? 'Русский' : lang === 'en' ? 'English' : null}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
