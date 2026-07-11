# Deployment & Environments

## Netlify

- Site: `jsowr.netlify.app`, connected to GitHub repo `team-jsowr/jsowr.org`.
- Build command: `pnpm build`, publish dir: `.next` (see `netlify.toml`). Node 20.
- Free-plan build minutes are limited, so we want to avoid triggering unnecessary builds.

**Branch build settings to check in the Netlify dashboard** (Site configuration → Build & deploy → Continuous deployment):
- **Production branch** should be `main` — only this branch should auto-publish to the live Netlify URL / eventually the custom domain.
- **Branch deploys**: if this is set to "All" or "Let me add individual branches", Netlify will run a full build on *every push* to *every* branch, including WIP feature branches — this burns build minutes fast. Set it to **"None"** (or explicitly list only branches you want previewed) while doing exploratory work on a feature branch.
- **Deploy previews for pull requests**: also consumes a build per PR/PR-update. Worth disabling or being deliberate about while iterating.

### Our workflow

We work on a local feature branch (currently `rebuild/site-migration`), commit freely, and only merge to `main` (which triggers the real deploy) once a batch of work is ready to review live. Push the feature branch to `origin` for backup/collaboration, but if branch deploys are enabled for all branches, know that each push there also costs a build — turn that off if it's a problem.

Merge to `main` in batches, not after every small change, to keep deploy/build-minute usage down.

## Contentful

`.env.local` (gitignored, never committed) currently holds:
- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_ACCESS_TOKEN` — Content Delivery API token, **read-only**, safe to use in the deployed app.
- `CONTENTFUL_PREVIEW_ACCESS_TOKEN` — for viewing unpublished drafts.
- `CONTENTFUL_ENVIRONMENT` — `master`.

### Content Management API token (for writing content programmatically)

Only needed for scripts that create/update/publish entries (not for the deployed Next.js app itself — the app should only ever read via the Delivery API token above).

To generate one:
1. In Contentful, go to **Settings (gear icon, top right) → API keys**.
2. Open the **Content management tokens** tab.
3. Click **Generate personal token**, give it a name (e.g. "local content scripts"), copy it immediately — Contentful only shows it once.
4. Add it to `.env.local` as `CONTENTFUL_MANAGEMENT_TOKEN`. Never commit this file, never prefix the variable with `NEXT_PUBLIC_`, and never reference it from any client-side code — it grants full read/write on the space.

This token is only ever used from local one-off Node scripts (not part of the Next.js build), and rotated/revoked if a script's work is done.

## Hostinger

`jsowr.org` domain (and DNS) is managed at Hostinger. It currently does **not** point at Netlify — the live `jsowr.org` and the in-progress `jsowr.netlify.app` are separate deployments. Pointing the domain at Netlify (custom domain + DNS cutover) is a deliberate future step, not something to do automatically once code merges to `main`.
