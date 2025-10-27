'use client';

import { useTranslations } from 'next-intl';

import { ProfileEdit } from '@/features/profile-edit';
import { useFindMeQuery } from '@/graphql/generated/output';
import { PageHeader } from '@/shared/components/page-header';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function ProfileEditPage() {
  const { data: meData, loading: meLoading, error: meError } = useFindMeQuery();
  const t = useTranslations('profileEdit');

  if (meLoading) {
    return (
      <div className='mx-auto max-w-2xl'>
        <div className='space-y-6'>
          <div className='flex items-center space-x-4'>
            <Skeleton className='h-8 w-8' />
            <Skeleton className='h-8 w-32' />
          </div>
          <Skeleton className='h-96 w-full' />
        </div>
      </div>
    );
  }

  if (meError || !meData?.findMe) {
    return (
      <div className='mx-auto max-w-2xl'>
        <div className='text-center text-gray-500 dark:text-gray-400'>
          {t('errorLoadingProfile')}
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-2xl'>
      <div>
        <PageHeader title={t('title')} />

        <ProfileEdit profile={meData.findMe} />
      </div>
    </div>
  );
}
