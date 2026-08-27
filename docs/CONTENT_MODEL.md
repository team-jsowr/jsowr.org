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

A `gallerySection` doesn't have to live inside a `Page.sections` array — `getGallerySectionByTitle(title)` in `lib/contentful-api.ts` fetches one directly by its `title` field for use outside the page-builder. Used on `/events` to show a general community photo gallery (title `"Events Gallery"`) below the events list, unrelated to any specific dated event.

## Standalone content types (their own routes, not page-builder sections)

### `event` (10 fields)
title, slug, date, location?, shortDescription, description (rich text), featuredImage?, gallery? (Asset[]), metaTitle?, metaDescription?

Rendered at `/events` (list) and `/events/[slug]` (detail).

**`date` is a single date-only field** (no end date) — for a multi-day event, use the start date and describe the full range in `shortDescription`/the rich text body. When formatting `date` for display, always pass `timeZone: 'UTC'` to `toLocaleDateString` (see `formatEventDate` in `EventCard.tsx`) — Contentful's date-only string parses as UTC midnight, and rendering it in the viewer's local timezone shifts it back a day for anyone west of UTC. This bit us once already with the first real event (Paryushan Mahaparv 2026 showing as "September 7" instead of 8th).

**Multi-day event schedules** (e.g. Paryushan Mahaparv): write the `description` rich text as an intro (paragraphs before the first heading), then one `Heading 3` per day followed by that day's paragraphs — e.g. `### Tuesday, September 8, 2026` then paragraphs starting `**Morning (8:30 AM – 12:30 PM):** ...` and `**Evening (7:00 PM – 10:30 PM):** ...` with the time-range prefix bolded. `app/events/[slug]/page.tsx`'s `splitSchedule()` helper walks the rich-text `content` array and groups everything between consecutive H3s into its own card (gold accent border, header bar with a calendar icon) instead of rendering it as a flat wall of text — this only works if the content actually follows the "H3 = day boundary" convention, so keep using it for future multi-day events rather than inventing a different structure.

### `teamMember` (9 fields)
name, role, bio?, photo?, email?, phone?, order?, groups? (Array<Symbol>, values `"Committee"` / `"Board of Directors"`), boardOrder?

One `teamMember` entry can represent a person who sits on **both** the Committee and the Board of Directors (e.g. Anand Shah, Jignesh Shah, Dhara Vora) — `groups` is how a single entry appears on more than one listing page without duplicating their name/photo/bio. `getCommitteeMembers()` and `getBoardMembers()` in `lib/contentful-api.ts` each query `fields.groups[in]` for their own group.

**Why two separate order fields**: `order` drives `/team` (Committee needs President/VP/Secretary/Treasurer first, then Members), `boardOrder` drives `/board` independently. They're deliberately decoupled — reusing one field for both would mean re-ordering one page silently re-orders the other for anyone who's in both groups.

**Why `role` isn't used for the Board page's displayed title**: a shared entry's `role` field says "President" (for Committee purposes) — the Board page doesn't want to show that, it wants a uniform "Board Member" for everyone regardless of their Committee title. `app/_components/MemberGrid.tsx` (shared by both `/team` and `/board`) takes an optional `roleLabel` prop that overrides the per-member `role` field when set; `/board` passes `roleLabel="Board Member"`, `/team` doesn't pass it (shows each member's real `role`).

Rendered at `/team` (Committee, 9 members: President, Vice President, Secretary, Treasurer, 5 Members) and `/board` (Board of Directors, 5 members, added 2026-08). 8 of 9 Committee members and 3 of 5 Board members have real photos (square-cropped, see cropping lessons in `docs/OVERVIEW.md`); the rest are on the initials-avatar fallback pending photos. One name correction so far: "Dhavan Shah" → "Dhavan Mehta" (2026-08).

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

## Current navigation structure (as of 2026-08-27, live in Contentful — not derivable from code)

`Site Settings.mainNavigation`: Home (`/`) → About Us (`/about-us`, dropdown) → Events (`/events`) → Activities (`/activities`) → Contact (`/contact-us`). Donate is a separate button driven by `siteSettings.donateLink`, not part of `mainNavigation` (currently unset/hidden — see below).

**Activities** (`/activities`) is a `Page` with a hero + four `contentSection` entries (Religious Activities, Paryushan, Groups, Community Events), each a bullet list. This is distinct from `/events`: it's a static list of recurring practices/programs with no dates, not calendar occurrences — real dated events (Paryushan Mahaparv, AGM, etc.) belong in the `event` content type instead once specific dates exist.

**About Us** dropdown children, in order:
- **Board of Directors** → `/board` (dedicated Board listing page, added 2026-08 — see `teamMember`'s `groups`/`boardOrder` fields above)
- **Committee** → `/team` (points at the dedicated Team Member listing page, not a `Page` entry — there is no `/about-us/committee` page)
- ~~**Place of Worship**~~ → removed from the dropdown 2026-08 per org request. The `Page` entry at `/about-us/place-of-worship` (a "Coming Soon" notice about the fundraising campaign) is still published and reachable by direct URL — just unlinked from `About Us`'s `children` field. Re-adding it to the menu later is a one-field Contentful edit, no code change.

**Membership**: requested as a new top-level nav item, **not yet created** — waiting on the org for what the page should say before adding a link that would otherwise 404.

There used to be separate "Our Mission" and "Our History" nav items (`/about-us/mission`, `/about-us/history`) — these were unpublished (not deleted) 2026-07 in favor of a single combined `/about-us` page covering both, reachable by clicking the "About Us" label itself. That page now exists: a `heroSection` header ("About Us") followed by three `contentSection` entries — "Who We Are", "Our Vision", "Our Purpose" — built from copy provided directly by the org (not the old site, which was flagged as unreliable).

**Donate**: the button (Navbar + Footer + any hero-slide CTA) only renders when `siteSettings.donateLink` is set — it's intentionally unset right now, so hiding/showing it again is a content-only change (no code touched) via that one field.

## Adding a new content type

1. Create it in Contentful (Content model tab).
2. Add the TS interface to `types/contentful.ts`.
3. Add a fetch helper to `lib/contentful-api.ts`.
4. Either wire it into the page-builder switch in `app/[[...slug]]/page.tsx` (if it's a reusable page section), or give it its own route under `app/` (if it's a standalone content type like Event/Team Member).
5. Update this file.
