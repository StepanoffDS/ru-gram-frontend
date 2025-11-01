import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  useDeleteProfileMutation,
  useLogoutUserMutation,
} from '@/graphql/generated/output';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';

interface DeleteProfileProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function DeleteProfile({ isOpen, setIsOpen }: DeleteProfileProps) {
  const router = useRouter();
  const { exit } = useAuth();
  const t = useTranslations('deleteProfile');
  const [deleteProfile, { loading: deleteLoading }] =
    useDeleteProfileMutation();
  const [logoutUser] = useLogoutUserMutation();

  const handleDeleteProfile = async () => {
    try {
      const result = await deleteProfile();

      if (result.data?.deleteProfile) {
        toast.success(t('successMessage'));
        setIsOpen(false);

        // Выходим из системы после удаления профиля
        await logoutUser();
        exit();
        router.push('/login');
      } else {
        toast.error(t('errorMessage'));
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error(t('errorMessage'));
    }
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancelButton')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteProfile}
            disabled={deleteLoading}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {deleteLoading ? t('loading') : t('submitButton')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
