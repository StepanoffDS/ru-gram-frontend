'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { MessageItem } from '@/entities/message/ui/message-item';
import { Card, CardContent, CardDescription } from '@/shared/components/ui/card';

interface Message {
  id: string;
  content: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  isReadByOtherUser: boolean;
  replyTo?: {
    id: string;
    content: string;
    user: {
      id: string;
      username: string;
      name: string | null;
    };
  } | null;
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
  onDeleteMessage?: (id: string) => void;
  onUpdateMessage?: (id: string, content: string) => void;
  onReplyMessage?: (message: {
    id: string;
    content: string;
    user: {
      id: string;
      username: string;
      name: string | null;
    };
  }) => void;
  deletingMessageId?: string | null;
  updatingMessageId?: string | null;
}

export function MessageList({
  messages,
  loading,
  error,
  currentUserId,
  onDeleteMessage,
  onUpdateMessage,
  onReplyMessage,
  deletingMessageId,
  updatingMessageId,
}: MessageListProps) {
  const t = useTranslations('chats.chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null);

  useEffect(() => {
    // Прокрутка вниз при загрузке сообщений
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJumpToMessage = useCallback(
    (messageId: string) => {
      const target = messageRefs.current[messageId];

      if (!target) {
        toast.error(t('originalMessageNotFound'));
        return;
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedMessageId(messageId);
      setTimeout(() => {
        setHighlightedMessageId((current) =>
          current === messageId ? null : current,
        );
      }, 1600);
    },
    [t],
  );

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
          onDelete={onDeleteMessage}
          onUpdate={onUpdateMessage}
          onReply={onReplyMessage}
          onJumpToMessage={handleJumpToMessage}
          messageRef={(element) => {
            messageRefs.current[message.id] = element;
          }}
          isHighlighted={highlightedMessageId === message.id}
          isDeleting={deletingMessageId === message.id}
          isUpdating={updatingMessageId === message.id}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
