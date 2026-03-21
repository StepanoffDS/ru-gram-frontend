'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FindAllChatsByMeQuery } from '@/graphql/generated/output';
import {
  Card,
  CardContent,
  CardDescription,
} from '@/shared/components/ui/card';

import { ChatItem } from './chat-item';

interface ChatListProps {
  chats: FindAllChatsByMeQuery['findAllChatsByMe'];
  loading: boolean;
  error: Error | null;
  currentUserId?: string;
}

export function ChatList({
  chats,
  loading,
  error,
  currentUserId,
}: ChatListProps) {
  const t = useTranslations('chats');

  if (loading && chats.length === 0) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='size-8 animate-spin' />
        <span className='ml-2'>{t('loading')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className='text-destructive py-12 text-center'>
          {t('errorLoading')}: {error.message}
        </CardContent>
      </Card>
    );
  }

  if (chats.length === 0) {
    return (
      <Card>
        <CardContent className='py-12 text-center'>
          <CardDescription className='mb-2 text-lg font-semibold'>
            {t('noChats')}
          </CardDescription>
          <CardDescription>{t('noChatsDescription')}</CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          id={chat.id}
          users={chat.users}
          lastMessage={chat.messages?.[0] || null}
          currentUserId={currentUserId}
          unreadCount={chat.unreadCount}
        />
      ))}
    </div>
  );
}
