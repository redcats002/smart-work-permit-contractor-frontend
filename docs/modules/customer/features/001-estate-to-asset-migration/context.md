# CUST-001: Migrate EstateStatus to AssetStatus enum

## Goal

Remove `src/enums/modules/estate/EstateStatus.enum.ts` entirely and replace all usages
with `src/enums/modules/asset/AssetStatus.enum.ts`.

## Why

The `estate` enum is a legacy duplicate of the `asset` status concept. Both represent the
same domain (collateral asset lifecycle) but with divergent values. Consolidating to
`AssetStatus` eliminates confusion and aligns the customer detail tab with the stock/asset
module.

## Enum comparison

### EstateStatusEnum (to remove)

| Value | Thai label |
|---|---|
| ACTIVE | ปกติ |
| PENDING_SALE | รอขาย |
| DONE | คืนลูกค้า |
| RETURNED | คืนลูกค้า |
| NORMAL | ปกติ |
| SOLD | ขายแล้ว |
| PENDING_TO_SELL | รอขาย |
| PENDING_TO_AUCTION | รอประมูล |

### AssetStatusEnum (to keep)

| Value | Thai label |
|---|---|
| ACTIVE | ใช้งาน |
| PENDING_REFUND | รอคืนลูกค้า |
| REFUNDED | คืนลูกค้าแล้ว |
| LEGAL_EXECUTION | บังคับคดี |
| SOLD | ขายแล้ว |
| PENDING_SALE | รอขาย |

### Proposed mapping (needs backend confirmation)

| Estate value | → Asset value | Notes |
|---|---|---|
| ACTIVE | ACTIVE | Direct match |
| NORMAL | ACTIVE | Both mean "in use" |
| PENDING_SALE | PENDING_SALE | Direct match |
| PENDING_TO_SELL | PENDING_SALE | Same meaning |
| PENDING_TO_AUCTION | PENDING_SALE | Closest match — confirm with backend |
| SOLD | SOLD | Direct match |
| RETURNED | REFUNDED | Both mean "returned to customer" |
| DONE | REFUNDED | Both mean "returned to customer" |

> **BLOCKER:** The PENDING_TO_AUCTION → PENDING_SALE mapping needs backend confirmation.
> If the API still returns `PENDING_TO_AUCTION`, we need to know whether the backend will
> migrate the data or the frontend must handle both values.

## Files to change

### 1. Delete

- `src/enums/modules/estate/EstateStatus.enum.ts`

### 2. Update model types (TEstateStatus → TAssetStatus)

| File | Field | Current type | New type |
|---|---|---|---|
| `src/models/response/customer/CustomerRes.model.ts:69` | `ICustomerAssetList.status` | `TEstateStatus` | `TAssetStatus` |
| `src/models/response/employee/EmployeeRes.model.ts:59` | `IEmployeeEstateList.estateStatus` | `TEstateStatus` | `TAssetStatus` |
| `src/models/response/document-storage/DocumentStorageRes.model.ts:97` | `IStockEstateList.estateStatus` | `TEstateStatus` | `TAssetStatus` |

### 3. Replace or remove components

| Component | Action |
|---|---|
| `src/pages/customer/pages/detail/components/tab/estate/ChipEstateStatus.vue` | Delete — replace with `ChipAssetStatus` import in consumers |
| `src/pages/customer/pages/detail/components/tab/estate/EstateTable.vue` | Update import: `ChipEstateStatus` → `ChipAssetStatus` |
| `src/pages/stock/pages/list/components/ChipContactHistoryStatus.vue` | Orphaned (unused) — delete |
| `src/pages/contract/pages/detail/components/tab/guarantor/ChipGuarantorStatus.vue` | Orphaned (unused) — delete |

### 4. Update imports in consumers

| File | Current import | New import |
|---|---|---|
| `EstateTable.vue` | `ChipEstateStatus` from local | `ChipAssetStatus` from `@/pages/stock/pages/list/components/asset/ChipAssetStatus.vue` |
| `CustomerRes.model.ts` | `TEstateStatus` from estate | `TAssetStatus` from asset |
| `EmployeeRes.model.ts` | `TEstateStatus` from estate | `TAssetStatus` from asset |
| `DocumentStorageRes.model.ts` | `TEstateStatus` from estate | `TAssetStatus` from asset |

### 5. Dead code to remove

- `EstateStatusItems` — exported but never imported anywhere

## Verification

After implementation:

1. `bunx eslint src/enums/modules/estate src/pages/customer/pages/detail/components/tab/estate src/pages/stock/pages/list/components/ChipContactHistoryStatus.vue src/pages/contract/pages/detail/components/tab/guarantor/ChipGuarantorStatus.vue src/models/response/customer/CustomerRes.model.ts src/models/response/employee/EmployeeRes.model.ts src/models/response/document-storage/DocumentStorageRes.model.ts` — 0 errors
2. `bunx vue-tsc --noEmit` — clean
3. `bunx vitest run` — all tests pass
4. `grep -r "estate/EstateStatus" src/` — no results (all references removed)
5. `grep -r "EstateStatusEnum" src/` — no results
6. `grep -r "TEstateStatus" src/` — no results
