'use client';

import { useTranslations } from 'next-intl';

import { ChatList } from '@/entities/chat-list/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useFindAllChatsByMeQuery } from '@/graphql/generated/output';
import { PageHeader } from '@/shared/components/page-header';

export default function ChatsPage() {
  const t = useTranslations('chats');
  const { userId } = useAuth();
  const { data, loading, error } = useFindAllChatsByMeQuery();

  const chats = data?.findAllChatsByMe || [];

  return (
    <div className='flex h-full flex-col'>
      <PageHeader
        title={t('title')}
        withBackButton={false}
      />
      <div className='mt-4 flex-1 overflow-y-auto'>
        <ChatList
          chats={chats}
          loading={loading}
          error={error as Error}
          currentUserId={userId || undefined}
        />
      </div>
    </div>
  );
}
