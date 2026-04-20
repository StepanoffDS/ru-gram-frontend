'use client';

import Link from 'next/link';

import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import { ShieldAlert, UserCog, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { toast } from 'sonner';

import { Role } from '@/features/auth/types';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';

const FIND_ME_FOR_MODERATION = gql`
  query FindMeForModeration {
    findMe {
      id
      role
    }
  }
`;

const FIND_MODERATION_USERS = gql`
  query FindModerationUsers($filter: FilterUsersInput!) {
    findAllUsers(filter: $filter) {
      id
      username
      email
      name
      role
      isBlocked
      blockedAt
      blockedBy {
        id
        username
        email
        name
      }
    }
  }
`;

const TOGGLE_USER_BLOCK = gql`
  mutation ToggleUserBlock($data: ToggleUserBlockInput!) {
    toggleUserBlock(data: $data) {
      id
      isBlocked
    }
  }
`;

const CHANGE_ROLE = gql`
  mutation ChangeRoleFromModeration($data: ChangeRoleInput!) {
    changeRole(data: $data) {
      id
      role
    }
  }
`;

type Nullable<T> = T | null;

type ModerationUser = {
  id: string;
  username: string;
  email: string;
  name: Nullable<string>;
  role: string;
  isBlocked: boolean;
  blockedAt: Nullable<string>;
  blockedBy: Nullable<{
    id: string;
    username: string;
    email: string;
    name: Nullable<string>;
  }>;
};

type ModerationUsersResponse = {
  findAllUsers: ModerationUser[];
};

type MeResponse = {
  findMe: {
    id: string;
    role: string;
  };
};

const PAGE_SIZE = 20;

type UsersListProps = {
  filter: {
    isBlocked?: boolean;
    role?: string;
  };
  refreshIndex: number;
  actionLabel: string;
  onAction: (user: ModerationUser) => Promise<void>;
  actionDisabled?: (user: ModerationUser) => boolean;
  emptyText: string;
  loadingText: string;
  footerText?: (user: ModerationUser) => string | null;
};

function ModerationUsersList({
  filter,
  refreshIndex,
  actionLabel,
  onAction,
  actionDisabled,
  emptyText,
  loadingText,
  footerText,
}: UsersListProps) {
  const client = useApolloClient();
  const t = useTranslations('moderationPage');
  const { ref, inView } = useInView({ rootMargin: '120px', threshold: 0 });
  const filterKey = JSON.stringify(filter);
  const isFetchingRef = useRef(false);
  const [users, setUsers] = useState<ModerationUser[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(
    async (skip: number, replace: boolean) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setError(null);
      setLoading(replace);
      setLoadingMore(!replace);

      try {
        const { data } = await client.query<ModerationUsersResponse>({
          query: FIND_MODERATION_USERS,
          variables: {
            filter: {
              ...filter,
              take: PAGE_SIZE,
              skip,
            },
          },
          fetchPolicy: 'network-only',
        });

        const chunk = data.findAllUsers ?? [];
        setUsers((prev) => (replace ? chunk : [...prev, ...chunk]));
        setHasMore(chunk.length === PAGE_SIZE);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : t('commonErrorMessage');
        setError(message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        isFetchingRef.current = false;
      }
    },
    [client, filter, t],
  );

  useEffect(() => {
    setUsers([]);
    setHasMore(true);
    void loadUsers(0, true);
  }, [filterKey, refreshIndex, loadUsers]);

  useEffect(() => {
    if (inView && hasMore && !loading && !loadingMore) {
      void loadUsers(users.length, false);
    }
  }, [inView, hasMore, loading, loadingMore, users.length, loadUsers]);

  if (loading && users.length === 0) {
    return (
      <div className='text-muted-foreground py-8 text-center'>
        {loadingText}
      </div>
    );
  }

  if (error && users.length === 0) {
    return <div className='py-8 text-center text-red-500'>{error}</div>;
  }

  if (!loading && users.length === 0) {
    return (
      <div className='text-muted-foreground py-8 text-center'>{emptyText}</div>
    );
  }

  return (
    <div className='space-y-3'>
      {users.map((user) => {
        const displayName = user.name || user.username;
        const disabled = actionDisabled?.(user) ?? false;
        return (
          <Card key={user.id}>
            <CardContent className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div className='space-y-1'>
                <p className='font-medium'>{displayName}</p>
                <p className='text-muted-foreground text-sm'>
                  @{user.username}
                </p>
                <p className='text-muted-foreground text-xs'>{user.email}</p>
                {footerText ? (
                  <p className='text-muted-foreground text-xs'>
                    {footerText(user)}
                  </p>
                ) : null}
              </div>
              <Button
                variant={user.isBlocked ? 'outline' : 'destructive'}
                size='sm'
                disabled={disabled}
                onClick={() => void onAction(user)}
              >
                {actionLabel}
              </Button>
            </CardContent>
          </Card>
        );
      })}
      {hasMore ? (
        <div
          ref={ref}
          className='text-muted-foreground py-2 text-center text-sm'
        >
          {loadingMore ? t('loadingMore') : ''}
        </div>
      ) : null}
    </div>
  );
}

export function ModerationView() {
  const t = useTranslations('moderationPage');
  const { data, loading: meLoading } = useQuery<MeResponse>(
    FIND_ME_FOR_MODERATION,
    {
      fetchPolicy: 'network-only',
    },
  );
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [toggleUserBlock, { loading: isBlocking }] =
    useMutation(TOGGLE_USER_BLOCK);
  const [changeRole, { loading: isChangingRole }] = useMutation(CHANGE_ROLE);

  const me = data?.findMe;
  const isPrivileged = me?.role === Role.ADMIN || me?.role === Role.SUPER_ADMIN;
  const isSuperAdmin = me?.role === Role.SUPER_ADMIN;

  const refreshAll = () => setRefreshIndex((prev) => prev + 1);

  const handleBlockToggle = async (
    user: ModerationUser,
    nextBlocked: boolean,
  ) => {
    try {
      await toggleUserBlock({
        variables: {
          data: {
            id: user.id,
            isBlocked: nextBlocked,
          },
        },
      });
      toast.success(nextBlocked ? t('blockedSuccess') : t('unblockedSuccess'));
      refreshAll();
    } catch {
      toast.error(t('commonErrorMessage'));
    }
  };

  const handleRemoveAdmin = async (user: ModerationUser) => {
    try {
      await changeRole({
        variables: {
          data: {
            id: user.id,
            role: Role.USER,
          },
        },
      });
      toast.success(t('roleRemovedSuccess'));
      refreshAll();
    } catch {
      toast.error(t('commonErrorMessage'));
    }
  };

  if (meLoading) {
    return (
      <div className='text-muted-foreground py-8 text-center'>
        {t('loading')}
      </div>
    );
  }

  if (!isPrivileged) {
    return (
      <div className='mx-auto w-full max-w-2xl py-4'>
        <Card>
          <CardHeader>
            <CardTitle>{t('forbiddenTitle')}</CardTitle>
            <CardDescription>{t('forbiddenDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant='outline'
            >
              <Link href='/settings'>{t('backToSettings')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='w-full space-y-4'>
      <Tabs defaultValue='active'>
        <TabsList className='w-full'>
          <TabsTrigger
            value='active'
            className='w-full'
          >
            <Users className='size-4' />
            {t('tabs.activeUsers')}
          </TabsTrigger>
          <TabsTrigger
            value='blocked'
            className='w-full'
          >
            <ShieldAlert className='size-4' />
            {t('tabs.blockedUsers')}
          </TabsTrigger>
          {isSuperAdmin ? (
            <TabsTrigger
              value='admins'
              className='w-full'
            >
              <UserCog className='size-4' />
              {t('tabs.admins')}
            </TabsTrigger>
          ) : null}
        </TabsList>

        <TabsContent value='active'>
          <ModerationUsersList
            filter={{ isBlocked: false }}
            refreshIndex={refreshIndex}
            actionLabel={isBlocking ? t('actions.loading') : t('actions.block')}
            actionDisabled={(user) => user.id === me?.id || isBlocking}
            emptyText={t('empty.activeUsers')}
            loadingText={t('loadingUsers')}
            onAction={(user) => handleBlockToggle(user, true)}
          />
        </TabsContent>

        <TabsContent value='blocked'>
          <ModerationUsersList
            filter={{ isBlocked: true }}
            refreshIndex={refreshIndex}
            actionLabel={
              isBlocking ? t('actions.loading') : t('actions.unblock')
            }
            actionDisabled={(user) => user.id === me?.id || isBlocking}
            emptyText={t('empty.blockedUsers')}
            loadingText={t('loadingUsers')}
            onAction={(user) => handleBlockToggle(user, false)}
            footerText={(user) => {
              const blockedBy = user.blockedBy?.username
                ? `@${user.blockedBy.username}`
                : t('unknownBlocker');
              return t('lastBlockedBy', { blocker: blockedBy });
            }}
          />
        </TabsContent>

        {isSuperAdmin ? (
          <TabsContent value='admins'>
            <ModerationUsersList
              filter={{ role: Role.ADMIN }}
              refreshIndex={refreshIndex}
              actionLabel={
                isChangingRole ? t('actions.loading') : t('actions.removeAdmin')
              }
              actionDisabled={(user) => isChangingRole || user.isBlocked}
              emptyText={t('empty.admins')}
              loadingText={t('loadingUsers')}
              onAction={handleRemoveAdmin}
              footerText={(user) => {
                if (user.isBlocked) return t('adminBlockedHint');
                return null;
              }}
            />
          </TabsContent>
        ) : null}
      </Tabs>
    </div>
  );
}
