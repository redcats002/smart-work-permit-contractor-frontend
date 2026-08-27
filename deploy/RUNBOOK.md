# Contractor Web — deployment runbook

Static bundle on **Cloudflare Pages** at `app.e-safework.com`. Backend must be live and
verified first (`smart-work-permit-api/deploy/RUNBOOK.md` section 7).

---

## 1. Cloudflare Pages project — once

Dashboard → Workers & Pages → Create → Pages → **Connect to Git** → this repo.

| Setting | Value |
|---|---|
| Project name | `esw-contractor` |
| Production branch | `dev` |
| Build command | `bun run build` |
| Output directory | `dist` |

Then **Custom domains → Set up a domain → `app.e-safework.com`**. Cloudflare creates the CNAME
itself when the zone is on the same account.

Deploys are driven by `.github/workflows/deploy.yml`, not by Pages' own Git build — the
workflow lints, tests, builds and then uploads with wrangler. The Git connection is only there
so the project exists and owns the custom domain.

## 2. GitHub repo settings — once

Settings → Secrets and variables → Actions:

| Kind | Name | Value |
|---|---|---|
| Variable | `VITE_APP_API_URL` | `https://api.e-safework.com` — no `/api/v1`, no trailing slash |
| Secret | `CF_API_TOKEN` | Cloudflare token, scope *Cloudflare Pages — Edit* |
| Secret | `CF_ACCOUNT_ID` | Cloudflare account ID |

`VITE_*` is inlined at build time. Changing it requires a rebuild, not a restart. The app
appends `/api/v1` itself — putting it in this variable double-prefixes every request.

## 3. Backend must list this origin

`https://app.e-safework.com` has to be in the API's `CORS_ORIGIN`. Credentialed CORS refuses
wildcards, so a missing entry means login appears to succeed and every later call 401s.

## 4. SPA fallback

`public/_redirects` (committed) contains:

```
/*  /index.html  200
```

Without it a hard refresh on a deep link 404s.

## 5. PR previews

Preview builds land on `https://<hash>.esw-contractor.pages.dev`. That origin is **not** in
`CORS_ORIGIN` and must not be added — any PR from any fork would then hold a credentialed
origin against production data. Previews are visual-only; auth does not work there.

## 6. Verification

From `https://app.e-safework.com`:

1. Log in as a `contractor`; DevTools → Application → Cookies shows
   `__Secure-better-auth.session_token` scoped to `.e-safework.com` (not to `api.e-safework.com`).
2. `GET /api/v1/permits` returns 200 and is scoped to your own permits.
3. Hard-refresh a permit detail URL — no 404.
4. Run the 6-step wizard; submit a deliberately out-of-range O2 and confirm the screen renders
   the server's `GAS_OUT_OF_RANGE` through your localized mapping, not the English `message`.
5. Upload a photo in step 4 — confirm it round-trips through `POST /api/v1/upload` and renders
   back from `storage.e-safework.com`. A CORS error here means the bucket CORS step was skipped.
6. Locale defaults to Thai, switcher persists.
7. Timestamps show `Asia/Bangkok`; cross-check one `createdAt` against the raw UTC value. A
   7-hour gap is a container `TZ` problem, not a frontend one.
8. Layout pass at 375px, 768px, 1280px.


## Rollback

Pages keeps every deployment: project → **Deployments → … → Rollback**. Instant, no rebuild.
If the frontend broke because of an API change, roll the API back too — the contract has two
sides.
