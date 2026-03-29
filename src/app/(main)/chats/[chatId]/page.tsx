'use client';

import { gql, useApolloClient, useSubscription } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';

import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { MessageList } from '@/entities/message-list/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  FindAllChatsByMeDocument,
  FindMessagesByChatIdQuery,
  useCreateMessageMutation,
  useFindMessagesByChatIdQuery,
  useMarkChatAsReadMutation,
  useMessageCreatedSubscription,
} from '@/graphql/generated/output';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';

type Message = FindMessagesByChatIdQuery['findMessagesByChatId'][number];

type ChatReadUpdatedSubscriptionData = {
  chatReadUpdated: {
    chatId: string;
    userId: string;
    lastReadAt: string;
  };
};

type ChatReadUpdatedSubscriptionVariables = {
  chatId: string;
};

const CHAT_READ_UPDATED_SUBSCRIPTION = gql`
  subscription ChatReadUpdated($chatId: String!) {
    chatReadUpdated(chatId: $chatId) {
      chatId
      userId
      lastReadAt
    }
  }
`;

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.chatId as string;
  const t = useTranslations('chats.chat');
  const { userId } = useAuth();
  const [message, setMessage] = useState('');
  const client = useApolloClient();
  const [createMessage, { loading: sendingMessage }] =
    useCreateMessageMutation();
  const [markChatAsReadMutation] = useMarkChatAsReadMutation();

  const markChatAsReadAndSyncList = useCallback(
    async (id: string) => {
      try {
        await markChatAsReadMutation({ variables: { chatId: id } });
        await client.refetchQueries({ include: [FindAllChatsByMeDocument] });
      } catch {
        // сессия / сеть — список чатов обновим при следующем запросе
      }
    },
    [client, markChatAsReadMutation],
  );

  useEffect(() => {
    if (!chatId) return;
    void markChatAsReadAndSyncList(chatId);
  }, [chatId, markChatAsReadAndSyncList]);

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

  useMessageCreatedSubscription({
    variables: {
      chatId,
    },
    skip: !chatId,
    onData: ({ data: subscriptionData }) => {
      if (subscriptionData.data?.messageCreated) {
        const newMessage = subscriptionData.data.messageCreated;
        updateQuery((prev) => {
          if (!prev?.findMessagesByChatId) {
            return prev;
          }

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
        void markChatAsReadAndSyncList(chatId);
      }
    },
  });

  useSubscription<
    ChatReadUpdatedSubscriptionData,
    ChatReadUpdatedSubscriptionVariables
  >(CHAT_READ_UPDATED_SUBSCRIPTION, {
    variables: { chatId },
    skip: !chatId,
    onData: ({ data: subscriptionData }) => {
      const readUpdate = subscriptionData.data?.chatReadUpdated;
      if (!readUpdate || readUpdate.userId === userId) {
        return;
      }

      const readAt = new Date(readUpdate.lastReadAt);

      updateQuery((prev) => {
        if (!prev?.findMessagesByChatId) {
          return prev;
        }

        return {
          ...prev,
          findMessagesByChatId: prev.findMessagesByChatId.map((msg) => {
            if (msg.user.id !== userId) {
              return msg;
            }

            if (msg.isReadByOtherUser) {
              return msg;
            }

            const isReadNow = new Date(msg.createdAt) <= readAt;
            return isReadNow ? { ...msg, isReadByOtherUser: true } : msg;
          }),
        };
      });
    },
  });

  const messages = useMemo(() => {
    if (!data?.findMessagesByChatId) return [];
    return data.findMessagesByChatId.map((msg: Message) => ({
      id: msg.id,
      content: msg.content,
      images: msg.images,
      isReadByOtherUser: msg.isReadByOtherUser,
      createdAt: new Date(msg.createdAt),
      user: {
        id: msg.user.id,
        username: msg.user.username,
        name: msg.user.name ?? null,
        avatar: msg.user.avatar ?? null,
      },
    }));
  }, [data]);

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
