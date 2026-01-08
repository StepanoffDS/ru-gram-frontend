'use client';

import Link from 'next/link';

import { useTranslations } from 'next-intl';
import { RefObject, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { S3_URL } from '@/shared/constants/api.constants';
import { getInitials } from '@/shared/utils/get-initials';

interface UserPreview {
  id: string;
  username: string;
  name?: string | null;
  avatar?: string | null;
  bio?: string | null;
  followedAt: string;
}

interface UsersListProps {
  users: UserPreview[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore?: () => void;
  ref?: RefObject<HTMLDivElement>;
}

export function UsersList({
  users,
  loading,
  hasMore,
  onLoadMore,
  ref,
}: UsersListProps) {
  const t = useTranslations('usersList');
  const { ref: inViewRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView && hasMore && !loading && onLoadMore) {
      onLoadMore();
    }
  }, [inView, hasMore, loading, onLoadMore]);

  if (loading && users.length === 0) {
    return (
      <div className='space-y-4'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='flex items-center space-x-4 p-4'
          >
            <Skeleton className='h-12 w-12 rounded-full' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-3 w-24' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0 && !loading) {
    return (
      <div className='py-12 text-center text-gray-500 dark:text-gray-400'>
        {t('noUsers')}
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {users.map((user) => {
        const displayName = user.name || user.username;
        return (
          <Link
            key={user.id}
            href={`/profile/${user.username}`}
            className='flex items-center space-x-4 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900'
          >
            <Avatar className='h-12 w-12'>
              {user.avatar ? (
                <AvatarImage
                  src={S3_URL + user.avatar}
                  alt={displayName}
                  className='object-cover'
                />
              ) : (
                <AvatarFallback className='bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'>
                  {getInitials(displayName)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className='min-w-0 flex-1'>
              <div className='mb-1 flex items-center space-x-2'>
                <h3 className='text-sm font-semibold text-gray-900 dark:text-white'>
                  {displayName}
                </h3>
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                @{user.username}
              </p>
              {user.bio && (
                <p className='mt-1 line-clamp-1 text-sm text-gray-600 dark:text-gray-400'>
                  {user.bio}
                </p>
              )}
            </div>
          </Link>
        );
      })}
      {hasMore && (
        <div ref={inViewRef}>
          {loading && (
            <div className='space-y-4'>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className='flex items-center space-x-4 p-4'
                >
                  <Skeleton className='h-12 w-12 rounded-full' />
                  <div className='flex-1 space-y-2'>
                    <Skeleton className='h-4 w-32' />
                    <Skeleton className='h-3 w-24' />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {ref && <div ref={ref} />}
    </div>
  );
}
