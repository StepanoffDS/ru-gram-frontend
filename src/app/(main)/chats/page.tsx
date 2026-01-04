'use client';

import { useTranslations } from 'next-intl';

import { ChatList } from '@/entities/chat-list/ui';
import { PageHeader } from '@/shared/components/page-header';

// Моковые данные для верстки (без бэкенда)
const mockChats = [
  {
    id: '1',
    users: [
      {
        id: 'user1',
        username: 'john_doe',
        name: 'John Doe',
        avatar: null,
      },
      {
        id: 'user2',
        username: 'jane_smith',
        name: 'Jane Smith',
        avatar: null,
      },
    ],
    messages: [
      {
        content: 'Привет! Как дела?',
        createdAt: new Date(),
        user: {
          username: 'john_doe',
        },
      },
    ],
  },
  {
    id: '2',
    users: [
      {
        id: 'user1',
        username: 'john_doe',
        name: 'John Doe',
        avatar: null,
      },
      {
        id: 'user3',
        username: 'alice_wonder',
        name: 'Alice Wonder',
        avatar: null,
      },
    ],
    messages: [
      {
        content: 'Спасибо за помощь!',
        createdAt: new Date(),
        user: {
          username: 'alice_wonder',
        },
      },
    ],
  },
];

export default function ChatsPage() {
  const t = useTranslations('chats');

  return (
    <div className='flex h-full flex-col'>
      <PageHeader
        title={t('title')}
        withBackButton={false}
      />
      <div className='mt-4 flex-1 overflow-y-auto'>
        <ChatList
          chats={mockChats}
          loading={false}
          error={null}
          currentUserId='user1'
        />
      </div>
    </div>
  );
}
