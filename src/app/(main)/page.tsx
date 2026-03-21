'use client';

import { useTranslations } from 'next-intl';
import { RefObject, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { PostsList } from '@/entities/posts-list';
import {
  useFindAllByFollowingQuery,
  useFindAllPostsQuery,
} from '@/graphql/generated/output';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import {
  POSTS_PER_PAGE,
  PostSortOrder,
} from '@/shared/constants/post.constants';
import { ListPost } from '@/shared/libs/types';

export default function MainPage() {
  const t = useTranslations('mainPage');
  const [activeTab, setActiveTab] = useState('all');
  const [allPosts, setAllPosts] = useState<ListPost[]>([]);
  const [followingPosts, setFollowingPosts] = useState<ListPost[]>([]);
  const [hasMoreAll, setHasMoreAll] = useState(true);
  const [hasMoreFollowing, setHasMoreFollowing] = useState(true);
  const [currentSkipAll, setCurrentSkipAll] = useState(0);
  const [currentSkipFollowing, setCurrentSkipFollowing] = useState(0);

  const { ref: refAll, inView: inViewAll } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  const { ref: refFollowing, inView: inViewFollowing } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  const {
    data: allPostsData,
    loading: loadingAll,
    error: errorAll,
    fetchMore: fetchMoreAll,
  } = useFindAllPostsQuery({
    variables: {
      filter: {
        take: POSTS_PER_PAGE,
        skip: 0,
        sortBy: PostSortOrder.NEWEST,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: followingPostsData,
    loading: loadingFollowing,
    error: errorFollowing,
    fetchMore: fetchMoreFollowing,
  } = useFindAllByFollowingQuery({
    variables: {
      filter: {
        take: POSTS_PER_PAGE,
        skip: 0,
        sortBy: PostSortOrder.NEWEST,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  // Обработка данных для всех постов
  useEffect(() => {
    if (allPostsData?.findAllPosts) {
      if (allPosts.length === 0 || currentSkipAll === POSTS_PER_PAGE) {
        setAllPosts(allPostsData.findAllPosts);
        setCurrentSkipAll(POSTS_PER_PAGE);
        setHasMoreAll(allPostsData.findAllPosts.length === POSTS_PER_PAGE);
      }
    }
  }, [allPostsData, currentSkipAll, allPosts.length]);

  // Обработка данных для постов от подписок
  useEffect(() => {
    if (followingPostsData?.findAllByFollowing) {
      if (
        followingPosts.length === 0 ||
        currentSkipFollowing === POSTS_PER_PAGE
      ) {
        setFollowingPosts(followingPostsData.findAllByFollowing);
        setCurrentSkipFollowing(POSTS_PER_PAGE);
        setHasMoreFollowing(
          followingPostsData.findAllByFollowing.length === POSTS_PER_PAGE,
        );
      }
    }
  }, [followingPostsData, currentSkipFollowing, followingPosts.length]);

  // Загрузка больше постов для всех постов
  useEffect(() => {
    if (inViewAll && hasMoreAll && !loadingAll) {
      fetchMoreAll({
        variables: {
          filter: {
            take: POSTS_PER_PAGE,
            skip: currentSkipAll,
            sortBy: PostSortOrder.NEWEST,
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          const newPosts = fetchMoreResult.findAllPosts || [];
          const allPostsNew = [...allPosts, ...newPosts];

          setAllPosts(allPostsNew);
          setCurrentSkipAll(currentSkipAll + POSTS_PER_PAGE);
          setHasMoreAll(newPosts.length === POSTS_PER_PAGE);

          return {
            findAllPosts: allPostsNew,
          };
        },
      });
    }
  }, [
    inViewAll,
    hasMoreAll,
    loadingAll,
    currentSkipAll,
    allPosts,
    fetchMoreAll,
  ]);

  // Загрузка больше постов для постов от подписок
  useEffect(() => {
    if (inViewFollowing && hasMoreFollowing && !loadingFollowing) {
      fetchMoreFollowing({
        variables: {
          filter: {
            take: POSTS_PER_PAGE,
            skip: currentSkipFollowing,
            sortBy: PostSortOrder.NEWEST,
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          const newPosts = fetchMoreResult.findAllByFollowing || [];
          const allPostsNew = [...followingPosts, ...newPosts];

          setFollowingPosts(allPostsNew);
          setCurrentSkipFollowing(currentSkipFollowing + POSTS_PER_PAGE);
          setHasMoreFollowing(newPosts.length === POSTS_PER_PAGE);

          return {
            findAllByFollowing: allPostsNew,
          };
        },
      });
    }
  }, [
    inViewFollowing,
    hasMoreFollowing,
    loadingFollowing,
    currentSkipFollowing,
    followingPosts,
    fetchMoreFollowing,
  ]);

  return (
    <div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='w-full'
      >
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='all'>{t('allPosts')}</TabsTrigger>
          <TabsTrigger value='following'>{t('following')}</TabsTrigger>
        </TabsList>

        <TabsContent
          value='all'
          className='mt-6'
        >
          <PostsList
            posts={allPosts}
            loading={loadingAll}
            error={errorAll as Error}
            hasMore={hasMoreAll}
            ref={refAll as unknown as RefObject<HTMLDivElement>}
          />
        </TabsContent>

        <TabsContent
          value='following'
          className='mt-6'
        >
          {followingPosts.length === 0 && !loadingFollowing ? (
            <div className='py-12 text-center text-gray-500 dark:text-gray-400'>
              {t('noFollowingPosts')}
            </div>
          ) : (
            <PostsList
              posts={followingPosts}
              loading={loadingFollowing}
              error={errorFollowing as Error}
              hasMore={hasMoreFollowing}
              ref={refFollowing as unknown as RefObject<HTMLDivElement>}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
