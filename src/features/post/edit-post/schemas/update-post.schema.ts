import { z } from 'zod';

export const updatePostSchema = z
  .object({
    title: z.string().optional(),
    text: z
      .string()
      .max(1500, 'Текст не может превышать 1500 символов')
      .optional(),
  })
  .refine((data) => data.title || data.text, {
    message: 'Пост не может быть пустым',
    path: ['title'],
  });

export type UpdatePostSchema = z.infer<typeof updatePostSchema>;
