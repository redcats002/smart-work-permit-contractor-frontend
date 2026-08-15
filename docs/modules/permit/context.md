# Module: `permit`

The core of the Contractor app: everything under `/permits` — the list, the 6-step creation
wizard, the detail screen, closure, and the Fire Watch countdown.

Root feature: `feat-002`. Depends on `platform` (`feat-001`).

## Location

| Concern | Path |
|---|---|
| Routes | `src/router/modules/Permit.router.ts` — `const prefix = '/permits'` |
| Pages | `src/pages/permit/pages/{list,create,detail}/` |
| Provider | `src/resources/provider/permit/Permit.provider.ts` |
| Models | `src/models/request/permit/`, `src/models/response/permit/`, `src/models/modules/permit/` |
| Enums | `src/enums/modules/permit/` |
| Schemas | per-step, under `src/pages/permit/pages/create/schema/` |

## Status machine (authoritative — mirrors the backend)

```
DRAFT ──submit──> PENDING ──reject──> REJECTED ──(duplicate & edit)──> DRAFT
                     │
                  approve
                     ▼
                  ACTIVE ─────────close────────> CLOSED
                     │                              ▲
              mark-complete (hot work only)         │
                     ▼                              │
               FIRE_MONITOR ──30 min elapsed────────┘

  PENDING / ACTIVE ──work end-time passes──> EXPIRED   (terminal)
```

The contractor app can trigger only: `submit`, `mark-complete`, `close`. `approve` and
`reject` are Safety Officer actions in a different repo — **never build them here.** The
contractor sees their outcome (status banner, rejection reason) only.

## Safety-check ranges (client-side convenience — backend is authoritative)

| Reading | Hot Work | Confined Space | Heights |
|---|---|---|---|
| LEL (`%`) | must be `0` | must be `0` | — |
| O₂ (`%`) | `19.5 – 23.5` | `19.5 – 23.5` | — |
| CO (`ppm`) | — | `≤ 50` | — |
| SO₂ (`ppm`) | — | logged, design shows `≤ 10` as guidance, **no hard block** | — |
| Wind (`km/h`) | — | — | `≤ 25` |
| Height from ground (`m`) | — | — | `> 4` triggers extra checks (informational) |

- LEL / O₂ / CO are skippable **only** when the permit is flagged `outdoorWork: true`. The wizard exposes this as an Indoor/Outdoor toggle on step 3.
- Out-of-range blocks "Next" with **no override**. Show which reading failed.
- On submit, the backend re-validates and can return `GAS_OUT_OF_RANGE` even if the client passed. **Server response wins** — render its failing readings.

## Endpoints (see `docs/main/dev-handoff/01-backend-elysia-tasks.md`)

```
POST   /permits                    create draft
PATCH  /permits/:id                update draft (only while DRAFT)
POST   /permits/:id/submit         DRAFT → PENDING
GET    /permits                    list, filter by status/type/date (scoped to own permits)
GET    /permits/:id                detail
POST   /permits/:id/mark-complete  hot work only → FIRE_MONITOR
POST   /permits/:id/close          closure checklist + signature → CLOSED (403 on block)
GET    /permits/:id/qr             QR payload, ACTIVE / FIRE_MONITOR only
GET    /permits/:id/audit          audit trail
```

Permit ID format: `WP-{TYPE}-{YYYYMMDD}-{seq}` (e.g. `WP-HOT-20260625-001`). Render in the
mono face.

## Screen anatomy (from `SmartWorkPermit-v3.dc.html`)

### My Permits — design lines 109-143
Header (title + subtitle + dark `＋ New Permit` button) → filter chips (All / Active /
Pending / Closed) → 2-column card grid. Each card: 5px left border in the permit-type color,
mono permit ID top-left, status pill top-right, title, location, then a footer row with a
type chip, 📅 date, 🕗 time, and — for confined space with entrants inside — a blinking red
"N inside" indicator pushed right. Empty state when the filtered list is empty.

### Wizard — design lines 146-426
Back link → title → 6-node stepper (30px circles, connecting 2px rules) → white card
(`min-height: 360px`) → footer with `← Back` left, blocked-note + `Next →` / green
`Submit` right.

