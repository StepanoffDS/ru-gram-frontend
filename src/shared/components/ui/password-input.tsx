'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ComponentProps, useState } from 'react';

import { Button } from './button';
import { Input } from './input';

interface PasswordInputProps extends Omit<ComponentProps<'input'>, 'type'> {
  className?: string;
}

function PasswordInput({ className, ...props }: PasswordInputProps) {
  const t = useTranslations('passwordInput');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='relative'>
      <Input
        className={className}
        type={showPassword ? 'text' : 'password'}
        {...props}
      />
      <Button
        type='button'
        variant='ghost'
        size='sm'
        className='absolute top-0 right-0 h-9 w-9 p-0 hover:bg-transparent'
        onClick={togglePasswordVisibility}
        disabled={props.disabled}
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff className='text-muted-foreground h-4 w-4' />
        ) : (
          <Eye className='text-muted-foreground h-4 w-4' />
        )}
        <span className='sr-only'>
          {showPassword ? t('hidePassword') : t('showPassword')}
        </span>
      </Button>
    </div>
  );
}

export { PasswordInput };
