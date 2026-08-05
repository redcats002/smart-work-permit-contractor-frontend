# Module: customer

Module-level invariants for the customer detail flow. Read this before touching
`src/pages/customer/**`.

## Harness layout

```
docs/modules/customer/
├── context.md            ← you are here (module invariants)
├── feature_list.json     ← registry of every work item, all types
└── <type>/<nnn-slug>/
    ├── context.md        ← what this item is, the rule it encodes, its data flow
    ├── progress.md       ← dated session log for this item only
    └── tickets/          ← ticket write-ups (CUST-<nnn>.md)
```

## Location

- Routes: `src/router/modules/customer/` (`/customer`)
- Pages: `src/pages/customer/`
  - `pages/list/` — customer list page
  - `pages/create/` — customer creation
  - `pages/detail/` — customer detail with tabs (info, asset, contract, etc.)
  - `pages/edit/` — customer edit
- Providers: `customer`
- Models: `src/models/response/customer/CustomerRes.model.ts`

## Cross-cutting concerns

- The `asset` tab in customer detail uses `AssetStatusEnum` from `src/enums/modules/asset/`.
  Migrated from `EstateStatusEnum` (deleted) — see CUST-001.
