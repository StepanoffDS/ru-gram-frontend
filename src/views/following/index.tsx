'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { UsersList } from '@/entities/users-list';
import {
  useFindOneByUsernameQuery,
  useGetFollowingQuery,
} from '@/graphql/generated/output';
import { PageHeader } from '@/shared/components/page-header';
import { Skeleton } from '@/shared/components/ui/skeleton';

interface FollowingPageComponentProps {
  username: string;
}

const USERS_PER_PAGE = 20;

export function FollowingPageComponent({
  username,
}: FollowingPageComponentProps) {
  const t = useTranslations('following');
  const [skip, setSkip] = useState(0);

  const { data: profileData, loading: profileLoading } =
    useFindOneByUsernameQuery({
      variables: { username },
    });

  const {
    data: followingData,
    loading: followingLoading,
    fetchMore,
  } = useGetFollowingQuery({
    variables: {
      userId: profileData?.findOneByUsername?.id ?? '',
      skip: 0,
      take: USERS_PER_PAGE,
    },
    skip: !profileData?.findOneByUsername?.id,
  });

  const [users, setUsers] = useState(followingData?.getFollowing?.data ?? []);
  const [hasMore, setHasMore] = useState(
    followingData?.getFollowing?.hasMore ?? false,
  );

  useEffect(() => {
    if (followingData?.getFollowing) {
      setUsers(followingData.getFollowing.data);
      setHasMore(followingData.getFollowing.hasMore);
      setSkip(followingData.getFollowing.data.length);
    }
  }, [followingData]);

  const handleLoadMore = async () => {
    if (!hasMore || followingLoading || !profileData?.findOneByUsername?.id) {
      return;
    }

    try {
      const result = await fetchMore({
        variables: {
          userId: profileData.findOneByUsername.id,
          skip,
          take: USERS_PER_PAGE,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          const newUsers = fetchMoreResult.getFollowing?.data ?? [];
          const allUsers = [...users, ...newUsers];

          setUsers(allUsers);
          setHasMore(fetchMoreResult.getFollowing?.hasMore ?? false);
          setSkip(allUsers.length);

          return {
            getFollowing: {
              ...fetchMoreResult.getFollowing,
              data: allUsers,
            },
          };
        },
      });
    } catch (error) {
      console.error('Failed to load more following:', error);
    }
  };

  const displayName =
    profileData?.findOneByUsername?.name ||
    profileData?.findOneByUsername?.username ||
    username;

  return (
    <div className='flex flex-col gap-4'>
      <PageHeader
        title={
          profileLoading ? (
            <Skeleton className='h-6 w-48' />
          ) : (
            t('title', { name: displayName })
          )
        }
      />
      <UsersList
        users={users}
        loading={followingLoading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
