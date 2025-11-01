import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { PostsList } from '@/entities/posts-list';
import { ListPost } from '@/shared/libs/types';

export function ProfilePostsList({
  posts,
  loading,
  error,
  hasMore,
  ref,
}: {
  posts: ListPost[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  ref: React.RefObject<HTMLDivElement>;
}) {
  const t = useTranslations('profilePostsList');

  if (loading) {
    return (
      <div className='absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center'>
        <Loader2 className='size-8 animate-spin' />
      </div>
    );
  }

  if (error) {
    return <div className='text-center text-red-500'>{error.message}</div>;
  }

  if (posts.length === 0) {
    return <div className='text-center text-gray-500'>{t('noPosts')}</div>;
  }

  return (
    <PostsList
      posts={posts}
      loading={loading}
      error={error}
      hasMore={hasMore}
      ref={ref}
    />
  );
}
