'use client';

import { usePathname, useRouter } from 'next/navigation';

import { useApolloClient, useSubscription } from '@apollo/client';
import { PropsWithChildren } from 'react';
import { toast } from 'sonner';

import { FindAllChatsByMeDocument } from '@/graphql/generated/output';

import {
  NotificationCreatedForUserData,
  NOTIFICATION_CREATED_FOR_USER_SUBSCRIPTION,
  NOTIFICATION_UPDATED_FOR_USER_SUBSCRIPTION,
  NOTIFICATIONS_UNREAD_COUNT_QUERY,
  NotificationUpdatedForUserData,
} from '@/features/notifications/api/notifications.gql';

export function ChatNotificationsProvider({
  children,
}: PropsWithChildren<unknown>) {
  const pathname = usePathname();
  const router = useRouter();
  const client = useApolloClient();

  useSubscription<NotificationCreatedForUserData>(
    NOTIFICATION_CREATED_FOR_USER_SUBSCRIPTION,
    {
      onData: ({ data }) => {
        const notification = data.data?.notificationCreatedForUser;

        if (!notification) {
          return;
        }

        const actor =
          notification.actor?.name || notification.actor?.username || 'user';

        void client.refetchQueries({
          include: [FindAllChatsByMeDocument, NOTIFICATIONS_UNREAD_COUNT_QUERY],
        });

        if (pathname === '/notifications') {
          return;
        }

        if (notification.type === 'NEW_MESSAGE') {
          const onChatPage =
            !!notification.chatId && pathname.startsWith(`/chats/${notification.chatId}`);

          if (onChatPage) {
            return;
          }

          toast(`Новое сообщение от @${actor}`, {
            description: notification.message?.content || '',
            action: notification.chatId
              ? {
                  label: 'Открыть',
                  onClick: () => router.push(`/chats/${notification.chatId}`),
                }
              : undefined,
          });

          return;
        }

        if (notification.type === 'POST_COMMENT') {
          const postPath = notification.postId
            ? `/post/${notification.postId}${
                notification.comment?.id
                  ? `?commentId=${notification.comment.id}`
                  : ''
              }`
            : '/notifications';

          toast(`Новый комментарий от @${actor}`, {
            description: notification.comment?.content || '',
            action: {
              label: 'Открыть',
              onClick: () => router.push(postPath),
            },
          });

          return;
        }

        if (notification.type === 'POST_COMMENT_REPLY') {
          const postPath = notification.postId
            ? `/post/${notification.postId}${
                notification.comment?.id
                  ? `?commentId=${notification.comment.id}`
                  : ''
              }`
            : '/notifications';

          toast(`Новый ответ от @${actor}`, {
            description: notification.comment?.content || '',
            action: {
              label: 'Открыть',
              onClick: () => router.push(postPath),
            },
          });

          return;
        }

        toast(`Новый лайк от @${actor}`, {
          action: {
            label: 'Открыть',
            onClick: () => router.push('/notifications'),
          },
        });
      },
    },
  );

  useSubscription<NotificationUpdatedForUserData>(
    NOTIFICATION_UPDATED_FOR_USER_SUBSCRIPTION,
    {
      onData: () => {
        void client.refetchQueries({
          include: [NOTIFICATIONS_UNREAD_COUNT_QUERY],
        });
      },
    },
  );

  return <>{children}</>;
}
