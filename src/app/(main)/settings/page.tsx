'use client';

import { Languages, Moon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { LanguageButtons } from '@/shared/components/language-buttons';
import { PageHeader } from '@/shared/components/page-header';
import { SettingsOptionCard } from '@/shared/components/settings-option-card';
import { ThemeToggleSwitch } from '@/shared/components/theme-toggle-switch';

export default function SettingsPage() {
  const t = useTranslations('settingsPage');

  return (
    <div className='mx-auto w-full max-w-2xl'>
      <PageHeader title={t('title')} />

      <div className='space-y-4'>
        <SettingsOptionCard
          title={t('languageTitle')}
          description={t('languageDescription')}
          icon={<Languages className='size-4' />}
        >
          <LanguageButtons className='w-full sm:w-[180px]' />
        </SettingsOptionCard>

        <SettingsOptionCard
          title={t('themeTitle')}
          description={t('themeDescription')}
          icon={<Moon className='size-4' />}
        >
          <ThemeToggleSwitch />
        </SettingsOptionCard>
      </div>
    </div>
  );
}
