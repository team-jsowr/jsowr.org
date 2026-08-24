import { Metadata } from 'next';
import { getEvents, getGallerySectionByTitle } from '@/lib/contentful-api';
import EventCard from '@/app/_components/EventCard';
import GallerySection from '@/app/_components/sections/GallerySection';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming prayers, festivals, and community gatherings hosted by the Jain Society of Waterloo Region.',
};

export default async function EventsPage() {
  const [events, gallery] = await Promise.all([
    getEvents(),
    getGallerySectionByTitle('Events Gallery'),
  ]);

  return (
    <main className="py-16 bg-secondary min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Events</h1>
          <p className="text-lg text-muted-foreground">
            Join us for prayers, festivals, and community gatherings.
          </p>
        </div>

        {events.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No events are posted right now. Check back soon.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        )}
      </div>

      {gallery && gallery.images?.length > 0 && (
        <GallerySection title={gallery.title} images={gallery.images} layout={gallery.layout} />
      )}
    </main>
  );
}
