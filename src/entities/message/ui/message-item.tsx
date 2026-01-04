'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/libs/utils';

interface MessageItemProps {
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
  currentUserId?: string;
}

export function MessageItem({
  content,
  images,
  createdAt,
  user,
  currentUserId,
}: MessageItemProps) {
  const isOwnMessage = user.id === currentUserId;
  const displayName = user.name || user.username;

  return (
    <div className={cn('mb-4 flex gap-3', isOwnMessage && 'flex-row-reverse')}>
      <Avatar className='size-8 shrink-0'>
        <AvatarImage
          src={user.avatar || undefined}
          alt={displayName}
        />
        <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'flex max-w-[70%] flex-col gap-1',
          isOwnMessage && 'items-end',
        )}
      >
        <Card
          className={cn(
            'p-3',
            isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted',
          )}
        >
          <CardContent className='p-0'>
            <p className='text-sm break-words whitespace-pre-wrap'>{content}</p>
            {images.length > 0 && (
              <div className='mt-2 flex flex-col gap-2'>
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Image ${index + 1}`}
                    className='h-auto max-w-full rounded-lg'
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <span className='text-muted-foreground px-1 text-xs'>
          {new Date(createdAt).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
