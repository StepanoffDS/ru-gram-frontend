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
import { useCreatePostMutation } from '@/graphql/generated/output';
import { AuthWarning } from '@/shared/components/auth-warning';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { addImageToPost } from '@/shared/libs/post-images-api';

import {
  createPostSchema,
  type CreatePostSchema,
} from '../schemas/create-post.schema';
import { CreatePostFooter } from './footer';

function getImageData(event: ChangeEvent<HTMLInputElement>) {
  const fileList = event.target.files;
  if (!fileList || fileList.length === 0) {
    return { files: [], displayUrls: [] };
  }

  const files = Array.from(fileList);
  const displayUrls = files.map((file) => URL.createObjectURL(file));

  return { files, displayUrls };
}

interface CreatePostProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function CreatePost({ isOpen, setIsOpen }: CreatePostProps) {
  const { isAuthenticated } = useAuth();
  const t = useTranslations('createPostModal');
  const [createPost, { loading: createLoading }] = useCreatePostMutation();
  const [uploadLoading, setUploadLoading] = useState(false);
  const form = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      text: '',
    },
  });
  const [preview, setPreview] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const loading = createLoading || uploadLoading;

  const onSubmit = async (data: CreatePostSchema) => {
    try {
      setUploadLoading(true);

      const { data: postData } = await createPost({
        variables: {
          data: {
            title: data.title,
            text: data.text,
          },
        },
        refetchQueries: ['findAllPosts'],
        awaitRefetchQueries: true,
      });

      if (!postData?.createPost) {
        throw new Error(t('errorMessage'));
      }

      const postId = postData.createPost.id;

      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          setUploadProgress(
            t('uploadProgress', { index: i + 1, total: imageFiles.length }),
          );

          await addImageToPost(postId, imageFiles[i]);
        }
      }

      toast.success(t('successMessage'));
      form.reset();
      setPreview([]);
      setImageFiles([]);
      setUploadProgress('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
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

    if (newFiles.length > 0) {
      const dataTransfer = new DataTransfer();
      newFiles.forEach((file) => dataTransfer.items.add(file));
      form.setValue('images', dataTransfer.files);
    } else {
      form.setValue('images', undefined);
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

              <FormField
                control={form.control}
                name='images'
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormLabel>{t('imagesLabel')}</FormLabel>
                    <FormControl>
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
                              const { files, displayUrls } =
                                getImageData(event);

                              const newImageFiles = [...imageFiles, ...files];
                              setPreview([...preview, ...displayUrls]);
                              setImageFiles(newImageFiles);

                              const dataTransfer = new DataTransfer();
                              newImageFiles.forEach((file) =>
                                dataTransfer.items.add(file),
                              );
                              onChange(dataTransfer.files);

                              event.target.value = '';
                            }}
                          />
                          <PlusIcon />
                        </label>
                        {preview.length > 0 &&
                          preview.map((image, index) => (
                            <div
                              key={index}
                              className='relative h-32 w-32 flex-shrink-0'
                            >
                              <Image
                                src={image}
                                alt='preview'
                                className='rounded-md object-cover'
                                fill
                              />
                              <XIcon
                                className='absolute top-0 right-0 cursor-pointer'
                                onClick={() => deleteImage(index)}
                              />
                            </div>
                          ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CreatePostFooter
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
