'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

import { MessageSquare, PencilIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { isPrivilegedRole } from '@/features/auth/types';
import { FollowUser } from '@/features/follow/follow-user';
import {
  useCreateOrFindChatMutation,
  UserModel,
} from '@/graphql/generated/output';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { S3_URL } from '@/shared/constants/api.constants';
import { Nullable } from '@/shared/libs/types';
import { getInitials } from '@/shared/utils/get-initials';

import { copyProfileLink } from '../utils';

interface ProfileInfoProps {
  profile: Nullable<UserModel>;
  loading: boolean;
  error: Nullable<Error>;
  isMe?: boolean;
  /** Верхний правый угол (доп. действия, например меню «⋯») */
  trailingSlot?: ReactNode;
}

export function ProfileInfo({
  profile,
  loading,
  error,
  isMe,
  trailingSlot,
}: ProfileInfoProps) {
  const t = useTranslations('profileInfo');
  const router = useRouter();
  const [createOrFindChat, { loading: chatLoading }] =
    useCreateOrFindChatMutation();

  if (loading) {
    return (
      <div className='border-b border-gray-200 dark:border-gray-800'>
        <div className='mx-auto max-w-4xl pb-4'>
          <div className='flex space-x-6'>
            <Skeleton className='h-24 w-24 rounded-full' />
            <div className='space-y-3'>
              <Skeleton className='h-8 w-full max-w-48' />
              <Skeleton className='h-4 w-full max-w-32' />
              <Skeleton className='h-4 w-full max-w-64' />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className='border-b border-gray-200 dark:border-gray-800'>
        <div className='mx-auto max-w-4xl pb-4'>
          <div className='text-center text-gray-500 dark:text-gray-400'>
            {t('errorLoadingProfile')}
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile?.name || profile.username;

  const handleStartChat = async () => {
    if (!profile?.id || isMe) return;

    try {
      const { data } = await createOrFindChat({
        variables: {
          data: {
            userIds: [profile.id],
          },
        },
      });

      if (data?.createOrFindChat?.id) {
        router.push(`/chats/${data.createOrFindChat.id}`);
      }
    } catch (error) {
      console.error('Failed to create or find chat:', error);
    }
  };

  return (
    <div className='border-b border-gray-200 dark:border-gray-800'>
      <div className='mx-auto max-w-4xl pb-4'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex min-w-0 flex-1 space-x-6'>
            <div className='relative'>
              <Avatar className='h-24 w-24'>
                {profile.avatar ? (
                  <AvatarImage
                    src={S3_URL + profile.avatar}
                    alt={displayName}
                    className='object-cover'
                  />
                ) : (
                  <AvatarFallback className='bg-gray-100 text-2xl font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300'>
                    {getInitials(displayName)}
                  </AvatarFallback>
                )}
              </Avatar>
              {isMe && (
                <Button
                  variant='secondary'
                  className='absolute top-0 right-0 h-8 w-8 rounded-full'
                  size='sm'
                  asChild
                >
                  <Link href='/profile/me/edit'>
                    <PencilIcon className='h-4 w-4' />
                  </Link>
                </Button>
              )}
            </div>

            <div className='min-w-0 flex-1'>
              <div className='mb-0.5 flex flex-wrap items-center space-x-3'>
                <h1 className='text-md mb-0 truncate font-bold text-gray-900 md:text-2xl dark:text-white'>
                  {displayName}
                </h1>
                {isPrivilegedRole(profile.role) ? (
                  <span className='inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
                    {profile.role}
                  </span>
                ) : null}
              </div>

              <button
                className='mb-2 cursor-pointer text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                onClick={() => copyProfileLink(profile.username)}
              >
                @{profile.username}
              </button>

              {profile.bio && (
                <p className='max-w-md text-sm leading-relaxed text-gray-700 dark:text-gray-300'>
                  {profile.bio}
                </p>
              )}

              <div className='mt-4 flex gap-6'>
                <div className='cursor-pointer text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'>
                  <span className='font-semibold'>
                    {profile.postsCount ?? 0}
                  </span>{' '}
                  {t('posts')}
                </div>
                <Link
                  href={`/profile/${profile.username}/followers`}
                  className='cursor-pointer text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                >
                  <span className='font-semibold'>
                    {profile.followersCount ?? 0}
                  </span>{' '}
                  {t('followers')}
                </Link>
                <Link
                  href={`/profile/${profile.username}/following`}
                  className='cursor-pointer text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                >
                  <span className='font-semibold'>
                    {profile.followingCount ?? 0}
                  </span>{' '}
                  {t('following')}
                </Link>
              </div>

              {!isMe && (
                <div className='mt-4 flex items-start gap-2'>
                  <FollowUser
                    userId={profile.id}
                    isFollowing={profile.isFollowing ?? false}
                    username={profile.username}
                  />
                  <Button
                    onClick={handleStartChat}
                    disabled={chatLoading}
                    variant='default'
                    size='sm'
                    className='flex items-center gap-2'
                  >
                    <MessageSquare className='h-4 w-4' />
                    {t('writeMessage')}
                  </Button>
                </div>
              )}
            </div>
          </div>
          {trailingSlot ? (
            <div className='shrink-0 pt-0.5'>{trailingSlot}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
