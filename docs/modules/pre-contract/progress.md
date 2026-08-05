# pre-contract Module — Session Progress Log

## 2026-08-05

**Active feature:** pre-contract-001 — appraisal confirmation ownership guard

### What's done

- [x] Added `canConfirm` guard (computed) in `ModalConfirmAppraisal.vue`: only the
      assigned `sellMan` or a `SUPER_ADMIN`/`ADMIN` may confirm appraisal.
- [x] On fail: `toast.warn('คุณไม่ใช่พนักงานประเมินของสัญญานี้ ไม่สามารถยืนยันราคาประเมินได้')`, modal stays closed.
- [x] Threaded `sellMan` prop: `PreContractDetailPage.vue` (`contract.sellMan`) →
      `PreContractAction.vue` → `ModalConfirmAppraisal.vue`.
- [x] Verified `sellMan: IEmployeeList` is a required field on `PreContractRes.model.ts`
      before wiring (not assumed from prop names elsewhere).
- [x] Used `EmployeeRoleEnum.SUPER_ADMIN` / `.ADMIN` instead of string literals.
- [x] Lint clean, no new type errors in the three touched files.

### What's next

- No follow-up required for this feature. If another modal needs the same
  ownership-check pattern, extract `canConfirm` into a composable at that point —
  don't pre-extract for a single caller.

## Files modified this session

- `src/pages/contract/pages/pre-contract-detail/components/appraisal/ModalConfirmAppraisal.vue`
- `src/pages/contract/pages/pre-contract-detail/components/PreContractAction.vue`
- `src/pages/contract/pages/pre-contract-detail/pages/PreContractDetailPage.vue`

## Notes for next session

Guard is a UX-layer check only — confirm the API enforces the same ownership rule
server-side. Not verified in this session (backend out of scope).
