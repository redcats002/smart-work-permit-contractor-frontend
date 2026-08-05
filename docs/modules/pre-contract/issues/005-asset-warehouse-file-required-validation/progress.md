# PRE-005 — Progress Log

## 2026-08-05

**Status:** not-started — ticket and handoff written, ready for a lower-model implementation pass.

### What's done

- [x] Traced the failing path from `PreContractDetailPage.vue` → `AssetSection.vue` →
      `AssetWarehouseForm.vue` → `make-contract.schema.ts`.
- [x] Confirmed the current schema allows empty files (`optional().default([])`).
- [x] Confirmed the form is bound to an array model but uses a single-item resolver.
- [x] Confirmed the file field uses non-indexed `name="files"`, which is too weak for
      per-asset validation targeting.
- [x] Wrote the implementation ticket at [tickets/PRE-005.md](tickets/PRE-005.md).

### Recommended next step

Implement [PRE-005](tickets/PRE-005.md) with the smallest diff:

1. make `files` required in the schema
2. validate the list shape, not one row
3. wire the indexed field path into the upload row
4. leave `locationId` logic alone unless the fix becomes simpler by removing duplication

### Lower-model handoff

- Start with `docs/modules/pre-contract/context.md`, then this folder's `context.md`.
- Read only:
  - `src/pages/contract/pages/pre-contract-detail/components/make-contract/AssetWarehouseForm.vue`
  - `src/pages/contract/pages/pre-contract-detail/schema/make-contract.schema.ts`
  - `src/components/input/UploadInput.vue`
  - `src/components/input/LabelField.vue`
- Prefer schema + field-path fixes over new abstractions.
- Leave one runnable check behind: a small schema test is enough if it proves empty files fail and
  populated files pass.

### Pending

- Implementation
- Verification evidence

## 2026-08-05 (implementation)

**Status:** done

### Tasks completed

1. **Tighten schema for `files` field** — Changed from `z.array(schema.media).optional().default([])` to `z.array(schema.media).min(1, 'กรุณาแนบเอกสารหลักทรัพย์อย่างน้อย 1 ไฟล์')` in `make-contract.schema.ts`

2. **Use list schema in resolver** — Updated `AssetWarehouseForm.vue` to import and use `PreAssetWarehouseListSchema` instead of `PreAssetWarehouseSchema` for the zodResolver, since the form's `initial-values` are the whole array

3. **Wire indexed field path** — Changed file field name from `"files"` to ``${i}.files`` in `LabelField`, enabling per-asset error targeting

4. **Show invalid state** — Used the `invalid` slot value from `LabelField` to dynamically apply red border and background to the `UploadInput` when validation fails

5. **Add schema test** — Created `src/tests/schema/make-contract.schema.test.ts` with 6 focused assertions:
   - empty `files` array fails validation
   - non-empty `files` array passes
   - `locationId` remains required
   - list validation blocks on first asset with empty files
   - list accepts all assets with files
   - preloaded files from API (without isNew) pass validation

### Verification

- `bunx vitest src/tests/schema/make-contract.schema.test.ts --run` — 6 tests passed
- `bunx eslint src/pages/contract/pages/pre-contract-detail/components/make-contract/AssetWarehouseForm.vue src/pages/contract/pages/pre-contract-detail/schema/make-contract.schema.ts src/tests/schema/make-contract.schema.test.ts` — 0 errors
- `bunx vue-tsc --noEmit` — no errors

### Files modified

- `src/pages/contract/pages/pre-contract-detail/schema/make-contract.schema.ts` (schema only)
- `src/pages/contract/pages/pre-contract-detail/components/make-contract/AssetWarehouseForm.vue` (resolver import, field name, invalid state styling)
- `src/tests/schema/make-contract.schema.test.ts` (new test file)

## 2026-08-05 (manual validation fix)

**Status:** in-progress → done

### Issue found

The `manualValidateLocation()` function only validated `locationId` but didn't validate `files` according to schema. This allowed empty files to pass the form submission check, bypassing the schema's `.min(1)` requirement.

### Fix applied

Updated `manualValidateLocation()` to validate both `files` and `locationId`:

- Check: `if (!asset.files || asset.files.length === 0)` — reject empty files
- Push error: `{ code: 'custom', path: \`${index}.files\`, message: 'Thai message' }`
- Both validations now run before returning true/false
- Error messages remain per-asset indexed for correct targeting

### Files modified

- `src/pages/contract/pages/pre-contract-detail/components/make-contract/AssetWarehouseForm.vue` (manualValidateLocation function updated)

## 2026-08-05 (scroll-to-error enhancement)

**Status:** done

### Enhancement added

Added `scrollToFirstError(errors.value)` call in `manualValidateLocation()` when validation fails. This ensures the form scrolls to the first error field (either files or locationId) for better UX, so users see the failing field immediately instead of needing to scroll manually.

### Change

```ts
if (errors.value.length) {
  scrollToFirstError(errors.value)  // scroll to first error
  errors.value.forEach((error: Record<string, any>): void => {
    toast.error(error.message)
  })
  return false
}
```

### Verification

- `bunx vitest src/tests/schema/make-contract.schema.test.ts --run` — 6 tests pass
- `bunx eslint` — 0 errors on AssetWarehouseForm.vue
