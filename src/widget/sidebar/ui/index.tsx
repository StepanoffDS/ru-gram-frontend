'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useQuery } from '@apollo/client';
import {
  BellIcon,
  HomeIcon,
  LogOutIcon,
  MessageSquareIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  NOTIFICATIONS_UNREAD_COUNT_QUERY,
  NotificationsUnreadCountData,
} from '@/features/notifications/api/notifications.gql';
import { CreatePost } from '@/features/post/create-post';
import {
  useFindAllChatsByMeQuery,
  useFindMeQuery,
  useLogoutUserMutation,
} from '@/graphql/generated/output';
import { Logo } from '@/shared/components/logo';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui/sidebar';
import { S3_URL } from '@/shared/constants/api.constants';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { getInitials } from '@/shared/utils/get-initials';

export function MainSidebar() {
  const [isOpenCreatePost, setIsOpenCreatePost] = useState(false);
  const t = useTranslations('sidebar');
  const router = useRouter();
  const { exit, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const { data: chatsData } = useFindAllChatsByMeQuery({
    skip: !isAuthenticated,
  });
  const { data: meData } = useFindMeQuery({
    skip: !isAuthenticated,
  });
  const { data: unreadNotificationsData } =
    useQuery<NotificationsUnreadCountData>(NOTIFICATIONS_UNREAD_COUNT_QUERY, {
      skip: !isAuthenticated,
    });
  const unreadNotificationsCount =
    unreadNotificationsData?.notificationsUnreadCount.total ?? 0;
  const totalUnreadMessages = useMemo(() => {
    const list = chatsData?.findAllChatsByMe;
    if (!list?.length) return 0;
    return list.reduce((acc, chat) => acc + Math.round(chat.unreadCount), 0);
  }, [chatsData]);
  const profileLogin = meData?.findMe?.username
    ? `@${meData.findMe.username}`
    : t('menu.profile');
  const profileName = meData?.findMe?.name || meData?.findMe?.username;
  const hasProfileName = Boolean(
    meData?.findMe?.name && meData.findMe.name !== meData.findMe.username,
  );
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

  const handleLogout = async () => {
    await logoutUser();
  };

  if (isMobile) {
    return null;
  }

  return (
    <div>
      <Sidebar>
        <SidebarHeader className='mt-4'>
          <Link href='/'>
            <Logo />
          </Link>
        </SidebarHeader>
        <SidebarContent className='mt-8 px-2'>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size='lg'
                  onClick={() => setIsOpenCreatePost(true)}
                >
                  <PlusIcon />
                  {t('menu.createPost')}
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  size='lg'
                  asChild={true}
                >
                  <Link href='/'>
                    <HomeIcon className='size-4' />
                    {t('menu.home')}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  size='lg'
                  asChild={true}
                >
                  <Link href='/chats'>
                    <MessageSquareIcon />
                    {t('menu.chats')}
                    {totalUnreadMessages > 0 && (
                      <Badge className='ml-auto min-w-5 justify-center px-1 py-0.5 text-[11px]'>
                        {totalUnreadMessages > 99 ? '99+' : totalUnreadMessages}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  size='lg'
                  asChild={true}
                >
                  <Link href='/notifications'>
                    <BellIcon />
                    {t('menu.notifications')}
                    {unreadNotificationsCount > 0 && (
                      <Badge className='ml-auto min-w-5 justify-center px-1 py-0.5 text-[11px]'>
                        {unreadNotificationsCount > 99
                          ? '99+'
                          : unreadNotificationsCount}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  size='lg'
                  asChild={true}
                >
                  <Link href='/search'>
                    <SearchIcon />
                    {t('menu.search')}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  size='lg'
                  asChild={true}
                >
                  <Link href='/settings'>
                    <SettingsIcon />
                    {t('menu.settings')}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarContent>
        <SidebarFooter className='p-2'>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size='lg'
                asChild={true}
              >
                <Link href='/profile/me'>
                  <Avatar className='size-7'>
                    {meData?.findMe?.avatar ? (
                      <AvatarImage
                        src={S3_URL + meData.findMe.avatar}
                        alt={profileName || t('menu.profile')}
                        className='object-cover'
                      />
                    ) : (
                      <AvatarFallback>
                        {getInitials(profileName || t('menu.profile'))}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className='flex min-w-0 flex-col leading-tight'>
                    {hasProfileName ? (
                      <span className='truncate font-medium'>{profileName}</span>
                    ) : null}
                    <span className='truncate text-xs text-muted-foreground'>
                      {profileLogin}
                    </span>
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                size='lg'
                onClick={handleLogout}
                disabled={isLoadingLogout}
                className='w-full text-red-500 disabled:text-red-300'
              >
                <LogOutIcon className='size-4' />
                {isLoadingLogout ? t('menu.loadingLogout') : t('menu.logout')}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <CreatePost
          isOpen={isOpenCreatePost}
          setIsOpen={setIsOpenCreatePost}
        />
      </Sidebar>
    </div>
  );
}
