# Contentful Content Model

Space alias "Blank", environment `master`. This mirrors `types/contentful.ts` — if you add/change a field in Contentful, update both this file and that file together, they're not auto-synced.

## Page-builder content types (used inside `Page.sections`)

### `heroSection` (7 fields)
| Field | Type | Notes |
|---|---|---|
| title | string | Used when not a carousel |
| subtitle | string? | |
| backgroundImage | Asset? | |
| ctaText | string? | |
| ctaLink | string? | |
| isCarousel | boolean? | If true and `carouselItems` is non-empty, renders the carousel instead of the single hero |
| carouselItems | Entry[]? | References to `heroCarouselItem` entries |

### `heroCarouselItem` (6 fields)
title, subtitle?, image, ctaText?, ctaLink?, order? — standalone entries, also fetched directly via `getHeroCarouselItems()` for the homepage carousel outside the page-builder.

### `contentSection` (4 fields)
title?, content (rich text), backgroundColor?, layout? (`single-column` | `two-column` | `three-column`)

### `gallerySection` (3 fields)
title?, images (Asset[]), layout? (`grid` | `carousel` | `masonry` — only `grid` is actually implemented in `GallerySection.tsx` as of 2026-07)

## Standalone content types (their own routes, not page-builder sections)

### `event` (10 fields)
title, slug, date, location?, shortDescription, description (rich text), featuredImage?, gallery? (Asset[]), metaTitle?, metaDescription?

Rendered at `/events` (list) and `/events/[slug]` (detail).

### `teamMember` (7 fields)
name, role, bio?, photo?, email?, phone?, order?

Rendered at `/team`.

## Site-wide content types

### `page` (5 fields)
title, slug, sections? (Entry[] of the page-builder types above), metaTitle?, metaDescription?

Fetched by slug via `getPageBySlug()`, rendered by the catch-all route `app/[[...slug]]/page.tsx`. A page with no `sections` falls back to rendering `fields.content` as a single `ContentSection` if present.

### `siteSettings` (9 fields)
siteName, siteDescription?, logo?, contactEmail?, contactPhone?, address?, socialMediaLinks? (facebook/twitter/instagram/linkedin), donateLink?, mainNavigation? (Entry[] of `navigationItem`)

Singleton — `getSiteSettings()` just takes the first entry. Fetched once in `app/layout.tsx` and passed to `Navbar`/`Footer`.

### `navigationItem` (4 fields)
label, href?, order?, children? (self-referencing Entry[] for submenus)

Parent items with `children` render as a dropdown in `Navbar.tsx` — the parent label itself is also a clickable link to its own `href` (not just a hover trigger), so a parent can have real page content at its own URL in addition to a dropdown.

## Current navigation structure (as of 2026-07, live in Contentful — not derivable from code)

`Site Settings.mainNavigation`: Home (`/`) → About Us (`/about-us`, dropdown) → Events (`/events`) → Contact (`/contact-us`). Donate is a separate button driven by `siteSettings.donateLink`, not part of `mainNavigation`.

**About Us** dropdown children:
- **Committee** → `/team` (points at the dedicated Team Member listing page, not a `Page` entry — there is no `/about-us/committee` page)
- **Place of Worship** → `/about-us/place-of-worship` — a real `Page` entry with a "Coming Soon" content section; JSOWR is planning a fundraising campaign for a physical place of worship, this is a placeholder until that launches.

There used to be separate "Our Mission" and "Our History" nav items (`/about-us/mission`, `/about-us/history`) — these were unpublished (not deleted) 2026-07 in favor of a single combined `/about-us` page covering both, reachable by clicking the "About Us" label itself. That page now exists: a `heroSection` header ("About Us") followed by three `contentSection` entries — "Who We Are", "Our Vision", "Our Purpose" — built from copy provided directly by the org (not the old site, which was flagged as unreliable).

## Adding a new content type

1. Create it in Contentful (Content model tab).
2. Add the TS interface to `types/contentful.ts`.
3. Add a fetch helper to `lib/contentful-api.ts`.
4. Either wire it into the page-builder switch in `app/[[...slug]]/page.tsx` (if it's a reusable page section), or give it its own route under `app/` (if it's a standalone content type like Event/Team Member).
5. Update this file.
