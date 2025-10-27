import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { Button } from './ui/button';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
}

export function PageHeader({ title, onBack }: PageHeaderProps) {
  const router = useRouter();
  const t = useTranslations('pageHeader');
  return (
    <div className='mb-4 flex items-center space-x-4'>
      <Button
        variant='ghost'
        size='sm'
        onClick={onBack || router.back}
        className='p-2'
      >
        ← <span className='hidden sm:inline'>{t('backButtonLabel')}</span>
      </Button>
      <h1 className='text-md font-bold text-gray-900 md:text-2xl dark:text-white'>
        {title}
      </h1>
    </div>
  );
}
