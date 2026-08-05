# FIN-002: Receipt Print Lite Version

## Goal

Add a "lite" version of the receipt print page that shows a simplified table and summary,
while keeping the original as "full" version. Default is lite; full is accessible only on
localhost via a dev-mode toggle.

## Objectives

1. **Table columns (lite):** Keep only 3 columns:
   - เลขที่สัญญา (contract idNo)
   - รายละเอียด (was "งวดที่") — each row prefixed with "งวดที่ {order}"
   - ราคา (was "รวม") — totalInstallment per row

2. **Summary section (lite):** Remove ยอดเงินต้น, ดอกเบี้ย, ค่าปรับ. Replace with single
   ยอดหนี้คงเหลือ using `totalOutstandingDebt` from API response.

3. **Model change:** Add `totalOutstandingDebt: number` to `IReceiptById`.

4. **Version switching:**
   - `ReceiptPrint.vue` becomes a wrapper component
   - Defaults to `ReceiptPrintLite.vue`
   - On localhost (`isDev`), shows toggle buttons to switch between lite/full
   - `ReceiptPrintFull.vue` = original content (unchanged)

## Files

| File | Action |
|---|---|
| `src/models/response/receipt/ReceiptRes.model.ts` | Add `totalOutstandingDebt: number` to `IReceiptById` |
| `src/pages/.../components/ReceiptPrint.vue` | Rename to `ReceiptPrintFull.vue` |
| `src/pages/.../components/ReceiptPrintLite.vue` | New — lite table + summary |
| `src/pages/.../components/ReceiptPrint.vue` | New — wrapper with isDev toggle |

## API change

`GET /api/v1/management/receipt/:id` response must include:
```ts
totalOutstandingDebt: number
```

## Verification

1. `bunx eslint` on touched files — 0 errors
2. `bunx vue-tsc --noEmit` — clean
3. `bunx vitest run` — all tests pass
