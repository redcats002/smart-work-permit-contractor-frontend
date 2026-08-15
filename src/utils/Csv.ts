/**
 * Minimal CSV (RFC 4180-ish) serializer + Blob download — deliberately no external
 * dependency (docs/modules/history/feature_list.json HST-003 forbids one).
 *
 * Used by the history module's CSV export (HST-003) to turn the active filtered
 * result set into a downloadable file, independent of the current page.
 */

/**
 * Escapes a single CSV field. A field is wrapped in double quotes only when it
 * contains a comma, a double quote, or a newline — embedded double quotes are
 * doubled per RFC 4180 §2.5/2.7. `null`/`undefined` become an empty field.
 */
export function csvEscapeField (value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value)
  if ((/[",\n\r]/).test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/** Serializes rows of already-stringified cells into a CSV body (CRLF line endings). */
export function toCsv (rows: string[][]): string {
  return rows.map((row: string[]): string => row.map(csvEscapeField).join(',')).join('\r\n')
}

/**
 * UTF-8 BOM — without it Excel guesses a non-UTF-8 codepage and renders Thai
 * characters as mojibake. Prepending this single character fixes that in Excel,
 * Numbers, and Google Sheets alike.
 */
const UTF8_BOM = String.fromCharCode(0xfeff)

/** Triggers a browser download of `csvContent` as a UTF-8-with-BOM `.csv` file named `filename`. */
export function downloadCsv (filename: string, csvContent: string): void {
  const blob = new Blob([UTF8_BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
