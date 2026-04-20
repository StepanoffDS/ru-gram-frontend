'use client';

import Link from 'next/link';

import { Languages, Moon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { LanguageButtons } from '@/shared/components/language-buttons';
import { PageHeader } from '@/shared/components/page-header';
import { SettingsOptionCard } from '@/shared/components/settings-option-card';
import { Button } from '@/shared/components/ui/button';
import { ThemeToggleSwitch } from '@/shared/components/theme-toggle-switch';
import { Shield } from 'lucide-react';

export default function SettingsPage() {
  const t = useTranslations('settingsPage');
  const { isAdmin } = useAuth();

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

        {isAdmin ? (
          <SettingsOptionCard
            title={t('moderationTitle')}
            description={t('moderationDescription')}
            icon={<Shield className='size-4' />}
          >
            <Button
              asChild
              variant='outline'
            >
              <Link href='/settings/moderation'>{t('moderationOpen')}</Link>
            </Button>
          </SettingsOptionCard>
        ) : null}
      </div>
    </div>
  );
}
