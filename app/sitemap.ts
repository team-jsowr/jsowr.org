import type { MetadataRoute } from 'next';
import { getAllPageSlugs, getEvents } from '@/lib/contentful-api';

const SITE_URL = 'https://jsowr.org';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pageSlugs, events] = await Promise.all([getAllPageSlugs(), getEvents()]);

  const pageEntries: MetadataRoute.Sitemap = pageSlugs.map((slug) => ({
    url: slug === 'home' ? SITE_URL : `${SITE_URL}/${slug}`,
    lastModified: new Date(),
  }));

  const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${SITE_URL}/events/${event.slug}`,
    lastModified: new Date(),
  }));

  // Code-defined routes not backed by a Contentful Page entry
  const staticEntries: MetadataRoute.Sitemap = ['/events', '/team'].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  return [...pageEntries, ...staticEntries, ...eventEntries];
}
