'use client';

import { useParams, useRouter } from 'next/navigation';

import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { MessageList } from '@/entities/message-list/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  FindMessagesByChatIdQuery,
  useCreateMessageMutation,
  useFindMessagesByChatIdQuery,
  useMessageCreatedSubscription,
} from '@/graphql/generated/output';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';

type Message = FindMessagesByChatIdQuery['findMessagesByChatId'][number];

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.chatId as string;
  const t = useTranslations('chats.chat');
  const { userId } = useAuth();
  const [message, setMessage] = useState('');
  const [createMessage, { loading: sendingMessage }] =
    useCreateMessageMutation();

  const { data, loading, error, updateQuery } = useFindMessagesByChatIdQuery({
    variables: {
      chatId,
      pagination: {
        skip: 0,
        take: 50,
      },
    },
    skip: !chatId,
  });
  // Подписка на новые сообщения

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: subscriptionData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loading: subscriptionLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error: subscriptionError,
  } = useMessageCreatedSubscription({
    variables: {
      chatId,
    },
    skip: !chatId,
    onData: ({ data: subscriptionData }) => {
      console.log('subscriptionData', subscriptionData);
      if (subscriptionData.data?.messageCreated) {
        const newMessage = subscriptionData.data.messageCreated;

        // Обновляем кэш запроса, добавляя новое сообщение
        updateQuery((prev) => {
          if (!prev?.findMessagesByChatId) {
            return prev;
          }

          // Проверяем, нет ли уже такого сообщения (избегаем дубликатов)
          const messageExists = prev.findMessagesByChatId.some(
            (msg) => msg.id === newMessage.id,
          );

          if (messageExists) {
            return prev;
          }

          return {
            ...prev,
            findMessagesByChatId: [...prev.findMessagesByChatId, newMessage],
          };
        });
      }
    },
  });

  // useEffect(() => {
  //   console.log('Subscription state changed:', {
  //     chatId,
  //     subscriptionLoading,
  //     subscriptionError: subscriptionError?.message,
  //     subscriptionErrorFull: subscriptionError,
  //     hasSubscriptionData: !!subscriptionData,
  //     subscriptionData,
  //   });
  // }, [chatId, subscriptionLoading, subscriptionError, subscriptionData]);

  const messages = useMemo(() => {
    if (!data?.findMessagesByChatId) return [];
    return data.findMessagesByChatId.map((msg: Message) => ({
      id: msg.id,
      content: msg.content,
      images: msg.images,
      createdAt: new Date(msg.createdAt),
      user: {
        id: msg.user.id,
        username: msg.user.username,
        name: msg.user.name ?? null,
        avatar: msg.user.avatar ?? null,
      },
    }));
  }, [data]);

  console.log('messages', messages);

  const chatUser = useMemo(() => {
    if (messages.length > 0) {
      const otherUser = messages.find((msg) => msg.user.id !== userId)?.user;
      if (otherUser) return otherUser;
    }
    return null;
  }, [messages, userId]);

  const sendMessage = async () => {
    if (!message.trim() || !chatId) {
      return;
    }

    const messageContent = message.trim();
    setMessage('');

    try {
      await createMessage({
        variables: {
          chatId,
          data: {
            content: messageContent,
            images: [],
          },
        },
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('errorSending'));
      setMessage(messageContent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const displayName = chatUser?.name || chatUser?.username || t('title');

  return (
    <div className='flex h-full flex-col'>
      <PageHeader
        title={displayName}
        onBack={() => router.replace('/chats')}
      />
      <div className='mt-4 mb-4 flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
        <MessageList
          messages={messages}
          loading={loading}
          error={error as Error}
          currentUserId={userId || undefined}
        />
      </div>
      <div className='mt-auto flex shrink-0 items-end gap-2 border-t pt-4'>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('messagePlaceholder')}
          className='max-h-[120px] min-h-[60px] resize-none'
          rows={1}
        />
        <Button
          onClick={sendMessage}
          disabled={!message.trim() || sendingMessage}
          size='icon'
          className='h-[60px] w-[60px] shrink-0'
        >
          <Send className='size-5' />
        </Button>
      </div>
    </div>
  );
}
