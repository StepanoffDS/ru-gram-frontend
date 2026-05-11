'use client';

import { useParams, useSearchParams } from 'next/navigation';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Post } from '@/entities/post';
import { PostComments } from '@/features/post/comments';
import { useFindOneByIdQuery } from '@/graphql/generated/output';
import { PageHeader } from '@/shared/components/page-header';

export default function PostPage() {
  const t = useTranslations('postPage');
  const params = useParams<{ postId: string }>();
  const searchParams = useSearchParams();

  const postId = params.postId;
  const focusCommentId = searchParams.get('commentId');

  const { data, loading } = useFindOneByIdQuery({
    variables: { id: postId },
    skip: !postId,
  });

  const post = data?.findOneById;

  if (loading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <Loader2 className='size-8 animate-spin' />
      </div>
    );
  }

  if (!post) {
    return (
      <div className='flex h-full flex-col'>
        <PageHeader title={t('title')} />
        <div className='text-muted-foreground text-sm'>{t('notFound')}</div>
      </div>
    );
  }

  return (
    <div className='flex h-full flex-col'>
      <PageHeader title={t('title')} />
      <div className='space-y-4 pb-6'>
        <Post
          post={post}
          showCommentsAction={false}
        />
        <PostComments
          postId={post.id}
          initialCount={post.commentsCount}
          initialOpen
          showToggleButton={false}
          focusCommentId={focusCommentId}
        />
      </div>
    </div>
  );
}
