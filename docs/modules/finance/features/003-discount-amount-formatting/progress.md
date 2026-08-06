# FIN-003 Progress

## 2026-08-06 — Implementation complete

- Replaced direct per-field decimal handlers in `CardInstallment.vue` with reusable 2-decimal input utilities.
- Added `src/utils/TwoDecimalInput.ts` for:
  - sanitizing decimal input text
  - parsing to numeric value
  - clamping by max value
  - formatting with 2 decimals
  - keydown allowlist validation
- Updated `discountAmount` input to enforce max value `props.data.penaltyFee.outstanding`.
- Rewired both `customAmount` and `discountAmount` to use one shared handler factory in the component.
- Added `src/tests/utils/TwoDecimalInput.test.ts` to cover sanitize, parse, clamp, and decimal keydown rules.
