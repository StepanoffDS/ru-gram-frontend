'use client';

import Image from 'next/image';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/shared/components/ui/dialog';

interface ImageWindowProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  src: string;
  alt: string;
}

export function ImageWindow({ isOpen, setIsOpen, src, alt }: ImageWindowProps) {
  const t = useTranslations('imageWindow');
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [containerDimensions, setContainerDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const calculateOptimalDimensions = (
    naturalWidth: number,
    naturalHeight: number,
    containerWidth: number,
    containerHeight: number,
  ) => {
    const aspectRatio = naturalWidth / naturalHeight;

    const padding = 40;
    const availableWidth = containerWidth - padding;
    const availableHeight = containerHeight - padding;

    let width = availableWidth;
    let height = availableWidth / aspectRatio;

    if (height > availableHeight) {
      height = availableHeight;
      width = height * aspectRatio;
    }

    return { width, height };
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    setImageDimensions({ width: naturalWidth, height: naturalHeight });
  };

  useEffect(() => {
    const updateContainerDimensions = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const isMobile = viewportWidth < 768;
      const maxWidth = isMobile
        ? viewportWidth * 0.95
        : Math.min(viewportWidth * 0.9, 1200);
      const maxHeight = isMobile ? viewportHeight * 0.9 : viewportHeight * 0.85;

      setContainerDimensions({ width: maxWidth, height: maxHeight });
    };

    updateContainerDimensions();
    window.addEventListener('resize', updateContainerDimensions);

    return () =>
      window.removeEventListener('resize', updateContainerDimensions);
  }, []);

  const finalDimensions =
    imageDimensions && containerDimensions
      ? calculateOptimalDimensions(
          imageDimensions.width,
          imageDimensions.height,
          containerDimensions.width,
          containerDimensions.height,
        )
      : null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogContent
        showCloseButton={false}
        className='w-auto max-w-[95vw] p-2 sm:p-4'
        style={{
          maxWidth: containerDimensions
            ? `${containerDimensions.width}px`
            : '95vw',
          maxHeight: containerDimensions
            ? `${containerDimensions.height}px`
            : '90vh',
        }}
      >
        <DialogTitle className='sr-only'>{alt}</DialogTitle>

        <Button
          variant='ghost'
          size='icon'
          className='absolute -top-2 -right-2 z-10 h-8 w-8 cursor-pointer rounded-full bg-black/50 text-white hover:bg-black/70 sm:-top-7 sm:-right-7'
          onClick={() => setIsOpen(false)}
          aria-label={t('closeButton')}
        >
          <X className='h-4 w-4' />
        </Button>

        <div className='flex h-full min-h-[200px] w-full items-center justify-center'>
          <div
            className='relative flex items-center justify-center'
            style={{
              width: finalDimensions ? `${finalDimensions.width}px` : '100%',
              height: finalDimensions ? `${finalDimensions.height}px` : 'auto',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          >
            <Image
              src={src}
              alt={alt}
              width={finalDimensions?.width || 800}
              height={finalDimensions?.height || 600}
              style={{
                objectFit: 'contain',
                maxWidth: '100%',
                maxHeight: '100%',
              }}
              className='rounded-md'
              onLoad={handleImageLoad}
              priority
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
