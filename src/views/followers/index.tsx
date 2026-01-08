'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { UsersList } from '@/entities/users-list';
import {
  useFindOneByUsernameQuery,
  useGetFollowersQuery,
} from '@/graphql/generated/output';
import { PageHeader } from '@/shared/components/page-header';
import { Skeleton } from '@/shared/components/ui/skeleton';

interface FollowersPageComponentProps {
  username: string;
}

const USERS_PER_PAGE = 20;

export function FollowersPageComponent({
  username,
}: FollowersPageComponentProps) {
  const t = useTranslations('followers');
  const [skip, setSkip] = useState(0);

  const { data: profileData, loading: profileLoading } =
    useFindOneByUsernameQuery({
      variables: { username },
    });

  const {
    data: followersData,
    loading: followersLoading,
    fetchMore,
  } = useGetFollowersQuery({
    variables: {
      userId: profileData?.findOneByUsername?.id ?? '',
      skip: 0,
      take: USERS_PER_PAGE,
    },
    skip: !profileData?.findOneByUsername?.id,
  });

  const [users, setUsers] = useState(followersData?.getFollowers?.data ?? []);
  const [hasMore, setHasMore] = useState(
    followersData?.getFollowers?.hasMore ?? false,
  );

  useEffect(() => {
    if (followersData?.getFollowers) {
      setUsers(followersData.getFollowers.data);
      setHasMore(followersData.getFollowers.hasMore);
      setSkip(followersData.getFollowers.data.length);
    }
  }, [followersData]);

  const handleLoadMore = async () => {
    if (!hasMore || followersLoading || !profileData?.findOneByUsername?.id) {
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

          const newUsers = fetchMoreResult.getFollowers?.data ?? [];
          const allUsers = [...users, ...newUsers];

          setUsers(allUsers);
          setHasMore(fetchMoreResult.getFollowers?.hasMore ?? false);
          setSkip(allUsers.length);

          return {
            getFollowers: {
              ...fetchMoreResult.getFollowers,
              data: allUsers,
            },
          };
        },
      });
    } catch (error) {
      console.error('Failed to load more followers:', error);
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
        loading={followersLoading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
