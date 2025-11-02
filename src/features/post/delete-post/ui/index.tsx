import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useDeletePostMutation } from '@/graphql/generated/output';
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

interface DeletePostProps {
  postId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function DeletePost({ postId, isOpen, setIsOpen }: DeletePostProps) {
  const [deletePost, { loading: deleteLoading }] = useDeletePostMutation();
  const t = useTranslations('deletePost');
  const handleDeletePost = async () => {
    const result = await deletePost({
      variables: { id: postId },
      refetchQueries: ['FindAllPosts', 'FindAllByMe', 'FindAllByUsername'],
      awaitRefetchQueries: true,
    });
    if (result.data?.deletePost) {
      toast.success(t('successMessage'));
      setIsOpen(false);
    } else {
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
            onClick={handleDeletePost}
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
