import type { TBaseOption } from '@/models/Global.model'
import { formatter } from '@/utils/Formatter'

export enum ETitleName {
  '' = '',
  'MR' = 'MR',
  'MS' = 'MS',
  'MRS' = 'MRS'
}

export type TTitleName = keyof typeof ETitleName

const titleMap: Record <TTitleName, string> = {
  '': '',
  [ETitleName.MR]: 'นาย',
  [ETitleName.MS]: 'นางสาว',
  [ETitleName.MRS]: 'นาง'
}

export const TitleNameItems: TBaseOption[] = Object.values(ETitleName).filter(Boolean).map(
  (e: TTitleName): TBaseOption => ({
    label: formatTitle(e),
    value: e as string
  })
)

export function formatTitle (title?: TTitleName, eng?: boolean): string {
  if (!title) return ''
  if (eng) return formatter.stringFormatSnakeToTitleCase(title)
  return titleMap[title] || ''
}
