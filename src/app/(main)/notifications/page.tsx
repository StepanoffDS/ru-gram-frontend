'use client';

import { useRouter } from 'next/navigation';

import {
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from '@apollo/client';
import { Bell, CheckCheck, Circle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import {
  AppNotification,
  FindMyNotificationsData,
  FindMyNotificationsVariables,
  FIND_MY_NOTIFICATIONS_QUERY,
  MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION,
  MARK_NOTIFICATION_AS_READ_MUTATION,
  MarkAllNotificationsAsReadData,
  MarkNotificationAsReadData,
  MarkNotificationAsReadVariables,
  NOTIFICATION_CREATED_FOR_USER_SUBSCRIPTION,
  NOTIFICATION_UPDATED_FOR_USER_SUBSCRIPTION,
  NotificationCreatedForUserData,
  NotificationUpdatedForUserData,
} from '@/features/notifications/api/notifications.gql';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/shared/components/ui/button';
import { useFormatTime } from '@/shared/hooks/use-format-time';

export default function NotificationsPage() {
  const t = useTranslations('notificationsPage');
  const router = useRouter();
  const { formatTimeAgo } = useFormatTime();
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const client = useApolloClient();

  const { data, loading, refetch } = useQuery<
    FindMyNotificationsData,
    FindMyNotificationsVariables
  >(FIND_MY_NOTIFICATIONS_QUERY, {
    variables: {
      filter: {
        take: 50,
        skip: 0,
        onlyUnread: tab === 'unread',
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const [markNotificationAsRead] = useMutation<
    MarkNotificationAsReadData,
    MarkNotificationAsReadVariables
  >(MARK_NOTIFICATION_AS_READ_MUTATION);

  const [markAllNotificationsAsRead, { loading: markAllLoading }] = useMutation<
    MarkAllNotificationsAsReadData
  >(MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION);

  useSubscription<NotificationCreatedForUserData>(
    NOTIFICATION_CREATED_FOR_USER_SUBSCRIPTION,
    {
      onData: () => {
        void refetch();
      },
    },
  );

  useSubscription<NotificationUpdatedForUserData>(
    NOTIFICATION_UPDATED_FOR_USER_SUBSCRIPTION,
    {
      onData: () => {
        void refetch();
      },
    },
  );

  const list = data?.findMyNotifications ?? [];

  const unreadCount = list.filter((item) => !item.isRead).length;

  const handleOpenNotification = async (notification: AppNotification) => {
    if (!notification.isRead) {
      await markNotificationAsRead({
        variables: { notificationId: notification.id },
      });
      await client.refetchQueries({
        include: ['NotificationsUnreadCount'],
      });
    }

    if (notification.type === 'NEW_MESSAGE' && notification.chatId) {
      router.push(`/chats/${notification.chatId}`);
      return;
    }

    if (notification.type === 'NEW_FOLLOWER' && notification.actor?.username) {
      router.push(`/profile/${notification.actor.username}`);
      return;
    }

    if (notification.postId) {
      const commentQuery = notification.comment?.id
        ? `?commentId=${notification.comment.id}`
        : '';
      router.push(`/post/${notification.postId}${commentQuery}`);
      return;
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
    await client.refetchQueries({
      include: ['NotificationsUnreadCount'],
    });
    await refetch();
  };

  return (
    <div className='flex h-full flex-col'>
      <PageHeader
        title={t('title')}
        withBackButton={false}
      />

      <div className='mb-4 flex items-center justify-between gap-2'>
        <div className='flex gap-2'>
          <Button
            variant={tab === 'all' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setTab('all')}
          >
            {t('tabs.all')}
          </Button>
          <Button
            variant={tab === 'unread' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setTab('unread')}
          >
            {t('tabs.unread', { count: unreadCount })}
          </Button>
        </div>
        <Button
          variant='ghost'
          size='sm'
          disabled={markAllLoading}
          onClick={handleMarkAllAsRead}
        >
          <CheckCheck className='size-4' />
          {t('markAllRead')}
        </Button>
      </div>

      {loading ? <div className='text-sm text-muted-foreground'>{t('loading')}</div> : null}

      {!loading && list.length === 0 ? (
        <div className='flex flex-1 items-center justify-center text-muted-foreground'>
          <div className='flex flex-col items-center gap-2'>
            <Bell className='size-6' />
            <span>{t('empty')}</span>
          </div>
        </div>
      ) : null}

      <div className='space-y-2 overflow-y-auto pb-4'>
        {list.map((notification) => {
          const actorName =
            notification.actor?.name || notification.actor?.username || 'user';

          return (
            <button
              key={notification.id}
              type='button'
              onClick={() => handleOpenNotification(notification)}
              className='w-full rounded-lg border p-3 text-left transition hover:bg-muted/40'
            >
              <div className='flex items-start gap-3'>
                {!notification.isRead ? (
                  <Circle className='mt-1 size-2 fill-current text-blue-500' />
                ) : (
                  <span className='mt-1 size-2' />
                )}
                <div className='min-w-0 flex-1'>
                  <p className='text-sm font-medium'>
                    {getNotificationText(t, notification, actorName)}
                  </p>
                  <p className='mt-1 line-clamp-2 text-xs text-muted-foreground'>
                    {notification.comment?.content ||
                      notification.message?.content ||
                      ''}
                  </p>
                  <p className='mt-1 text-xs text-muted-foreground'>
                    {formatTimeAgo(notification.createdAt)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getNotificationText(
  t: (key: string, values?: Record<string, string | number>) => string,
  notification: AppNotification,
  actorName: string,
) {
  if (notification.type === 'POST_LIKE') {
    return t('items.postLike', { user: actorName });
  }

  if (notification.type === 'POST_COMMENT') {
    return t('items.postComment', { user: actorName });
  }

  if (notification.type === 'POST_COMMENT_REPLY') {
    return t('items.postCommentReply', { user: actorName });
  }

  if (notification.type === 'NEW_FOLLOWER') {
    return t('items.newFollower', { user: actorName });
  }

  return t('items.newMessage', { user: actorName });
}
