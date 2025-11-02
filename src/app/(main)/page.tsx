'use client';

import { RefObject, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { PostsList } from '@/entities/posts-list';
import { useFindAllPostsQuery } from '@/graphql/generated/output';
import {
  POSTS_PER_PAGE,
  PostSortOrder,
} from '@/shared/constants/post.constants';
import { ListPost } from '@/shared/libs/types';

export default function MainPage() {
  const [posts, setPosts] = useState<ListPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentSkip, setCurrentSkip] = useState(0);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  const { data, loading, error, fetchMore } = useFindAllPostsQuery({
    variables: {
      filter: {
        take: POSTS_PER_PAGE,
        skip: 0,
        sortBy: PostSortOrder.NEWEST,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data?.findAllPosts) {
      if (posts.length === 0 || currentSkip === POSTS_PER_PAGE) {
        setPosts(data.findAllPosts);
        setCurrentSkip(POSTS_PER_PAGE);
        setHasMore(data.findAllPosts.length === POSTS_PER_PAGE);
      }
    }
  }, [data, currentSkip, posts.length]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchMore({
        variables: {
          filter: {
            take: POSTS_PER_PAGE,
            skip: currentSkip,
            sortBy: PostSortOrder.NEWEST,
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          const newPosts = fetchMoreResult.findAllPosts || [];
          const allPosts = [...posts, ...newPosts];

          setPosts(allPosts);
          setCurrentSkip(currentSkip + POSTS_PER_PAGE);
          setHasMore(newPosts.length === POSTS_PER_PAGE);

          return {
            findAllPosts: allPosts,
          };
        },
      });
    }
  }, [inView, hasMore, loading, currentSkip, posts, fetchMore]);

  return (
    <PostsList
      posts={posts}
      loading={loading}
      error={error as Error}
      hasMore={hasMore}
      ref={ref as unknown as RefObject<HTMLDivElement>}
    />
  );
}
