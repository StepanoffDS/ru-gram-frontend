'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import { MessageItem } from '@/entities/message/ui/message-item';
import { Card, CardContent, CardDescription } from '@/shared/components/ui/card';

interface Message {
  id: string;
  content: string;
  images: string[];
  createdAt: Date;
  user: {
    id: string;
    username: string;
    name: string | null;
    avatar: string | null;
  };
}

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  error: Error | null;
  currentUserId?: string;
}

export function MessageList({
  messages,
  loading,
  error,
  currentUserId,
}: MessageListProps) {
  const t = useTranslations('chats.chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Прокрутка вниз при загрузке сообщений
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading && messages.length === 0) {
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

  if (messages.length === 0) {
    return (
      <Card>
        <CardContent className='py-12 text-center'>
          <CardDescription className='text-lg font-semibold mb-2'>
            {t('noMessages')}
          </CardDescription>
          <CardDescription>{t('noMessagesDescription')}</CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='flex flex-col'>
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          {...message}
          currentUserId={currentUserId}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
