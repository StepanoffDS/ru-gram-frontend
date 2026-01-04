import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { Button } from './ui/button';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  withBackButton?: boolean;
}

export function PageHeader({
  title,
  onBack,
  withBackButton = true,
}: PageHeaderProps) {
  const router = useRouter();
  const t = useTranslations('pageHeader');
  return (
    <div className='mb-4 flex items-center space-x-4'>
      {withBackButton && (
        <Button
          variant='ghost'
          size='sm'
          onClick={onBack || router.back}
          className='p-2'
        >
          ← <span className='hidden sm:inline'>{t('backButtonLabel')}</span>
        </Button>
      )}
      <h1
        className='text-md font-bold text-gray-900 md:text-2xl dark:text-white'
        data-heading-tag='H1'
      >
        {title}
      </h1>
    </div>
  );
}
