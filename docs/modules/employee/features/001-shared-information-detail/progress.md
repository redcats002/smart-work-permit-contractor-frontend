# EMP-001 Progress

## 2026-08-06 — Plan created

- Compared both `InformationDetail.vue` copies (employee vs. profile) field-by-field and
  menu-by-menu. Confirmed employee's version is a strict superset.
- Wrote implementation plan: turn employee's menu area into a `#menu-action` slot, point
  `ProfileDetailPage.vue` at the employee component, delete profile's copy.
- Flagged one open product question in `context.md` (whether profile should now show
  supervisor-line/evaluatorLevel rows it previously hid) — needs a yes/no before implementation
  starts.
- Status: `planned`, not yet implemented.

## 2026-08-06 — Implemented

- Product confirmed: profile page should show supervisor-line/evaluatorLevel rows too when
  applicable (consistency with employee detail page).
- `employee/pages/detail/components/InformationDetail.vue`: replaced hardcoded
  `EmployeeDetailMenuAction` in `#topright` with `<slot name="menu-action" />`; removed the
  `edit`/`delete`/`resetPassword` emits and the now-unused import.
- `employee/pages/detail/pages/EmployeeDetailPage.vue`: moved `EmployeeDetailMenuAction` into
  the `#menu-action` slot, added its import.
- `setting/pages/profile/pages/detail/pages/ProfileDetailPage.vue`: switched `InformationDetail`
  import to `@/pages/employee/pages/detail/components/InformationDetail.vue`; put
  `ProfileDetailMenuAction` into `#menu-action` slot.
- Deleted `setting/pages/profile/pages/detail/components/InformationDetail.vue` after confirming
  no other importer.
- Verification: eslint 0 errors, vue-tsc clean, vitest 252/252 passed.
