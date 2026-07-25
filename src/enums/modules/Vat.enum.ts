import type { TBaseOption } from '@/models/Global.model'

export enum EVatType {
  VAT = 'VAT',
  NON_VAT = 'NON_VAT'
}

export type TVatType = keyof typeof EVatType

const titleMap: Record <TVatType, string> = {
  [EVatType.VAT]: 'VAT',
  [EVatType.NON_VAT]: 'Non VAT'
}

export const VatTypeItems: TBaseOption[] = Object.values(EVatType).filter(Boolean).map(
  (e: TVatType): TBaseOption => ({
    label: formatTitle(e),
    value: e as string
  })
)

export function formatTitle (title?: TVatType, eng?: boolean): string {
  if (!title) return ''
  if (eng) return title
  return titleMap[title] || ''
}
