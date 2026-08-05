# PRE-001 — Progress Log

## 2026-08-05

**Status:** done · commit `fb0b293f`

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

### Decisions

- **Guard at the activator, not in `onSubmit`.** Blocking after the form is filled wastes
  the user's effort; the button is also where the rule is most legible.
- **No permissions composable extracted.** Single caller — extract when a second modal
  needs the same check, not before.

### Verification

| Check | Command | Result |
|---|---|---|
| Lint | `bunx eslint <3 touched files>` | 0 errors |
| Types | `bunx vue-tsc --noEmit` | no errors in touched files |

## Files modified

- `src/pages/contract/pages/pre-contract-detail/components/appraisal/ModalConfirmAppraisal.vue`
- `src/pages/contract/pages/pre-contract-detail/components/PreContractAction.vue`
- `src/pages/contract/pages/pre-contract-detail/pages/PreContractDetailPage.vue`

## Next

Nothing outstanding for this item. Open question left for whoever owns the API:
confirm the backend enforces the same ownership rule server-side (not verified here,
backend was out of scope).
