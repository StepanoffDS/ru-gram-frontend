import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useToggleHidePostMutation } from '@/graphql/generated/output';
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
import { Nullable } from '@/shared/libs/types';

interface HidePostProps {
  postId: string;
  hidden: Nullable<boolean>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function HidePost({ postId, hidden, isOpen, setIsOpen }: HidePostProps) {
  const [hidePost, { loading: hideLoading }] = useToggleHidePostMutation();
  const t = useTranslations('hidePost');
  const handleHidePost = async () => {
    const result = await hidePost({
      variables: { postId },
      refetchQueries: ['findAllPosts'],
      awaitRefetchQueries: true,
    });
    if (result.data?.toggleHidePost) {
      toast.success(hidden ? t('successShowPost') : t('successHidePost'));
      setIsOpen(false);
    } else {
      toast.error(hidden ? t('errorShowPost') : t('errorHidePost'));
    }
  };

  const getButtonText = () => {
    if (hideLoading)
      return hidden ? t('loadingShowPost') : t('loadingHidePost');
    return hidden ? t('showPostButton') : t('hidePostButton');
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {hidden ? t('showPost') : t('hidePost')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {hidden ? t('showPostDescription') : t('hidePostDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancelButton')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleHidePost}
            disabled={hideLoading}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {getButtonText()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
