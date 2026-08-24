import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin } from 'lucide-react';
import type { Event } from '@/types/contentful';

function formatEventDate(date: string) {
  // Contentful gives a date-only string (e.g. "2026-09-08"), which Date() parses as UTC
  // midnight. Rendering in the viewer's local timezone would shift it back a day for
  // anyone west of UTC, so force the formatter to read it back as UTC too.
  return new Date(date).toLocaleDateString('en-CA', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export default function EventCard({ event }: { event: Event }) {
  const image = event.featuredImage?.fields;

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block bg-background rounded-lg shadow-sm border border-border border-t-[3px] border-t-primary-yellow overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative h-48 bg-secondary">
        {image?.file ? (
          <Image
            src={`https:${image.file.url}`}
            alt={(image.title as unknown as string) || event.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="absolute inset-0 bg-primary-red/10" />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary-red transition-colors">
          {event.title}
        </h3>
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <Calendar size={16} className="mr-2 flex-shrink-0" />
          {formatEventDate(event.date)}
        </div>
        {event.location && (
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin size={16} className="mr-2 flex-shrink-0" />
            {event.location}
          </div>
        )}
        <p className="text-muted-foreground text-sm line-clamp-3">{event.shortDescription}</p>
      </div>
    </Link>
  );
}

export { formatEventDate };
