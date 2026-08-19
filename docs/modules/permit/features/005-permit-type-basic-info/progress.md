# PMT-005 — progress

## 2026-08-17 — brief written, item not started

Item directory created per `docs/GUIDE.md`'s layout (`<type>/<nnn-slug>/`). No code written.

The acceptance list in `docs/modules/permit/feature_list.json` was **rewritten** in the same pass:
the original named `Project` and `Work description*`, neither of which exists on the real API. It
now names wire fields, and adds the constraint that step 2's schema must satisfy
`useWizard.hasCreatableDraft()` — otherwise the wizard silently never persists a draft.

`docs/api/GAPS.md` gained §F: the permit has no free-text description field.

Next: implement per `context.md` in this directory.

## 2026-08-17 — implemented, done

Filled `Step1Type.vue` (3 selectable type cards, `--color-permit-type-*` tokens, same pattern as
`PermitCard.vue`) and `Step2BasicInfo.vue` (title/foreman/location/date/start/end/location +
readonly contractor + static map-pin placeholder), plus both real schemas.

`Step1TypeSchema` — `schema.enum(EPermitType, …)` on `type`.

`Step2BasicInfoSchema` — `title`/`foreman`/`location`/`workDate`/`workTimeStart`/`workTimeEnd` all
required strings (matches `hasCreatableDraft` exactly, tested), `.refine` for end-after-start. This
is the wire-shaped schema registered in `WizardSteps.ts` and is the only thing that gates Next —
kept deliberately separate from the component's own UI-layer validation (see below).

Only `title`/`foreman`/`location` go through `@primevue/forms` + `zodResolver` inside
`Step2BasicInfo.vue` (`Step2BasicInfoFieldsSchema.pick(...)`, project's mandatory form pattern).
The three date/time pickers are wired as plain `v-model` computed proxies straight onto
`props.formData` instead — a DatePicker's `Date` v-model can't share one resolver schema with the
wire-string shape `Step2BasicInfoSchema` needs, and forcing a dual Date/string schema pair for 3
fields wasn't worth the complexity for this item. `workTimeStart`/`workTimeEnd` are composed from
`workDate` + the picked time-of-day (`combined.setHours(...); .toISOString()`), never a bare
`'HH:mm'` string (trap 1). An inline warning shows under End Time when end ≤ start, backed by the
same comparison the schema's `.refine` makes (trap 2) — cosmetic only, the schema is still what
blocks Next.

No `project` or `workDescription` key is ever emitted (trap 3) — the map-pin panel is a static
📍 box, no mapping library.

**Live-API verification** (mandatory per this item's brief, beyond the generic `smoke-api.mjs`): a
throwaway probe script (session scratchpad, not committed) logged in as the seeded contractor and
POSTed exactly the payload these two components would emit — got `200` back with a real id
(`WP-HOT-20260817-002`), then PATCHed it (foreman edit) — got `200`. This is the first time this
create→PATCH code path has run against the live backend end to end.

**Not done**: an interactive browser click-through of the rendered wizard (card selection,
DatePicker popups, inline error text). The Claude-in-Chrome extension was not connected in this
sandbox, so this was verified by code review + typecheck + lint + the schema/behavioral unit tests
+ the live payload probe above, not by seeing it rendered. Recommend a human (or a session with
browser tooling available) click through `/permits/create` once before this is fully trusted for
production UI polish — CSS token names and Volt component prop names were followed by convention
but not screenshot-verified.

`./init.sh`: typecheck PASS, lint PASS, vitest 28 files / 323 tests PASS (2 new schema test files),
live smoke 16/16 PASS.
