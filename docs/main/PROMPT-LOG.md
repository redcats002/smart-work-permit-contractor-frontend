# Prompt & Decision Log — e-safework

**Read this before implementing anything.** It is the base knowledge for this workspace: what the
product owner actually asked for, in their words, and every ruling they gave when an agent hit an
ambiguity. Code and `progress.md` tell you *what was built*. This file tells you *why it was built
that way* and *what you are not allowed to re-decide*.

## For the product owner — where to record a change

**This file is yours to append to.** When something changes in a *logical* or *business* way — a
rule, a role, a status transition, a scope call, a "we do it this way, not that way" — write it here.
Every agent is required to read this file before implementing anything, so a ruling recorded here is
one they cannot silently undo. A ruling that lives only in chat is one a later agent will "fix" back,
and that is exactly how the same broken solution gets reinvented.

Append to `## Owner updates` at the bottom. That section is **not** session history — it is a running
list, newest last, never rewritten. Entries do not need polish; they need the rejected option:

~~~
### YYYY-MM-DD — one-line title
**Now:** what is true.
**Was:** what it replaces — write this even if it is "nothing". The replaced option is what an
agent will otherwise restore.
**Applies to:** api / contractor / safety (or all three).
~~~

If a change makes an earlier ruling wrong, add a **new** entry that says so and links back. Never
edit an old one.

Where it does *not* go: a feature's build status (that is the repo's `feature_list.json` +
`progress.md`) and wire shapes (that is `openapi.json` — `CONTEXT.md` §2 owns the propagation).
Cross-repo *technical* invariants live in `CONTEXT.md`; *decisions* live here.

This file is copied into each repo at `docs/main/PROMPT-LOG.md`. **Edit the workspace-root copy**,
then run the copy one-liner in `CONTEXT.md` §1 — `check-contract-sync.mjs` fails if they drift.

## What belongs here

- The product owner's own instructions, condensed but not reinterpreted.
- Every **ruling** on a question an agent escalated — with the option that was rejected, because the
  rejected option is what a later agent will otherwise "fix".
- Cross-cutting constraints that no single repo's `feature_list.json` can own.

## What does NOT belong here

- A feature registry. Three live registries already exist (`feature_list.json` per repo, plus
  `docs/modules/<module>/feature_list.json`). `CONTEXT.md` §6 forbids a fourth. Link, don't copy.
- Per-item build notes. Those go in that repo's `progress.md`.
- Verification output. That goes in the item's `evidence` field.

Append newest-last. Never rewrite a past entry — if a ruling is reversed, add a new entry that says
so and links back.

---

## 2026-08-21 — Session 1: audit three repos, then implement in parallel

**Asked:** ensure all tasks are done in each project per the main documents and design; the contract
[permit] detail page was not implemented, and permit creation was "not properly in some function";
then spawn agents in each project to implement.

**Established by audit (not by asking):** the harness itself was already sound — `CONTEXT.md`,
per-repo `AGENTS.md` + `feature_list.json` + `progress.md` + `init.sh`, and a cross-repo
`check-contract-sync.mjs`. The gap was unbuilt features, not missing scaffolding. Both complaints
were confirmed in code: `PermitDetailPage.vue` was a 33-line placeholder (`PMT-010`), and wizard
steps 3–6 were `z.object({})` stubs (`PMT-006`..`009`).

**Rulings given:**

| Question | Ruling | Rejected |
|---|---|---|
| Uncommitted work in all three repos before agents edit on top | Snapshot each repo on branch `wip/pre-agent-20260821` first | Leaving the trees dirty |
| Which repos get agents | All three, in parallel | Contractor only |

**Landed:** backend `feat-008/009/010/012/019`; contractor `PMT-006`..`PMT-012`; Safety/Inspector
`SHL-005/007/008`. Workspace `./init.sh`: **ALL GREEN — 3 repos + contract sync.**

**Operational lesson worth keeping:** the host slept three times mid-run and killed agents. Agents
told to "save incrementally — finish and write one item before starting the next" lost nothing; the
one still holding work in context lost the whole stretch. On resume, always diff the agent's
in-context belief against `git status`: once it was *ahead* of disk (claimed work that never
landed), once *behind* (about to redo an item already recorded `done`). Trust disk.

---

## 2026-08-22 — Session 2: detail pages, map, create-permit bug

**Asked:**
0. Track the prompts in a `.md` file and point `AGENTS.md` at it as required reading — base
   knowledge plus project progress. *(This file.)*
1. Both frontends' permit **detail** pages show a "lite" version. They must show **all** the
   information the user entered, correctly grouped into sections/tabs. The Safety Officer needs a
   **full** review, not a summary.
   - 1.1 implement the contractor permit detail page properly;
   - 1.2 make the Safety/Inspector detail page align with it — same data, same sections.
2. Complete the `ตำแหน่งบนแผนที่ — เร็ว ๆ นี้` (location-on-map) feature properly, plus any other
   unfinished features.
3. Permit creation cannot be continued in the contractor app — find the issue and fix it.

**Established before asking:** the map cannot be built "properly" today. Verified — there are
**zero** geo fields on the wire (no `latitude`/`longitude`/`lat`/`lng`/`coordinates` anywhere in
`openapi.json`), **no** map library in either `package.json`, and `SafetyRiskMapPage.vue` carries a
comment recording that `SFO-007`'s acceptance *forbids* sourcing or fabricating a floor-plan asset,
with a product-owner note that a real GIS/floor-plan is a later decision. Today's risk-map pin
positions come from a deterministic hash of the free-text `location` string
(`risk-map/utils/LocationPosition.ts`).

**Rulings given:**

| Question | Ruling | Rejected |
|---|---|---|
| `.claude/agents/vue-feature-implementer.md` is bound to a different project (`kitpiboon-import-management-frontend`, Vuetify 3 + SCSS) and routes to a skill it self-declares STALE | **Fix the agent definitions first**, bind them to these repos, then use them | Using them as-is; falling back to `general-purpose` |
| Map scope | **Ship the zone-picker version**: share `LocationPosition.ts`'s zone vocabulary so the contractor's step-2 pin resolves to the *same* position the Safety risk map plots. No new dependency, no wire change | Full GIS now; leaving the map alone |
| Foreman closure is impossible — `close.http.controller.ts:15` is `auth: ['safety_officer']`, but the design, `00-SHARED-CONTEXT.md` and `PMT-011` all model closure as the Foreman's action | **Admit `contractor` on that route, scoped to their own permit.** Backend change + openapi regen + three-repo propagation. Closes `GAPS` row **H** | Declaring closure officer-only; deferring |
| `reject.signature` optional vs required | **Make it required**, matching approve | Leaving it optional |
| `PMT-008`'s "at least one JSA row" client rule | **Drop it.** It was never in the backend contract — `PATCH` accepts an empty `jsaSteps` and submit never checks the JSA. A client-only rule must not block a submission the server would accept | Keeping the weaker per-permit reading |

**Standing constraint from these rulings:** full GIS (real lat/lng on the payload, a map dependency,
a real facility floor-plan image) remains an **open product decision**. Do not implement it
speculatively, and do not fabricate a floor-plan asset — that prohibition is explicit.

**Outcome (all four rulings landed, workspace `./init.sh` ALL GREEN — 3 repos + contract sync):**

- **The create-permit bug WAS the JSA minimum rule.** Reproduced in headless Chromium against the
  live backend: steps 1–4 unlocked Next and both writes answered 200, then step 5 arrived with Next
  **permanently disabled** — `jsaSteps` is `undefined` on arrival, nothing seeds a row, so the
  schema failed before the user touched anything. Dropping the rule (ruling above) *is* the fix.
  Regression: `PermitCreatePage.walk.test.ts`, confirmed red against the pre-fix schema.
  The rule had been implemented carefully — weaker reading, flagged as unconfirmed, noted for the
  product owner — and every safeguard fired except walking the six steps. This is why the standing
  "no client rule that blocks what the server would accept" rule exists.
- Contractor detail (`PMT-013`) and Safety review detail (`SFO-012`) both implement all six sections
  of `docs/main/dev-handoff/05-permit-detail-sections.md`. Both chose **stacked over tabs** — tabs
  fight the "expanded by default" requirement, and the contract makes that a presentation choice.
