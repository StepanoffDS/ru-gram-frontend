'use client';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTranslations } from 'next-intl';

dayjs.extend(relativeTime);

/**
 * Хук для форматирования времени в красивый относительный формат
 * @returns функция для форматирования времени
 */
export function useFormatTime() {
  const t = useTranslations('formatTimeAgo');

  const formatTimeAgo = (date: string | Date): string => {
    const now = dayjs();
    const postDate = dayjs(date);
    const diffInMinutes = now.diff(postDate, 'minute');
    const diffInHours = now.diff(postDate, 'hour');
    const diffInDays = now.diff(postDate, 'day');

    return getTimeAgoText(diffInMinutes, diffInHours, diffInDays, postDate, t);
  };

  return { formatTimeAgo };
}

/**
 * Возвращает текст для отображения времени
 */
function getTimeAgoText(
  diffInMinutes: number,
  diffInHours: number,
  diffInDays: number,
  postDate: dayjs.Dayjs,
  t: ReturnType<typeof useTranslations<'formatTimeAgo'>>,
): string {
  if (diffInMinutes < 1) return t('justNow');
  if (diffInMinutes < 60) return formatMinutes(diffInMinutes, t);
  if (diffInHours < 24) return formatHours(diffInHours, t);
  if (diffInDays < 7) return formatDays(diffInDays, t);

  return postDate.format('DD.MM.YYYY');
}

/**
 * Форматирует минуты
 */
function formatMinutes(
  minutes: number,
  t: ReturnType<typeof useTranslations<'formatTimeAgo'>>,
): string {
  if (minutes === 1) return t('minuteAgo1');
  if (minutes < 5) return t('minuteAgo2to4', { count: minutes });
  return t('minuteAgo5plus', { count: minutes });
}

/**
 * Форматирует часы
 */
function formatHours(
  hours: number,
  t: ReturnType<typeof useTranslations<'formatTimeAgo'>>,
): string {
  if (hours === 1) return t('hourAgo1');
  if (hours < 5) return t('hourAgo2to4', { count: hours });
  return t('hourAgo5plus', { count: hours });
}

/**
 * Форматирует дни
 */
function formatDays(
  days: number,
  t: ReturnType<typeof useTranslations<'formatTimeAgo'>>,
): string {
  if (days === 1) return t('dayAgo1');
  if (days < 5) return t('dayAgo2to4', { count: days });
  return t('dayAgo5plus', { count: days });
}
