import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin } from 'lucide-react';
import type { Event } from '@/types/contentful';

function formatEventDate(date: string) {
  return new Date(date).toLocaleDateString('en-CA', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function EventCard({ event }: { event: Event }) {
  const image = event.featuredImage?.fields;

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative h-48 bg-gray-100">
        {image?.file ? (
          <Image
            src={`https:${image.file.url}`}
            alt={(image.title as unknown as string) || event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="absolute inset-0 bg-primary-red/10" />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-red transition-colors">
          {event.title}
        </h3>
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <Calendar size={16} className="mr-2 flex-shrink-0" />
          {formatEventDate(event.date)}
        </div>
        {event.location && (
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin size={16} className="mr-2 flex-shrink-0" />
            {event.location}
          </div>
        )}
        <p className="text-gray-600 text-sm line-clamp-3">{event.shortDescription}</p>
      </div>
    </Link>
  );
}

export { formatEventDate };
