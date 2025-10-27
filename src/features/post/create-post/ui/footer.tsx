import { useTranslations } from 'next-intl';

import {
  AlertDialogCancel,
  AlertDialogFooter,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';

interface CreatePostFooterProps {
  setIsOpen: (isOpen: boolean) => void;
  isValid: boolean;
  loading?: boolean;
  uploadProgress?: string;
}

export function CreatePostFooter({
  setIsOpen,
  isValid,
  loading = false,
  uploadProgress = '',
}: CreatePostFooterProps) {
  const t = useTranslations('createPostModal');
  const handleClose = () => {
    setIsOpen(false);
  };

  const getButtonText = () => {
    if (uploadProgress) return uploadProgress;
    if (loading) return t('loading');
    return t('submitButton');
  };

  return (
    <AlertDialogFooter>
      <AlertDialogCancel
        onClick={handleClose}
        disabled={loading}
      >
        {t('cancelButton')}
      </AlertDialogCancel>
      <Button
        disabled={!isValid || loading}
        type='submit'
      >
        {getButtonText()}
      </Button>
    </AlertDialogFooter>
  );
}
