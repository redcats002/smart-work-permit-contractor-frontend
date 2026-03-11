import { formatter } from '@/utils/Formatter'
import type { IBaseOption } from '@/models/Global.model'

export enum EDay {
  SUN = 'Sun',
  MON = 'Mon',
  TUE = 'Tue',
  WED = 'Wed',
  THU = 'Thu',
  FRI = 'Fri',
  SAT = 'Sat'
}
export enum EDays {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}
export enum EMonths {
  JANUARY = 'JANUARY',
  FEBRUARY = 'FEBRUARY',
  MARCH = 'MARCH',
  APRIL = 'APRIL',
  MAY = 'MAY',
  JUNE = 'JUNE',
  JULY = 'JULY',
  AUGUST = 'AUGUST',
  SEPTEMBER = 'SEPTEMBER',
  OCTOBER = 'OCTOBER',
  NOVEMBER = 'NOVEMBER',
  DECEMBER = 'DECEMBER'
}
export enum EMonthsCapitalize {
  January = 'January',
  February = 'February',
  March = 'March',
  April = 'April',
  May = 'May',
  June = 'June',
  July = 'July',
  August = 'August',
  September = 'September',
  October = 'October',
  November = 'November',
  December = 'December'
}

export enum EDateUnit {
  DAY = 'DAY',
  MONTH = 'MONTH',
  YEAR = 'YEAR'
}

export type TDay = keyof typeof EDay | undefined
export type TDays = keyof typeof EDays | undefined
export type TMonths = keyof typeof EMonths | undefined
export type TMonthsCapitalize = keyof typeof EMonthsCapitalize | undefined
export type TDateUnit = keyof typeof EDateUnit | undefined

export function formatDayToThai (day: TDays, abb?: boolean): string {
  switch (day) {
    case 'SUNDAY':
      return abb ? 'อา' : 'อาทิตย์'
    case 'MONDAY':
      return abb ? 'จ' : 'จันทร์'
    case 'TUESDAY':
      return abb ? 'อ' : 'อังคาร'
    case 'WEDNESDAY':
      return abb ? 'พ' : 'พุธ'
    case 'THURSDAY':
      return abb ? 'พฤ' : 'พฤหัสบดี'
    case 'FRIDAY':
      return abb ? 'ศ' : 'ศุกร์'
    case 'SATURDAY':
      return abb ? 'ส' : 'เสาร์'
    default:
      return 'ไม่พบข้อมูล'
  }
}

export const daysItems: IBaseOption[] = Object.values(EDays).map(
  (e: TDays): IBaseOption => ({
    label: formatter.stringFormatSnakeToTitleCase(e || '').slice(0, 3),
    value: e
  })
)
export const monthsItems: IBaseOption[] = Object.values(EMonths).map(
  (e: TMonths, i: number): IBaseOption => ({
    label: formatter.stringFormatSnakeToTitleCase(e || '').slice(0, 3),
    value: `${i + 1}`,
    alt: e
  })
)

export const monthsCapitalizeItems: IBaseOption[] = Object.values(EMonthsCapitalize).map(
  (e: TMonthsCapitalize, i: number): IBaseOption => ({
    label: formatter.stringFormatSnakeToTitleCase(e || '').slice(0, 3),
    value: `${i + 1}`,
    alt: e
  })
)
export const dateUnitItems: IBaseOption[] = Object.values(EDateUnit).map(
  (e: TDateUnit, i: number): IBaseOption => ({
    label: formatter.stringFormatSnakeToTitleCase(e || '').slice(0, 3),
    value: `${i + 1}`
  })
)
