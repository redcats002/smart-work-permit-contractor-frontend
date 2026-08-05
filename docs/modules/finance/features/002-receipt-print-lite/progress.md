# FIN-002 Progress

## 2026-08-05 — Implementation complete

- Added `totalOutstandingDebt: number` to `IReceiptById` in `ReceiptRes.model.ts`
- Renamed `ReceiptPrint.vue` → `ReceiptPrintFull.vue`
- Created `ReceiptPrintLite.vue` with 3-column table (เลขที่สัญญา, รายละเอียด, ราคา) and ยอดหนี้คงเหลือ summary
- Created new `ReceiptPrint.vue` wrapper with isDev toggle (default: lite)
- Verification: eslint, vue-tsc, vitest passed
