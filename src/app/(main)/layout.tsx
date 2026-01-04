import { MobileBottomNavigation } from '@/shared/components/mobile-bottom-navigation';
import {
  SidebarProvider,
  SidebarTrigger,
} from '@/shared/components/ui/sidebar';
import { MainSidebar } from '@/widget/sidebar';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider className='flex h-screen overflow-hidden'>
      <MainSidebar />
      <main className='relative flex-1 flex flex-col overflow-hidden'>
        <SidebarTrigger />
        <div className='my-container flex-1 flex flex-col overflow-hidden'>
          {children}
        </div>
      </main>
      <MobileBottomNavigation />
    </SidebarProvider>
  );
}
