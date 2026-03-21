'use client';

import { MoreVertical } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Role } from '@/features/auth/types';
import {
  FindOneByUsernameDocument,
  useChangeRoleMutation,
} from '@/graphql/generated/output';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

type ProfileActionsMenuProps = {
  userId: string;
  username: string;
  currentRole: string;
};

export function ProfileActionsMenu({
  userId,
  username,
  currentRole,
}: ProfileActionsMenuProps) {
  const t = useTranslations('profileActionsMenu');
  const [changeRole, { loading }] = useChangeRoleMutation({
    refetchQueries: [
      { query: FindOneByUsernameDocument, variables: { username } },
    ],
    awaitRefetchQueries: true,
  });

  async function applyRole(next: Role) {
    try {
      await changeRole({
        variables: { data: { id: userId, role: next } },
      });
      toast.success(next === Role.ADMIN ? t('successAdmin') : t('successUser'));
    } catch {
      toast.error(t('error'));
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon-sm'
          className='text-gray-500 shrink-0 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          aria-label={t('ariaLabel')}
        >
          <MoreVertical className='size-5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-56'
      >
        {currentRole !== Role.ADMIN ? (
          <DropdownMenuItem
            disabled={loading}
            onClick={() => void applyRole(Role.ADMIN)}
          >
            {t('makeAdmin')}
          </DropdownMenuItem>
        ) : null}
        {currentRole === Role.ADMIN ? (
          <DropdownMenuItem
            disabled={loading}
            onClick={() => void applyRole(Role.USER)}
          >
            {t('removeAdmin')}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
