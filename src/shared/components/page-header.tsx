import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { cn } from '@/shared/libs/utils';

import { Button } from './ui/button';

interface PageHeaderProps {
  title: string | React.ReactNode;
  onBack?: () => void;
  withBackButton?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  onBack,
  withBackButton = true,
  className,
}: PageHeaderProps) {
  const router = useRouter();
  const t = useTranslations('pageHeader');
  return (
    <div className={cn('mb-4 flex items-center space-x-4', className)}>
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
