'use client';

import { useTranslations } from 'next-intl';
import { RefObject, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { ProfileInfo } from '@/entities/profile-info';
import { ProfilePostsList } from '@/entities/profile-posts-list';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Role } from '@/features/auth/types';
import { ProfileActionsMenu } from '@/features/profile/profile-actions/ui/profile-actions-menu';
import {
  useFindAllByUsernameQuery,
  useFindOneByUsernameQuery,
  UserModel,
} from '@/graphql/generated/output';
import {
  POSTS_PER_PAGE,
  PostSortOrder,
} from '@/shared/constants/post.constants';
import { ListPost, Nullable } from '@/shared/libs/types';

interface ProfilePageComponentProps {
  username: string;
}

export function ProfilePageComponent({ username }: ProfilePageComponentProps) {
  const t = useTranslations('profile');
  const { isSuperAdmin } = useAuth();
  const [posts, setPosts] = useState<ListPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentSkip, setCurrentSkip] = useState(0);

  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
  } = useFindOneByUsernameQuery({
    variables: { username: username },
  });

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
    fetchMore: fetchMorePosts,
  } = useFindAllByUsernameQuery({
    variables: {
      username,
      filter: {
        take: POSTS_PER_PAGE,
        skip: 0,
        sortBy: PostSortOrder.NEWEST,
      },
    },
  });

  useEffect(() => {
    if (postsData?.findAllByUsername) {
      setPosts(postsData?.findAllByUsername as ListPost[]);
      setCurrentSkip(POSTS_PER_PAGE);
      setHasMore(postsData?.findAllByUsername?.length === POSTS_PER_PAGE);
    }
  }, [postsData]);

  useEffect(() => {
    if (inView && hasMore && !postsLoading) {
      fetchMorePosts({
        variables: {
          filter: {
            take: POSTS_PER_PAGE,
            skip: currentSkip,
            sortBy: PostSortOrder.NEWEST,
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          const newPosts = fetchMoreResult.findAllByUsername || [];
          const allPosts = [...(prev.findAllByUsername || []), ...newPosts];

          setPosts(allPosts as ListPost[]);
          setCurrentSkip(currentSkip + POSTS_PER_PAGE);
          setHasMore(newPosts.length === POSTS_PER_PAGE);

          return {
            findAllByUsername: allPosts,
          };
        },
      });
    }
  }, [inView, hasMore, postsLoading, currentSkip, posts, fetchMorePosts]);

  if (!profileData && !profileLoading) {
    return <div className='text-center text-gray-500'>{t('noProfile')}</div>;
  }

  const viewed = profileData?.findOneByUsername;

  return (
    <div className='flex flex-col gap-4'>
      <ProfileInfo
        profile={viewed as Nullable<UserModel>}
        loading={profileLoading}
        error={profileError as Error}
        isMe={viewed?.isMe}
        trailingSlot={
          viewed &&
          !viewed.isMe &&
          isSuperAdmin &&
          viewed.role !== Role.SUPER_ADMIN ? (
            <ProfileActionsMenu
              userId={viewed.id}
              username={viewed.username}
              currentRole={viewed.role}
            />
          ) : null
        }
      />
      <ProfilePostsList
        posts={posts}
        loading={postsLoading}
        error={postsError as Error}
        hasMore={hasMore}
        ref={ref as unknown as RefObject<HTMLDivElement>}
      />
    </div>
  );
}
