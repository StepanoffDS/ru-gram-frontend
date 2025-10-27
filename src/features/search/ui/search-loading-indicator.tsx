'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SearchLoadingIndicatorProps {
  message?: string;
}

export function SearchLoadingIndicator({
  message,
}: SearchLoadingIndicatorProps) {
  const t = useTranslations('searchLoadingIndicator');
  return (
    <div className='flex items-center justify-center py-8'>
      <Loader2 className='mr-2 h-6 w-6 animate-spin' />
      <span className='text-muted-foreground'>{message || t('loading')}</span>
    </div>
  );
}
