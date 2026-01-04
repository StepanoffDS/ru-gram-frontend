'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/libs/utils';

interface ChatItemProps {
  id: string;
  users: Array<{
    id: string;
    username: string;
    name: string | null;
    avatar: string | null;
  }>;
  lastMessage?: {
    content: string;
    createdAt: Date;
    user: {
      username: string;
    };
  } | null;
  currentUserId?: string;
}

export function ChatItem({ id, users, lastMessage, currentUserId }: ChatItemProps) {
  const params = useParams();
  const isActive = params.chatId === id;

  // Получаем собеседника (не текущего пользователя)
  const otherUser = users.find((user) => user.id !== currentUserId) || users[0];

  // Форматируем имя
  const displayName = otherUser.name || otherUser.username;

  // Обрезаем последнее сообщение
  const messagePreview = lastMessage
    ? lastMessage.content.length > 50
      ? `${lastMessage.content.substring(0, 50)}...`
      : lastMessage.content
    : 'Нет сообщений';

  return (
    <Link href={`/chats/${id}`}>
      <Card
        className={cn(
          'cursor-pointer transition-colors hover:bg-accent',
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
          <div className='flex-1 min-w-0'>
            <div className='font-semibold truncate'>{displayName}</div>
            {lastMessage && (
              <div className='text-sm text-muted-foreground truncate'>
                {messagePreview}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
