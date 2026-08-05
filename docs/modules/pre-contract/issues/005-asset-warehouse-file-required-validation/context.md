# PRE-005 — Require uploaded files for every make-contract asset

**Type:** bug · **Status:** not-started · **Module:** [pre-contract](../../context.md)

Require at least one uploaded file for each `preAssets[i]` row in
`src/pages/contract/pages/pre-contract-detail/components/make-contract/AssetWarehouseForm.vue`
before the user can confirm pre-make-contract.

## Why this exists

Today the form does **not** reliably enforce `preAssets[i].files`:

- `PreAssetWarehouseSchema` currently uses `files: z.array(schema.media).optional().default([])`,
  so an empty file list passes schema validation.
- `AssetWarehouseForm.vue` binds the whole `preAssets` array into `<Form :initial-values="preAssets">`
  but uses `zodResolver(PreAssetWarehouseSchema)` (single-item schema), not the list schema.
- The file field is labeled with `name="files"` instead of an indexed path such as
  ``${i}.files``, so any form error cannot target the failing asset row cleanly.

`locationId` already has a manual whole-list validation pass. `files` should reach the same
product expectation: no asset can proceed without the required attachment.

## Flow

1. `useInitDetail.ts` seeds `formMakeContract.preAssets` from `contract.preAssets`.
2. `PreContractDetailPage.vue` triggers `assetSectionRef.submit()` during
   `onTriggerPreMakeContract()`.
3. `AssetSection.vue` forwards to `AssetWarehouseForm.submit()`.
4. `AssetWarehouseForm.vue` validates, then `useMakeContract.ts` uploads `e.files`.

Because `useMakeContract.ts` already serializes `files || []`, this is a frontend validation
bug, not a payload-shaping bug.

## Lazy implementation boundary

Do the smallest fix that makes the field truly required:

1. Make `files` fail on empty arrays.
2. Validate against the list shape actually passed into the form.
3. Use the indexed field path for the file row so the failing asset is addressable.
4. Preserve the current tabbed asset UI and existing `locationId` behavior unless removing the
   manual validation falls out naturally in the same diff.

Do **not** refactor the entire make-contract flow, rewrite `UploadInput`, or move this form to a
different ownership model.

## Likely minimal path

- `make-contract.schema.ts`
  - Change `files` to `z.array(schema.media).min(1, 'กรุณาแนบเอกสารหลักทรัพย์อย่างน้อย 1 ไฟล์')`
  - Keep `locationId` required.
- `AssetWarehouseForm.vue`
  - Switch resolver to `PreAssetWarehouseListSchema`
  - Change file field name from `"files"` to ``${i}.files``
  - Pass the indexed name through to `UploadInput`
  - Use the `LabelField` slot's `invalid` state to show the upload area as invalid, or otherwise
    provide a visible invalid state without changing the component contract broadly

## Validation target

The bug is fixed only when:

- submitting with any empty `preAssets[i].files` blocks confirmation
- the error points at the correct asset row
- uploading a file clears the failing state for that asset
- existing populated files from `useInitDetail.ts` still count as valid