| Step | Content |
|---|---|
| 1 Type | 3 cards: Hot Work (`#FCE9EB`/`#C81E2C`), Confined Space (`#F1E9FE`/`#7C3AED`), Working at Heights (`#FFF8E1`/`#B8860B`). Each has an icon, EN name, Thai name, blurb. |
| 2 Basic Info | 2-col grid: Project*, Contractor (readonly), Foreman*, Date*, Start*/End*, Work description* (textarea), Location* + map-pin placeholder (200×96 grid panel with a pin marker — **no mapping library**). |
| 3 Safety Checks | Type chip in the heading. Blocked banner (`#C81E2C`, white text) / safe banner (`#E4F4EC`). Indoor-vs-outdoor toggle (bypasses gas). Reading cards — each has label (TH/EN), range hint, mono numeric input + unit, and a dashed "📷 Instrument photo" slot. Then a numbered Yes/No/N/A checklist. |
| 4 PPE & Workers | 4-col photo-evidence slot grid (dashed, 130px). Amber notice quoting the Thai ministerial regulation on pre-work BP + alcohol testing. Worker table: `#`, name, cert/role, BP, alcohol, health badge — plus a role-chip row per worker (options vary by permit type). Red banner when any worker fails the health check. |
| 5 JSA | Phase tab pill group (Pre / Process / Post, each with a count). 3-column table: Work Step / Hazard (amber chip) / Control. `＋ Add Step to <phase>` button. |
| 6 Review | Read-only summary card: type chip + title + mono ID, then a 3-col grid (Project, Foreman, Date/Time, Location, Workers, JSA Steps). Below it, green ✓ rows confirming atmosphere, photo evidence, and certificate validity. |

Worker roles vary by type — Confined Space: Entrant / Attendant / Gas Tester; Hot Work:
Fire Watcher / Operator / Helper. Heights roles come from the design's role chips.

### Permit Detail — design lines 430-614
Back link → status-dependent banner → 2-column body (left: type+status pills, title, mono
ID, info card, audit timeline; right 268px: QR panel or "QR pending approval" dashed
placeholder) → status-dependent action strip → modals.

Banner variants:

| Status | Banner |
|---|---|
| `DRAFT` | Grey card + `Edit Permit →` (dark button) |
| `REJECTED` | `#FCE9EB` card, reason text, mono "Rejected by … · Immutable — logged to audit trail", `Duplicate & Edit` button |
| just submitted | `#E4F4EC` success card |
| `ACTIVE`, confined/heights | `#E4F4EC` strip + green `Mark Work Complete →` (opens closure) |
| `ACTIVE`, hot work | `#FFF1E6` strip + orange `Mark Work Complete →` (opens the 30-min confirm dialog) |
| `FIRE_MONITOR` | Full orange (`#F26B1D`) panel — see below |

**Fire Monitor panel:** 80px mono `MM:SS` countdown, progress bar, a warning that the timer
is server-side and cannot be reset from any client, and a disabled `Close Permit — locked
until MM:SS` button. When the timer hits zero the design walks a GPS-tagged-photo flow
(capture → preview → verifying → pass/fail → `Close Permit ✓`).

> ⚠ **Scope flag:** the GPS-photo verification sub-flow appears **only in the design**.
> Neither `00-SHARED-CONTEXT.md` nor `01-backend-elysia-tasks.md` models it, and there is no
> endpoint for it. `PMT-012` must ask the product owner before building it. Default: build
> the countdown and unlock closure at zero; leave the photo step out.

**Closure modal:** title + subtitle → red block banner when entrants remain inside (shows
count + names, states the backend returns 403) → checklist rows with ✓/✗ buttons → dashed
e-signature pad with a mono timestamp, revealed only once the checklist is complete →
Cancel / Confirm.

### Audit timeline
Left-rule list, one dot per entry, action in bold, `who · when` in mono. Read-only —
the audit log is append-only server-side and this app never offers edit or delete.

## Conventions specific to this module

- Forms use `@primevue/forms` + `zodResolver` — never raw `safeParse`. One schema per wizard step under `create/schema/`.
- Wizard state lives in a composable (`useWizard`), not a Pinia store — it is page-scoped. Draft persistence goes through `PATCH /permits/:id`, not localStorage.
- Safety ranges live in **one** exported constant consumed by both the schema and the inline pass/fail display. Do not duplicate the numbers.
- Delete confirmations use `DeleteModal` from `src/components/modal/` — never inline.
- Provider instantiation: `const PermitService: IPermitProvider = new PermitProvider()`.
- Every string goes through `t()` with the `permit.*` namespace.
