'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { FindAllChatsByMeQuery } from '@/graphql/generated/output';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Card, CardContent } from '@/shared/components/ui/card';
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
}

export function ChatItem({
  id,
  users,
  lastMessage,
  currentUserId,
}: ChatItemProps) {
  const params = useParams();
  const isActive = params.chatId === id;

  const otherUser = users.find((user) => user.id !== currentUserId) || users[0];

  const displayName = otherUser.name || otherUser.username;

  const messagePreview = lastMessage
    ? lastMessage.content.length > 50
      ? `${lastMessage.content.substring(0, 50)}...`
      : lastMessage.content
    : 'Нет сообщений';

  return (
    <Link href={`/chats/${id}`}>
      <Card
        className={cn(
          'hover:bg-accent cursor-pointer transition-colors',
          isActive && 'bg-accent border-primary',
        )}
      >
        <CardContent className='flex items-center gap-4 p-4'>
          <Avatar className='size-12'>
            <AvatarImage
              src={otherUser.avatar || undefined}
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
        </CardContent>
      </Card>
    </Link>
  );
}
