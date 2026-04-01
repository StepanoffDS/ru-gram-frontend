'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { HelpCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  useCreateUserMutation,
  useLoginUserMutation,
} from '@/graphql/generated/output';
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
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';
import { AuthWrapper } from '../ui/auth-wrapper';
import { FieldWrapper } from '../ui/field-wrapper';
import { FormWrapper } from '../ui/form-wrapper';

export function CreateAccountForm() {
  const t = useTranslations('auth.register');
  const { auth, setRole, setUserId } = useAuth();
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

  const [createUser, { loading: isLoadingCreate }] = useCreateUserMutation();
  const [loginUser, { loading: isLoadingLogin }] = useLoginUserMutation();
  const isLoading = isLoadingCreate || isLoadingLogin;

  const onSubmit = async (data: CreateAccountSchema) => {
    try {
      const createResponse = await createUser({ variables: { data } });

      if (!createResponse.data?.createUser) {
        throw new Error('Failed to create user');
      }

      const loginResponse = await loginUser({
        variables: {
          data: {
            login: data.email,
            password: data.password,
          },
        },
      });

      const user = loginResponse.data?.loginUser;

      if (!user) {
        throw new Error('Failed to login after registration');
      }

      auth();
      setRole(user.role as Role);
      setUserId(user.id);
      toast.success(t('successMessage'));
      globalThis.location.href = '/';
    } catch {
      toast.error(t('errorMessage'));
    }
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                    autoComplete='new-password'
                  />
                )}
              />
            </FieldWrapper>

            <Button
              type='submit'
              disabled={!isValid || isLoading}
            >
              {t('submitButton')}
            </Button>
          </FormWrapper>
        </form>
      </Form>
    </AuthWrapper>
  );
}
