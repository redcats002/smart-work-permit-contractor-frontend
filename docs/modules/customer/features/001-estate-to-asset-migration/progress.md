# CUST-001 Progress

## 2026-08-05 — Initial analysis

- Audited all usages of `EstateStatusEnum` across codebase (6 consumer files + source)
- Compared enum values between Estate and Asset — found they are NOT 1:1 mapped
- Identified 3 model files that need type changes
- Identified 4 components to delete (2 orphaned, 1 used, 1 consumer)
- Created migration plan with proposed value mapping
- **BLOCKER:** Need backend confirmation on PENDING_TO_AUCTION → PENDING_SALE mapping

## 2026-08-05 — Implementation complete

- Updated 3 model files: `TEstateStatus` → `TAssetStatus` (CustomerRes, EmployeeRes, DocumentStorageRes)
- Updated `EstateTable.vue`: replaced `ChipEstateStatus` with `ChipAssetStatus` import
- Deleted 4 files: `ChipEstateStatus.vue`, `ChipContactHistoryStatus.vue` (orphaned), `ChipGuarantorStatus.vue` (orphaned), `EstateStatus.enum.ts`
- Removed empty `src/enums/modules/estate/` directory
- Verification: eslint 0 errors, vue-tsc clean, 238 tests passed, grep confirms zero remaining estate references
- **NOTE:** Backend still returns estate status values (ACTIVE, PENDING_SALE, DONE, RETURNED, NORMAL, SOLD, PENDING_TO_SELL, PENDING_TO_AUCTION). The frontend now types these as `TAssetStatus`. If the backend sends values not in `AssetStatusEnum` (e.g., DONE, RETURNED, NORMAL, PENDING_TO_SELL, PENDING_TO_AUCTION), the `formatTitle()` will return 'ไม่พบสถานะ' and `getStatusClass()`/`getIcon()` will hit the default branch.
