# api-integration — progress

## 2026-08-17 — module opened and completed (API-001 … API-010)

Handoff of the integration from the sibling Safety/Inspector app, which migrated against the same
backend earlier the same day. Per-item evidence is in `feature_list.json`; this is the shape of it.

**Baseline was red, and the harness said it was green.** `./init.sh` failed on
`Certificate.provider.test.ts` before a single edit — a stub fixture had drifted out of the 30-day
expiring-soon window, so an assertion started failing on a date with no code change. `progress.md`
and `session-handoff.md` both claimed "GREEN — 303 tests". Recorded in `API-001` rather than
quietly fixed, because the next session would otherwise have spent a bisect on it.

**Why this module ran before the wizard.** `PMT-005`…`PMT-012`, `CRT-004` and `PLT-007` are not
started. Every one of them would have been written against a contract the backend does not
implement. They now *depend* on `API-005`/`API-006` in the graph, so the order is enforced, not
advised.

**The break that mattered most.** `useApiError` accepted an error only when `code` was a string;
the backend puts the HTTP status there and the machine code in `errorCode`. Every coded failure —
out-of-range gas, expired certificate, blocked closure — rendered `error.unknown`. The wizard's
"surface the specific failing reading" requirement was unimplementable until `API-004`.

**What else was quietly broken:**

- All three auth paths were missing their `/user` segment. Every one would have 404'd the moment
  the stub came off.
- The app's only live network call, `GET /notifications/check`, hits an endpoint that does not
  exist — 404 on every page load, and nothing read the result anyway.
- The wizard sent `project` and `workDescription` (neither exists) and never sent `title` (which
  `POST /permits` requires), so no draft could have been created.
- `humps.camelizeKeys` ran on every response, which rewrites the keys inside `closureChecklist` —
  free-form user data.

**Two decisions worth keeping:**

- *The envelope is not unwrapped here*, unlike the sibling app. Every provider already types
  `IBaseSuccessResponse<T>` and every caller already reads `.data`. The repos differ on purpose;
  `context.md` says so, so it reads as a decision rather than drift.
- *Expiry is the server's call.* `certificateStatus()` takes the backend's computed `expired` and
  honours it outright, deciding only the advisory "expiring soon" window itself. The client can no
  longer disagree with the server about whether a worker may enter.

**Verification changed shape.** `./init.sh` gained a fourth check: `scripts/smoke-api.mjs` logs in
against a running API and asserts 16 real response shapes, skipping cleanly when none is reachable.
A green vitest only ever proved the app agreed with its own types.

Final `./init.sh`: typecheck PASS, lint PASS, vitest 26 files / 309 tests PASS, smoke 16/16 PASS.

Open gaps that need a backend change are in `docs/api/GAPS.md` — the missing entrant count on the
permit list is the one that removed a UI affordance.
