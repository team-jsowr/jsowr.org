# JSOWR Website — Project Overview

This doc exists so anyone (human or AI) picking up this project later has context without archaeology. Keep it updated as the project evolves — treat it as living documentation, not a one-time writeup.

## Background

The Jain Society of Waterloo Region's current live site (https://jsowr.org) was built by someone no longer involved, and nobody on the team has working knowledge of it or credentials to change it. As of 2026-07, the old site renders almost no crawlable content even through a JS-rendering scraper — it appears to be a mostly-empty/minimal SPA. There is no known CMS export or admin access to it yet. The plan is **not** a lift-and-shift migration; it's a rebuild where real content gets added incrementally as the org provides it.

A rebuild is already in progress in this repo, deployed to Netlify for preview, with the intent to eventually point the `jsowr.org` domain (registered/managed at Hostinger) at it once it's ready.

## Stack

- **Framework**: Next.js 16 (App Router, React 19, Turbopack build)
- **Styling**: Tailwind CSS v4 + shadcn/ui-style components (Radix primitives) in `app/_components/ui/`
- **CMS**: Contentful (headless), space alias "Blank", environment `master`
- **Package manager**: pnpm (`pnpm@10.24.0`, see `packageManager` in package.json)
- **Hosting/CI**: Netlify — builds via `pnpm build`, publishes `.next` (see `netlify.toml`). Connected to GitHub repo `team-jsowr/jsowr.org`, auto-deploys on push (see [DEPLOYMENT.md](./DEPLOYMENT.md) for branch/build-minute considerations).
- **Domain**: `jsowr.org` is registered/managed through Hostinger. Not yet pointed at Netlify — the live site and the Netlify preview (`jsowr.netlify.app`) are currently separate.

## Visual theme: "Heritage Maroon & Gold"

Chosen 2026-07-15 from 3 mockup directions presented to the org (deep maroon/gold classical vs. bright saffron/indigo festive vs. minimal terracotta modern) — this one was picked for reading as both professional/institutional and distinctly devotional, rather than generic-nonprofit.

**Single source of truth: `app/globals.css`'s `@theme` block.** The primary-red/primary-yellow/primary-green/primary-white/primary-black tokens (deep oxblood, antique gold, muted green, ivory, warm dark brown) and all the shadcn neutral tokens (background/card/secondary/muted/border/ring) are defined there once; every component references those same token names, so changing a hex value in that one file re-themes the whole site. Don't hardcode Tailwind's default `gray-*`/stock `white`/`black` utilities in new components — use the theme tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, etc.) so they stay consistent with whatever the palette is.

Headings (`h1`/`h2`/`h3`) get the serif font (Cormorant Garamond, loaded via Google Fonts in `layout.tsx`) automatically through a base-layer rule in `globals.css` — no need to add a font class per component.

There is no `tailwind.config.ts` — it existed in the original scaffold with stale hardcoded colors but was never actually loaded by Tailwind v4 (v4 uses CSS-first `@theme` config, not the old JS config file, unless explicitly referenced via `@config`, which this project never did). It was deleted 2026-07-15 to avoid misleading anyone into thinking it controlled anything.

## Repository layout

```
app/
  [[...slug]]/page.tsx     # Catch-all: renders a Contentful "Page" entry by slug, section by section
  events/page.tsx          # Events listing (explicit route — wins over the catch-all for exact match)
  events/[slug]/page.tsx   # Single event detail
  team/page.tsx            # Team/committee listing
  layout.tsx                # Fetches Site Settings, renders Navbar + Footer around every page
  _components/
    Navbar.tsx, Footer.tsx  # Driven by Contentful "Site Settings" (nav items, socials, contact info)
    sections/                # Renderers for each Contentful "section" content type used by the page builder
    ui/                       # Generic shadcn-style primitives (Button, Card, Switch)
    EventCard.tsx
lib/
  contentful.ts             # Contentful Delivery API client (read-only)
  contentful-api.ts         # Typed fetch helpers (getPageBySlug, getEvents, getTeamMembers, getSiteSettings, ...)
  rich-text.tsx              # Shared Contentful rich-text -> React renderer, used by ContentSection and event detail
types/contentful.ts          # Hand-written TS types mirroring the Contentful content model (kept in sync manually)
```