- Map shipped as ruled: `create/constants/LocationZones.ts` mirrors the Safety app's
  `LocationPosition.ts` (same 8 keys, same percentages, same hash fallback). Step 2 writes
  **canonical English** into the existing free-text `location` — a Thai *value* would fail the
  Safety app's `startsWith` match and split the pin across the two apps.
- Backend shipped `feat-020` (contractor closure, ownership-scoped) and `feat-021` (reject signature
  required). `00-SHARED-CONTEXT.md` is now byte-identical in all four copies and states who may close.

**Two latent bugs found on the way past, both fixed:**

- **Every timestamp in the Safety app rendered browser-local.** `dayjs.tz.setDefault('Asia/Bangkok')`
  was set but `.format()` never consulted it — it only looked correct because the dev host is in
  Bangkok. Would have shipped wrong times to any user outside `Asia/Bangkok`.
- `permit.wizard.blockedNote` was the English string *"Resolve the blocked reading to continue"* in
  **both** locale files, and named a *reading* whatever step was blocked — it is what sent the user
  back to an already-green step 3 while step 5 was the dead end. Now generic and really translated.

**Follow-ups filed, not done:** the Safety app's photo grid was never seen in a browser (no seeded
fixture attaches a photo); `InspectorScanPage.vue` still passes `fireWatch.startedAt` instead of the
server-anchored `remainingSeconds` — same latent reload bug, different screen; probe permits
`WP-HOT-20260821-002`…`-006` and `WP-CONF-20260821-005` are left in the dev DB.

---

## 2026-08-23 — Session 3: finish the leftovers

**Asked:** continue the tasks left over from the agents.

No new rulings were needed. Three leftovers were confirmed in code first, then built:

- **`PMT-014` — draft resume + Duplicate & Edit.** A DRAFT permit could not be reopened at all:
  `Permit.router.ts` was list/create/detail only, so a contractor who started a permit and left lost
  it, and `PMT-010`'s two banner CTAs shipped disabled. This was written up as a registry item
  *before* being handed to an agent — it is a feature, not a follow-up bullet.
  Two traps were established up front so no agent had to discover them: **there is no clone route on
  the wire** (all 13 permit paths checked), so Duplicate is client-side `POST` + `PATCH`; and
  `safetyReading` **appends** a row per PATCH, so hydration must seed `lastPersistedReading` or every
  resumed edit logs a duplicate reading.
  The implementation settles editability with a real empty-body `PATCH` and defers to the server.
  That is worth keeping: **`REJECTED` is editable too** (`update.service.ts` allows DRAFT *and*
  REJECTED so a contractor can revise and resubmit), which a client-side "DRAFT only" check would
  have got wrong. `PATCH` writes no audit row, so the probe costs only an `updatedAt` bump.
- **`CRT-004`** — bullets 3 and 4 were **already satisfied** by `PMT-009` and were recorded with
  evidence rather than rebuilt. Only the step-4 per-worker badges and named-worker blocking were
  new. The gate blocks solely on a confirmed `'fail'`, never stricter than the server's
  `certificateFailures[]`.
- **Inspector Fire Watch** anchored on the server's `remainingSeconds`, matching the review screen.
  `fireMonitorStartedAt` was **kept** — it is the documented fallback, not vestigial.

**One more silent-failure bug found and fixed:** `useUpload()` caught every error, toasted a
hardcoded Thai string naming **Google Cloud Storage** in a **MinIO** app, and returned a fabricated
success with `filePath: ''`. Callers could not distinguish a failed upload from a good one, and the
empty `fileRef` surfaced as a 400 at PATCH time, far from the cause. Third instance this project of
the same shape: *a client pretending to know an answer that belongs to the server.*

**The workspace root is now a git repo.** `CONTEXT.md`, `docs/main/`, `check-contract-sync.mjs`,
`init.sh`, this file and the `.claude/agents` definitions were versioned nowhere. The three app repos
are **gitignored, not vendored as submodules** — how they are cloned and committed is unchanged.

Workspace `./init.sh`: **ALL GREEN — 3 repos + contract sync.** All four trees clean and committed.

---

## 2026-08-23 — Session 4: make the glue knowledge survive a clone, and publish `dev`

**Asked:** confirm whether cross-repo *and* per-repo knowledge already exists; if not, create it —
and make it the file the product owner updates for every logical/business change, so agents read it
before implementing and stop reinventing solutions that did not work. Then push every repo to `dev`.

**Established, not built:** the knowledge already existed and no fourth document was created.
`CONTEXT.md` owns cross-repo technical invariants, this file owns decisions, and each repo's
`AGENTS.md` + `feature_list.json` + `progress.md` + `session-handoff.md` own that repo. Adding a
fifth registry is forbidden by `CONTEXT.md` §6 for the same reason it was forbidden before.

What was actually missing was **distribution and freshness**, which is what the complaint was about:

- **The pointers dangled.** All three `AGENTS.md` said `../PROMPT-LOG.md` was required reading, but
  the workspace root has **no remote** — clone any repo from GitHub and the required base knowledge
  does not exist. Both glue files are now **copied** into each repo at `docs/main/`, the same pattern
  `docs/main/` and `05-permit-detail-sections.md` already use, and every reference in every repo was
  repointed at the in-repo copy. The root stays the **edit origin**; edit it there and re-run the
  copy one-liner in `CONTEXT.md` §1.
- **`check-contract-sync.mjs` gained check 1b**: the glue docs must be byte-identical across the root
  and all three repos. A stale copy is how a settled ruling gets re-litigated, so it is now a red row
  rather than a thing someone notices later.
- **Read-first docs that lied were corrected** — the real cause of duplicate work:
  `CONTEXT.md` §1 still said the workspace root was not a git repo and that nothing here was
  committed anywhere (false since `0078e7d`). The contractor's `AGENTS.md` still told every agent
  that the DRAFT/REJECTED edit CTAs render **disabled** because no edit-or-duplicate route exists
  (`PMT-014` shipped it) and that closure is `safety_officer`-only so a contractor always 403s
  (`feat-020` shipped it) — and it cited "`GAPS.md` rows H and I" as one unit when **H is closed and
  I is not**. An agent reading that would have rebuilt work that already existed.

**Ruling recorded for the owner:** this file now opens with *For the product owner — where to record
a change*, and ends with an `## Owner updates` section. Owner entries go there, not interleaved with
session history, and each one states **what it replaces** — the replaced option is what a later agent
restores if it is not written down.

**Published:** all three app repos pushed to `origin/dev`, and each repo's local branch is now `dev`
tracking it. **`origin/dev` is the live branch — `origin/main` is stale** on all three and is behind
by the whole session-1-to-4 stack. `wip/pre-agent-20260821` is kept as a pointer to the same commit,
not as the working branch. The workspace root repo has no remote and was not pushed.

`docs/main/dev-handoff/05-permit-detail-sections.md` is copied into both frontends the same way as
the two glue files but is **not** covered by a sync check — keep it in the same `cp` when you touch it.

---

## 2026-08-23 — Session 5: contractor management + profiles

**Asked:** a contractor module in the Safety Officer app — create/register, read, update, delete a
contractor — plus a self-service profile for both the contractor and the safety-officer side. Stated
hierarchy: one company has many safety officers and many contractors; one contractor has one company;
**one domain is one company**. Plan first, review before implementing.

**Established before asking:** none of this exists on the wire. `POST /api/v1/users/` (provision,
`safety_officer`-only) is the *only* user route — no list, no read, no update, no `me` endpoint of any
kind. There is **no company/organisation concept anywhere** in the backend: no table, no column, no
field (`GAPS.md` row C already recorded that `IUser.company` will never be populated). And the Safety
app's `ProfileCard.vue:57` pushes to `{ name: 'ProfileDetailPage' }`, **a route that does not exist**
— the Profile menu item is dead today, so building the profile page fixes a live bug rather than only
adding a feature.

**Rulings given:**

