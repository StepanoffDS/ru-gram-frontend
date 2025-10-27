'use client';

import Image from 'next/image';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { FieldWrapper } from '@/features/auth/ui/field-wrapper';
import { useUpdatePostMutation } from '@/graphql/generated/output';
import { AuthWarning } from '@/shared/components/auth-warning';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Form } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { S3_URL } from '@/shared/constants/api.constants';
import {
  addImageToPost,
  removeImageFromPost,
} from '@/shared/libs/post-images-api';
import { ListPost } from '@/shared/libs/types';

import {
  updatePostSchema,
  type UpdatePostSchema,
} from '../schemas/update-post.schema';
import { UpdatePostFooter } from './footer';

function getImageData(event: ChangeEvent<HTMLInputElement>) {
  const fileList = event.target.files;
  if (!fileList || fileList.length === 0) {
    return { files: [], displayUrls: [] };
  }

  const files = Array.from(fileList);
  const displayUrls = files.map((file) => URL.createObjectURL(file));

  return { files, displayUrls };
}

interface EditPostProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  post: ListPost;
}

export function EditPost({ isOpen, setIsOpen, post }: EditPostProps) {
  const { isAuthenticated } = useAuth();
  const t = useTranslations('editPostModal');
  const [updatePost, { loading: updateLoading }] = useUpdatePostMutation();
  const [uploadLoading, setUploadLoading] = useState(false);
  const form = useForm<UpdatePostSchema>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      title: post.title || '',
      text: post.text || '',
    },
  });

  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [preview, setPreview] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    post.images || [],
  );

  const loading = updateLoading || uploadLoading;

  const onSubmit = async (data: UpdatePostSchema) => {
    try {
      setUploadLoading(true);

      const { data: postData } = await updatePost({
        variables: {
          id: post.id,
          data: {
            title: data.title || '',
            text: data.text || '',
          },
        },
        refetchQueries: ['findAllPosts'],
        awaitRefetchQueries: true,
      });

      if (!postData?.updatePost) {
        throw new Error(t('errorMessage'));
      }

      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          setUploadProgress(
            t('uploadProgress', { index: i + 1, total: imageFiles.length }),
          );

          await addImageToPost(post.id, imageFiles[i]);
        }
      }

      toast.success(t('successMessage'));
      form.reset();
      setPreview([]);
      setImageFiles([]);
      setUploadProgress('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error(t('errorMessage'));
      setUploadProgress('');
    } finally {
      setUploadLoading(false);
    }
  };

  const deleteImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = preview.filter((_, i) => i !== index);

    setImageFiles(newFiles);
    setPreview(newPreviews);
  };

  const deleteExistingImage = async (imageUrl: string) => {
    try {
      setUploadLoading(true);
      await removeImageFromPost(post.id, imageUrl);
      setExistingImages((prev) => prev.filter((url) => url !== imageUrl));
      toast.success(t('deleteImageSuccessMessage'));
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error(t('deleteImageErrorMessage'));
    } finally {
      setUploadLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <AuthWarning
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    );
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-4'>
              <FieldWrapper
                label={t('titleLabel')}
                name='title'
              >
                <Input
                  {...form.register('title')}
                  placeholder={t('titleLabel')}
                />
              </FieldWrapper>
              <FieldWrapper
                label={t('textLabel')}
                name='text'
              >
                <Textarea
                  {...form.register('text')}
                  placeholder={t('textLabel')}
                />
              </FieldWrapper>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>
                  {t('imagesLabel')}
                </label>
                <div className='custom-scrollbar flex gap-2 overflow-x-auto pb-2'>
                  <label
                    htmlFor={t('imagesLabel')}
                    className='flex aspect-square h-32 w-32 flex-shrink-0 items-center justify-center rounded-md border border-dashed border-gray-300'
                  >
                    <Input
                      type='file'
                      multiple
                      accept='image/*'
                      id='images'
                      className='hidden'
                      onChange={(event) => {
                        const { files, displayUrls } = getImageData(event);

                        const newImageFiles = [...imageFiles, ...files];
                        setPreview([...preview, ...displayUrls]);
                        setImageFiles(newImageFiles);

                        event.target.value = '';
                      }}
                    />
                    <PlusIcon />
                  </label>

                  {existingImages.map((imageUrl, index) => (
                    <div
                      key={`existing-${index}`}
                      className='relative h-32 w-32 flex-shrink-0'
                    >
                      <Image
                        src={S3_URL + imageUrl}
                        alt='existing'
                        className='rounded-md object-cover'
                        fill
                      />
                      <XIcon
                        className='absolute top-0 right-0 cursor-pointer rounded-full bg-red-500 text-white'
                        onClick={() => deleteExistingImage(imageUrl)}
                        size={20}
                      />
                    </div>
                  ))}

                  {preview.length > 0 &&
                    preview.map((image, index) => (
                      <div
                        key={`new-${index}`}
                        className='relative h-32 w-32 flex-shrink-0'
                      >
                        <Image
                          src={image}
                          alt='preview'
                          className='rounded-md object-cover'
                          fill
                        />
                        <XIcon
                          className='absolute top-0 right-0 cursor-pointer rounded-full bg-red-500 text-white'
                          onClick={() => deleteImage(index)}
                          size={20}
                        />
                      </div>
                    ))}
                </div>
                <p className='text-muted-foreground text-sm'>
                  {t('imagesDescription')}
                </p>
              </div>
            </div>

            <UpdatePostFooter
              setIsOpen={setIsOpen}
              isValid={!loading}
              loading={loading}
              uploadProgress={uploadProgress}
            />
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
