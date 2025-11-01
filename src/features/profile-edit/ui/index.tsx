'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  FindMeQuery,
  useChangeProfileInfoMutation,
} from '@/graphql/generated/output';
import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

import { AvatarUpload } from './avatar-upload';
import { DeleteProfile } from './delete-profile';

const profileEditSchema = z.object({
  name: z.string().min(1, 'Имя обязательно').max(50, 'Имя слишком длинное'),
  username: z
    .string()
    .min(3, 'Имя пользователя должно содержать минимум 3 символа')
    .max(30, 'Имя пользователя слишком длинное')
    .regex(
      /^[a-zA-Z0-9_.-]+$/,
      'Имя пользователя может содержать только буквы, цифры, точку, дефис и подчеркивания',
    ),
  bio: z.string().max(300, 'Биография слишком длинная').optional(),
});

type ProfileEditFormData = z.infer<typeof profileEditSchema>;

interface ProfileEditFormProps {
  profile: FindMeQuery['findMe'];
}

export function ProfileEdit({ profile }: ProfileEditFormProps) {
  const router = useRouter();
  const t = useTranslations('profileEdit');
  const [currentAvatar, setCurrentAvatar] = useState(profile.avatar);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const form = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      name: profile.name || '',
      username: profile.username,
      bio: profile.bio || '',
    },
  });

  const [changeProfileInfo, { loading: changeProfileLoading }] =
    useChangeProfileInfoMutation({
      refetchQueries: ['FindMe', 'FindAllByMe'],
      awaitRefetchQueries: true,
    });

  const onSubmit = async (data: ProfileEditFormData) => {
    try {
      await changeProfileInfo({
        variables: {
          data: {
            name: data.name,
            username: data.username,
            bio: data.bio || '',
          },
        },
        refetchQueries: ['FindMe', 'FindAllByMe'],
        awaitRefetchQueries: true,
      });

      toast.success(t('successUpdateProfile'));
      router.push('/profile/me');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(t('errorUpdateProfile'));
    }
  };

  const isLoading = changeProfileLoading;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6'
      >
        <div className='space-y-4'>
          <FormLabel>{t('avatarLabel')}</FormLabel>
          <AvatarUpload
            currentAvatar={currentAvatar}
            onAvatarChange={setCurrentAvatar}
            disabled={isLoading}
          />
        </div>

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('nameLabel')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('namePlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('usernameLabel')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('usernamePlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => {
            const bioLength = field.value?.length || 0;
            const maxLength = 300;
            return (
              <FormItem>
                <div className='flex items-center justify-between'>
                  <FormLabel>{t('bioLabel')}</FormLabel>
                  <span
                    className={`text-xs ${
                      bioLength > maxLength
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {bioLength}/{maxLength}
                  </span>
                </div>
                <FormControl>
                  <Textarea
                    placeholder={t('bioPlaceholder')}
                    className='min-h-[100px]'
                    maxLength={maxLength}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className='flex justify-end space-x-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.back()}
            disabled={isLoading}
          >
            {t('cancelButton')}
          </Button>
          <Button
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? t('loading') : t('submitButton')}
          </Button>
        </div>
      </form>

      <div className='mt-8 border-t pt-6'>
        <div className='flex flex-col gap-4'>
          <div>
            <h3 className='text-destructive text-lg font-semibold'>
              {t('dangerZone.title')}
            </h3>
            <p className='text-muted-foreground text-sm'>
              {t('dangerZone.description')}
            </p>
          </div>
          <Button
            type='button'
            variant='destructive'
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isLoading}
          >
            {t('dangerZone.deleteButton')}
          </Button>
        </div>
      </div>

      <DeleteProfile
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
      />
    </Form>
  );
}
