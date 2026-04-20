import {
  SidebarProvider,
  SidebarTrigger,
} from '@/shared/components/ui/sidebar';
import { BlockedUserOverlay } from '@/features/user-block';
import { MobileBottomNavigation } from '@/widget/mobile-bottom-navigation';
import { MainSidebar } from '@/widget/sidebar';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider className='flex h-screen'>
      <MainSidebar />
      <main className='relative flex flex-1 flex-col'>
        <SidebarTrigger />
        <div className='my-container flex min-h-0 flex-1 flex-col'>
          {children}
        </div>
        <BlockedUserOverlay />
      </main>
      <MobileBottomNavigation />
    </SidebarProvider>
  );
}
