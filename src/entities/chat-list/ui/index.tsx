'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ChatItem } from './chat-item';
import { Card, CardContent, CardDescription } from '@/shared/components/ui/card';

interface Chat {
  id: string;
  users: Array<{
    id: string;
    username: string;
    name: string | null;
    avatar: string | null;
  }>;
  messages?: Array<{
    content: string;
    createdAt: Date;
    user: {
      username: string;
    };
  }> | null;
}

interface ChatListProps {
  chats: Chat[];
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
        <CardContent className='py-12 text-center text-destructive'>
          {t('errorLoading')}: {error.message}
        </CardContent>
      </Card>
    );
  }

  if (chats.length === 0) {
    return (
      <Card>
        <CardContent className='py-12 text-center'>
          <CardDescription className='text-lg font-semibold mb-2'>
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
        />
      ))}
    </div>
  );
}
