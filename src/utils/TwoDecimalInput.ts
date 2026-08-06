import { formatter } from '@/utils/Formatter'

export interface ITwoDecimalInputResult {
  raw: string
  value: number
}

export function sanitizeTwoDecimalRaw (input: string): string {
  let raw = input.replace(/[^0-9.]/g, '')
  const parts = raw.split('.')
  if (parts.length > 2) raw = `${parts[0]}.${parts.slice(1).join('')}`
  return raw
}

export function clampMaxValue (value: number, max?: number): number {
  if (typeof max !== 'number') return value
  return Math.min(value, max)
}

export function parseTwoDecimalInput (input: string, max?: number): ITwoDecimalInputResult {
  const sanitized = sanitizeTwoDecimalRaw(input)
  const parsed = parseFloat(sanitized) || 0
  const value = clampMaxValue(parsed, max)
  const raw = value < parsed ? String(value) : sanitized
  return { raw, value }
}

export function formatTwoDecimalDisplay (value: number): string {
  return formatter.numberFormat2Decimal(value)
}

export function toTwoDecimalEditableValue (value: number): string {
  return value != null && !isNaN(value) ? String(value) : ''
}

export function isAllowedTwoDecimalKeydown (event: KeyboardEvent): boolean {
  if (event.key === 'Enter') return true
  const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End']
  if (allowed.includes(event.key)) return true
  if (event.key === '.') return !(event.target as HTMLInputElement).value.includes('.')
  return (/^[0-9]$/).test(event.key)
}
