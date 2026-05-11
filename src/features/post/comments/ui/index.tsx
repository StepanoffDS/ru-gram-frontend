'use client';

import { gql, useMutation, useQuery } from '@apollo/client';
import { MessageCircle, Reply } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { useFormatTime } from '@/shared/hooks/use-format-time';
import { cn } from '@/shared/libs/utils';

type CommentUser = {
  id: string;
  username: string;
  name: string | null;
};

type PostComment = {
  id: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  user: CommentUser;
  replies: PostComment[];
};

type FindPostCommentsData = {
  findPostComments: PostComment[];
};

type FindPostCommentsVariables = {
  postId: string;
};

type CreatePostCommentData = {
  createPostComment: PostComment;
};

type CreatePostCommentVariables = {
  postId: string;
  data: {
    content: string;
    parentId?: string;
  };
};

const FIND_POST_COMMENTS_QUERY = gql`
  query FindPostComments($postId: String!) {
    findPostComments(postId: $postId) {
      id
      content
      parentId
      createdAt
      user {
        id
        username
        name
      }
      replies {
        id
        content
        parentId
        createdAt
        user {
          id
          username
          name
        }
      }
    }
  }
`;

const CREATE_POST_COMMENT_MUTATION = gql`
  mutation CreatePostComment($postId: String!, $data: CreatePostCommentInput!) {
    createPostComment(postId: $postId, data: $data) {
      id
    }
  }
`;

interface PostCommentsProps {
  postId: string;
  initialCount?: number | null;
  initialOpen?: boolean;
  showToggleButton?: boolean;
  focusCommentId?: string | null;
}

export function PostComments({
  postId,
  initialCount,
  initialOpen = false,
  showToggleButton = true,
  focusCommentId,
}: PostCommentsProps) {
  const t = useTranslations('postComments');
  const { formatTimeAgo } = useFormatTime();
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [displayCount, setDisplayCount] = useState(initialCount ?? 0);
  const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(
    null,
  );
  const [replyTo, setReplyTo] = useState<{
    id: string;
    username: string;
  } | null>(null);

  const { data, loading, refetch } = useQuery<
    FindPostCommentsData,
    FindPostCommentsVariables
  >(FIND_POST_COMMENTS_QUERY, {
    variables: { postId },
    skip: !isOpen,
    fetchPolicy: 'cache-and-network',
  });

  const comments = useMemo(() => data?.findPostComments ?? [], [data]);

  const loadedCount = useMemo(
    () => comments.reduce((acc, comment) => acc + 1 + comment.replies.length, 0),
    [comments],
  );

  const commentIdsSignature = useMemo(() => {
    return comments
      .flatMap((comment) => [comment.id, ...comment.replies.map((reply) => reply.id)])
      .join(',');
  }, [comments]);

  useEffect(() => {
    setIsOpen(initialOpen);
  }, [initialOpen]);

  useEffect(() => {
    setDisplayCount(initialCount ?? 0);
  }, [initialCount]);

  useEffect(() => {
    if (isOpen) {
      setDisplayCount(loadedCount);
    }
  }, [isOpen, loadedCount]);

  useEffect(() => {
    if (!replyTo) {
      return;
    }

    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.focus();
    const length = textarea.value.length;
    textarea.setSelectionRange(length, length);
  }, [replyTo]);

  useEffect(() => {
    if (!isOpen || !focusCommentId) {
      return;
    }

    const el = document.getElementById(`comment-${focusCommentId}`);

    if (!el) {
      return;
    }

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightedCommentId(focusCommentId);

    const timeout = window.setTimeout(() => {
      setHighlightedCommentId((current) =>
        current === focusCommentId ? null : current,
      );
    }, 2400);

    return () => window.clearTimeout(timeout);
  }, [focusCommentId, isOpen, commentIdsSignature]);

  const [createComment, { loading: isCreating }] = useMutation<
    CreatePostCommentData,
    CreatePostCommentVariables
  >(CREATE_POST_COMMENT_MUTATION);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const content = value.trim();

    if (!content) {
      return;
    }

    await createComment({
      variables: {
        postId,
        data: {
          content,
          ...(replyTo ? { parentId: replyTo.id } : {}),
        },
      },
    });

    setValue('');
    setReplyTo(null);
    setDisplayCount((prev) => prev + 1);
    await refetch();
  };

  return (
    <>
      {showToggleButton ? (
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='w-fit gap-2'
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <MessageCircle className='size-4' />
          {t('toggle', { count: displayCount })}
        </Button>
      ) : null}

      {isOpen ? (
        <div className='w-full space-y-3 rounded-md border p-3'>
          <form
            onSubmit={handleSubmit}
            className='space-y-2'
          >
            {replyTo ? (
              <div className='text-muted-foreground text-xs'>
                {t('replyTo', { username: replyTo.username })}
                <button
                  type='button'
                  onClick={() => setReplyTo(null)}
                  className='ml-2 underline'
                >
                  {t('cancelReply')}
                </button>
              </div>
            ) : null}
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={t('placeholder')}
              rows={2}
            />
            <Button
              type='submit'
              size='sm'
              disabled={isCreating || !value.trim()}
            >
              {isCreating ? t('sending') : t('send')}
            </Button>
          </form>

          {loading ? (
            <div className='text-muted-foreground text-sm'>{t('loading')}</div>
          ) : null}

          {!loading && comments.length === 0 ? (
            <div className='text-muted-foreground text-sm'>{t('empty')}</div>
          ) : null}

          <div className='space-y-3'>
            {comments.map((comment) => (
              <div
                key={comment.id}
                className='space-y-2'
              >
                <CommentCard
                  id={comment.id}
                  comment={comment}
                  formatTimeAgo={formatTimeAgo}
                  highlighted={highlightedCommentId === comment.id}
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='h-7 px-2 text-xs'
                  onClick={() =>
                    setReplyTo({
                      id: comment.id,
                      username: comment.user.username,
                    })
                  }
                >
                  <Reply className='size-3.5' />
                  {t('reply')}
                </Button>

                {comment.replies.length ? (
                  <div className='ml-5 space-y-2 border-l pl-3'>
                    {comment.replies.map((reply) => (
                      <CommentCard
                        key={reply.id}
                        id={reply.id}
                        comment={reply}
                        formatTimeAgo={formatTimeAgo}
                        highlighted={highlightedCommentId === reply.id}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

function CommentCard({
  id,
  comment,
  formatTimeAgo,
  highlighted,
}: {
  id: string;
  comment: PostComment;
  formatTimeAgo: (value: string | Date) => string;
  highlighted?: boolean;
}) {
  const displayName = comment.user.name || comment.user.username;

  return (
    <div
      id={`comment-${id}`}
      className={cn(
        'bg-muted/40 rounded-md p-2 transition-colors duration-300',
        highlighted && 'bg-amber-200/60 dark:bg-amber-500/20',
      )}
    >
      <div className='text-muted-foreground flex items-center gap-2 text-xs'>
        <span className='text-foreground font-medium'>
          @{comment.user.username}
        </span>
        <span>{displayName}</span>
        <span>{formatTimeAgo(comment.createdAt)}</span>
      </div>
      <p className='mt-1 text-sm whitespace-pre-wrap'>{comment.content}</p>
    </div>
  );
}
