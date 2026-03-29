'use client';

import { ReactNode } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/shared/components/ui/card';

interface SettingsOptionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}

export function SettingsOptionCard({
  title,
  description,
  icon,
  children,
}: SettingsOptionCardProps) {
  return (
    <Card>
      <CardContent className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='space-y-1'>
          <CardTitle className='flex items-center gap-2'>
            {icon}
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className='w-full sm:w-auto'>{children}</div>
      </CardContent>
    </Card>
  );
}
