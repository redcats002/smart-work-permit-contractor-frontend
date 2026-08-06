# Module: employee

Module-level invariants for employee pages. Read this before touching `src/pages/employee/**`
or `src/pages/setting/pages/profile/**` (profile is "view own employee record", not a separate
domain — see EMP-001 below).

## Harness layout

```
docs/modules/employee/
├── context.md            ← you are here (module invariants)
├── feature_list.json     ← registry of every work item, all types
└── features/<nnn-slug>/
    ├── context.md        ← what this item is, the rule it encodes, its data flow
    └── progress.md        ← dated session log for this item only
```

## Location

- Routes: employee pages have no top-level router entry — wired under
  `src/router/modules/setting/Employee.router.ts` (`/setting/...`). See root `CLAUDE.md`
  "Modules without a top-level router entry".
- Pages: `src/pages/employee/pages/`
  - `pages/detail/` — employee detail view (`InformationDetail.vue`, `EmployeeDetailMenuAction.vue`)
  - `pages/list/` — employee list, `ChipEmployeeStatus.vue`
  - `pages/create/` — employee create
- Providers: `employee`, `auth/public`
- Models: `src/models/response/employee/EmployeeRes.model.ts` (`IEmployeeById`)

## Cross-cutting concerns

- **`setting/pages/profile` is a consumer of `employee` detail UI, not an independent domain.**
  `ProfileDetailPage.vue` shows the logged-in user's own employee record — same `IEmployeeById`
  shape, same `EmployeeService.getEmployeeFindOne`. It historically forked its own copy of
  `InformationDetail.vue` with a reduced field set and a plain "edit only" menu
  (`ProfileDetailMenuAction.vue`). Any change to the employee detail field list or layout must be
  checked against both consumers before being called done.
- Menu actions differ per consumer (profile: edit only; employee: edit/reset-password/delete,
  gated by `useAuthStore().user.role` and self-view). This is real per-page policy, not
  duplicated data — do not try to collapse the menu logic itself, only the display list + layout.
