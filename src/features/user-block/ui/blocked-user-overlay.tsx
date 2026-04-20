'use client';

import { gql, useQuery } from '@apollo/client';
import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

const FIND_BLOCK_STATUS = gql`
  query FindBlockStatus {
    findMe {
      id
      isBlocked
      blockedBy {
        id
        username
        email
      }
    }
  }
`;

const FIND_SUPER_ADMINS_CONTACTS = gql`
  query FindSuperAdminsContacts {
    findSuperAdmins {
      id
      username
      email
      name
    }
  }
`;

type BlockStatusResponse = {
  findMe: {
    id: string;
    isBlocked: boolean;
    blockedBy: {
      id: string;
      username: string;
      email: string;
    } | null;
  };
};

type SuperAdminsResponse = {
  findSuperAdmins: Array<{
    id: string;
    username: string;
    email: string;
    name: string | null;
  }>;
};

export function BlockedUserOverlay() {
  const t = useTranslations('blockedOverlay');
  const { data, loading } = useQuery<BlockStatusResponse>(FIND_BLOCK_STATUS, {
    fetchPolicy: 'network-only',
    pollInterval: 15000,
  });

  const { data: superAdminsData } = useQuery<SuperAdminsResponse>(
    FIND_SUPER_ADMINS_CONTACTS,
    {
      skip: !data?.findMe?.isBlocked,
      fetchPolicy: 'network-only',
    },
  );

  if (loading || !data?.findMe?.isBlocked) {
    return null;
  }

  const blocker = data.findMe.blockedBy?.username
    ? `@${data.findMe.blockedBy.username}`
    : t('unknownBlocker');

  return (
    <div
      className='absolute inset-0 z-[120] flex items-center justify-center p-4'
      style={{ backdropFilter: 'blur(2px)' }}
    >
      <Card className='w-full max-w-2xl'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <AlertTriangle className='size-5 text-red-500' />
            {t('title')}
          </CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-muted-foreground text-sm'>
            {t('blockedBy', { blocker })}
          </p>
          <div className='space-y-2'>
            <p className='text-sm font-medium'>{t('contactsTitle')}</p>
            {superAdminsData?.findSuperAdmins?.length ? (
              <ul className='space-y-2'>
                {superAdminsData.findSuperAdmins.map((admin) => {
                  const displayName = admin.name || admin.username;
                  return (
                    <li
                      key={admin.id}
                      className='rounded-md border p-3'
                    >
                      <p className='text-sm font-medium'>{displayName}</p>
                      <p className='text-muted-foreground text-xs'>
                        @{admin.username}
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        {admin.email}
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className='text-muted-foreground text-sm'>
                {t('contactsEmpty')}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
