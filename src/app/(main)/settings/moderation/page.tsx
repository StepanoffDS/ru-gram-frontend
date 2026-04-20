'use client';

import { useTranslations } from 'next-intl';

import { PageHeader } from '@/shared/components/page-header';
import { ModerationView } from '@/views/moderation';

export default function ModerationPage() {
  const t = useTranslations('moderationPage');

  return (
    <div className='mx-auto w-full max-w-3xl'>
      <PageHeader title={t('title')} />
      <ModerationView />
    </div>
  );
}
