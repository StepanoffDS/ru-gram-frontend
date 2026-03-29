'use client';

import { usePathname, useRouter } from 'next/navigation';

import { useApolloClient } from '@apollo/client';
import { PropsWithChildren } from 'react';
import { toast } from 'sonner';

import {
  FindAllChatsByMeDocument,
  useMessageCreatedForUserSubscription,
} from '@/graphql/generated/output';

export function ChatNotificationsProvider({
  children,
}: PropsWithChildren<unknown>) {
  const pathname = usePathname();
  const router = useRouter();
  const client = useApolloClient();

  useMessageCreatedForUserSubscription({
    onData: ({ data }) => {
      const msg = data?.data?.messageCreatedForUser;
      if (!msg) return;
      const senderName = msg.user.name ?? msg.user.username;

      const onThisChatPage = pathname.startsWith(`/chats/${msg.chatId}`);

      void client.refetchQueries({ include: [FindAllChatsByMeDocument] });

      if (onThisChatPage) return;

      toast(`Новое сообщение от @${senderName}`, {
        description: msg.content,
        action: {
          label: 'Открыть',
          onClick: () => router.push(`/chats/${msg.chatId}`),
        },
      });
    },
  });

  return <>{children}</>;
}
