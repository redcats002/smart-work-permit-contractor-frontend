# api-integration — context

## Why this module exists, and why it goes first

The backend is **built and running** (`../smart-work-permit-api`, Elysia + Prisma + better-auth).
Everything in this repo was written against an assumed contract that disagrees with it on almost
every point: the path prefix, the success envelope, the auth mechanism, the error body, and the
role model.

This is not cleanup. `PMT-005`…`PMT-012`, `CRT-004` and `PLT-007` — the 6-step wizard, permit
detail, closure, the certificate gate, notifications — are **not started**. Land this module first
and they get built against the real contract once. Skip it and every one of them is written twice.

For that reason the wizard and detail items now **depend on** `API-005`/`API-006` in
`docs/modules/permit/feature_list.json`. That is a hard dependency in the graph, not a suggestion in
prose.

The sibling app (`../smart-work-permit-frontend`, Safety Officer + Inspector) completed exactly this
migration on 2026-08-17 against the same backend. Its `feat-005` harness
(`docs/modules/api-integration/`) is the worked example — when a decision here looks arbitrary, that
repo has already paid for it.

## Ground truth

**`docs/api/openapi.json`** — generated from a live boot of the API, never hand-edited:

```bash
cd ../smart-work-permit-api && ./scripts/dump-openapi.sh    # writes docs/openapi.json
cp ../smart-work-permit-api/docs/openapi.json docs/api/openapi.json
```

**`docs/main/dev-handoff/04-api-contract.md`** — the human-readable contract written for this repo:
invariants, the contractor-visible endpoint slice with an explicit allowed/403 column, the PATCH
wizard semantics, the full error vocabulary, and a step-by-step integration recipe. It supersedes
`01-backend-elysia-tasks.md` wherever the two disagree — that file was the plan, this is what shipped.

On any conflict the JSON wins. If the JSON looks stale, regenerate it rather than trusting prose.

## What the assumption got wrong

| Thing | This repo assumes | Backend actually does |
|---|---|---|
| Path prefix | none — `/permits` | `/api/v1/permits` |
| Casing | `humps` converts responses | camelCase both ways; converting **corrupts** free-form keys (`closureChecklist`, sync payloads) |
| Error body | `{ code: 'GAS_OUT_OF_RANGE', message, details }` | `{ code: 403, message, errorCode: 'GAS_OUT_OF_RANGE' }` — **`code` is the HTTP status** |
| Error vocabulary | 4 codes | 21 |
| Auth | bearer token | better-auth **session cookie**; `Authorization: Bearer` returns 401 |
| Roles | includes `admin` | `contractor` \| `safety_officer` \| `inspector` only |
| Permit detail | `jsa` grouped, `workers[].name`, `safetyReading` | flat `jsaSteps` with `phase`, `workers[].workerName`, `latestSafetyReading` |
| Certificate | client decides expiry | server returns a computed `expired` on every row |

`useApiError().mapError()` is the sharpest edge: it accepts an error only when `code` is a
**string**, and the real backend sends a **number** there. Today every coded backend failure — an
out-of-range gas reading, an expired certificate, a blocked closure — falls through to
`error.unknown`. The wizard's whole "surface the specific failing reading" requirement is dead until
`API-004` lands.

## Decisions

- **The success envelope is NOT unwrapped in the interceptor.** The sibling repo unwraps and types
  providers to the payload; this repo already types every provider `IBaseSuccessResponse<T>` and every
  caller already reads `.data`, so keeping the envelope is the smaller and safer change here. The two
  repos therefore differ on purpose — do not "align" them by rewriting this one.
- **`humps` is deleted from both directions**, not re-enabled. The API is camelCase; the commented-out
  request-side `decamelizeKeys` would rename `workTimeStart` → `work_time_start` and break every write,
  and the live response-side `camelizeKeys` rewrites the keys inside `closureChecklist`, which is
  free-form user data.
- **`USE_STUB_DATA` goes away with the provider items, not before.** Each provider item flips its own
  flag, deletes its `*.mock.ts`, and fixes its paths and shapes in one commit. A provider is not `done`
  while its stub still returns the guessed shape — that is exactly how this module became necessary.
- **Validation stays server-authoritative.** The wizard may hint at ranges for UX, but `POST
  /permits/:id/submit` is the verdict. It answers **400** with the first of eight codes and a `message`
  that joins every failure with `; ` — render mapped codes, never that string.

## The three contractor-only rules the wizard must inherit

1. **`PATCH /permits/:id` is not a partial merge for collections.** `jsaSteps` and `workers` are
   **replaced wholesale** — send the full list every time; a partial list silently deletes the rest.
   `safetyReading` **appends** a new row (the permit exposes only `latestSafetyReading` back).
   `photos` **upsert per `slotKey`**.
2. **`workDate` is asymmetric.** Sent as `YYYY-MM-DD`, returned as a full ISO timestamp. Never
   round-trip the response value into a date input.
3. **A contractor is scoped to their own permits automatically.** The `contractorId` query param is
   ignored for contractor accounts, and reading someone else's permit is a 403 — the client does not
   need to filter by owner, and must not rely on being able to.

## Verification

`./init.sh` (typecheck + lint + vitest) is necessary and not sufficient: with `USE_STUB_DATA` true it
only proves the app agrees with its own fixtures. `API-009` adds `scripts/smoke-api.mjs` — logs in
against a running API and asserts real response shapes, skipping cleanly (exit 0) when none is
reachable — and wires it into `init.sh`.

Local API:

```bash
cd ../smart-work-permit-api && bun run dev          # :3000, needs postgres + redis
```

A contractor account must be provisioned by a safety officer (`POST /api/v1/users`); the seeded
bootstrap account is a `safety_officer`. See `04-api-contract.md` §2.

## Order

`API-001` (baseline + gaps) → `API-002` (transport) → `API-003` (auth) → `API-004` (errors) →
`API-005` (models/enums) → `API-006`/`API-007`/`API-008` (providers, serialized where they share a
file) → `API-009` (smoke) → `API-010` (docs sweep).

Nothing after `API-002` may start before it lands: prefix, casing and auth are the three answers
every provider depends on.
