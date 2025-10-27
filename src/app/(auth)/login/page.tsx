import { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import { LoginWrapper } from '@/features/auth/ui/login-wrapper';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.login');
  return {
    title: t('heading'),
  };
}

export default function LoginAccountPage() {
  return <LoginWrapper />;
}
