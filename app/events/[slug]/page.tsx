import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import type { Document } from '@contentful/rich-text-types';
import { Calendar, MapPin } from 'lucide-react';
import { getEventBySlug } from '@/lib/contentful-api';
import { richTextOptions } from '@/lib/rich-text';
import GallerySection from '@/app/_components/sections/GallerySection';
import { formatEventDate } from '@/app/_components/EventCard';

export const revalidate = 3600;

interface ScheduleDay {
  heading: any;
  body: any[];
}

/**
 * Splits a rich-text description into any intro content before the first H3,
 * plus one group per H3 (used for multi-day schedules like Paryushan) so each
 * day can be rendered as its own card instead of a flat wall of text.
 */
function splitSchedule(doc: Document): { intro: any[]; days: ScheduleDay[] } {
  const days: ScheduleDay[] = [];
  const intro: any[] = [];
  let current: ScheduleDay | null = null;

  for (const node of doc.content) {
    if (node.nodeType === BLOCKS.HEADING_3) {
      if (current) days.push(current);
      current = { heading: node, body: [] };
    } else if (current) {
      current.body.push(node);
    } else {
      intro.push(node);
    }
  }
  if (current) days.push(current);

  return { intro, days };
}

function headingText(node: any): string {
  return (node.content || []).map((c: any) => c.value || '').join('');
}

function renderNodes(nodes: any[]) {
  return documentToReactComponents({ nodeType: 'document', data: {}, content: nodes } as Document, richTextOptions);
}

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
    title: event.metaTitle || event.title,
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
  const { intro, days } = splitSchedule(event.description);

  return (
    <main>
      <section className="relative bg-secondary">
        <div className="relative h-[360px] md:h-[420px]">
          {image?.file ? (
            <>
              <Image
                src={`https:${image.file.url}`}
                alt={(image.title as unknown as string) || event.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-primary-red/50 via-primary-red/40 to-primary-red/75" />
            </>
          ) : (
            <div className="absolute inset-0 bg-primary-red" />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center text-primary-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{event.title}</h1>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-primary-white/90">
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

      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {intro.length > 0 && (
            <div className="prose prose-lg max-w-none mb-10">{renderNodes(intro)}</div>
          )}

          {days.length > 0 && (
            <div className="space-y-4">
              {days.map((day, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border border-l-4 border-l-primary-yellow bg-card shadow-sm overflow-hidden"
                >
                  <div className="bg-secondary px-5 py-3 flex items-center gap-2">
                    <Calendar size={18} className="text-primary-red shrink-0" />
                    <h3 className="font-serif font-semibold text-lg text-foreground">
                      {headingText(day.heading)}
                    </h3>
                  </div>
                  <div className="px-5 py-4 prose max-w-none [&_p]:mb-2 [&_p:last-child]:mb-0">
                    {renderNodes(day.body)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {event.gallery && event.gallery.length > 0 && (
        <GallerySection title="Gallery" images={event.gallery} />
      )}
    </main>
  );
}
