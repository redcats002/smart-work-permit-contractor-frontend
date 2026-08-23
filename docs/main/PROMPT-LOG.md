# Prompt & Decision Log — SmartWorkPermit

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
- **Blocked items are product decisions**, not work: backend `feat-011`, `SHL-006` (self-hosting
  fonts for the offline Inspector role). Do not implement them speculatively.

---

## Owner updates

Product-owner entries only. Format above. Newest last.

_(none yet)_
