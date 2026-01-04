'use client';

import { Send } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { MessageList } from '@/entities/message-list/ui';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';

// Моковые данные для верстки (без бэкенда)
const mockMessages = [
  {
    id: '1',
    content: 'Привет! Как дела?',
    images: [],
    createdAt: new Date(Date.now() - 3600000),
    user: {
      id: 'user2',
      username: 'jane_smith',
      name: 'Jane Smith',
      avatar: null,
    },
  },
  {
    id: '2',
    content: 'Привет! Всё отлично, спасибо! А у тебя как?',
    images: [],
    createdAt: new Date(Date.now() - 1800000),
    user: {
      id: 'user1',
      username: 'john_doe',
      name: 'John Doe',
      avatar: null,
    },
  },
  {
    id: '3',
    content: 'Тоже всё хорошо! Хотел спросить, можешь помочь с проектом?',
    images: [],
    createdAt: new Date(Date.now() - 600000),
    user: {
      id: 'user1',
      username: 'john_doe',
      name: 'John Doe',
      avatar: null,
    },
  },
  {
    id: '4',
    content: 'Конечно! Что именно нужно?',
    images: [],
    createdAt: new Date(),
    user: {
      id: 'user2',
      username: 'jane_smith',
      name: 'Jane Smith',
      avatar: null,
    },
  },
];

const mockChatUser = {
  id: 'user2',
  username: 'jane_smith',
  name: 'Jane Smith',
  avatar: null,
};

export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const t = useTranslations('chats.chat');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) {
      return;
    }
    // Здесь будет логика отправки сообщения (без бэкенда)
    console.log('Sending message:', message);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const displayName = mockChatUser.name || mockChatUser.username;

  return (
    <div className='flex flex-col h-full'>
      <PageHeader title={displayName} />
      <div className='flex-1 overflow-y-auto mb-4 mt-4'>
        <MessageList
          messages={mockMessages}
          loading={false}
          error={null}
          currentUserId='user1'
        />
      </div>
      <div className='flex gap-2 items-end border-t pt-4 mt-auto shrink-0'>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('messagePlaceholder')}
          className='min-h-[60px] max-h-[120px] resize-none'
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim()}
          size='icon'
          className='h-[60px] w-[60px] shrink-0'
        >
          <Send className='size-5' />
        </Button>
      </div>
    </div>
  );
}
