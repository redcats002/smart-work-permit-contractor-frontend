# CON-001: Print pages layout default

## Goal

Change `PreContractPrintPage.vue` and `ContractPrintPage.vue` to use default layout
instead of blank layout, and display like `ReceiptPrintPage.vue` — with PageTitle,
BackButton, PrintButton, and proper `@media print` CSS that hides chrome and shows
only the print area.

## Current state

Both print pages (`PreContractPrintPage.vue`, `ContractPrintPage.vue`):
- Use `layout: 'blank'` in router meta (no sidebar/header)
- Render a fixed-position floating print button
- Call `window.print()` on mount (auto-prints immediately)
- Use `A4Paper` component for the document

`ReceiptPrintPage.vue` (the reference):
- Uses default layout (sidebar + header visible)
- Shows `PageTitle`, `BackButton`, `PrintButton` inside a `BasePage`
- Wraps content in a `section` with `id="print-area"`
- Has `@media print` CSS that hides everything except `#print-area`

## Changes

### 1. Router meta (`src/router/modules/contract/index.ts`)

- **ContractPrintPage** (line 71): change `layout: 'blank'` → remove `layout` key (defaults to `'default'`)
- **PreContractPrintPage** (line 80): same change

### 2. ContractPrintPage.vue

Rewrite template to match `ReceiptPrintPage.vue`:
- Wrap in `<section id="contract-print-page">`
- Add `<PageTitle class="no-print" />`
- Add `<BasePage>` with BackButton + PrintButton in a flex row
- Replace `A4Paper` with just the `LoanAgreementDocument` inside `#print-area`
- Remove auto-print from `onMounted` (keep fetch only)
- Add `<style>` block with `@media print` CSS (copy from ReceiptPrintPage.vue, change `#receipt-print-page` → `#contract-print-page`)
- Remove unused imports: `Icon`, `Button`
- Add needed imports: `BasePage`, `BackButton`, `PrintButton`, `PageTitle`

### 3. PreContractPrintPage.vue

Same template restructure as ContractPrintPage.vue:
- Wrap in `<section id="pre-contract-print-page">`
- Add PageTitle, BasePage, BackButton, PrintButton
- Replace `A4Paper` with just the document inside `#print-area`
- Remove auto-print from `onMounted`
- Add `@media print` CSS
- Remove `Icon`, `Button`; add `BasePage`, `BackButton`, `PrintButton`, `PageTitle`

### 4. Check A4Paper usage

If `A4Paper` was only used to provide print-specific sizing, check if the
`@media print` CSS + `#print-area` approach replaces it. If `A4Paper` provides
actual content structure (margins, page-break hints), keep it inside `#print-area`.

## Files to change

| File | Change |
|---|---|
| `src/router/modules/contract/index.ts` | Remove `layout: 'blank'` from both print routes |
| `src/pages/contract/pages/print/pages/ContractPrintPage.vue` | Restructure to match ReceiptPrintPage pattern |
| `src/pages/contract/pages/pre-contract-print/pages/PreContractPrintPage.vue` | Same restructure |

## Reference

`src/pages/finance/pages/receipt/detail/pages/ReceiptPrintPage.vue` — the target pattern.

## Verification

1. Navigate to `/contract/print/:id` — should show default layout with sidebar/header
2. Navigate to `/contract/pre-contract/print/:id` — same
3. Click Print button — should print only the document area
4. `bunx eslint src/pages/contract/pages/print/pages/ContractPrintPage.vue src/pages/contract/pages/pre-contract-print/pages/PreContractPrintPage.vue src/router/modules/contract/index.ts` — 0 errors
5. `bunx vue-tsc --noEmit` — clean
