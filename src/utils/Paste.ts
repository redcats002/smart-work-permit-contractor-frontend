export interface IPaste {
  number(e: ClipboardEvent): string
}

function number (e: ClipboardEvent): string {
  const clipboardText: string = e.clipboardData?.getData('text') || ''

  if (!clipboardText) return ''

  // 1. Try normal numeric parsing (with commas)
  const cleaned = clipboardText.replaceAll(',', '')
  const directNumber = Number(cleaned)

  if (!Number.isNaN(directNumber) && cleaned) return `${directNumber}`

  // 2. Try parsing as URL (extract port)
  try {
    const url = new URL(clipboardText)
    if (url.port) return `${String(url.port)}`
  } catch {
    // not a valid URL → ignore
  }

  // 3. Fallback: extract first number from string
  const match = clipboardText.match(/\d+/)

  if (match) {
    return `${String(match[0])}`
  }

  return ''
}

const paste: IPaste = {
  number
}

export default paste
