import type { TBaseOption } from '@/models/Global.model'

export enum ETitleName {
  MR = 'MR',
  MS = 'MS',
  MRS = 'MRS'
}

export type TTitleName = keyof typeof ETitleName

const titleMap: Record <TTitleName, string> = {
  [ETitleName.MR]: 'นาย',
  [ETitleName.MS]: 'นางสาว',
  [ETitleName.MRS]: 'นาง'
}

export const TitleNameItems: TBaseOption[] = Object.values(ETitleName).map(
  (e: TTitleName): TBaseOption => ({
    title: formatTitle(e),
    value: e as string
  })
)

export function formatTitle (title?: TTitleName): string {
  if (!title) return ''
  return titleMap[title] || ''
}
