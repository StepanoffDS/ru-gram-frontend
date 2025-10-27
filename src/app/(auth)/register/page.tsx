import { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import { CreateAccountForm } from '@/features/auth';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.register');
  return {
    title: t('heading'),
  };
}

export default function CreateAccountPage() {
  return <CreateAccountForm />;
}
