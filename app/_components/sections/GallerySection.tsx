'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
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
                className="object-contain"
              />
            </div>
            <button
              className="absolute top-4 right-4 text-white text-4xl hover:text-primary-white/70"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>
        )}
    </section>
  );
}
