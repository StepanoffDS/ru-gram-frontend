'use client';

import { useParams, useRouter } from 'next/navigation';

import {
  gql,
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from '@apollo/client';
import emojiMartData from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Send, Smile } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { MessageList } from '@/entities/message-list/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  FindAllChatsByMeDocument,
  useMarkChatAsReadMutation,
} from '@/graphql/generated/output';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/shared/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Textarea } from '@/shared/components/ui/textarea';

type MessageUser = {
  id: string;
  username: string;
  name: string | null;
  avatar?: string | null;
};

type ReplyMessage = {
  id: string;
  content: string;
  user: MessageUser;
};

type MessageDto = {
  id: string;
  content: string;
  images: string[];
  isReadByOtherUser: boolean;
  createdAt: string;
  updatedAt: string;
  user: MessageUser;
  replyToMessageId?: string | null;
  replyTo?: ReplyMessage | null;
};

type FindMessagesByChatIdData = {
  findMessagesByChatId: MessageDto[];
};

type FindMessagesByChatIdVariables = {
  chatId: string;
  pagination?: {
    skip: number;
    take: number;
  };
};

type CreateMessageMutationData = {
  createMessage: MessageDto;
};

type CreateMessageMutationVariables = {
  chatId: string;
  data: {
    content: string;
    images: string[];
    replyToMessageId?: string | null;
  };
};

type MessageCreatedSubscriptionData = {
  messageCreated: MessageDto;
};

type MessageCreatedSubscriptionVariables = {
  chatId: string;
};

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

type MessageDeletedSubscriptionData = {
  messageDeleted: string;
};

type MessageUpdatedSubscriptionData = {
  messageUpdated: {
    id: string;
    content: string;
    updatedAt: string;
  };
};

type UpdateMessageMutationData = {
  updateMessage: {
    id: string;
    content: string;
    updatedAt: string;
  };
};

type UpdateMessageMutationVariables = {
  messageId: string;
  data: {
    content: string;
  };
};

type DeleteMessageMutationData = {
  deleteMessage: boolean;
};

type DeleteMessageMutationVariables = {
  messageId: string;
};

type EmojiSelectPayload = {
  native: string;
};

const FIND_MESSAGES_BY_CHAT_ID_QUERY = gql`
  query FindMessagesByChatId(
    $chatId: String!
    $pagination: MessagesPaginationInput
  ) {
    findMessagesByChatId(chatId: $chatId, pagination: $pagination) {
      id
      content
      images
      replyToMessageId
      replyTo {
        id
        content
        user {
          id
          username
          name
          avatar
        }
      }
      isReadByOtherUser
      createdAt
      updatedAt
      user {
        id
        username
        name
        avatar
      }
    }
  }
`;

const CREATE_MESSAGE_MUTATION = gql`
  mutation CreateMessage($chatId: String!, $data: CreateMessageInput!) {
    createMessage(chatId: $chatId, data: $data) {
      id
      content
      images
      replyToMessageId
      replyTo {
        id
        content
        user {
          id
          username
          name
          avatar
        }
      }
      isReadByOtherUser
      createdAt
      updatedAt
      user {
        id
        username
        name
        avatar
      }
    }
  }
`;

const MESSAGE_CREATED_SUBSCRIPTION = gql`
  subscription MessageCreated($chatId: String!) {
    messageCreated(chatId: $chatId) {
      id
      content
      images
      replyToMessageId
      replyTo {
        id
        content
        user {
          id
          username
          name
          avatar
        }
      }
      isReadByOtherUser
      createdAt
      updatedAt
      user {
        id
        username
        name
        avatar
      }
    }
  }
`;

const CHAT_READ_UPDATED_SUBSCRIPTION = gql`
  subscription ChatReadUpdated($chatId: String!) {
    chatReadUpdated(chatId: $chatId) {
      chatId
      userId
      lastReadAt
    }
  }
`;

const MESSAGE_DELETED_SUBSCRIPTION = gql`
  subscription MessageDeleted {
    messageDeleted
  }
`;

