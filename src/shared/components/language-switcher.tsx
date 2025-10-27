'use client';

import { useEffect, useState } from 'react';

import {
  COOKIE_NAME,
  defaultLanguage,
  Language,
  languages,
} from '@/shared/libs/i18n/config';

import { Button } from './ui/button';

export function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState<Language>(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const handleLanguageChange = async () => {
    const currentIndex = languages.indexOf(currentLocale);
    const nextIndex = (currentIndex + 1) % languages.length;
    const nextLanguage = languages[nextIndex];

    document.cookie = `${COOKIE_NAME}=${nextLanguage}; path=/; max-age=31536000`;
    globalThis.location.reload();
  };

  return (
    <Button
      variant='outline'
      size='icon'
      onClick={mounted ? handleLanguageChange : undefined}
      className='h-10 w-10'
      disabled={!mounted}
    >
      <span className='text-sm font-semibold uppercase'>{currentLocale}</span>
      <span className='sr-only'>Switch language</span>
    </Button>
  );
}
