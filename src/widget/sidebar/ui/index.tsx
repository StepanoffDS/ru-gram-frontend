'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  HomeIcon,
  LogOutIcon,
  MessageSquareIcon,
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
import { Logo } from '@/shared/components/logo';
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
import { useIsMobile } from '@/shared/hooks/use-mobile';

export function MainSidebar() {
  const [isOpenCreatePost, setIsOpenCreatePost] = useState(false);
  const t = useTranslations('sidebar');
  const router = useRouter();
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
                  <Link href='/profile/me'>
                    <UserIcon />
                    {t('menu.profile')}
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
