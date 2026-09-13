/**
 * 2026-09-13 owner-filed task — official per-type printed permit forms. Generic, config-driven
 * building blocks shared by every permit type's printed form layout (`OfficialPermitFormLayout.vue`
 * and its `official-form/` block components render these; nothing in this file touches the DOM).
 *
 * Every block is a plain data shape, never a component reference — the point of this file is that
 * Hot Work / Working at Height / Confined Space can each describe their own paper form as DATA
 * (see `OfficialFormConfig.ts`) while sharing the same handful of renderers. `labelKey`/`titleKey`/
 * `textKey` are i18n keys resolved by the block component with `t()` — this file (and its builder)
 * stays free of any `vue-i18n` import so the config-building functions remain plain, unit-testable
 * functions with no Vue context required.
 *
 * The spec named four blocks explicitly (info-grid, checklist-grid, signature-line, footer-note).
 * Two more were added because the four named ones do not cover every shape on these forms:
 * `checkbox-row` (a plain or tri-state Yes/No/N-A checkbox list — the "type of work" row, the
 * Confined Space PPE list, the 11-item safety-measures list) and `worker-table` (Confined Space's
 * up-to-4-worker roster with per-worker health-check columns — a shape no other block fits). Both
 * are still generic/reusable rather than per-type, they simply have exactly one consumer today.
 */

/** A label/value pair for a bordered request-details grid (ส่วนที่ 1 style sections). */
export interface IOfficialFormField {
  /** i18n key, resolved by `OfficialFormInfoGrid.vue`. */
  labelKey: string
  /** `null` prints an empty line — never a placeholder like "-" or "N/A" (that would look filled). */
  value: string | number | null
}

export interface IOfficialFormInfoGridBlock {
  kind: 'info-grid'
  fields: IOfficialFormField[]
}

/** One row of a plain or tri-state checkbox list. `answer: null` prints every box empty. */
export interface IOfficialFormCheckboxItem {
  key: string
  labelKey: string
  answer: 'yes' | 'no' | 'na' | null
}

export interface IOfficialFormCheckboxRowBlock {
  kind: 'checkbox-row'
  /** 'single' renders one box per item (checked/unchecked); 'tri-state' renders Yes/No/N-A boxes. */
  mode: 'single' | 'tri-state'
  items: IOfficialFormCheckboxItem[]
}

/** One named column of a worker roster table (Confined Space's up-to-4-worker block). */
export interface IOfficialFormWorkerTableColumn {
  labelKey: string
}

export interface IOfficialFormWorkerTableBlock {
  kind: 'worker-table'
  columns: IOfficialFormWorkerTableColumn[]
  /** Each row has exactly `columns.length` cells, in the same order. `null` cells print blank. */
  rows: (string | null)[][]
  /** Number of additional blank rows to print so the table always shows its full fixed capacity. */
  blankRowCount: number
}

/**
 * A fixed checklist item repeated across N blank date columns (ส่วนที่ 2/3/4 of Hot Work/Height —
 * the three-stage pre/during/post-work check, each item checked on up to N separate site visits
 * under one permit). Every cell prints blank per ruling 1 — this block never carries an `answer`.
 */
export interface IOfficialFormChecklistItem {
  key: string
  labelKey: string
}

export interface IOfficialFormChecklistGridBlock {
  kind: 'checklist-grid'
  items: IOfficialFormChecklistItem[]
  dateColumns: number
}

/** A row of blank named signature lines (name / signature / date), always empty per ruling 1. */
export interface IOfficialFormSignatureLinesBlock {
  kind: 'signature-lines'
  roleLabelKeys: string[]
}

/** A static explanatory footer line (e.g. permit validity window), never permit-specific data. */
export interface IOfficialFormFooterNoteBlock {
  kind: 'footer-note'
  textKey: string
  params?: Record<string, string | number>
}

export type TOfficialFormBlock
  = | IOfficialFormInfoGridBlock
    | IOfficialFormCheckboxRowBlock
    | IOfficialFormWorkerTableBlock
    | IOfficialFormChecklistGridBlock
    | IOfficialFormSignatureLinesBlock
    | IOfficialFormFooterNoteBlock

export interface IOfficialFormSection {
  number: number
  titleKey: string
  blocks: TOfficialFormBlock[]
}

export interface IOfficialFormConfig {
  /** i18n key for the bilingual (Thai + English) form title, e.g. `permit.detail.print.official.hot.formTitle`. */
  formTitleKey: string
  permitNumber: string | null
  sections: IOfficialFormSection[]
}
