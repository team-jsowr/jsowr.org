import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageBySlug, getGallerySectionByTitle } from '@/lib/contentful-api';
import HeroSection from '@/app/_components/sections/HeroSection';
import ContentSection from '@/app/_components/sections/ContentSection';
import GallerySection from '@/app/_components/sections/GallerySection';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug?.join('/') || 'home';
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  const fields = page.fields as any;

  return {
    title: fields.metaTitle || fields.title || 'JSOWR',
    description: fields.metaDescription || '',
  };
}

export default async function CatchAllPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug?.join('/') || 'home';
  
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const fields = page.fields as any;
  const sections = fields.sections || [];

  const hasCarouselHero = sections.some(
    (s: any) =>
      s.sys?.contentType?.sys?.id === 'heroSection' &&
      s.fields?.isCarousel &&
      (s.fields?.carouselItems?.length || 0) > 0
  );
  const heroImagePool = hasCarouselHero ? await getGallerySectionByTitle('Events Gallery') : null;

  return (
    <main>
      {/* Render sections if they exist */}
      {sections.length > 0 && sections.map((section: any, index: number) => {
        const sectionType = section.sys?.contentType?.sys?.id;
        const sectionFields = section.fields;

        switch (sectionType) {
          case 'heroSection':
            // Check if this is a carousel or single hero
            const isCarousel = sectionFields.isCarousel;
            const carouselItems = sectionFields.carouselItems || [];

            return (
              <HeroSection
                key={index}
                items={isCarousel && carouselItems.length > 0 ? carouselItems : undefined}
                imagePool={isCarousel && carouselItems.length > 0 ? heroImagePool?.images : undefined}
                title={!isCarousel || carouselItems.length === 0 ? sectionFields.title : undefined}
                subtitle={!isCarousel || carouselItems.length === 0 ? sectionFields.subtitle : undefined}
                ctaText={!isCarousel || carouselItems.length === 0 ? sectionFields.ctaText : undefined}
                ctaLink={!isCarousel || carouselItems.length === 0 ? sectionFields.ctaLink : undefined}
                backgroundImage={!isCarousel || carouselItems.length === 0 ? sectionFields.backgroundImage : undefined}
              />
            );
          
          case 'contentSection':
            return (
              <ContentSection
                key={index}
                title={sectionFields.title}
                content={sectionFields.content}
                backgroundColor={sectionFields.backgroundColor}
                layout={sectionFields.layout}
              />
            );
          
          case 'gallerySection':
            return (
              <GallerySection
                key={index}
                title={sectionFields.title}
                images={sectionFields.images || []}
                layout={sectionFields.layout}
              />
            );
          
          default:
            return null;
        }
      })}

      {/* Fallback: render basic content if no sections */}
      {sections.length === 0 && fields.content && (
        <ContentSection content={fields.content} />
      )}
    </main>
  );
}