| Question | Ruling | Rejected |
|---|---|---|
| How "company" exists | **Single-tenant — the deployment *is* the company.** No `Company` table, no `companyId` on `User`; company identity is deployment config | A real `Company` table with `companyId`, which would force a re-scope of **every** existing role-scoped query (permits, certificates, dashboard, notifications, audit, sync) where one miss is a cross-company data leak |
| Deleting a contractor | **Deactivate (soft)** — a flag, never a row removal | Hard delete. `permit.createdById` is a plain indexed scalar (deliberately not an FK) and the audit log denormalizes the actor as JSON, so removing the row leaves both pointing at a vanished id and frees the email for reuse — a new account would inherit an old one's identity in historical records |
| What the officer edits | **Account fields + contractor business fields** (`firmName`, `taxId`, `address`, `contactPerson`, `contractStart`, `contractEnd`) | Account fields only |

**Consequence of the single-tenant ruling, written down so it is not re-opened:** "one company has
many safety officers / many contractors" is satisfied by the deployment boundary itself. `firmName` on
a contractor is the **contracting firm that person works for** — a descriptive field, *not* a tenant
key. **Nothing may be scoped by it.** `GAPS.md` row C closes as *will not exist*, not as pending work.

**Outcome — all three rulings landed, workspace `./init.sh` ALL GREEN (3 repos + contract sync):**

- Backend `feat-022`: `GET /users/`, `GET /users/{id}`, `PATCH /users/{id}`, `GET /users/me`,
  `PATCH /users/me`; `POST /users/` gained an optional `contractorProfile`. **`DELETE
  /api/v1/auth/user/delete/{userAuthId}` was removed** — it really hard-deleted and any safety
  officer could reach it, so it bypassed the deactivate ruling outright. Neither frontend called it
  (checked by grep first). Two new `errorCode`s bring the vocabulary to **27**.
- Safety app `feat-008` (`CON-001`..`004`): `/safety/contractors` register plus `/profile`.
  Contractor app `PLT-012`: `/profile`.
- **`GAPS.md` row C closed as *will not exist*, not as pending work** — with the single-tenant
  ruling there is no `Company` entity to model, and leaving the row open would read as outstanding
  backend work forever.

**Verified live against a booted backend, not mocks** (the parts that are security, not preference):

| Probe | Result |
|---|---|
| contractor `PATCH /users/me { permitRole: 'safety_officer', active: false }` | `firstName` changed, **`permitRole` still `contractor`, `active` still true** |
| contractor calls `PATCH /users/{id}` | `403 FORBIDDEN_ROLE` |
| deactivated account signs in | `403 ACCOUNT_DEACTIVATED` |
| deactivated account's **existing session** | `403 ACCOUNT_DEACTIVATED` — the cookie dies too, not just login |
| last active officer deactivates self | `409 LAST_SAFETY_OFFICER`, unchanged |
| last active officer demotes self | `409 LAST_SAFETY_OFFICER`, unchanged |
| audit chain | `USER_CREATED` / `USER_DEACTIVATED` / `USER_REACTIVATED` rows, `permitId: null` |

**One real bug found by the new tests, not by review:** the Safety app's `User.provider` read
`response.data` on every single-item call, but that app's response interceptor already unwraps a
`{ message: 'success', data }` envelope down to `data`. Every one returned `undefined` — against the
real API as well as the mock. The paginated envelope keeps its sibling keys; a single-item envelope
does not. Note the two apps differ here **on purpose**: the contractor app passes the envelope
through whole and its callers read `.data`.

**Hardened on review:** `POST /users/` originally wrote the role, the profile row and the audit row
as three separate calls. `userAuth.api.createUser` cannot join a Prisma transaction, but the other
three now do — so a mid-write failure leaves an account with **no `permitRole`**, which is inert
(every guarded route answers `403 FORBIDDEN_ROLE`), rather than a fully-roled account with no
provisioning row at all in a system whose whole point is an append-only provisioning trail.

**Left in the dev DB:** probe accounts `probe-con-1@test.local` (deactivated) and
`probe-con-2@test.local`.

**Standing constraints this feature adds:**

- **`PATCH /users/me` is an allow-list**, and the allow-list is the security boundary: `firstName`,
  `lastName`, `phoneNumberPrefix`, `phoneNumber`, `phoneNumberExtend`. Never `permitRole`, never
  `active`, never `email`. Accepting `permitRole` there lets any contractor promote themselves to
  `safety_officer` and gain approve/reject/close over the whole facility.
- **Deactivation is `PATCH /users/:id { active: false }`, and there is no `DELETE /users/:id`.** The
  UI button reads *Deactivate*. A `DELETE` verb that does not delete is the same class of lie this
  project has already been bitten by three times.
- **A deployment must never reach zero active safety officers.** Provisioning is the only way back in
  — public signup is closed — so the server refuses the last one with `409 LAST_SAFETY_OFFICER`.
- **An officer may not set another user's password.** A silent overwrite is an account takeover with
  no audit trail; the existing `request-password-reset` flow is the path.

---

## 2026-08-23 — Session 6: text contrast across both frontends

Reported from a screenshot of the Safety app's contractor list: column headers, the page subtitle
and the email/firm cells were barely distinguishable from the background.

**Root cause, and why it will recur if only the screen is patched.** The Safety app's surface scale
(`smart-work-permit-frontend/src/assets/css/primevue.css`) is not the conventional Tailwind/Zinc
direction. On it, `surface-500` is `#CBD2D9` — a *border* grey, 1.6:1 on white. `text-surface-500`
therefore reads like a perfectly ordinary secondary-text class and renders as nearly nothing. The
Contractor app uses stock Zinc, where the same class is `#71717A` at 4.8:1 and is correct. One class
name, two opposite outcomes, and 111 call sites had taken the wrong one.

### Ruling — the documented "muted" text colours fail AA and are no longer text colours

**Now:** readable text is `surface-800` (`#5B656F`, 5.9:1 on white / 5.6:1 on the `surface-50` header
row). `surface-700` (`#8B95A0`, 3.1:1) is reserved for placeholders and decorative or adornment
icons, where 3:1 is the correct WCAG threshold. Nothing lighter carries text.

**Was:** `tailwind.css` documented "Text: primary #16191D, secondary #5B656F, muted
#8B95A0/#A4ADB6", and `primevue.css` documented the whole 600-950 range as "text". Both are now
annotated. The rejected option was to keep following the documented palette: `#8B95A0` is 3.1:1 and
`#A4ADB6` is 2.5:1, so the design palette and WCAG AA cannot both be satisfied and AA wins. The
other rejected option was renumbering the surface scale to the conventional direction — that would
have flipped every `bg-surface-*` and `border-surface-*` in the app, a far larger blast radius than
the text classes actually at fault.

**Applies to:** safety (the sweep), contractor (affordance tier only — its readable text already
passed and was left alone; manufacturing symmetry would have been churn).

### What changed

