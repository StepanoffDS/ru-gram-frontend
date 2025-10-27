'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  HomeIcon,
  LogOutIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { CreatePost } from '@/features/post/create-post';
import { useLogoutUserMutation } from '@/graphql/generated/output';
import { LanguageButtons } from '@/shared/components/language-buttons';
import { Logo } from '@/shared/components/logo';
import { ThemeToggleSwitch } from '@/shared/components/theme-toggle-switch';
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
  const { exit } = useAuth();
  const isMobile = useIsMobile();
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarContent>
        <SidebarFooter className='p-2'>
          <SidebarMenu>
            <LanguageButtons />
            <SidebarMenuItem>
              <ThemeToggleSwitch />
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