const MESSAGE_UPDATED_SUBSCRIPTION = gql`
  subscription MessageUpdated($chatId: String!) {
    messageUpdated(chatId: $chatId) {
      id
      content
      updatedAt
    }
  }
`;

const UPDATE_MESSAGE_MUTATION = gql`
  mutation UpdateMessage($messageId: String!, $data: UpdateMessageInput!) {
    updateMessage(messageId: $messageId, data: $data) {
      id
      content
      updatedAt
    }
  }
`;

const DELETE_MESSAGE_MUTATION = gql`
  mutation DeleteMessage($messageId: String!) {
    deleteMessage(messageId: $messageId)
  }
`;

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.chatId as string;
  const t = useTranslations('chats.chat');
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const { userId } = useAuth();
  const [message, setMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<ReplyMessage | null>(
    null,
  );
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(
    null,
  );
  const [updatingMessageId, setUpdatingMessageId] = useState<string | null>(
    null,
  );
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const selectionRef = useRef({ start: 0, end: 0 });

  const client = useApolloClient();
  const [markChatAsReadMutation] = useMarkChatAsReadMutation();
  const [createMessageMutation, { loading: sendingMessage }] = useMutation<
    CreateMessageMutationData,
    CreateMessageMutationVariables
  >(CREATE_MESSAGE_MUTATION);
  const [updateMessageMutation] = useMutation<
    UpdateMessageMutationData,
    UpdateMessageMutationVariables
  >(UPDATE_MESSAGE_MUTATION);
  const [deleteMessageMutation] = useMutation<
    DeleteMessageMutationData,
    DeleteMessageMutationVariables
  >(DELETE_MESSAGE_MUTATION);

  const messageQueryVariables = useMemo<FindMessagesByChatIdVariables>(
    () => ({
      chatId,
      pagination: {
        skip: 0,
        take: 50,
      },
    }),
    [chatId],
  );

  const patchMessagesCache = useCallback(
    (patcher: (messages: MessageDto[]) => MessageDto[]) => {
      if (!chatId) {
        return;
      }

      client.cache.updateQuery<FindMessagesByChatIdData, FindMessagesByChatIdVariables>(
        {
          query: FIND_MESSAGES_BY_CHAT_ID_QUERY,
          variables: messageQueryVariables,
        },
        (cachedData) => {
          if (!cachedData?.findMessagesByChatId) {
            return cachedData;
          }

          return {
            ...cachedData,
            findMessagesByChatId: patcher(cachedData.findMessagesByChatId),
          };
        },
      );
    },
    [chatId, client.cache, messageQueryVariables],
  );

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

  const { data, loading, error } = useQuery<
    FindMessagesByChatIdData,
    FindMessagesByChatIdVariables
  >(FIND_MESSAGES_BY_CHAT_ID_QUERY, {
    variables: messageQueryVariables,
    skip: !chatId,
  });

  useSubscription<
    MessageCreatedSubscriptionData,
    MessageCreatedSubscriptionVariables
  >(MESSAGE_CREATED_SUBSCRIPTION, {
    variables: {
      chatId,
    },
    skip: !chatId,
    onData: ({ data: subscriptionData }) => {
      const newMessage = subscriptionData.data?.messageCreated;

      if (!newMessage) {
        return;
      }

      patchMessagesCache((messages) => {
        const messageExists = messages.some((item) => item.id === newMessage.id);
        if (messageExists) {
          return messages;
        }
        return [...messages, newMessage];
      });

      void markChatAsReadAndSyncList(chatId);
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

      patchMessagesCache((messages) =>
        messages.map((item) => {
          if (item.user.id !== userId) {
            return item;
          }

          if (item.isReadByOtherUser) {
            return item;
          }

          const isReadNow = new Date(item.createdAt) <= readAt;
          return isReadNow ? { ...item, isReadByOtherUser: true } : item;
        }),
      );
    },
  });

  useSubscription<MessageDeletedSubscriptionData>(MESSAGE_DELETED_SUBSCRIPTION, {
    skip: !chatId,
    onData: ({ data: subscriptionData }) => {
      const deletedMessageId = subscriptionData.data?.messageDeleted;
      if (!deletedMessageId) {
        return;
      }

      patchMessagesCache((messages) =>
        messages.filter((item) => item.id !== deletedMessageId),
      );

      setReplyToMessage((current) =>
        current?.id === deletedMessageId ? null : current,
      );
    },
  });

  useSubscription<MessageUpdatedSubscriptionData>(MESSAGE_UPDATED_SUBSCRIPTION, {
    variables: { chatId },
    skip: !chatId,
    onData: ({ data: subscriptionData }) => {
      const updatedMessage = subscriptionData.data?.messageUpdated;
      if (!updatedMessage) {
        return;
      }

      patchMessagesCache((messages) =>
        messages.map((item) =>
          item.id === updatedMessage.id
            ? {
                ...item,
                content: updatedMessage.content,
                updatedAt: updatedMessage.updatedAt,
              }
            : item,
        ),
      );
    },
  });

  const messages = useMemo(() => {
    if (!data?.findMessagesByChatId) return [];
    return data.findMessagesByChatId.map((item) => ({
      id: item.id,
      content: item.content,
      images: item.images,
      isReadByOtherUser: item.isReadByOtherUser,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      replyToMessageId: item.replyToMessageId ?? null,
      replyTo: item.replyTo
        ? {
            id: item.replyTo.id,
            content: item.replyTo.content,
            user: {
              id: item.replyTo.user.id,
              username: item.replyTo.user.username,
              name: item.replyTo.user.name ?? null,
            },
          }
        : null,
      user: {
        id: item.user.id,
        username: item.user.username,
        name: item.user.name ?? null,
        avatar: item.user.avatar ?? null,
      },
    }));
  }, [data]);

  const deleteMessage = useCallback(
    async (messageId: string) => {
      setDeletingMessageId(messageId);
      try {
        await deleteMessageMutation({ variables: { messageId } });
        patchMessagesCache((messages) =>
          messages.filter((item) => item.id !== messageId),
        );
        await client.refetchQueries({ include: [FindAllChatsByMeDocument] });
      } catch {
        toast.error(t('errorDeletingMessage'));
      } finally {
        setDeletingMessageId(null);
      }
    },
    [client, deleteMessageMutation, patchMessagesCache, t],
  );

  const updateMessage = useCallback(
    async (messageId: string, content: string) => {
      setUpdatingMessageId(messageId);
      try {
        const result = await updateMessageMutation({
          variables: {
            messageId,
            data: {
              content,
            },
          },
        });

        const updated = result.data?.updateMessage;
        if (!updated) {
          return;
        }

        patchMessagesCache((messages) =>
          messages.map((item) =>
            item.id === messageId
              ? {
                  ...item,
                  content: updated.content,
                  updatedAt: updated.updatedAt,
                }
              : item,
          ),
        );
        await client.refetchQueries({ include: [FindAllChatsByMeDocument] });
      } catch {
        toast.error(t('errorUpdatingMessage'));
      } finally {
        setUpdatingMessageId(null);
      }
    },
    [client, patchMessagesCache, t, updateMessageMutation],
  );

  const chatUser = useMemo(() => {
    if (messages.length > 0) {
      const otherUser = messages.find((item) => item.user.id !== userId)?.user;
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
      await createMessageMutation({
        variables: {
          chatId,
          data: {
            content: messageContent,
            images: [],
            replyToMessageId: replyToMessage?.id ?? null,
          },
        },
      });

      setReplyToMessage(null);
    } catch (error) {
      const errorMessage = (error as { message?: string })?.message ?? '';
      if (errorMessage.includes('Сообщение для ответа не найдено')) {
        toast.error(t('originalMessageNotFound'));
        setReplyToMessage(null);
      } else {
        toast.error(t('errorSending'));
      }
      setMessage(messageContent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const syncSelection = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    selectionRef.current = {
      start: textarea.selectionStart ?? textarea.value.length,
      end: textarea.selectionEnd ?? textarea.value.length,
    };
  }, []);

  const handleEmojiInsert = (emoji: string) => {

    setMessage((currentMessage) => {
      const safeStart = Math.max(
        0,
        Math.min(selectionRef.current.start, currentMessage.length),
      );
      const safeEnd = Math.max(
        safeStart,
        Math.min(selectionRef.current.end, currentMessage.length),
      );
      const nextMessage =
        currentMessage.slice(0, safeStart) +
        emoji +
        currentMessage.slice(safeEnd);
      const nextCaretPosition = safeStart + emoji.length;

      selectionRef.current = {
        start: nextCaretPosition,
        end: nextCaretPosition,
      };

      return nextMessage;
    });

    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea) {
        return;
      }

      const { start, end } = selectionRef.current;
      textarea.focus();
      textarea.setSelectionRange(start, end);
    });
  };

  const displayName = chatUser?.name || chatUser?.username || t('title');
  const replyPreviewName =
    replyToMessage?.user.id === userId
      ? t('you')
      : (replyToMessage?.user.name ?? replyToMessage?.user.username);
  const emojiPickerTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

  return (
    <div className='flex h-full min-h-0 flex-col overflow-hidden px-1 py-1 pt-0'>
      <PageHeader
        title={displayName}
        onBack={() => router.replace('/chats')}
      />
      <div className='min-h-0 flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
        <MessageList
          messages={messages}
          loading={loading}
          error={error as Error}
          currentUserId={userId || undefined}
          onDeleteMessage={deleteMessage}
          onUpdateMessage={updateMessage}
          onReplyMessage={(targetMessage) => setReplyToMessage(targetMessage)}
          deletingMessageId={deletingMessageId}
          updatingMessageId={updatingMessageId}
        />
      </div>
      <div className='shrink-0 border-t pt-3'>
        {replyToMessage && (
          <div className='bg-muted mb-2 rounded-md p-2'>
            <div className='mb-1 text-xs font-medium'>
              {t('replyTo')} {replyPreviewName}
            </div>
            <div className='text-muted-foreground mb-2 truncate text-xs'>
              {replyToMessage.content}
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setReplyToMessage(null)}
            >
              {t('cancelReply')}
            </Button>
          </div>
        )}
        <div className='flex items-end gap-2'>
          <Popover
            open={isEmojiPickerOpen}
            onOpenChange={(isOpen) => {
              if (isOpen) {
                syncSelection();
              }
              setIsEmojiPickerOpen(isOpen);
            }}
          >
            <PopoverTrigger asChild>
              <Button
                type='button'
                variant='outline'
                size='icon'
                className='h-[60px] w-[60px] shrink-0'
                aria-label={t('emojiButtonLabel')}
              >
                <Smile className='size-5' />
              </Button>
            </PopoverTrigger>
            <PopoverContent align='start' className='w-fit p-0'>
              <Picker
                data={emojiMartData}
                onEmojiSelect={(emoji: unknown) => {
                  if (
                    typeof emoji === 'object' &&
                    emoji &&
                    'native' in emoji &&
                    typeof (emoji as EmojiSelectPayload).native === 'string'
                  ) {
                    handleEmojiInsert((emoji as EmojiSelectPayload).native);
                  }
                }}
                locale={locale}
                searchPosition='sticky'
                previewPosition='none'
                theme={emojiPickerTheme}
              />
            </PopoverContent>
          </Popover>
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onSelect={syncSelection}
            onClick={syncSelection}
            onKeyUp={syncSelection}
            autoFocus
            placeholder={
              replyToMessage ? t('replyPlaceholder') : t('messagePlaceholder')
            }
            className='max-h-[120px] min-h-[60px] resize-none'
            rows={1}
          />
          <Button
            onClick={() => void sendMessage()}
            disabled={!message.trim() || sendingMessage}
            size='icon'
            className='h-[60px] w-[60px] shrink-0'
          >
            <Send className='size-5' />
          </Button>
        </div>
      </div>
    </div>
  );
}
