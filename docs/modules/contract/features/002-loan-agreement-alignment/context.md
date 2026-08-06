# CON-002: Loan agreement document alignment and A4 preview

## Goal

Fix alignment and formatting issues in `LoanAgreementDocument.vue` and add clear
A4 preview boundary for better visual preview before printing.

## Problems fixed

1. **Header meta alignment**: "เขียนที่" and "วันที่" used `text-right` with manual
   `mr-40` margin — fragile and inconsistent. Changed to `flex justify-end`.

2. **Borrower info block**: All fields (อายุ, อยู่บ้านเลขที่, หมู่, ตำบล, อำเภอ,
   จังหวัด, บัตรประชาชนเลขที่) were inline spans wrapping unpredictably. Restructured
   into proper lines with `<br>` breaks and consistent `min-width` values.

3. **Date fields in sections 3 & 4**: Used `d-underline` with no width — inconsistent
   sizing. Added `min-width` and `text-center` for proper alignment.

4. **A4 preview boundary**: No visual boundary for screen preview. Added `.a4-preview`
   class with dashed outline and shadow (screen only, hidden in print).

## Files changed

| File | Change |
|---|---|
| `src/pages/contract/components/print/LoanAgreementDocument.vue` | Fixed alignment, added A4 preview styling |

## Verification

1. `bunx eslint src/pages/contract/components/print/LoanAgreementDocument.vue` — 0 errors
2. `bunx vue-tsc --noEmit` — clean
3. Preview contract print page — should show A4 outline with proper text alignment
