# FIN-003: Format discount amount input with numberFormat2Decimal

## Goal

The `discountAmount` input in `CardInstallment.vue` (ส่วนลดค่าปรับ) currently uses
`type="number"` with `v-model.number`. It should display formatted with
`formatter.numberFormat2Decimal()` while the user edits, and cast to `number` in the
emitted payload.

## Current behavior

```html
<input
  v-model.number="discountAmount"
  :disabled="!fineDiscount"
  class="..."
  placeholder="0"
  type="number">
```

- `discountAmount` is `ref<number>(0)`
- `v-model.number` binds raw number value
- No formatting displayed to user

## Expected behavior

- Display formatted value (e.g., `1,000.00`) when not editing
- Allow free-form decimal input while editing (same as `customAmount` field)
- On blur, reformat to `numberFormat2Decimal`
- In payload (`currentDiscount`), cast to `number` (already happens via computed)
- Limit discount value to not exceed overdue penalty outstanding (`data.penaltyFee.outstanding`)
- Reuse one shared 2-decimal input utility for both `customAmount` and `discountAmount`

## Implementation approach

1. Refactor decimal input parsing/formatting/keydown filtering to shared util:
   - `src/utils/TwoDecimalInput.ts`
2. In `CardInstallment.vue`, use shared handler builder for both fields:
   - `customAmount`
   - `discountAmount`
3. Clamp discount input to `props.data.penaltyFee.outstanding`
4. Keep payload numeric via existing computed (`currentDiscount`)

## Files to change

| File | Change |
|---|---|
| `src/pages/finance/pages/receipt/create/components/CardInstallment.vue` | Switch both amount fields to shared util-driven handlers; enforce discount max cap |
| `src/utils/TwoDecimalInput.ts` | Add reusable parse/format/keydown helpers for 2-decimal text input |
| `src/tests/utils/TwoDecimalInput.test.ts` | Add focused checks for sanitize/parse/clamp/keydown behavior |

## Verification

1. `bunx eslint src/pages/finance/pages/receipt/create/components/CardInstallment.vue` — 0 errors
2. `bunx vitest src/tests/utils/TwoDecimalInput.test.ts --run` — pass
3. `bunx vue-tsc --noEmit` — clean
4. Manual: open receipt create page, select an overdue installment, enable ส่วนลดค่าปรับ,
   type a value — should format on blur, payload should contain numeric `discountPenaltyFee`
5. Manual: when discount exceeds penalty outstanding, value is clamped to outstanding
