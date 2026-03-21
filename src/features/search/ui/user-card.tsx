'use client';

import Link from 'next/link';

import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Role } from '@/features/auth/types';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { S3_URL } from '@/shared/constants/api.constants';
import { cn } from '@/shared/libs/utils';

interface User {
  id: string;
  email: string;
  username: string;
  name?: string | null;
  avatar?: string | null;
  bio?: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const t = useTranslations('userCard');
  const getInitials = (name: string | null, username: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return username.slice(0, 2).toUpperCase();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'USER':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const displayName = user.name || user.username;

  return (
    <Link
      href={`/profile/${user.username}`}
      className='block'
      aria-label={t('openProfile', { name: displayName })}
    >
      <Card
        className={cn(
          'hover:bg-accent cursor-pointer gap-0 py-0 transition-colors',
        )}
      >
        <CardContent className='flex items-center gap-4 p-4'>
          <Avatar className='ring-border size-14 shrink-0 ring-2'>
            {user.avatar ? (
              <AvatarImage
                src={S3_URL + user.avatar}
                alt={displayName}
              />
            ) : (
              <AvatarFallback className='text-base'>
                {getInitials(user.name || '', user.username)}
              </AvatarFallback>
            )}
          </Avatar>

          <div className='min-w-0 flex-1'>
            <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
              <span className='truncate font-semibold'>{displayName}</span>
              {user.role === Role.ADMIN && (
                <Badge
                  variant={getRoleBadgeVariant(user.role)}
                  className='shrink-0 text-[10px] uppercase tracking-wide'
                >
                  {user.role}
                </Badge>
              )}
            </div>
            <p className='text-muted-foreground truncate text-sm'>
              @{user.username}
            </p>
            {user.bio ? (
              <p className='text-muted-foreground mt-1 line-clamp-1 text-sm'>
                {user.bio}
              </p>
            ) : null}
            <p className='text-muted-foreground mt-1.5 text-xs'>
              {t('registered')}:{' '}
              {new Date(user.createdAt).toLocaleDateString('ru-RU')}
            </p>
          </div>

          <ChevronRight
            className='text-muted-foreground size-5 shrink-0'
            aria-hidden
          />
        </CardContent>
      </Card>
    </Link>
  );
}
