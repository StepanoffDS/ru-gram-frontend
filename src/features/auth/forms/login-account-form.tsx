'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { HelpCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useLoginUserMutation } from '@/graphql/generated/output';
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

import { useAuth } from '../hooks/useAuth';
import {
  loginAccountSchema,
  type LoginAccountSchema,
} from '../schemas/login-account.schema';
import { Role } from '../types';
import { FieldWrapper } from '../ui/field-wrapper';
import { FormWrapper } from '../ui/form-wrapper';

export function LoginAccountForm({
  cancelButton,
}: {
  cancelButton?: React.ReactNode;
}) {
  const t = useTranslations('auth.login');
  const { auth, setRole, setUserId } = useAuth();
  const form = useForm<LoginAccountSchema>({
    resolver: zodResolver(loginAccountSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  });
  const { isValid } = form.formState;

  const [loginUser, { loading: isLoadingLogin }] = useLoginUserMutation({
    onCompleted: (data) => {
      auth();
      setRole(data.loginUser.role as Role);
      setUserId(data.loginUser.id);
      toast.success(t('successMessage'));
      globalThis.location.href = '/';
    },
    onError: () => {
      toast.error(t('errorMessage'));
    },
  });

  const onSubmit = (data: LoginAccountSchema) => {
    loginUser({ variables: { data } });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormWrapper>
          <FieldWrapper
            label={
              <div className='flex items-center gap-2'>
                <Label htmlFor='login'>{t('loginLabel')}</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className='text-muted-foreground h-4 w-4 cursor-help' />
                  </TooltipTrigger>
                  <TooltipContent
                    side='top'
                    className='max-w-xs'
                  >
                    <div className='space-y-1'>
                      <p className='text-xs'>{t('loginTooltip.title')}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            }
          >
            <FormField
              control={form.control}
              name='login'
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ''}
                  placeholder='john_doe'
                  disabled={isLoadingLogin}
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
                  value={field.value || ''}
                  placeholder='********'
                  disabled={isLoadingLogin}
                />
              )}
            />
          </FieldWrapper>

          {cancelButton}
          <Button
            type='submit'
            disabled={!isValid || isLoadingLogin}
          >
            {t('submitButton')}
          </Button>
        </FormWrapper>
      </form>
    </Form>
  );
}
