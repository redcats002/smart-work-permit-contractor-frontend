import type { TBaseOption } from '@/models/Global.model'

export enum ReportTypeEnum {
  RECEIVE_REFUND = 'RECEIVE_REFUND',
  INCREASE_PAYMENT = 'INCREASE_PAYMENT',
  FUND_IN_FUND_OUT = 'FUND_IN_FUND_OUT'
}

export type TReportType = keyof typeof ReportTypeEnum

const titleMap: Record<TReportType, string> = {
  [ReportTypeEnum.RECEIVE_REFUND]: 'รับทุน-คืนทุน',
  [ReportTypeEnum.INCREASE_PAYMENT]: 'เพิ่มทุน-ชำระทุน',
  [ReportTypeEnum.FUND_IN_FUND_OUT]: 'รับทุน-จ่ายทุน (ศูนย์การเงิน)'
}

export const ReportTypeItems: TBaseOption[] = Object.values(ReportTypeEnum).filter(Boolean).map(
  (e: TReportType): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TReportType): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export const REPORT_TYPE_COL1_TYPES: Record<TReportType, string[]> = {
  [ReportTypeEnum.RECEIVE_REFUND]: ['CAPITAL_RECEIVE'],
  [ReportTypeEnum.INCREASE_PAYMENT]: ['CAPITAL_INCREASE'],
  [ReportTypeEnum.FUND_IN_FUND_OUT]: ['FUND_IN']
}

export const REPORT_TYPE_COL2_TYPES: Record<TReportType, string[]> = {
  [ReportTypeEnum.RECEIVE_REFUND]: ['CAPITAL_REFUND'],
  [ReportTypeEnum.INCREASE_PAYMENT]: ['CAPITAL_PAYMENT'],
  [ReportTypeEnum.FUND_IN_FUND_OUT]: ['FUND_OUT']
}

export const REPORT_TYPE_COL1_LABEL: Record<TReportType, string> = {
  [ReportTypeEnum.RECEIVE_REFUND]: 'รับทุน',
  [ReportTypeEnum.INCREASE_PAYMENT]: 'เพิ่มทุน',
  [ReportTypeEnum.FUND_IN_FUND_OUT]: 'รับทุน'
}

export const REPORT_TYPE_COL2_LABEL: Record<TReportType, string> = {
  [ReportTypeEnum.RECEIVE_REFUND]: 'คืนทุน',
  [ReportTypeEnum.INCREASE_PAYMENT]: 'ชำระทุน',
  [ReportTypeEnum.FUND_IN_FUND_OUT]: 'จ่ายทุน'
}

export const REPORT_TYPE_COL1_FOOTER_LABEL: Record<TReportType, string> = {
  [ReportTypeEnum.RECEIVE_REFUND]: 'ยอดรับทุนทั้งหมด',
  [ReportTypeEnum.INCREASE_PAYMENT]: 'ยอดเพิ่มทุนทั้งหมด',
  [ReportTypeEnum.FUND_IN_FUND_OUT]: 'ยอดรับทุนทั้งหมด'
}

export const REPORT_TYPE_COL2_FOOTER_LABEL: Record<TReportType, string> = {
  [ReportTypeEnum.RECEIVE_REFUND]: 'ยอดคืนทุนทั้งหมด',
  [ReportTypeEnum.INCREASE_PAYMENT]: 'ยอดชำระทุนทั้งหมด',
  [ReportTypeEnum.FUND_IN_FUND_OUT]: 'ยอดคืนทุนทั้งหมด'
}
