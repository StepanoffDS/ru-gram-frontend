'use client';

import Link from 'next/link';

import { useTranslations } from 'next-intl';

import { LoginAccountForm } from '@/features/auth';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
} from '@/shared/components/ui/alert-dialog';

interface AuthWarningProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function AuthWarning({ isOpen, setIsOpen }: AuthWarningProps) {
  const t = useTranslations('auth.authWarning');
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader className='mb-2 text-2xl font-semibold'>
          {t('title')}
        </AlertDialogHeader>
        <LoginAccountForm
          cancelButton={
            <AlertDialogCancel
              onClick={() => setIsOpen(false)}
              className='mr-2'
            >
              {t('cancelButton')}
            </AlertDialogCancel>
          }
        />
        <p className='text-sm text-gray-500'>
          {t('noAccount')}
          <Link
            href='/register'
            className='text-primary'
          >
            {t.raw('registerButton')}
          </Link>
        </p>
      </AlertDialogContent>
    </AlertDialog>
  );
}
