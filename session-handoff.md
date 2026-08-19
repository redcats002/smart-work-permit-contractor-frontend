# Session Handoff

> Fill this in before ending every session. The next agent reads this file, `progress.md`,
> and the active module's `feature_list.json` — nothing else is guaranteed to be in context.

**Date:** 2026-08-17
**Session did:** `PMT-005` — Wizard step 1-2 (Permit Type + Basic Information). Filled the two
real step bodies on top of the `PMT-004` shell.
**30 of 40 items done** (root registry, module counts).

**Status:** `./init.sh` passes clean — typecheck PASS, lint PASS, vitest 28 files / **323 tests**
PASS, live API smoke **16/16** PASS.
**Nothing is committed.** Review the working tree first.

---

## What PMT-005 built

- `src/pages/permit/pages/create/schema/Step1Type.schema.ts` — `type` must be one of
  `EPermitType` (`schema.enum`).
- `src/pages/permit/pages/create/schema/Step2BasicInfo.schema.ts` — exports
  `Step2BasicInfoFieldsSchema` (the 6 required wire-string fields) and `Step2BasicInfoSchema`
  (adds `.refine` for end-after-start). Both replace `z.object({})` placeholders and are what
  `useWizard` uses to gate the Next button — kept exactly as strict as `hasCreatableDraft()`
  (`useWizard.ts`), covered by two new test files under
  `src/tests/pages/permit/create/schema/`.
- `src/pages/permit/pages/create/components/steps/Step1Type.vue` — 3 selectable type cards
  (Hot/Confined/Heights), reusing the `--color-permit-type-*` tokens the same way
  `PermitCard.vue` does. Click sets `formData.type`.
- `src/pages/permit/pages/create/components/steps/Step2BasicInfo.vue` — title/foreman/location
  go through `@primevue/forms` + `zodResolver` (`Step2BasicInfoFieldsSchema.pick(...)`), per the
  project's mandatory form pattern. workDate/workTimeStart/workTimeEnd are plain `v-model`
  computed proxies straight onto `props.formData` (not inside the `<Form>`) — a `DatePicker`'s
  `Date` value can't share one resolver schema with the wire-string shape `useWizard.formData`
  needs, and a dual Date/string schema pair wasn't worth it for 3 fields. Times are composed as
  `workDate` + picked time-of-day → full ISO (`combined.setHours(...); .toISOString()`), never a
  bare `'HH:mm'`. Contractor field reads `authStore.user.name`, readonly. No `project` or
  `workDescription` key is ever emitted — neither exists on the API (`docs/api/GAPS.md` §F). Map
  pin is a static 📍 box.
- Locale keys added under `permit.create.steps.type.*` / `permit.create.steps.basicInfo.*` in
  both `src/locales/en/permit.ts` and `src/locales/th/permit.ts` (placeholder `marker`/`body`
  keys removed for steps 1-2 only; steps 3-6 keep theirs, untouched).

**Untouched, on purpose:** the wizard shell (`useWizard.ts`, `WizardSteps.ts`,
`StepperHeader.vue`, `WizardFooter.vue`, `PermitCreatePage.vue`), the permit provider, and steps
3-6 (still `z.object({})` placeholders — `PMT-006`..`009`).

## Verification detail — read before trusting this UI

`./init.sh`'s smoke step (`scripts/smoke-api.mjs`) is generic and does not exercise the wizard.
Per this item's brief, a throwaway probe script (session scratchpad, **not committed**) logged in
as the seeded contractor and called `POST /permits` with exactly the payload Step1Type +
Step2BasicInfo would emit (`{type:'hot', title, location, foreman, workDate:'2026-08-20',
workTimeStart/End as full ISO}`) — got `200` back with a real id (`WP-HOT-20260817-002`), then
`PATCH /permits/:id` (a foreman edit) — got `200`. This confirms the wire shape end to end against
the live backend, the first time this create-then-PATCH path has run against a real server.

**What was NOT verified:** an actual interactive click-through of the rendered wizard (card
selection, DatePicker popups, inline field errors, responsive stacking at 375px). The
Claude-in-Chrome browser extension was not connected in this sandbox
(`tabs_context_mcp` → "Browser extension is not connected"), so the components are
code-reviewed + typechecked + linted, not screenshot-verified. `bun run dev` was started and
confirmed to boot without a build error, then left running in the background (not killed — see
AGENTS.md's "never run `pkill -f vite`" rule; only kill your own PID, which this sandbox's
permission classifier blocked even for `lsof`/`pkill` scoped to one port). **Recommend the next
session — or a human — click through `/permits/create` once** before treating this UI as fully
trusted, especially: does clicking a type card visually select it, do the two time pickers show
sensible values, does the inline "end must be after start" note actually appear/disappear.

## Read this before touching src/resources or src/models

`docs/api/openapi.json` is the contract, generated from a live boot of the backend and never
hand-edited. `docs/main/dev-handoff/04-api-contract.md` is its readable form. `01-backend-elysia-tasks.md`
is the older *plan*; where they disagree, the contract wins.

## Next work

`PMT-006` (Wizard step 3 — Safety Checks) is next: type-specific gas/wind readings validated
against `SAFETY_RANGES` (one exported constant, consumed by both the schema and the inline
pass/fail display — do not duplicate the numbers), the indoor/outdoor bypass toggle, the numbered
Yes/No/N/A checklist, and a hard block on Next with no override when a reading fails. `type` was
set by Step1Type.vue and is already sitting in `formData.type` — step 3 reads it to decide which
readings to demand (hot → LEL+O₂, confined → LEL+O₂+CO+SO₂, heights → wind). Do not touch Step1/2
or the wizard shell while doing this.

## Known gaps needing a backend change

`docs/api/GAPS.md` §Open. The one with UI consequences today: `GET /permits` returns no entrant
count, so the My Permits card's "N inside" badge was removed — only the public
`GET /permits/qr/:token` reports one.
