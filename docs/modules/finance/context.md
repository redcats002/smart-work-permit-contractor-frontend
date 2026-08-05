# Module: finance

Module-level invariants for the finance flow (receipts, installments, expenses).
Read this before touching `src/pages/finance/**`.

## Harness layout

```
docs/modules/finance/
├── context.md            ← you are here (module invariants)
├── feature_list.json     ← registry of every work item, all types
└── <type>/<nnn-slug>/
    ├── context.md        ← what this item is, the rule it encodes, its data flow
    ├── progress.md       ← dated session log for this item only
    └── tickets/          ← ticket write-ups (FIN-<nnn>.md)
```

## Location

- Routes: `src/router/modules/finance/` (`/finance`)
- Pages: `src/pages/finance/`
  - `pages/record/` — installment records
  - `pages/receipt/` — receipt management
  - `pages/invoice/` — invoice management
  - `pages/close-account/` — close account
  - `pages/re-finance/` — refinance
- Providers: `invoice`, `receipt`, `expenses`, `close-contract`, `refinance`
- Models: `src/models/response/receipt/ReceiptRes.model.ts`

## Cross-cutting concerns

- `InstallmentStatusEnum` lives at `src/enums/modules/contract/InstallmentStatus.enum.ts`
  (consolidated from `finance/InstallmentStatus` and `contract/PaymentStatus` — see FIN-001).
