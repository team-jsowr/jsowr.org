'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { Asset } from 'contentful';
import type { HeroCarouselItem as HeroCarouselItemType } from '@/types/contentful';
import { Button } from '../ui/button';
import { shuffleArray } from '@/lib/utils';

interface HeroSectionProps {
  items?: HeroCarouselItemType[];
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: any;
  /** Pool of images to randomly draw from for each slide's photo on every visit, keeping each slide's own title/subtitle/CTA. */
  imagePool?: Asset[];
}

export default function HeroSection({ items, title, subtitle, ctaText, ctaLink, backgroundImage, imagePool }: HeroSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  // Start with the original items so server and client render the same markup on mount,
  // then swap in random images from the pool client-side so each visit looks different.
  const [displayItems, setDisplayItems] = useState(items);

  useEffect(() => {
    if (!items || items.length === 0 || !imagePool || imagePool.length === 0) return;
    const randomImages = shuffleArray(imagePool).slice(0, items.length);
    setDisplayItems(
      items.map((item: any, index: number) => ({
        ...item,
        fields: item.fields
          ? { ...item.fields, image: randomImages[index % randomImages.length] }
          : { ...item, image: randomImages[index % randomImages.length] },
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, imagePool]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Single hero mode (no carousel)
  if (title && !items) {
    return (
      <section className="relative bg-gray-50">
        <div className="relative h-[500px] md:h-[600px]">
          {backgroundImage && (
            <>
              <Image
                src={`https:${backgroundImage.fields.file?.url}`}
                alt={backgroundImage.fields.title || title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/40" />
            </>
          )}
          {!backgroundImage && (
            <div className="absolute inset-0 bg-primary-red" />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xl md:text-2xl mb-8 text-gray-100">
                  {subtitle}
                </p>
              )}
              {ctaText && ctaLink && (
                <Button
                  asChild
                  size="lg"
                  className="bg-primary-yellow hover:bg-primary-yellow/90 text-gray-900 font-semibold"
                >
                  <Link href={ctaLink}>{ctaText}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <section className="relative bg-gray-50">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {(displayItems || items).map((item: any, index: number) => {
            // Handle both direct objects and Contentful link objects
            const itemFields = item.fields || item;
            const imageAsset = itemFields.image?.fields || itemFields.image;
            
            return (
              <div key={index} className="flex-[0_0_100%] min-w-0">
                <div className="relative h-[500px] md:h-[600px]">
                  {imageAsset?.file && (
                    <Image
                      src={`https:${imageAsset.file.url}`}
                      alt={imageAsset.title || itemFields.title || 'Hero image'}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="max-w-4xl mx-auto px-4 text-center text-white">
                      <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        {itemFields.title}
                      </h1>
                      {itemFields.subtitle && (
                        <p className="text-xl md:text-2xl mb-8 text-gray-100">
                          {itemFields.subtitle}
                        </p>
                      )}
                      {itemFields.ctaText && itemFields.ctaLink && (
                        <Button
                          asChild
                          size="lg"
                          className="bg-primary-yellow hover:bg-primary-yellow/90 text-gray-900 font-semibold"
                        >
                          <Link href={itemFields.ctaLink}>{itemFields.ctaText}</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg transition-colors z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg transition-colors z-10"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === selectedIndex
                    ? 'bg-primary-yellow w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
