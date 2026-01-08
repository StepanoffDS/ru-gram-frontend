'use client';

import { UserMinus, UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  FindOneByUsernameDocument,
  useFollowUserMutation,
  useUnfollowUserMutation,
} from '@/graphql/generated/output';
import { Button } from '@/shared/components/ui/button';
import { Nullable } from '@/shared/libs/types';

interface FollowUserProps {
  userId: string;
  isFollowing?: Nullable<boolean>;
  onFollowChange?: (isFollowing: boolean) => void;
  username?: string;
}

export function FollowUser({
  userId,
  isFollowing: initialIsFollowing,
  onFollowChange,
  username,
}: FollowUserProps) {
  const t = useTranslations('follow');
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing ?? false);

  useEffect(() => {
    setIsFollowing(initialIsFollowing ?? false);
  }, [initialIsFollowing]);
  const [followUser, { loading: followLoading }] = useFollowUserMutation();
  const [unfollowUser, { loading: unfollowLoading }] =
    useUnfollowUserMutation();

  const loading = followLoading || unfollowLoading;

  const refetchQueries = username
    ? [
        {
          query: FindOneByUsernameDocument,
          variables: { username },
        },
      ]
    : [];

  const handleFollow = async () => {
    try {
      await followUser({
        variables: { userId },
        refetchQueries,
      });
      setIsFollowing(true);
      onFollowChange?.(true);
      toast.success(t('followedSuccessfully'));
    } catch (error) {
      console.error('Failed to follow user:', error);
      toast.error(t('followError'));
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser({
        variables: { userId },
        refetchQueries,
      });
      setIsFollowing(false);
      onFollowChange?.(false);
      toast.success(t('unfollowedSuccessfully'));
    } catch (error) {
      console.error('Failed to unfollow user:', error);
      toast.error(t('unfollowError'));
    }
  };

  if (isFollowing) {
    return (
      <Button
        onClick={handleUnfollow}
        disabled={loading}
        variant='outline'
        size='sm'
        className='flex items-center gap-2'
      >
        <UserMinus className='h-4 w-4' />
        {t('unfollow')}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={loading}
      variant='default'
      size='sm'
      className='flex items-center gap-2'
    >
      <UserPlus className='h-4 w-4' />
      {t('follow')}
    </Button>
  );
}