## Page-builder model

A Contentful `Page` entry has a `sections` array that can mix content types. `app/[[...slug]]/page.tsx` switches on each section's content type id and renders the matching component:

| Contentful content type | Renderer |
|---|---|
| `heroSection` | `HeroSection` (single hero OR carousel, depending on `isCarousel` + `carouselItems`) |
| `contentSection` | `ContentSection` (rich text, 1/2/3-column layout) |
| `gallerySection` | `GallerySection` (grid + lightbox) |

`Event` and `Team Member` are **not** page-builder sections — they're standalone content types rendered by their own dedicated routes (`/events`, `/events/[slug]`, `/team`), added 2026-07-11. Before that, these content types existed in Contentful and had fetch helpers in `lib/contentful-api.ts`, but nothing on the front end actually displayed them.

## Content status (as of 2026-07-11)

Live pages: Home, About Us (`/about-us`), Place of Worship (`/about-us/place-of-worship`, coming-soon placeholder), Committee/Team (`/team`, 9 members), Contact Us (`/contact-us`), Activities & Programs (`/activities`). All built from real copy/data supplied by the org — nothing fabricated, and old-site content was deliberately not reused (see below).

`/events` has a 12-photo general community gallery (`gallerySection` titled "Events Gallery", fetched directly by title rather than through the page-builder — see `docs/CONTENT_MODEL.md`) but no dated `Event` entries yet. The org has specific dated occurrences (Summer Picnic, Annual General Meeting, etc.) they'll supply dates for later; the general list of recurring religious activities/programs lives on `/activities` instead, since those aren't single dated events.

Contentful Management API access is configured (`CONTENTFUL_MANAGEMENT_TOKEN` in `.env.local`) — content changes now happen via one-off Node scripts using `contentful-management`, run with `node --env-file=.env.local <script>` from inside the repo (needed for `node_modules` resolution). These scripts are throwaway/local only, never committed.

**Photo handoff workflow**: `incoming-images/` at the repo root (gitignored except `.gitkeep`) is a drop folder — the org copies photo files in there, then they get uploaded to Contentful via a one-off script using `client.asset.createFromFiles` + `processForAllLocales` + `publish`, and the local copies are deleted once safely in Contentful. Never commit actual image files here; Contentful's Media library is the source of truth for assets, not the git repo.

**Deployed**: `rebuild/site-migration` was merged into `main` and is live on `jsowr.netlify.app` as of 2026-07-11 — confirmed by fetching `/team` and seeing the real committee roster. This was the first merge, and hit a Netlify plan restriction on the way (see "Git contributor limit" in [DEPLOYMENT.md](./DEPLOYMENT.md)) — worth reading before merging again if a new contributor's commits start failing to build.

## Known gaps / next steps

- Old site content couldn't be scraped (renders empty even via headless browser) — content is being supplied directly by the org as it becomes available, not migrated verbatim.
- `jsowr.org` DNS still points away from Netlify; cutover is a future step once the rebuild is content-complete and approved.

### Backlog (explicitly deferred, "good to have" per org feedback 2026-07-11)

- ~~Gallery as a carousel~~ — done 2026-07-15: lightbox now has left/right arrow buttons, an image counter, and ArrowLeft/ArrowRight/Escape keyboard support (`GallerySection.tsx`).
- **Event albums** — group event photos into named albums (e.g. "Mahavir Janma Vanchan 2025", "Ayambil 2025") with each album having its own sub-gallery, rather than one flat photo pool. Would need a new content type/model change, not just a component change. Still open.
