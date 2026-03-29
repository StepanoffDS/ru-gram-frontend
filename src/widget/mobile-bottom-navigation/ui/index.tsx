'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  HomeIcon,
  LogOutIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { CreatePost } from '@/features/post/create-post';
import {
  useFindAllChatsByMeQuery,
  useLogoutUserMutation,
} from '@/graphql/generated/output';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { cn } from '@/shared/libs/utils';

interface MobileBottomNavigationProps {
  className?: string;
}

export function MobileBottomNavigation({
  className,
}: MobileBottomNavigationProps) {
  const t = useTranslations('sidebar');
  const router = useRouter();
  const [isOpenCreatePost, setIsOpenCreatePost] = useState(false);
  const { exit, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const { data: chatsData } = useFindAllChatsByMeQuery({
    skip: !isAuthenticated,
  });
  const totalUnreadMessages = useMemo(() => {
    const list = chatsData?.findAllChatsByMe;
    if (!list?.length) return 0;
    return list.reduce((acc, chat) => acc + Math.round(chat.unreadCount), 0);
  }, [chatsData]);

  const [logoutUser, { loading: isLoadingLogout }] = useLogoutUserMutation({
    onCompleted: () => {
      exit();
      toast.success(t('logout.successMessage'));
      router.push('/login');
    },
    onError: () => {
      toast.error(t('logout.errorMessage'));
    },
  });

  const handleLogout = () => {
    logoutUser();
  };

  if (!isMobile) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          'bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed right-0 bottom-0 left-0 z-50 border-t backdrop-blur',
          className,
        )}
      >
        <div className='flex h-12 items-center justify-around px-2 sm:h-16'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsOpenCreatePost(true)}
            className='flex h-auto flex-col items-center gap-1 px-3 py-2'
          >
            <PlusIcon className='h-7 w-7' />
            <span className='hidden text-xs sm:block'>
              {t('menu.createPost')}
            </span>
          </Button>

          <Button
            variant='ghost'
            size='sm'
            asChild
            className='flex h-auto flex-col items-center gap-1 px-3 py-2'
          >
            <Link href='/search'>
              <SearchIcon className='h-7 w-7' />
              <span className='hidden text-xs sm:block'>
                {t('menu.search')}
              </span>
            </Link>
          </Button>

          <Button
            variant='ghost'
            size='sm'
            asChild
            className='flex h-auto flex-col items-center gap-1 px-3 py-2'
          >
            <Link href='/'>
              <HomeIcon className='h-7 w-7' />
              <span className='hidden text-xs sm:block'>{t('menu.home')}</span>
            </Link>
          </Button>

          <Button
            variant='ghost'
            size='sm'
            asChild
            className='flex h-auto flex-col items-center gap-1 px-3 py-2'
          >
            <Link href='/chats'>
              <MessageSquareIcon className='h-7 w-7' />
              <span className='hidden text-xs sm:block'>{t('menu.chats')}</span>
              {totalUnreadMessages > 0 && (
                <Badge className='ml-auto min-w-5 justify-center px-1 py-0.5 text-[11px]'>
                  {totalUnreadMessages > 99 ? '99+' : totalUnreadMessages}
                </Badge>
              )}
            </Link>
          </Button>

          <Button
            variant='ghost'
            size='sm'
            asChild
            className='flex h-auto flex-col items-center gap-1 px-3 py-2'
          >
            <Link href='/profile/me'>
              <UserIcon className='h-7 w-7' />
              <span className='hidden text-xs sm:block'>
                {t('menu.profile')}
              </span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className='flex h-auto flex-col items-center gap-1 px-3 py-2'
              >
                <MoreHorizontalIcon className='h-7 w-7' />
                <span className='hidden text-xs sm:block'>
                  {t('menu.other')}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='w-56'
            >
              <DropdownMenuItem asChild>
                <Link href='/settings'>
                  <SettingsIcon className='mr-2 h-4 w-4' />
                  {t('menu.settings')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoadingLogout}
                className='text-red-500 focus:bg-red-50 focus:text-red-500 dark:focus:bg-red-950'
              >
                <LogOutIcon className='mr-2 h-4 w-4' />
                {isLoadingLogout ? t('menu.loadingLogout') : t('menu.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CreatePost
        isOpen={isOpenCreatePost}
        setIsOpen={setIsOpenCreatePost}
      />
    </>
  );
}
