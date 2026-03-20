import type { IColumn, IFooter } from '@/models/Table.model'

/**
 * Full custom value function — receives the entire summary object.
 * Takes priority over `format`.
 */
export type TFooterValueFn<TSummary = Record<string, any>> = (summary: TSummary) => string

/**
 * Format callback applied to `summary[field]` when the column field key exists in summary.
 */
export type TFooterFormatFn = (value: any) => string

export interface IFooterColConfig<TSummary = Record<string, any>> {
  /**
   * Override the full cell value by deriving it from the whole summary.
   * Useful when summary key differs from column field, or needs custom text.
   * e.g. `(s) => \`รวม ${s.numberOfBranches} สาขา\``
   */
  value?: TFooterValueFn<TSummary> | string
  /**
   * Format the raw `summary[field]` value.
   * e.g. `formatter.numberFormat2Decimal`
   */
  format?: TFooterFormatFn
  colspan?: number
  footerClass?: string
  footerStyle?: string
}

/**
 * Generates an IFooter[] row from `columns` and `summary`, driven by per-field config.
 *
 * Resolution order per column:
 * 1. `config[field].value(summary)` — custom full override
 * 2. `config[field].format(summary[field])` — format auto-resolved value
 * 3. `String(summary[field])` — auto-resolve with no formatting
 * 4. `''` — column field not found in summary
 */
export const generateTableFooter = <TSummary extends Record<string, any>, TItem = any>(
  columns: IColumn<TItem>[],
  summary: TSummary | null | undefined,
  config: Partial<Record<keyof TItem | (string & {}), IFooterColConfig<TSummary>>> = {}
): IFooter[] => {
  if (!summary) return []

  return columns.map((col: IColumn): IFooter => {
    const field = String(col.field)
    const colConfig = config[field]

    let value: string
    if (colConfig?.value) {
      if (typeof colConfig.value === 'string') {
        value = colConfig.value
      } else {
        value = colConfig.value(summary)
      }
    } else if (field in summary) {
      const raw = summary[field as keyof TSummary]
      value = colConfig?.format ? colConfig.format(raw) : String(raw ?? '')
    } else {
      value = ''
    }

    const footer: IFooter = { colspan: colConfig?.colspan ?? 1, field, value }
    if (colConfig?.footerClass) footer.footerClass = colConfig.footerClass
    if (colConfig?.footerStyle) footer.footerStyle = colConfig.footerStyle
    return footer
  })
}
