# Deployment & Environments

## Netlify

- Site: `jsowr.netlify.app`, connected to GitHub repo `team-jsowr/jsowr.org`.
- Build command: `pnpm build`, publish dir: `.next` (see `netlify.toml`). Node 20.
- Free-plan build minutes are limited, so we want to avoid triggering unnecessary builds.

**Confirmed branch/deploy-context settings** (Site configuration → Build & deploy → Continuous deployment → Branches and deploy contexts, checked 2026-07-11):
- **Production branch**: `main`.
- **Branch deploys**: "Deploy only the production branch" — pushing to any other branch (e.g. our feature branches) triggers **no build at all**. Free to push WIP as often as we want.
- **Deploy Previews**: "Any pull request against your production branch / branch deploy branches" — opening a PR against `main` **does** trigger a build.

### Our workflow

We work on a local feature branch (currently `rebuild/site-migration`), commit and push freely — this costs nothing per the settings above. Two things do cost a build: opening a PR against `main`, and merging to `main` (which deploys to production). So batch work into a branch, and only open a PR / merge once a chunk is ready to go live, rather than round-tripping through PRs for every small change.

In practice this has meant several incremental PRs from the same long-lived `rebuild/site-migration` branch (#3, #4, #5 so far), each **squash-merged** by the org directly on GitHub's web UI. This environment has no `gh` CLI and no GitHub API token, so PRs can't be created programmatically — the flow is: push the branch, hand the org the compare URL (`https://github.com/team-jsowr/jsowr.org/compare/main...rebuild/site-migration?expand=1`), they open and merge it themselves.

**Squash-merge causes the next PR to show phantom conflicts.** Because each merge squashes the branch's commits into one new commit on `main`, `main` and `rebuild/site-migration` never share real ancestry again, even though the file content matches. GitHub will show "Can't automatically merge" on the next compare, and `git log main..rebuild/site-migration` will list commits that are already-merged-in-substance. Two things to know:
- **Don't trust the commit-ancestry check** (`git merge-base --is-ancestor` / `git log A..B`) to tell you what's actually live — it'll say "diverged" even when nothing real is outstanding. Use `git diff --stat origin/main rebuild/site-migration` instead; empty output means the branches are content-identical regardless of what the commit graph looks like.
- **Fix the phantom conflict** before the org opens the next PR by running `git merge origin/main` on the feature branch locally, resolving whatever trivial conflicts come up (usually just re-picking your side on lines your commits touched that the squash-commit also touched), then pushing. This makes `origin/main` a real ancestor of the feature branch again, so the next compare is clean.

### Git contributor limit (Starter/free plan) — 2026-07-11 incident

Netlify's free plan restricts **private repos to one recognized Git contributor**. It's not a per-person allowlist you add to over time — it's a hard cap of 1 unless you upgrade to Pro or make the repo public. When a commit's author isn't that one recognized contributor, the build fails outright with "Build blocked: Unrecognized Git contributor," even though the `git push` itself succeeds (this is a build-time check, not a push-time/permissions check).

What happened: local git identity here got set to a new contributor (`vasu2411 <vasushah76@gmail.com>`) who wasn't the previously-recognized one, so the `main` push (`618e9ce`) built successfully via `git push` but Netlify refused to actually build/deploy it.

Where to look: Netlify Team (not Site) settings → **Members → Git Contributors**. This shows which Git provider (GitHub, for us: `team-jsowr`) is connected, and the failed-deploy banner links to a **"manage Git contributors"** flow — a GitHub OAuth prompt to (re)designate who the one recognized contributor is. This is different from **Site configuration → Build & deploy → Continuous deployment → "Manage repository"**, which controls the GitHub App's *repo* access, not individual contributor recognition.

Important nuances if this comes up again:
- Recognition is tied to an actual GitHub account identity (verified via GitHub), not just whatever string is in `git config user.email` — changing the local commit-author email to some other address does **not** by itself make Netlify trust it, unless that email is a verified email on a real, already-recognized GitHub account.
- A commit that was pushed while unrecognized stays permanently blocked as that exact commit — recognizing a contributor afterward doesn't retroactively unblock it. You need either a fresh commit from a recognized identity, or to explicitly retry the deploy after linking.
- This time it was resolved by an already-recognized contributor (Viresh Shah) making an empty commit directly on `main` to trigger a fresh, buildable deploy — a fine one-off unblock, but not a long-term fix if more than one person needs to push regularly. That needs either the OAuth "manage Git contributors" link, upgrading to Pro, or making the repo public.

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
