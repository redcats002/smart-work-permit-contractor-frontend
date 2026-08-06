# EMP-001: Unify InformationDetail.vue between employee and profile

## Goal

One `InformationDetail.vue` component renders the employee detail card (photo + `DisplayList`
of fields). Today there are two near-identical copies:

| | `employee/pages/detail/components/InformationDetail.vue` | `setting/pages/profile/pages/detail/components/InformationDetail.vue` |
|---|---|---|
| Data prop | `IEmployeeById` | `IEmployeeById` (same) |
| Fields | status, id, idCard, name, birthDate, age, email, phone, role, **supervisor line items (conditional)**, branches, **evaluatorLevel** | status, id, idCard, name, birthDate, age, email, phone, role, branches |
| Menu | `EmployeeDetailMenuAction` (edit / reset-password / delete, role+self gated) | `ProfileDetailMenuAction` (edit only) |
| Emits | `edit`, `delete`, `resetPassword` | `edit` |

The employee version is a strict superset of the profile version's field list. Keep it as the
canonical component; delete the profile one.

## Why this is safe

- Both consume the exact same `IEmployeeById` model from the same provider call
  (`EmployeeService.getEmployeeFindOne`).
- The only real difference is the menu — which is already a separate child component in both
  cases (`EmployeeDetailMenuAction.vue` / `ProfileDetailMenuAction.vue`), each with its own
  emits and its own authorization logic. That logic must NOT be merged — only the mounting point
  needs to become generic.

## Implementation approach

1. In `src/pages/employee/pages/detail/components/InformationDetail.vue`:
   - Replace the hardcoded `<EmployeeDetailMenuAction ... />` in the `#topright` slot with a
     named slot, e.g. `<slot name="menu-action" />`, and drop the `edit` / `delete` /
     `resetPassword` emits + the `EmployeeDetailMenuAction` import from this component (the
     parent page will own wiring those directly on whatever it slots in).
   - Keep `data: IEmployeeById` prop and the full field list (including the conditional
     supervisor rows and `evaluatorLevel`) exactly as-is — this is the superset, nothing to trim.
2. In `src/pages/employee/pages/detail/pages/EmployeeDetailPage.vue`:
   - Move `<EmployeeDetailMenuAction @delete @edit @reset-password>` into the new
     `#menu-action` slot of `<InformationDetail>`.
3. In `src/pages/setting/pages/profile/pages/detail/pages/ProfileDetailPage.vue`:
   - Change the `InformationDetail` import to
     `@/pages/employee/pages/detail/components/InformationDetail.vue`.
   - Put `<ProfileDetailMenuAction @edit="onEdit()" />` into the `#menu-action` slot.
4. Delete `src/pages/setting/pages/profile/pages/detail/components/InformationDetail.vue`.
5. Leave `ProfileDetailMenuAction.vue` and `EmployeeDetailMenuAction.vue` untouched — they stay
   as the two distinct, per-page menu policies.
6. Grep for any other importer of either `InformationDetail.vue` before deleting (none known,
   but verify — `useInitDetail` composable is per-page-domain and separate, not affected).

## Files to change

| File | Change |
|---|---|
| `src/pages/employee/pages/detail/components/InformationDetail.vue` | Replace hardcoded menu component with `#menu-action` slot; remove now-unused emits/import |
| `src/pages/employee/pages/detail/pages/EmployeeDetailPage.vue` | Pass `EmployeeDetailMenuAction` into `#menu-action` slot |
| `src/pages/setting/pages/profile/pages/detail/pages/ProfileDetailPage.vue` | Import employee's `InformationDetail.vue`; pass `ProfileDetailMenuAction` into `#menu-action` slot |
| `src/pages/setting/pages/profile/pages/detail/components/InformationDetail.vue` | Delete |

## Out of scope

- Do not touch `ProfileDetailMenuAction.vue` / `EmployeeDetailMenuAction.vue` internals.
- Do not touch `useInitDetail` composables (each page domain keeps its own).
- Do not add a generic "shared components" directory for this — one cross-import is enough,
  matches existing project pattern (e.g. `ChipEmployeeStatus.vue` is already imported by both
  domains today).

## Verification

1. `bunx eslint` on all 3 changed files — 0 errors.
2. `bunx vue-tsc --noEmit` — clean (confirms slot wiring + removed emits don't break either
   parent page's template types).
3. `bunx vitest run` — no regressions.
4. Manual: open `/employee/:id` detail page — full field list (incl. supervisor rows / evaluator
   level when applicable) and edit/reset-password/delete menu all present, actions fire.
5. Manual: open `/setting/profile` detail page — reduced field list still renders (no
   supervisor/evaluatorLevel rows shown incorrectly — confirm those conditions don't apply to a
   non-supervisor profile, or explicitly confirm product wants profile to now show them too,
   since it's the same superset component). **This is the one open product question — flag it
   before deleting the old component**, see below.

## Open question (must resolve before implementing)

Profile's old component silently *dropped* the supervisor-line and evaluatorLevel rows even when
the logged-in user's own data would qualify (e.g. a supervisor viewing their own profile). Once
profile switches to the superset component, those rows will now show up on `/setting/profile`
too, since the field list is the same component with the same conditionals. Confirm with
whoever owns this task whether that's desired (most likely yes — profile is "view own employee
record", so seeing the same fields the employee detail page shows for them is arguably a
consistency fix, not a regression) before implementing.
