'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface EmptySearchStateProps {
  type: 'posts' | 'users';
}

export function EmptySearchState({ type }: EmptySearchStateProps) {
  const t = useTranslations('searchTabs');
  const message =
    type === 'posts' ? t('emptySearchStatePosts') : t('emptySearchStateUsers');

  return (
    <div className='py-12 text-center'>
      <Search className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
      <p className='text-muted-foreground text-lg'>{message}</p>
    </div>
  );
}
