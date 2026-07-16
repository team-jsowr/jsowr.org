'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Asset } from 'contentful';
import { shuffleArray } from '@/lib/utils';

interface GallerySectionProps {
  title?: string;
  images: Asset[];
  layout?: 'grid' | 'carousel' | 'masonry';
}

function getImageAlt(fieldsTitle: unknown, fallback: string): string {
  if (typeof fieldsTitle === 'string' && fieldsTitle) return fieldsTitle;
  if (fieldsTitle && typeof fieldsTitle === 'object') {
    const firstValue = Object.values(fieldsTitle as Record<string, string | undefined>)[0];
    if (firstValue) return firstValue;
  }
  return fallback;
}

export default function GallerySection({
  title,
  images,
  layout = 'grid',
}: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  // Start with the original order so server and client render the same markup on mount,
  // then shuffle client-side so each visit shows a different order/position.
  const [displayImages, setDisplayImages] = useState(images);

  useEffect(() => {
    setDisplayImages(shuffleArray(images));
  }, [images]);

  const showPrev = useCallback(() => {
    setSelectedImage((current) =>
      current === null ? null : (current - 1 + displayImages.length) % displayImages.length
    );
  }, [displayImages.length]);

  const showNext = useCallback(() => {
    setSelectedImage((current) => (current === null ? null : (current + 1) % displayImages.length));
  }, [displayImages.length]);

  useEffect(() => {
    if (selectedImage === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'ArrowRight') showNext();
      else if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedImage, showPrev, showNext]);

  if (!images || images.length === 0) return null;

  return (
    <section className="bg-background py-16 px-4 sm:px-6 lg:px-8">
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground text-center">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {displayImages.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={`https:${image.fields.file?.url}`}
                alt={getImageAlt(image.fields.title, `Gallery image ${index + 1}`)}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform group-hover:scale-110"
              />
            </div>
          ))}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
              <Image
                src={`https:${displayImages[selectedImage].fields.file?.url}`}
                alt={getImageAlt(displayImages[selectedImage].fields.title, 'Gallery image')}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>

            {displayImages.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary-white/80 hover:bg-primary-white text-primary-red p-2 rounded-full shadow-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary-white/80 hover:bg-primary-white text-primary-red p-2 rounded-full shadow-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight size={28} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-primary-white/80 text-sm">
                  {selectedImage + 1} / {displayImages.length}
                </div>
              </>
            )}

            <button
              className="absolute top-4 right-4 text-primary-white text-4xl hover:text-primary-white/70"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        )}
    </section>
  );
}
