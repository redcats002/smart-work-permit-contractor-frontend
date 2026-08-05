# FIN-001: Consolidate InstallmentStatus and PaymentStatus enums

## Goal

Rename `src/enums/modules/contract/PaymentStatus.enum.ts` → `InstallmentStatus.enum.ts`
and remove the duplicate `src/enums/modules/finance/InstallmentStatus.enum.ts`.

The enum values, types, and helpers stay exactly as they were in PaymentStatus — only the
file name, enum name, type name, and exported symbol names change.

## Naming map

| Old (PaymentStatus) | New (InstallmentStatus) |
|---|---|
| `PaymentStatusEnum` | `InstallmentStatusEnum` |
| `TPaymentStatus` | `TInstallmentStatus` |
| `PaymentStatusItems` | `InstallmentStatusItems` |
| `contract/PaymentStatus.enum` | `contract/InstallmentStatus.enum` |

## Enum values (unchanged)

| Value | Thai label |
|---|---|
| OVERDUE | เกินกำหนด |
| NOT_DUE_YET | ยังไม่ถึงกำหนด |
| PARTIAL | ชำระบางส่วน |
| PAID | ชำระแล้ว |
| DUE_DATE | ถึงกำหนดชำระ |

## Files changed

### Deleted

- `src/enums/modules/finance/InstallmentStatus.enum.ts` — duplicate, removed
- `src/enums/modules/contract/PaymentStatus.enum.ts` — renamed to InstallmentStatus

### Created

- `src/enums/modules/contract/InstallmentStatus.enum.ts` — exact copy of PaymentStatus with renamed symbols

### Updated (6 files)

| File | Change |
|---|---|
| `src/models/response/receipt/ReceiptRes.model.ts` | Import path: `finance/InstallmentStatus` → `contract/InstallmentStatus` |
| `src/pages/finance/pages/receipt/create/components/ChipInstallmentStatus.vue` | Import path change |
| `src/pages/finance/pages/receipt/create/components/CardInstallment.vue` | Import path change |
| `src/models/response/contract/ContractRes.model.ts` | `TPaymentStatus` → `TInstallmentStatus`, import path change |
| `src/pages/contract/pages/detail/components/tab/installment/ChipInstallmentStatus.vue` | `TPaymentStatus` → `TInstallmentStatus`, import path change |
| `src/pages/contract/pages/detail/components/tab/installment/InstallmentMenuAction.vue` | `TPaymentStatus` → `TInstallmentStatus`, import path change |

### Dead code removed

- `ContractStatusItems` (from finance/InstallmentStatus) — exported but never imported
