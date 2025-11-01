'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { HelpCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useCreateUserMutation } from '@/graphql/generated/output';
import { Button } from '@/shared/components/ui/button';
import { Form, FormField } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { PasswordInput } from '@/shared/components/ui/password-input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

import {
  createAccountSchema,
  type CreateAccountSchema,
} from '../schemas/create-account.schema';
import { AuthWrapper } from '../ui/auth-wrapper';
import { FieldWrapper } from '../ui/field-wrapper';
import { FormWrapper } from '../ui/form-wrapper';

export function CreateAccountForm() {
  const t = useTranslations('auth.register');
  const router = useRouter();
  const usernameRules = t.raw('usernameTooltip.rules') as string[];
  const form = useForm<CreateAccountSchema>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });
  const { isValid } = form.formState;

  const [createUser, { loading: isLoadingCreate }] = useCreateUserMutation({
    onCompleted: () => {
      toast.success(t('successMessage'));
      router.push('/login');
    },
    onError: () => {
      toast.error(t('errorMessage'));
    },
  });

  const onSubmit = (data: CreateAccountSchema) => {
    createUser({ variables: { data } });
  };

  return (
    <AuthWrapper
      heading={t('heading')}
      backButtonLabel={t('backButtonLabel')}
      backButtonHref='/login'
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          autoComplete='on'
        >
          <FormWrapper>
            <FieldWrapper
              label='Email'
              name='email'
            >
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <Input
                    {...field}
                    id='email'
                    name='email'
                    value={field.value || ''}
                    placeholder='example@gmail.com'
                    disabled={isLoadingCreate}
                    autoComplete='email'
                  />
                )}
              />
            </FieldWrapper>

            <FieldWrapper
              label={
                <div className='flex items-center gap-2'>
                  <Label htmlFor='username'>{t('usernameLabel')}</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className='text-muted-foreground h-4 w-4 cursor-help' />
                    </TooltipTrigger>
                    <TooltipContent
                      side='top'
                      className='max-w-xs'
                    >
                      <div className='space-y-1'>
                        <p className='font-medium'>
                          {t('usernameTooltip.title')}:
                        </p>
                        <ul className='space-y-1 text-xs'>
                          {usernameRules.map((rule, index) => (
                            <li key={index}>• {rule}</li>
                          ))}
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              }
            >
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <Input
                    {...field}
                    id='username'
                    name='username'
                    value={field.value || ''}
                    placeholder='john_doe'
                    disabled={isLoadingCreate}
                    autoComplete='username'
                  />
                )}
              />
            </FieldWrapper>

            <FieldWrapper
              label={t('passwordLabel')}
              name='password'
            >
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    id='password'
                    name='password'
                    value={field.value || ''}
                    placeholder='********'
                    disabled={isLoadingCreate}
                    autoComplete='new-password'
                  />
                )}
              />
            </FieldWrapper>

            <Button
              type='submit'
              disabled={!isValid || isLoadingCreate}
            >
              {t('submitButton')}
            </Button>
          </FormWrapper>
        </form>
      </Form>
    </AuthWrapper>
  );
}