- Safety app, 36 files outside `src/volt/`: `text-surface-{500,600}` → `text-surface-800`.
  `text-surface-400` first went to `700` as a blanket pass, which was wrong — that tier held far
  more real content than affordances (`BaseTable`'s `bodyRow`, i.e. **every table body row in the
  app**, the permit-overview and status-banner `<dl>`s, the dashboard KPI labels, the gas-log cells,
  the time-picker's hour/minute values). 34 of those sites were promoted again to `800`. What is
  left at `700` is 17 sites: icon glyphs (`size-5`/`size-8`/absolutely-positioned adornments), the
  pager chevron buttons, and one `disabled:` state. **`surface-700` is not a text colour** — if a
  human reads it as content, it is `800`.
- Contractor app, 6 files: `text-surface-400` → `text-surface-500` for adornment icons and pager
  chevrons. The three `text-6xl` ghost numerals on the 404 / not-permitted / not-available pages
  keep `surface-400` deliberately — they are decoration, not content.
- Safety contractor list: the inactive status pill was `bg-surface-200 text-surface-600` at 1.7:1
  (the grey-on-grey in the screenshot) and wrapped mid-word in Thai. Now a bordered pill with
  `whitespace-nowrap`, and the active pill uses the existing `--color-success-*` triple instead of
  Tailwind's default `green-100/800` — this page was the only one in the app not using the triple.
- `src/volt/**` was deliberately NOT swept: it is scaffolded by `volt add <Component>` and
  ESLint-ignored, so edits there are lost on regeneration. Volt's
  `placeholder:text-surface-500` renders an invisible placeholder on this app's scale, so the
  correction lives as one rule in `src/assets/css/main.css` instead, where regeneration cannot
  reach it.
- `scripts/check-contract-sync.mjs` gained check 5, which fails on any new
  `text-surface-{300,400,500,600}` in the Safety app outside `src/volt/`. Without it this regresses
  the next time someone writes the class that reads correct and renders invisible.

---

## 2026-08-23 — Session 7: owner unblocks SHL-006 and feat-011

Both items had sat `blocked` on a product call, not on work. The owner made both calls today.

### Ruling — the offline shell is in this milestone; self-host the fonts (`SHL-006`)

**Now:** the Safety/Inspector app self-hosts IBM Plex Sans, IBM Plex Sans Thai and IBM Plex Mono at
400/500/600/700. No CDN font request anywhere.

**Was:** `SHL-001` loaded all three from the Google Fonts CDN, matching the prototype, and `SHL-006`
recorded the open question "is offline-shell support in this milestone?". The item's own evidence
had already worked out the answer and been ignored for four days: the sibling repo's `CLAUDE.md`
states "No CDN or Google Fonts import — this app runs inside an industrial facility" as a settled
constraint, and the Inspector role in THIS app has a *stronger* offline requirement than the
contractor app does. So the CDN link contradicted a documented project constraint rather than merely
risking one. The rejected option was to keep the CDN and rely on the system fallback face — on a
plant floor with no signal that silently degrades, and Thai coverage degrades worst.

**Applies to:** safety.

Verified, not assumed: `fonts.googleapis.com` and `fonts.gstatic.com` blocked at the network layer,
zero requests fired, `document.fonts` reporting all three families loaded locally at all four
weights, and a Thai screen rendering real Plex Sans Thai glyphs rather than tofu. 16 woff2 files,
274,512 bytes, `unicode-range`-subset. Separately confirmed against a **production build**, not just
the dev server: `index.html`'s `/src/assets/css/fonts.css` link is rewritten by Vite into the hashed
CSS bundle, all 16 files ship to `dist`, and no Google reference survives.

Stale premise found and corrected: the contractor repo does **not** already self-host IBM Plex — it
self-hosts LINE Seed Sans TH only. The files were fetched fresh, not copied.

### Ruling — `feat-011` split three ways

`feat-011` bundled three unrelated product decisions, which is why it sat blocked as a unit.

**(a) free-text work description — build it.** The design has a "Work description" field with
nowhere to go; `Permit` gains a nullable free-text `description`.

**(b) organisation / company concept — closed, will not exist.** Already ruled in session 5: the
deployment IS the company. Recorded as closed rather than pending so it stops reading as backlog.

**(c) `GET /notifications` pagination — build it.** It had `limit` and no `page`. Note this is
inherently cross-repo: **both** frontends carry a contract check asserting notifications are *not*
paginated, so a backend-only change breaks two repos silently.

**Applies to:** api, contractor, safety.

---

## 2026-08-24 — Session 8: facility plan, real permit positions, clickable permit rows

Three requests: blank placeholders on every dropdown, clickable rows in the permit register, and a
real floor plan behind the risk map with properly marked positions. Planned by interview before any
code. The third is the one with a domain model.

### Why the risk map needed more than a background image

`LocationPosition.ts` derived pin positions by **hashing the free-text `location` string** — its own
comment called the result "meaningless but stable". That is fine behind a blank dashed rectangle,
where it reads as a placeholder. Behind a real floor plan the same pin reads as a claim about where
hot work is physically happening, and an officer could dispatch to the wrong part of the plant. The
governing rule for this feature: **never draw a pin in a position the system cannot vouch for.**

### Rulings — facility plan and permit position

**Vocabulary.** *Facility plan* = the uploaded, cropped image. *Plan version* = an immutable record.
*Position* = `planId` + `planX` + `planY`. *Unplaced* = no position. *Stale-plan* = a live permit
whose `planId` is not the active version. Use these words; do not invent synonyms.

1. **The contractor sets the position**, not the officer, and never derived from text.
2. **Frozen at submit.** From PENDING onward the position is read-only for everyone, safety officers
   included. A wrong pin is handled by **reject-with-reason**. Rejected: letting the officer drag the
   pin during review — the reviewer must never edit the artefact they then approve, and "who placed
   this pin" must have exactly one answer.
   **Refinement, 2026-08-24:** the editable window is `DRAFT || REJECTED`, not DRAFT alone. `reject`
   sets status to `REJECTED` (it does not return the permit to DRAFT), and that is already the window
   every other field uses. A DRAFT-only position would have been the one field a contractor could not
   fix after a rejection, making this very ruling's remedy inert. Do not "tighten" it back.
3. **One active plan, but the permit stores `planId`.** That column is what makes a stale pin *known*
   stale rather than silently wrong. Rejected: global coordinates with no plan reference — the day a
   second building or a mezzanine appears, every stored coordinate is ambiguous with no way to tell
   which plan it meant.
4. **Plans are immutable versions, retained, never overwritten or deleted.** A live permit frozen
   against v1 must resolve v1 forever, so `GET /facility-plans/:id` is any-role, not officer-only.
5. **Cropping happens only before activation.** A crop changes the coordinate frame; a post-activation
   crop would silently move every existing pin.
6. **Position is required to submit only once an active plan exists** (`PERMIT_POSITION_REQUIRED`,
   the 28th code). Before any plan is uploaded, submit behaves as before; permits predating the plan
   are grandfathered as unplaced. Rejected: always-required, which takes the whole system hostage on
   day one, and always-optional, which lets the map be a permanently partial view of live hazards.
7. **A running permit is frozen** — the owner's rule, and it is what forced 3 and 4. Replacing the
   plan must not alter a live permit, so the risk map gets a **plan-version switcher** rather than
   re-placing or re-projecting existing pins.

### Security — the facility plan is not an ordinary upload

`POST /upload` is guarded `auth: true`, so any authenticated role including a contractor can use it.
That is fine for permit photos. It is not fine for the facility plan: a contractor who can replace it
can silently relocate every hazard on the officer's map. `UPLOAD_ALLOWED_SUBFOLDERS` (storage policy)
is now split from `UPLOAD_CLIENT_SUBFOLDERS` (client-selectable), and `facility-plans` is in the
first only. **The schema narrowing alone was verified insufficient** — Elysia's validation on the
multipart path let a stubbed officer session through to MinIO anyway — so `UploadService.execute()`
re-checks at runtime. Do not "simplify" that re-check away as redundant with the schema.

### `meta.root` was documented and dead

Four routes declared `meta.root` as the back-button mechanism and **nothing in the repo read it**, so
`SafetyReviewDetailPage` always returned to the pending queue. The new `permits/:id` route would have
shipped a breadcrumb saying "← Review Queue" from the All Permits register — the exact bounce this
ruling existed to prevent. Now wired, with the label taken from the root route's own `meta.titleKey`
(`documentTitle.*` is already a page name in both locales), so it needs no per-page back string and
any future route declaring `meta.root` gets a correct back link for free.

**Applies to:** api, safety, contractor.

---

## 2026-08-31 — Session 9: the docs site, and a fourth repo for the landing page

Two pieces of work that sit outside all three app repos, plus one accessibility finding that
belongs inside two of them.

### The docs site is VitePress over the existing `docs/` tree, and the numbered files keep their names

**Now:** `bun run docs:dev` / `docs:build` / `docs:check` at the workspace root serve
`docs/` as a VitePress site: a Guide section (architecture, data model, permit lifecycle,
CI/CD, current state, doc drift, and the three applications) alongside the existing
deployment runbooks.

**Was:** loose Markdown with no index. The rejected option was renaming
`10-DEPLOYMENT-OVERVIEW.md` and friends to pretty slugs — `10` declares itself normative and
is mirrored into all three app repos, which cross-reference `11`/`12`/`13` **by filename**.
Ugly URLs, working mirrors. `srcExclude` keeps `docs/deployment/env/**` (real `.env` files,
gitignored) out of `dist/`, because VitePress does not read `.gitignore`.

Two traps worth not re-learning. VitePress interpolates `${{ … }}` in **inline** code spans as
a Vue expression — a GitHub Actions `${{ github.sha }}` in backticks fails the build with
`Cannot read properties of undefined (reading 'sha')`; fenced blocks are unaffected, and the
fix is `<code v-pre>`. And **`vitepress build` cannot catch a broken mermaid diagram**: the
plugin renders client-side, so a syntax error ships as a blank box rather than failing the
build. `scripts/check-mermaid.mjs` parses every fence in jsdom and is wired into `docs:check`;
it caught an invalid `PK_FK` ER key on the day it was written. Diagrams are click-to-zoom via
one delegated listener (`docs/.vitepress/theme/mermaid-zoom.ts`), covered by
`scripts/check-mermaid-zoom.mjs`.

**Applies to:** workspace root only.

### Ruling — the landing page is a fourth repo, and it resolves the two apps' primary-colour split

**Now:** `smart-work-permit-landing/` is a Vue 3 + Vite + Tailwind v4 + PrimeVue/Volt static
page, built from the same tokens as the apps, with **red `#C81E2C` as primary and orange
`#F26B1D` as accent**.

**Was:** nothing — the repo was empty. The two apps disagree on primary (contractor red,
safety orange) and on body font (LINE Seed Sans TH, IBM Plex Sans), so "match both" had to
pick. Red-primary/orange-accent is not a new invention: the contractor app's own
`tailwind.css` already ships both scales, and its `--color-accent-500/600` are byte-identical
to the safety app's `--p-primary-500/600`. Neutrals, the dark base shell scale, the status
triples and IBM Plex come from the safety app, which is the accessibility-audited set and the
one with a metrically-matched Thai face. The rejected option was inventing a neutral third
palette, which would have made the landing look like a different product.

The landing is **not** a contract-sync participant — it has no openapi copy, no error codes,
no `/api/v1` prefix. `check-contract-sync.mjs` stays a three-repo check. It does carry its
own gate, `scripts/check-landing.mjs`, which fails the build on any third-party origin in the
bundle and on any enumerated text pair below WCAG AA. First-party is not a preference here:
the landing serves from the apex, where `COOKIE_DOMAIN=.e-safework.com` means every request
on that origin carries the better-auth session cookie. No CDN fonts, no analytics snippet, no
icon API.

**Human action, not yet done:** the landing needs a fifth destination. §5 of `CONTEXT.md`
fixes four subdomains (`api.` `storage.` `app.` `safety.`); this page needs the apex or
`www.`. Serving it from `www.` with a 301 from the apex keeps the session cookie off the
marketing origin entirely and is worth preferring.

**Applies to:** landing (new), and §5 of `CONTEXT.md`.

### Finding — `--color-warning-text: #B26A00` is sub-AA in both frontends

**Now:** the landing uses `#9A5C00` — 4.89:1 on `--color-warning-surface` (`#FFF3DC`) and
5.38:1 on white.

**Was, and still is in both app repos:** `#B26A00`, which measures **3.86:1 on its own status
surface and 4.24:1 on white**. Both are below the 4.5:1 AA floor for body-size text. This is
the same class of defect Session 6 fixed and `check-contract-sync.mjs` check 5 enforces —
that check reads Tailwind *classes* against the surface scale, so a hex written directly into
a `@theme` token is outside what it can see. The contractor app carries the same value as
`--color-status-pending-fg`.

Not fixed in the app repos here: it is a two-repo visual change and belongs in its own pass
with a screenshot check, not folded into a landing-page session. Recorded so it is not
rediscovered a third time.

**Applies to:** safety, contractor.

---

## 2026-08-31 — Session 10: the product is called e-safework

**Now:** the official product name is **`e-safework`**, lowercase, matching the domain
(`e-safework.com`) and the `esw` deploy prefix that were already in place. Owner's call.

**Was:** `SmartWorkPermit` (159 occurrences) and `Smart Work Permit` (42), plus one
`smartworkpermit` directory. All swept across all five repos — prose, UI strings, browser tab
titles, the `DEFAULT_TITLE` in both routers, the landing wordmark, the design-system artifacts,
and the Thai proposal document. Historical entries in `progress.md`, `feature_list.json` and
this log were swept too: a product name is not a fact about what happened, and leaving the old
name in past-tense entries only would produce a codebase where nobody can tell whether an
inconsistency is deliberate. This entry is what makes the old name findable.

### The rule — and it is greppable on purpose

**Only the brand forms changed.** Every lowercase-hyphen `smart-work-permit-*` token was left
exactly as it was, because that form is never the brand — it is a repo directory, a git remote,
a package name matching its directory, an IndexedDB database, a storage bucket, or a legacy
deploy hostname.

So, after this sweep: a remaining `smart-work-permit-` is **correct**, and a remaining
`SmartWorkPermit` is a **miss**. One grep tells you which.

### What must never be renamed, and why the comments matter more than this entry

Four identifiers kept the old brand, each with a comment at its own call site explaining why —
because the next agent doing a rename sweep will read the code, not this log:

- **`smart-work-permit-offline-queue`** (`smart-work-permit-frontend/src/utils/OfflineQueue.ts`)
  is the Inspector's IndexedDB **database name**. A database name is an address, not a label.
  Renaming it does not migrate the store, it **orphans** it: a device holding unsynced
  check-ins or gas readings would open a new empty database while the old one became
  unreachable from app code. That is silent loss of field safety data. Renaming it safely means
  writing a migration that opens the old database, copies every entry, and only then drops it.
- **`smart-work-permit-bucket`** — object storage does not follow a renamed bucket. Legacy
  besides: production storage is MinIO behind `storage.e-safework.com`, not GCS.
- **`smart-work-permit-alpha` / `-staging`.vercel.app** — external addresses. Renaming the
  string does not rename the deployment, it just stops matching. Also legacy: both frontends
  deploy to Cloudflare Pages now.
- **Repo directory names and git remotes.** Renaming those is a GitHub operation plus every CI
  secret and every doc path, not a text substitution. Out of scope until someone asks for it.

### Two filenames were left alone

`SmartWorkPermit-v3.dc.html` and `SmartWorkPermit Proposal.dc.html` keep their names; their
**contents** were swept. They are referenced by path from `CONTEXT.md`, both apps' `AGENTS.md`
and `feature_list.json` evidence, and renaming them means four copies of two files plus every
reference, with `check-contract-sync.mjs` check 4 failing mid-flight if the root copy moves
before the repo copies. A stale filename on a historical proposal document is not drift.

`docs/openapi.json` contained no brand string at all, so all three copies stayed byte-identical
and no regeneration was needed.

**Applies to:** api, safety, contractor, landing, root.

---

## 2026-08-31 — Session 11: four product rulings from the field-report grilling

Owner decisions on the four questions that were blocking the field-report map. Full reasoning
lives on each ticket in `docs/wayfinder/tickets/`; the load-bearing halves are here because they
constrain code in more than one repo.

### A worker stays a name string. No `worker` entity.

The permit form's worker field becomes an AutoComplete over the certificate list, and **free text
stays legal** — a name matching no certificate is still accepted there, because certificate gating
belongs at submit, not in the middle of the wizard.

A real `worker` table was declined on cost, not merit: migration, backfill of every existing name
string, and every worker-touching route. **The consequence is accepted, not overlooked:** the join
between `Certificate.workerName` and a permit worker's `workerName` is raw text, so two spellings
are two people and a typo yields a worker whose certificate lookup finds nothing — reading as
uncertified. The AutoComplete makes the certified spelling the path of least resistance. It does
not close the hole.

### Toast only where the outcome is not already on screen

Toast on create, submit, approve, reject, close, a scan registering, a certificate created from the
permit form. **Not** on a list that just re-rendered with the change visible in it. A toast on every
action trains people to dismiss toasts, which is how the one that matters gets missed.

**Validation failures stay inline, beside the field.** An out-of-range gas reading does not belong
in a corner that vanishes after four seconds. This is the rule most likely to be broken while
implementing "toast every action".

**Offline says queued, never saved.** The Inspector replays a local queue; telling them a gas
reading is recorded when it is sitting in a browser database is a lie with safety consequences.

### Inspector scan history is on-device and read-only

IndexedDB, in a store **separate from `smart-work-permit-offline-queue`** — that database must not
grow a convenience feature.

**A scan proves the inspector is physically at the permit; a history entry proves only that they
were there once.** So an entry opens live status, read-only, and every state-changing action behind
it — entrant check-in and check-out, gas log entry — still requires a fresh scan. Do not deep-link
a history entry into the entrant register, however much shorter that path is.

### The facility plan is a JPEG/PNG raster, and the upload flow does not exist

Investigation found the risk map's placeholder is correct behaviour: **no plan version was ever
activated, and no UI exists to activate one.** `FacilityPlan.provider.ts` declares `upload()`,
`create()` and `activate()`; none has a caller anywhere in either frontend.

The asset is a scan or clean export, so no rasteriser and no PDF renderer enters an app that bans
third-party runtime requests. But the server accepts PDF and HEIC while the map draws with a plain
`<img>` — **a PDF uploads successfully and then renders as a broken image**, failing silently after
an officer believes the plan is installed. Narrowing the accepted types for the `facility-plans`
prefix server-side is the honest fix.

**The constraint that orders the work:** `submit.service.ts` throws `PERMIT_POSITION_REQUIRED` once
an active plan exists, and the contractor app has no position picker — `planId`/`planX`/`planY`
appear once in that repo, in a comment. **Activating the first plan without shipping the picker
locks every contractor out of submitting.** The two halves ship together or not at all.

**Applies to:** api, safety, contractor.

---

## Standing rulings — do not re-decide these

- **Never render the backend's `message` field.** Clients localize off `errorCode` (EN + TH). This
  has been re-broken twice; `handleLoading`'s default error callback now routes through `mapError()`
  so an un-customized call site is safe by default.
- **No client-side rule that blocks what the server would accept.** The server's verdict wins, always.
  The client may mirror a rule for instant feedback, never to gate beyond it.
- **Never fabricate a facility floor-plan asset** (`SFO-007` acceptance).
- **The audit log is append-only.** Never add an edit or delete affordance, in any app.
- **`PATCH /users/me` never accepts `permitRole`, `active` or `email`.** Self-service profile edits
  are an allow-list, and that allow-list is a privilege boundary — widening it is privilege
  escalation, not a convenience. Role and activation change only through the `safety_officer`-gated
  `PATCH /users/:id`.
- **Accounts are deactivated, never deleted**, and a deployment may never reach zero active safety
  officers (`409 LAST_SAFETY_OFFICER`).
- **Readable text is `surface-800` or darker, in both frontends.** The Safety app's surface scale
  runs light-to-dark in the non-standard direction, so `text-surface-500` there is a border grey at
  1.6:1 while the identical class in the Contractor app is a correct 4.8:1. `surface-700` is for
  placeholders and decorative icons only. `check-contract-sync.mjs` check 5 enforces it.
- **Never draw a risk-map pin in a position the system cannot vouch for.** Positions are set by the
  contractor while DRAFT/REJECTED and frozen at submit; plans are immutable versions; a permit whose
  `planId` is not the rendered plan is shown via the version switcher, never re-projected. The old
  hash-of-location mapping is gone and must not return, even as a fallback.
- **`facility-plans` is a server-owned upload prefix.** It is in `UPLOAD_ALLOWED_SUBFOLDERS` and NOT
  in `UPLOAD_CLIENT_SUBFOLDERS`, and `UploadService` re-checks it at runtime because the schema alone
  does not hold. Never widen the generic upload route to reach it.
- **A history entry is not a scan.** Anything reached from a list, a link or a cached entry opens
  read-only; state-changing field actions require a fresh scan. Never soften this for one fewer
  tap. **But be precise about what is actually enforced:** the manual-entry box on the scan page
  has always accepted a typed permit ID and opened the full action panel, so "a scan proves the
  inspector is at the permit" is a design intent, not a guarantee the system delivers. Ticket 017
  logs the difference so the cost of closing that door is known before anyone closes it. Until
  then, treat the read-only history as a UX guardrail, not a security boundary.
- **Never activate a facility plan before the contractor position picker ships.** The submit route
  refuses a positionless permit once a plan is active, and the picker does not exist yet.
- **The product is `e-safework`, lowercase.** Only the brand forms were renamed; every
  lowercase-hyphen `smart-work-permit-*` token is a repo, a remote, a database, a bucket or a
  hostname and stays as it is. A remaining `smart-work-permit-` is correct; a remaining
  `SmartWorkPermit` is a miss. **Never rename the IndexedDB database
  `smart-work-permit-offline-queue`** without a migration — it orphans unsynced field data.
- **The landing page is first-party only.** It serves from an origin covered by
  `COOKIE_DOMAIN=.e-safework.com`, so every request it makes on that origin carries the
  session cookie. No CDN fonts, no analytics snippet, no runtime icon API — ever.
  `smart-work-permit-landing/scripts/check-landing.mjs` fails the build on any other host.
- **Blocked items are product decisions**, not work: backend `feat-011`, `SHL-006` (self-hosting
  fonts for the offline Inspector role). Do not implement them speculatively.
- **A Fire Watch outlives the work window, so hot permits get grace before expiry.** A Fire Watch
  is by definition the 30 minutes *after* hot work stops, so a Hot Work permit's safety obligation
  always extends past `workTimeEnd`. Expiring a hot `ACTIVE` permit the instant its window lapsed
  expired it at exactly the moment its most important control was supposed to begin — and because
  `mark-complete` carries `status: 'ACTIVE'` in its WHERE, the expired permit could never reach
  `FIRE_MONITOR`, locking the crew out of starting the watch at all. This was not a rare race: hot
  work finishes *at* the end of its booked window, so it was the normal case. The sweep now grants
  hot `ACTIVE` permits exactly `FIRE_WATCH_DURATION_MINUTES` of grace — derived from the domain
  rule, never a hand-tuned fudge. Scoped to hot *and* ACTIVE: a hot `PENDING` permit was never
  approved so no watch can be owed, and no other permit type has a post-window control.
- **Expiry must never START a Fire Watch.** A Fire Watch is a person standing there. A sweep that
  wrote `fireMonitorStartedAt` unattended would put a safety control into an append-only audit log
  that no human performed — a false safety record is worse than a missing one.
- **Closure is the Foreman's act; an officer close is an exception and must say why.** The crew
  know when the work is done and the area is cold. `safety_officer` was always authorised to close
  any permit but had no UI, which turned load-bearing once `FIRE_MONITOR` was made non-expiring:
  `close` is the only exit from that state, so a crew that went home, a disabled contractor account
  or a lost phone stranded the permit permanently, leaving a manual database `UPDATE` — which
  bypasses the audit chain — as the only recourse. An officer must now supply a `reason`
  (`403 CLOSURE_REASON_REQUIRED`), recorded on the `PERMIT_CLOSED` audit row so the exception stays
  distinguishable forever after. A contractor closing their own permit owes none. The UI is
  deliberately subordinate to Approve/Reject — a backstop, not a parallel workflow.
- **Facility plans are raster images only.** PNG/JPEG/WebP; PDF and HEIC are refused at the plan
  upload route even though the generic upload route accepts them, because the map draws the plan
  with a plain `<img>`. A bad version is permanent (versions are immutable and retained forever)
  and is only discovered after activation, at which point every contractor is locked out of
  submitting. **A photo of a printed plan is keystoned and cropping does not fix it** — a pin lands
  where you clicked and still not where you meant, error growing toward the far edge, invisibly. The
  upload flow therefore carries a skippable four-corner perspective correction.
- **Never activate a facility plan until the contractor position picker has shipped.** Restated
  because it is now imminent rather than hypothetical: `submit.service.ts` throws
  `PERMIT_POSITION_REQUIRED` the moment any plan is active.
- **A demo affordance must never become a second, weaker way in.** ~~The trial auto-login buttons are
  hidden behind `VITE_TRIAL_LOGIN` (default off), take their password from
  `VITE_TRIAL_LOGIN_PASSWORD` (never hardcoded, nothing rendered if absent), put no password in any
  committed file, and call the same `login()` provider the form calls — no client-minted tokens, no
  skipped guards, no auth-store bypass.~~ **Superseded 2026-09-08 (wayfinder 042): there is no demo
  affordance at all.** The principle stands and is why the feature is gone rather than hardened
  further — the owner ruled that no demo environment will exist, and a credential path whose only
  safety argument was "the data behind it is worth nothing" cannot be justified once nobody owns
  that environment. `POST /api/v1/auth/demo-login`, the seeded demo accounts, `VITE_TRIAL_LOGIN` and
  `VITE_TRIAL_LOGIN_PASSWORD` are all removed. Do not reintroduce any of them; if trial access is
  wanted again, that is a new decision about a demo *environment* first, not a login shortcut.
- **There is no `admin` role.** `UserRole` is exactly `contractor | safety_officer | inspector`. A
  request naming an admin is a request for a role that does not exist; say so rather than inventing
  one. (2026-08-31: the owner considered adding one and then ruled it out
  of scope — wayfinder 024/025. The bypass login shipped for the three roles that exist; 2026-09-08:
  that login has since been removed entirely, see the demo-affordance bullet above. The no-admin
  ruling is unaffected — it never depended on it.)
- **Demo login is for UAT, on data whose loss costs nothing.** ~~The owner's ruling when asked what
  the demo accounts point at. That is what makes an open endpoint acceptable — not the flag, not
  the rate limit, both of which are still required. If demo login is ever pointed at real permit
  data this ruling no longer holds and the endpoint must be disabled.~~ **Resolved 2026-09-08
  (wayfinder 042) by removing the endpoint.** This ruling's own condition is what closed it: asked
  directly whether that loss-costs-nothing environment exists, the owner ruled it never would.
  Three alternatives were rejected on the way — a separate demo deployment (infrastructure nobody
  wants to run), pointing demo login at staging (whose data is not disposable, so a leak there is a
  real leak), and flagging demo rows inside the real database (every list, count, expiry sweep and
  audit query would need the filter, and one missed filter puts a fake permit in front of a safety
  officer).
- **No credential string may survive into a production bundle, mock ones included.** A frontend
  cannot keep a secret: Vite env vars are build-time substitutions, and a runtime check like
  `hostname === 'localhost'` leaves both branches in the shipped JavaScript. Gate on
  `import.meta.env.DEV`, which the bundler can prove false and eliminate. Verify by building and
  grepping `dist/` — never by reading the source and assuming.
- **Every repo's data must agree with every other repo's.** `CONTEXT.md`, `PROMPT-LOG.md` and
  `openapi.json` are byte-identical across the workspace root and all three app repos, and
  `check-contract-sync.mjs` enforces it. But the rule is broader than the checker: a change in one
  repo that makes a statement in another repo false — a status machine, a threshold, a role list,
  a lifecycle diagram, landing-page copy describing a feature — **must be corrected in that other
  repo in the same session**. A doc that describes behaviour the code no longer has is worse than
  no doc, because it is trusted. The checker catches divergence in four files; everything else is
  the author's responsibility.

## 2026-09-10 — Session 12: CR round 3 — the where-and-when step, and the inspector stepper

**Change requirement round 3.** Round 1 = the twelve issues of 2026-08-31. Round 2 = the five items
of 2026-09-08. This is the third, and the first charted as its own map:
`docs/wayfinder/map-permit-ux-and-inspector.md`. Verbatim report and fact-check:
`docs/wayfinder/assets/field-report-2026-09-10.md`. Tickets 067-079.

Twelve rulings came out of the grilling. The map holds all twelve with their reasoning; recorded
here are the ones that **change or decline a previous ruling**, because those are the ones a later
agent would otherwise "fix" back.

### Amends a previous ruling

- **`certType` survives, as an enum filtered by the worker's role.** The owner asked to delete
  `ชนิดบัตร` from the form and the entity and gate on `Worker.role` instead. **Declined and
  amended.** Deleting `certType` deletes the only field able to say a card is a *hot work* card, and
  ticket 049's finding is what makes it matter: **today `certType` gates nothing** — both the submit
  check and the entrant scan query certificates with no type filter, so a First Aid card satisfies a
  hot work permit. The real complaint was a free-text box asking a question it never explained, so
  the box becomes a closed-set picker filtered by that worker's role. **Ticket 050 is amended, not
  superseded** — read its amendment before starting it. Relates to: 049, 050, 061.
- **Role and `certType` are code enums in one constants file, not admin-managed tables.** The owner
  asked for a "dynamic setting" for roles. Declined for this round: one facility, under 100 users, a
  vocabulary that changes twice a year — that is a deploy, not a feature. Promoting either to a
  table later is a data migration, not a redesign. The rejected version also adds a fresh way for an
  admin to misconfigure the submit gate into locking out every contractor, which
  `PERMIT_POSITION_REQUIRED` already did to this system once. Recorded as out of scope, with the
  argument intact, so it can be reopened deliberately.
- **"Where & when" is one wizard step at position 3, and Review is always last.** Supersedes the
  step order ticket 015 shipped, in which the pin is step 7 — *after* Review — and is filtered out
  of `useWizard.steps` entirely when no plan is active. **Ticket 045's invariant is unchanged and
  must survive the move**: `areaId` reaches the wire only when a human set it this session, tracked
  in `updateFormData` where patches arrive, not where the picker speaks. The four spellings
  (`12` / `null` / `undefined` / key absent) stay distinct. Relates to: 015, 037, 045.
- **A permit's work window becomes multi-day: `startDate`, `endDate`, `dailyStart`, `dailyEnd`.**
  Supersedes the single-day `workDate` + `workTimeStart`/`workTimeEnd` model. The owner asked for
  six fields (a window on the first day and another on the last); **declined** — six leave the
  middle days of a multi-day permit undefined, and both the expiry sweep and the overlap query need
  a window they can compute *per day*. Exceptions ("not working Sat/Sun") ride a free-text schedule
  note. Structured weekday exclusion is out of scope and recorded as such. Relates to: 018, 019, 038.

### Declines a request, with a substitute

- **The facility plan stays safety-owned. Contractors do not upload site rasters.** The owner asked
  for contractor-chosen plans. Declined: per-contractor rasters put two crews on the same physical
  roof into unrelated coordinate spaces, so the overlap warning — the payoff that justified the Area
  entity at all — cannot see the collision. The genuine need underneath ("the site drawing is too
  coarse for my work") is met by **a drawing per Area**, safety-uploaded, with the permit's pin
  resolving against the area's drawing when it has one. A contractor's own sketch attaches to the
  permit as a **document with no coordinate system**, and must not acquire one. Relates to: 015,
  034, 036, 038.
- **Geo is a stored coordinate, not an interactive map.** The owner asked for a map picker, "open
  source, free, easy to maintain". Declined as asked: an OSM/Leaflet map fetches tiles from a third
  party on every pan, against the standing first-party rule, and self-hosting tiles is neither free
  nor easy. Instead a pasted map URL is **parsed** to `lat,lng` and stored, rendered as an "open in
  maps" link that leaves the app. Because the coordinate is what gets stored, an interactive picker
  stays a later upgrade rather than a redesign. A URL that cannot be parsed is a **form error, never
  a silent no-op**, and a `maps.app.goo.gl` shortener is rejected rather than followed server-side —
  following a user-supplied URL outbound is both a first-party violation and an SSRF shape.

### New rulings this round (no predecessor)

- **The inspector's stepper is one site visit, not the permit's lifetime.** Scan starts a run; the
  permit shows a timeline of runs. This follows from ticket 010's existing rule — a scan proves the
  inspector is physically at the permit, and history is a read-only shortcut that never stands in
  for being there.
- **The inspector records; the foreman closes.** The final post-work review carries images and a
  note and changes no permit state. Closure stays where ticket 020 put it. One role does not get
  both "I witnessed it" and "I ended it" — that separation is what the audit chain is for.
- **One fixed spine, no visit-type picker.** Confined space splices in a gas step, hot work a fire
  watch step once `FIRE_MONITOR`, high work nothing. A picker is a click that can be wrong, and
  picking wrong is how a gas reading gets skipped.
- **`noteType` is `GENERAL | WARNING | CORRECTIVE_ACTION | EMERGENCY | INCIDENT`.** The last two
  notify the safety officer immediately and change no permit state. `CORRECTIVE_ACTION` was added
  because "I told them to fix X" is the commonest inspector note and had no home. Spelled `WARNING`,
  not `WARN` (ticket 031). Inspector-triggered permit suspension was considered and ruled out of
  scope: a real emergency is a radio call, and it would hand an inspector the power to halt a crew
  by mis-tapping.
- **The 2-hour gas interval is server-owned config, exposed on the permit payload.** The client
  renders the server's verdict rather than recomputing the threshold — the standing "server's
  verdict is authoritative" rule applied to the one number this round adds. Two implementations of
  one safety threshold in two repos is the exact shape that let `certType` gate nothing while both
  gates looked correct. An overdue reading notifies every inspector on duty and the safety officer,
  then escalates to a banner for the officer **and the contractor foreman** — it is their crew
  inside. Reuses the `fireWatchAlertedAt` once-only-alert pattern, whose re-notification bug is
  already fixed.
- **Getting started is a static page plus a first-run checklist, in each app. No guided tour.** A
  spotlight tour anchors to DOM selectors and breaks silently the day someone reorders a step, with
  no gate to catch it — this workspace has four recorded cases of a green gate covering a broken
  thing.

### Harness change made in the same session

`scripts/check-deploy-lag.mjs` now **dates its own numbers**. Its header has always said "run
`git fetch` first; a stale remote ref reports stale news" — and on 2026-09-09 it was read without
fetching, reported the contractor app 10 commits undeployed (4 after a fetch), and that reading
became a map's "~20-day backlog" framing days after the backlog was cleared. The knowledge was
written down, at the point of use, and still did not protect the reader, because **nothing in the
output distinguished a stale read from a fresh one**. Now every row carries `[refs Nm old]` or
`[never fetched]`, an unfetched run prints a STALE READ banner *before* the numbers, and `--fetch`
makes the run current. Same lesson as the four gates recorded on `map.md`: a limitation the output
states beats a limitation the header states.

## 2026-09-11 — Session 13: CR round 4 — pins replace areas, safety owns closure

**Change requirement round 4**, approved by the owner on 2026-09-11 after a nineteen-question
grilling. Map: `docs/wayfinder/map-round-4-pins-closure-and-the-inspector-menu.md`. Report and the
full 33-item table: `docs/wayfinder/assets/field-report-2026-09-11.md`. Tickets 094-114 charted;
115-127 opened during implementation (each names what found it).

**Twelve of the report's items reverse or amend a prior decision** (the field report's own count), recorded
below as ten entries where items share a predecessor; five had shipped on 2026-09-10. Those are recorded here
because they are the ones a later agent would otherwise "fix" back.

### Reverses a previous ruling

- **`Area` is deleted; a named `Pin` on a named `FacilityPlan` replaces it.** Reverses 034, 036, 037,
  044, 069 and half of 070. **This is a rename plus a simplification, not a lost capability** — the
  contractor selects a pin safety placed instead of proposing an area and dropping their own. The
  reason 034 argued for the entity, the overlap warning, **survives on `pinId`** and is more precise
  than it was on an area. Do not read "remove Area" as "remove the ability to ask what else is
  happening here". Blast radius when counted: ~70 api files, 43 contractor, 56 safety.
- **Closure is the safety officer's, not the foreman's.** Reverses 020 — *"Closure is the Foreman's
  act; the crew know when the work is done and the area is cold"* — under which the officer's close
  was built as a deliberately-understated backstop. It also reverses **the owner's own answer from
  the previous day** (round 3, Q2), which chose the foreman. Contractor and inspector now *request*
  closure; safety approves, or closes directly. Closing with entrants still checked in is allowed
  **with a reason**, auto-checking them out with system provenance, because a closed permit whose
  register still shows people inside is a record that lies where it must not.
- **The inspector gets an action menu, not a fixed spine.** Reverses round 3's ruling 3, chosen the
  previous day precisely because *"a picker is a click that can be wrong, and picking wrong is how a
  gas reading gets skipped"*. **This is only safe because the guarantee moved server-side**: 075's 2h
  sweep notifies and escalates regardless of what any visit records. Only check-in/out blocks submit,
  and it is satisfied by **reviewing** the entrant table, never by changing it — the alternative
  teaches inspectors to check people out early so the app lets them finish.
- **A visit may start from history within the window the scan bought** — the permit's work window,
  capped at 12 hours. Narrows 010's *"every state-changing action requires a fresh scan"*, which 074
  had made structural. The scan still proves presence; it now proves it for the day rather than for
  one action. **The window is the whole safety argument** — it must not become configurable to
  infinity or be dropped "for now".
- **`Worker.role` is removed**, reversing 060. Made free by the item below: with `certType` 1:1 with
  permit type, 086's role filter has nothing left to do.
- **`certType` drops `Gas Testing`**, amending 049, 050 and 086. What remains is exactly
  `GATING_CERT_TYPES` and 1:1 with `PermitType`.
- **The permit's geo coordinate is removed**, reversing 068 — shipped the previous day. The URL
  parser goes with it, including its shortener rejection.
- **`planId`/`planX`/`planY` collapse into `pinId`.** Facility plans become a flat set of named places
  with **immutable images**; a new scan is a new plan and the old one is deactivated. No version
  chain, so the permit carries one reference instead of five columns.
- **Tabs everywhere, except urgent and notification-related state**, which stays a fixed section above
  them. Narrows 052's ruling that *all* safety-critical sections stay outside the tabs: round 4 pins
  only what is alarming **right now**, so the normal case is a clean tabbed page.
- **Contractors read the full inspector visit record on their own permits.** This resolves 083, closed
  unresolved the previous night. The owner chose full visibility over a `noteType` filter, knowingly.
  **Inspectors must be told their notes are contractor-visible** — it changes how people write, and
  finding out afterwards is worse than knowing.

### Declines nothing, adds these

- **Nine existing permit positions are dropped, not migrated.** A pin exists only because safety
  placed and named it; inventing nine pins would put objects nobody chose in front of the officer
  curating the list. Those permits render as unplaced.
- **Pins: names editable, positions frozen, deactivate never delete.** A position is a claim about
  where work happened; a name is a label. Same rule as accounts and audit rows.
- **"Not available" is about the worker, not the inspection** — an absence on the permit's worker row,
  **not an `EntrantEvent`**, because the entry log answers "who was inside" and a third value would
  force every such query to learn a state meaning the opposite.
- **One PPE vocabulary** across the API and both frontends, gated like the certificate vocabulary. The
  inspector checks what the contractor declared and can flag an **undeclared** gap as a
  `CORRECTIVE_ACTION` — that flag is the point, since a JSA that forgot respiratory protection is
  exactly what an inspection exists to catch.
- **A real socket service** carrying badges and notifications, **with polling kept as the fallback**.
  The API has no WebSocket server today and `useSocket.ts` is a shell. The fallback matters more than
  the socket: an inspector on plant-floor signal drops constantly, and a badge that only works live is
  wrong exactly when someone is walking the site.
- **Offline survives.** The two inspector pages being cut are the **only** producers in the app, so
  the visit's actions must enqueue or offline ends silently for the role that needs it.
- **A permit report** — a visits view and a closure report, printable and downloadable via a print
  stylesheet. No PDF dependency: the browser renders Thai correctly because it is the same engine.
- **Pins are visible to every contractor; the grant table is deleted.** 044's own resolution called
  per-contractor scoping dead weight for a single facility under 100 users.

### Harness change made the same day

`scripts/check-ticket-frontmatter.mjs` now runs in `./init.sh`. `docs/wayfinder/` sits inside a
VitePress site built with `ignoreDeadLinks: false`, so a ticket whose front matter will not parse
**breaks the docs build** — which had now happened twice, both times on a `source:` line quoting the
owner, where YAML read an inner colon as a nested mapping. The first occurrence was already written
up in ticket 089 and it happened again the next day, which is the argument for a check rather than a
note. It caught a second bad ticket in the batch that prompted it.

---

## Owner updates

Product-owner entries only. Format above. Newest last.

_(none yet)_
