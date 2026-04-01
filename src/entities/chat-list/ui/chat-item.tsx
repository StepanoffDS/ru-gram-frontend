'use client';

import { MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import {
  FindAllChatsByMeDocument,
  FindAllChatsByMeQuery,
  useClearChatHistoryMutation,
  useDeleteChatMutation,
  useSetChatImportantMutation,
} from '@/graphql/generated/output';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { S3_URL } from '@/shared/constants/api.constants';
import { cn } from '@/shared/libs/utils';

interface ChatItemProps {
  id: string;
  users: FindAllChatsByMeQuery['findAllChatsByMe'][number]['users'];
  lastMessage?: {
    content: string;
    createdAt: Date | string;
    user: {
      username: string;
    };
  } | null;
  currentUserId?: string;
  unreadCount: number;
  isImportant: boolean;
}

export function ChatItem({
  id,
  users,
  lastMessage,
  currentUserId,
  unreadCount,
  isImportant,
}: ChatItemProps) {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('chats');
  const isActive = params.chatId === id;
  const displayUnread = Math.round(unreadCount);
  const [setChatImportant, { loading: isImportantUpdating }] =
    useSetChatImportantMutation({
      refetchQueries: [FindAllChatsByMeDocument],
      awaitRefetchQueries: true,
    });
  const [clearChatHistory, { loading: isClearingHistory }] =
    useClearChatHistoryMutation({
      refetchQueries: [FindAllChatsByMeDocument],
      awaitRefetchQueries: true,
    });
  const [deleteChat, { loading: isDeletingChat }] = useDeleteChatMutation({
    refetchQueries: [FindAllChatsByMeDocument],
    awaitRefetchQueries: true,
  });

  const otherUser = users.find((user) => user.id !== currentUserId) || users[0];

  const displayName = otherUser.name || otherUser.username;

  const messagePreview = lastMessage
    ? lastMessage.content.length > 50
      ? `${lastMessage.content.substring(0, 50)}...`
      : lastMessage.content
    : t('chat.noMessages');

  const isActionPending =
    isImportantUpdating || isClearingHistory || isDeletingChat;

  async function handleSetImportant(nextValue: boolean) {
    try {
      await setChatImportant({
        variables: {
          chatId: id,
          isImportant: nextValue,
        },
      });
    } catch {
      toast.error(t('actionError'));
    }
  }

  async function handleClearHistory() {
    if (!window.confirm(t('confirmClearHistory'))) {
      return;
    }

    try {
      await clearChatHistory({
        variables: {
          chatId: id,
        },
      });
      toast.success(t('historyCleared'));
    } catch {
      toast.error(t('actionError'));
    }
  }

  async function handleDeleteChat() {
    if (!window.confirm(t('confirmDeleteChat'))) {
      return;
    }

    try {
      await deleteChat({
        variables: {
          chatId: id,
        },
      });

      if (isActive) {
        router.replace('/chats');
      }

      toast.success(t('chatDeleted'));
    } catch {
      toast.error(t('actionError'));
    }
  }

  return (
    <Card
      className={cn(
        'hover:bg-accent relative cursor-pointer transition-colors',
        isActive && 'bg-accent border-primary',
      )}
    >
      <CardContent className='flex items-center gap-4 p-4 pr-12'>
        <Link
          href={`/chats/${id}`}
          className='contents'
        >
          <Avatar className='size-12'>
            <AvatarImage
              src={
                otherUser.avatar ? S3_URL + otherUser.avatar : undefined
              }
              alt={displayName}
            />
            <AvatarFallback>
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='min-w-0 flex-1'>
            <div className='truncate font-semibold'>{displayName}</div>
            {lastMessage && (
              <div className='text-muted-foreground truncate text-sm'>
                {messagePreview}
              </div>
            )}
          </div>
          {displayUnread > 0 && (
            <Badge className='ml-2 px-2 py-0.5 text-xs'>
              {displayUnread > 99 ? '99+' : displayUnread}
            </Badge>
          )}
        </Link>

        <div className='absolute top-2 right-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon-sm'
                aria-label={t('actionsLabel')}
                disabled={isActionPending}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
              >
                <MoreVertical className='size-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='w-64'
            >
              <DropdownMenuItem
                disabled={isActionPending}
                onClick={() => void handleSetImportant(!isImportant)}
              >
                {isImportant ? t('removeFromImportant') : t('addToImportant')}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isActionPending}
                onClick={() => void handleClearHistory()}
              >
                {t('clearHistory')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='text-destructive focus:text-destructive'
                disabled={isActionPending}
                onClick={() => void handleDeleteChat()}
              >
                {t('deleteChat')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
