import { contentfulClient } from './contentful';
import type {
  SiteSettings,
  Page,
  Event,
  TeamMember,
  HeroCarouselItem,
  GallerySection,
} from '@/types/contentful';

// Helper function to parse Contentful entries
function parseEntry<T>(entry: any): T {
  return entry.fields as T;
}

// Get site settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'siteSettings',
      limit: 1,
      include: 3, // Include navigation items and their children
    });

    if (entries.items.length === 0) return null;
    return parseEntry<SiteSettings>(entries.items[0]);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

// Get all hero carousel items
export async function getHeroCarouselItems(): Promise<HeroCarouselItem[]> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'heroCarouselItem',
      order: ['fields.order'],
    });

    return entries.items.map((item) => parseEntry<HeroCarouselItem>(item));
  } catch (error) {
    console.error('Error fetching hero carousel items:', error);
    return [];
  }
}

// Get page by slug
export async function getPageBySlug(slug: string): Promise<any | null> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'page',
      'fields.slug': slug,
      limit: 1,
      include: 10, // Include deeply nested references (sections -> heroSection -> carouselItems -> images)
    });

    if (entries.items.length === 0) return null;
    return entries.items[0];
  } catch (error) {
    console.error(`Error fetching page with slug ${slug}:`, error);
    return null;
  }
}

// Get all page slugs (for sitemap generation)
export async function getAllPageSlugs(): Promise<string[]> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'page',
      select: ['fields.slug'],
      limit: 100,
    });
    return entries.items.map((item) => (item.fields as any).slug).filter(Boolean);
  } catch (error) {
    console.error('Error fetching page slugs:', error);
    return [];
  }
}

// Get all events
export async function getEvents(limit?: number): Promise<Event[]> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'event',
      order: ['-fields.date'],
      limit: limit || 100,
    });

    return entries.items.map((item) => parseEntry<Event>(item));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

// Get event by slug
export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'event',
      'fields.slug': slug,
      limit: 1,
    });

    if (entries.items.length === 0) return null;
    return parseEntry<Event>(entries.items[0]);
  } catch (error) {
    console.error(`Error fetching event with slug ${slug}:`, error);
    return null;
  }
}

// Get all team members
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'teamMember',
      order: ['fields.order'],
    });

    return entries.items.map((item) => parseEntry<TeamMember>(item));
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

// Get a standalone gallery section by title (used outside the page-builder, e.g. on /events)
export async function getGallerySectionByTitle(title: string): Promise<GallerySection | null> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'gallerySection',
      'fields.title': title,
      limit: 1,
    });

    if (entries.items.length === 0) return null;
    return parseEntry<GallerySection>(entries.items[0]);
  } catch (error) {
    console.error(`Error fetching gallery section "${title}":`, error);
    return null;
  }
}
