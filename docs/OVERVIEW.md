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
  events/[slug]/page.tsx   # Single event detail; also splits multi-day schedules into per-day cards
  team/page.tsx            # Team/committee listing
  layout.tsx                # Fetches Site Settings, renders Navbar + Footer around every page
  not-found.tsx              # Themed 404 page
  sitemap.ts, robots.ts       # Dynamic sitemap (pulls real Page slugs from Contentful) + robots.txt
  icon.png                    # Favicon, generated from the real logo
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

## Content status (as of 2026-08-27)

Live pages: Home, About Us (`/about-us`), Place of Worship (`/about-us/place-of-worship`, coming-soon placeholder, currently **unlinked from the nav** — see below), Committee/Team (`/team`, 9 members, 8 with real photos — only Anand Shah still has an initials fallback), Contact Us (`/contact-us`), Activities & Programs (`/activities`). All built from real copy/data supplied by the org — nothing fabricated, and old-site content was deliberately not reused.

`/events` now has its first real dated event: **Paryushan Mahaparv 2026** (Sept 8–16, 2026), with a full day-by-day schedule sourced from the org's own flyer, rendered as per-day cards (see "Multi-day event schedules" in `docs/CONTENT_MODEL.md`) and a featured image. It also still carries the 12-photo general community gallery (`gallerySection` titled "Events Gallery", fetched directly by title — see `docs/CONTENT_MODEL.md`).

**Nav changes since launch**: "Place of Worship" was removed from the About Us dropdown per org request (2026-08) — the page itself is still published and reachable by direct URL, just not linked from the menu. A **"Membership"** top-level nav item was requested but not yet built — still waiting on the org for what that page should actually say (benefits, fees, how to apply) before creating it, to avoid shipping a nav link to placeholder content.

Contentful Management API access is configured (`CONTENTFUL_MANAGEMENT_TOKEN` in `.env.local`) — content changes happen via one-off Node scripts using `contentful-management`, run with `node --env-file=.env.local <script>` from inside the repo (needed for `node_modules` resolution). These scripts are throwaway/local only, never committed.

**Photo handoff workflow**: `incoming-images/` at the repo root (gitignored except `.gitkeep`) is a drop folder — the org copies photo files in there, then they get uploaded to Contentful via a one-off script using `client.asset.createFromFiles` + `processForAllLocales` + `publish`, and the local copies are deleted once safely in Contentful. Never commit actual image files here; Contentful's Media library is the source of truth for assets, not the git repo.

**Cropping lessons learned** (worth reading before processing more photos):
- Sharp's `sharp.strategy.attention` (saliency-based auto-crop) works well most of the time but **can get fooled by busy backgrounds** — it picked autumn leaves over a person's face once, and a lake's rock/water texture over a face another time, both resulting in the face being nearly cropped out. Always render a preview crop and visually check it before uploading; don't trust attention-crop blindly for portraits with cluttered backgrounds.
- A **tall portrait photo cropped into a very wide hero banner** (the event detail page's hero is full-viewport-width but only ~360-420px tall, so on wide monitors it's a ~4.5:1 crop) is a much bigger mismatch than a circular avatar crop — both center-crop and attention-crop landed on the wrong region entirely (torso/hands instead of face). Fix was a manually-verified square crop with generous margin around the subject, checked against *both* the extreme-wide desktop ratio and the near-square mobile ratio before committing.
- **HEIC files can silently arrive corrupted** (decoder errors, suspiciously small file size) — if `sharp` fails to decode one, ask for a JPEG/PNG re-export rather than trying to force it.

**Deployed**: as of 2026-08-27, `main` and `rebuild/site-migration` are fully in sync (zero file differences) — everything described in this doc is live on `jsowr.netlify.app`, across several incrementally-merged PRs (the org merges these directly on GitHub's web UI, since this environment has no `gh` CLI or API token — see [DEPLOYMENT.md](./DEPLOYMENT.md)). Don't assume the feature branch is ahead of `main` just because `git log main..rebuild/site-migration` shows commits — GitHub squash-merges collapse each PR into one new commit on `main`, so the branch-vs-branch commit graph looks perpetually diverged even when the actual file content is identical. Always check with `git diff --stat origin/main rebuild/site-migration` (real content diff) rather than the commit-ancestry check before concluding something is or isn't live.

## Known gaps / next steps

- Old site content couldn't be scraped (renders empty even via headless browser) — content is being supplied directly by the org as it becomes available, not migrated verbatim.
- `jsowr.org` DNS still points away from Netlify; cutover is a future step once the rebuild is content-complete and approved.
- **Membership page** — top-level nav item requested by the org, not yet built. Needs content: benefits, fees, how to apply, eligibility.
- **Anand Shah** (President) still has no committee photo.

### Backlog (explicitly deferred, "good to have" per org feedback 2026-07-11)

- ~~Gallery as a carousel~~ — done 2026-07-15: lightbox now has left/right arrow buttons, an image counter, and ArrowLeft/ArrowRight/Escape keyboard support (`GallerySection.tsx`).
- **Event albums** — group event photos into named albums (e.g. "Mahavir Janma Vanchan 2025", "Ayambil 2025") with each album having its own sub-gallery, rather than one flat photo pool. Would need a new content type/model change, not just a component change. Still open.
