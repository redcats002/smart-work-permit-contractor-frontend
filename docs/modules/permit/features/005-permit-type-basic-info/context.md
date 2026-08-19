# PMT-005 — Wizard step 1-2: Permit Type + Basic Information

Launch brief. Item registry entry: `docs/modules/permit/feature_list.json` → `PMT-005`.

---

## Launch prompt

Paste this to start an agent in this repo:

```
Work in this repo (smart-work-permit-contractor-frontend). Implement exactly one item: PMT-005.

Read, in order:
1. AGENTS.md — conventions, commands, and "Business rules that must not drift"
2. docs/modules/permit/features/005-permit-type-basic-info/context.md  ← this file, the brief
3. docs/modules/permit/context.md + the PMT-005 entry in docs/modules/permit/feature_list.json
4. docs/main/dev-handoff/04-api-contract.md §4 — the PATCH wizard payload
5. session-handoff.md — what the previous session changed under you

Ground truth for any API question is docs/api/openapi.json (generated from a live boot, never
hand-edited); 04-api-contract.md is its readable form. docs/main/dev-handoff/01-backend-elysia-tasks.md
is the older PLAN — where they disagree, the contract wins. Field names in the design
(SmartWorkPermit-v3.dc.html) are LABELS, not wire names; see §Field mapping in the brief.

Done = ./init.sh passes clean: typecheck + lint + vitest + the live smoke check. Start the backend
for the smoke step: cd ../smart-work-permit-api && bun run dev
Then record the passing output in PMT-005's `evidence`, append to this item's progress.md and the
module progress.md, and update session-handoff.md.

Scope: step 1 and step 2 bodies plus their two schemas only. Do not touch other steps, the wizard
shell (PMT-004), or any provider. Do not start PMT-006.
```

---

## What this item is

The first two bodies of the 6-step wizard. The shell — stepper, Next/Back gating, draft
persistence, the create-then-PATCH race guard — already exists and is `done` (`PMT-004`). Filling a
step means editing that step's `.vue` and its `.schema.ts`; the registry
(`wizard/WizardSteps.ts`) wires everything else.

Files you will touch:

```
src/pages/permit/pages/create/
├── schema/Step1Type.schema.ts        ← placeholder z.object({}) today
├── schema/Step2BasicInfo.schema.ts   ← placeholder z.object({}) today
└── components/ (or steps/) — the two step bodies
```

## The rule this item encodes

**Nothing is persisted until step 2 is complete.**

`POST /permits` requires seven fields together, each `minLength: 1`:

```
type · title · location · foreman · workDate · workTimeStart · workTimeEnd
```

`useWizard.updateFormData()` gates the first create on `hasCreatableDraft(formData)`, which checks
exactly those. Until step 2 fills them, **no draft exists and nothing is saved** — by design, since
an earlier create would 400 every time. Once the draft exists, every later edit PATCHes normally.

This changed on 2026-08-17 (`feat-005`/`API-005`). Before that the wizard created a draft as soon as
a type was picked, which worked only against the deleted stub.

## Field mapping — design label → wire name

The design's labels are not the API's field names. Bind to the right side.

| Design label (line 168-215) | Wire field | Notes |
|---|---|---|
| Project * | **`title`** | There is no `project` field. This is the one that trips people. |
| Foreman * | `foreman` | |
| Date * | `workDate` | Send `YYYY-MM-DD`. Comes back as a full ISO timestamp — never round-trip the response into the date input. |
| Start * / End * | `workTimeStart` / `workTimeEnd` | **Full ISO datetimes**, not `'HH:mm'`. Compose from `workDate` + the picked time. |
| Location * | `location` | |
| Contractor (readonly) | — | Show the signed-in user's name from the auth store. It is **not** a company: the API has no organisation concept and `IUser.company` never populates (`docs/api/GAPS.md` §C). |
| Work description * | — | **No such field exists.** Omit it, or render it explicitly unpersisted. Adding it to the payload silently drops it (`docs/api/GAPS.md` §F). |
| Map pin | — | Static placeholder panel. Do **not** add a mapping dependency. |

## Data flow

```
step 1 card click ──► updateFormData({ type })      ─┐
                                                      ├─► formData (page-scoped ref in useWizard)
step 2 field blur ──► updateFormData({ title, … })  ─┘
                                                        │
                                    hasCreatableDraft(formData)?
                                       no ──► nothing happens (correct)
                                      yes ──► debounce 1500ms ──► doPersist()
                                                                   │
                                              draftId? ── no ──► POST /permits   → draftId
                                                       └─ yes ──► PATCH /permits/:id
```

`type` also drives step 3: which readings are demanded (hot → LEL+O₂, confined → LEL+O₂+CO+SO₂,
heights → wind). Don't encode that here — step 3 owns it — but don't break it either.

## Traps

1. **`workTimeStart`/`workTimeEnd` are datetimes.** A `'09:00'` string reaches the backend as an
   invalid date. Compose with the work date.
2. **End must be after start** — schema-level, per the acceptance list.
3. **Don't send `project` or `workDescription`.** Neither exists; the payload type will not stop you
   from adding an extra key.
4. **Server errors carry `errorCode`, not `code`.** `code` is the numeric HTTP status. Map via
   `useApiError()`; never render the backend's `message`.
5. **The schema gate and the persistence gate are different things.** A step-2 schema that passes
   while a required wire field is empty means the wizard silently never saves. Keep the schema at
   least as strict as `hasCreatableDraft`.

## Verification

```bash
cd ../smart-work-permit-api && bun run dev     # :3000, needs postgres + redis
./init.sh                                      # typecheck + lint + vitest + live smoke
```

`./init.sh` alone is not proof for this item: the smoke check does not exercise the wizard. Before
claiming done, create a draft by hand against the running API and confirm a real `WP-…` id comes
back — that is the first time this code path has ever run against a real server.

A contractor account is required (the API seeds a `safety_officer` only) — provision one with
`POST /api/v1/users` while signed in as that officer, per `04-api-contract.md` §2.
