'use client';

import { Moon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

export function ThemeToggleSwitch() {
  const t = useTranslations('themeToggleSwitch');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='flex w-full items-center gap-2 rounded-md p-2 text-sm'>
        <Moon className='size-4' />
        {t('theme')}
        <span className='text-muted-foreground ml-auto'>{t('system')}</span>
      </div>
    );
  }

  const currentTheme = theme ?? 'system';

  return (
    <Select
      value={currentTheme}
      onValueChange={(value) => setTheme(value)}
    >
      <SelectTrigger
        aria-label={t('ariaLabel')}
        className='ml-auto h-8 w-36'
      >
        <SelectValue placeholder={t('system')} />
      </SelectTrigger>
      <SelectContent align='end'>
        <SelectItem value='light'>{t('light')}</SelectItem>
        <SelectItem value='dark'>{t('dark')}</SelectItem>
        <SelectItem value='system'>{t('system')}</SelectItem>
      </SelectContent>
    </Select>
  );
}
