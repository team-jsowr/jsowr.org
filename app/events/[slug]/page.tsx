import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, MapPin } from 'lucide-react';
import { getEventBySlug } from '@/lib/contentful-api';
import { renderRichText } from '@/lib/rich-text';
import GallerySection from '@/app/_components/sections/GallerySection';
import { formatEventDate } from '@/app/_components/EventCard';

export const revalidate = 3600;

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: 'Event Not Found' };
  }

  return {
    title: event.metaTitle || `${event.title} | JSOWR`,
    description: event.metaDescription || event.shortDescription,
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const image = event.featuredImage?.fields;

  return (
    <main>
      <section className="relative bg-gray-50">
        <div className="relative h-[360px] md:h-[420px]">
          {image?.file ? (
            <>
              <Image
                src={`https:${image.file.url}`}
                alt={(image.title as unknown as string) || event.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/40" />
            </>
          ) : (
            <div className="absolute inset-0 bg-primary-red" />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{event.title}</h1>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-gray-100">
                <span className="flex items-center">
                  <Calendar size={18} className="mr-2" />
                  {formatEventDate(event.date)}
                </span>
                {event.location && (
                  <span className="flex items-center">
                    <MapPin size={18} className="mr-2" />
                    {event.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
          {renderRichText(event.description)}
        </div>
      </section>

      {event.gallery && event.gallery.length > 0 && (
        <GallerySection title="Gallery" images={event.gallery} />
      )}
    </main>
  );
}
