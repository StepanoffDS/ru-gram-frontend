'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

import { ImageWindow } from '@/features/image-window';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/shared/components/ui/context-menu';
import { Textarea } from '@/shared/components/ui/textarea';
import { S3_URL } from '@/shared/constants/api.constants';
import { cn } from '@/shared/libs/utils';

interface MessageItemProps {
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
  currentUserId?: string;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, content: string) => void;
  onReply?: (message: {
    id: string;
    content: string;
    user: {
      id: string;
      username: string;
      name: string | null;
    };
  }) => void;
  onJumpToMessage?: (id: string) => void;
  messageRef?: (element: HTMLDivElement | null) => void;
  isHighlighted?: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export function MessageItem({
  id,
  content,
  images,
  createdAt,
  updatedAt,
  isReadByOtherUser,
  replyTo,
  user,
  currentUserId,
  onDelete,
  onUpdate,
  onReply,
  onJumpToMessage,
  messageRef,
  isHighlighted = false,
  isDeleting = false,
  isUpdating = false,
}: MessageItemProps) {
  const t = useTranslations('chats.chat');
  const isOwnMessage = user.id === currentUserId;
  const displayName = user.name || user.username;
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [previewImage, setPreviewImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const [imageRetryToken, setImageRetryToken] = useState<
    Record<string, number>
  >({});
  const formattedTime = new Date(createdAt).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const isEdited =
    new Date(updatedAt).getTime() > new Date(createdAt).getTime();
  const replyAuthorName =
    replyTo?.user.id === currentUserId
      ? t('you')
      : (replyTo?.user.name ?? replyTo?.user.username);
  const getMessageImageSrc = useCallback(
    (image: string, index: number) => {
      const baseSrc = image.startsWith('http') ? image : `${S3_URL}${image}`;
      const retry = imageRetryToken[`${id}-${index}`] ?? 0;
      if (retry === 0) {
        return baseSrc;
      }
      const separator = baseSrc.includes('?') ? '&' : '?';
      return `${baseSrc}${separator}retry=${retry}`;
    },
    [id, imageRetryToken],
  );
  const handleMessageImageError = useCallback(
    (index: number) => {
      const key = `${id}-${index}`;
      const currentRetry = imageRetryToken[key] ?? 0;

      if (currentRetry >= 3) {
        return;
      }

      const nextRetry = currentRetry + 1;
      window.setTimeout(() => {
        setImageRetryToken((current) => ({
          ...current,
          [key]: Date.now(),
        }));
      }, nextRetry * 700);
    },
    [id, imageRetryToken],
  );

  const messageBody = (
    <Card
      className={cn(
        'relative p-3',
        isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted',
      )}
    >
      <CardContent className='p-0'>
        {isEditing ? (
          <div className='space-y-2'>
            <Textarea
              value={editedContent}
              onChange={(event) => setEditedContent(event.target.value)}
              className='bg-background text-foreground min-h-[72px] resize-none'
              rows={3}
            />
            <div className='flex justify-end gap-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  setEditedContent(content);
                  setIsEditing(false);
                }}
              >
                {t('cancelEdit')}
              </Button>
              <Button
                size='sm'
                disabled={!editedContent.trim() || isUpdating}
                onClick={() => {
                  onUpdate?.(id, editedContent.trim());
                  setIsEditing(false);
                }}
              >
                {isUpdating ? t('saving') : t('saveEdit')}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {replyTo && (
              <button
                type='button'
                className={cn(
                  'mb-2 w-full rounded-md border-l-2 px-2 py-1 text-left text-xs',
                  isOwnMessage
                    ? 'bg-primary-foreground/15 border-primary-foreground/60'
                    : 'bg-muted-foreground/10 border-muted-foreground/40',
                )}
                onClick={() => onJumpToMessage?.(replyTo.id)}
              >
                <div className='font-medium'>
                  {t('replyTo')} {replyAuthorName}
                </div>
                <div className='truncate opacity-90'>{replyTo.content}</div>
              </button>
            )}
            {content && (
              <p className='text-sm break-words whitespace-pre-wrap'>
                {content}
              </p>
            )}
          </div>
        )}
        {images.length > 0 && (
          <div className='mt-2 flex flex-col gap-2'>
            {images.map((image, index) => (
              <img
                key={index}
                src={getMessageImageSrc(image, index)}
                alt={`Image ${index + 1}`}
                className='h-auto max-w-full cursor-pointer rounded-lg'
                onError={() => handleMessageImageError(index)}
                onClick={() =>
                  setPreviewImage({
                    src: getMessageImageSrc(image, index),
                    alt: `Image ${index + 1}`,
                  })
                }
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      <div
        ref={messageRef}
        className={cn(
          'mb-4 flex gap-3 rounded-lg p-1 transition-colors',
          isOwnMessage && 'flex-row-reverse',
          isHighlighted && 'ring-primary/40 bg-primary/5 ring-2',
        )}
      >
        <Link
          href={`/profile/${user.username}`}
          className='shrink-0'
        >
          <Avatar className='size-8'>
            <AvatarImage
              src={user.avatar ? S3_URL + user.avatar : undefined}
              alt={displayName}
            />
            <AvatarFallback>
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div
          className={cn(
            'flex max-w-[70%] flex-col gap-1',
            isOwnMessage && 'items-end',
          )}
        >
          {!isEditing ? (
            <ContextMenu>
              <ContextMenuTrigger asChild>{messageBody}</ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  onClick={() =>
                    onReply?.({
                      id,
                      content,
                      user: {
                        id: user.id,
                        username: user.username,
                        name: user.name,
                      },
                    })
                  }
                >
                  {t('reply')}
                </ContextMenuItem>
                {isOwnMessage && (
                  <ContextMenuItem
                    onClick={() => {
                      setEditedContent(content);
                      setIsEditing(true);
                    }}
                  >
                    {t('editMessage')}
                  </ContextMenuItem>
                )}
                {isOwnMessage && (
                  <ContextMenuItem
                    variant='destructive'
                    onClick={() => onDelete?.(id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? t('deleting') : t('deleteMessage')}
                  </ContextMenuItem>
                )}
              </ContextMenuContent>
            </ContextMenu>
          ) : (
            messageBody
          )}
          <span className='text-muted-foreground px-1 text-xs'>
            {isEdited && `${t('edited')} · `}
            {isOwnMessage
              ? `${formattedTime} · ${isReadByOtherUser ? t('read') : t('unread')}`
              : formattedTime}
          </span>
        </div>
      </div>
      {previewImage && (
        <ImageWindow
          isOpen={!!previewImage}
          setIsOpen={(isOpen) => {
            if (!isOpen) {
              setPreviewImage(null);
            }
          }}
          src={previewImage.src}
          alt={previewImage.alt}
        />
      )}
    </>
  );
}
