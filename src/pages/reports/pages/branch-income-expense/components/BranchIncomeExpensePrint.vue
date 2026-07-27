<template>
  <BasePrintPage
    :page-count="totalPages || 1"
    :title="title">
    <template #default="{ page }">
      <div
        v-if="!items.length"
        class="text-center py-16 text-zinc-500">
        ไม่มีข้อมูล
      </div>
      <table
        v-else
        class="w-full border-collapse border border-zinc-300 rounded-sm overflow-hidden">
        <thead>
          <tr class="bg-zinc-700 text-white">
            <th class="p-1.5 text-left text-[9px]">
              วันที่
            </th>
            <th class="p-1.5 text-left text-[9px]">
              รหัสการชำระ
            </th>
            <th
              v-if="!isReceiveRefund"
              class="p-1.5 text-left text-[9px]">
              สาขา
            </th>
            <th
              v-if="showCol1"
              class="p-1.5 text-right text-[9px]">
              {{ col1Label }}
            </th>
            <th
              v-if="showCol2"
              class="p-1.5 text-right text-[9px]">
              {{ col2Label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in pages[page]"
            :key="`${item.code}-${i}`"
            class="border-b border-zinc-200">
            <td class="p-1.5">
              {{ dayjs.formatDate(item.date) }}
            </td>
            <td class="p-1.5">
              {{ item.code }}
            </td>
            <td
              v-if="!isReceiveRefund"
              class="p-1.5">
              {{ item.referBranchName }}
            </td>
            <td
              v-if="showCol1"
              class="p-1.5 text-right">
              {{ col1Types.includes(item.type) ? formatter.numberFormat2Decimal(item.amount) : '-' }}
            </td>
            <td
              v-if="showCol2"
              class="p-1.5 text-right">
              {{ col2Types.includes(item.type) ? formatter.numberFormat2Decimal(item.amount) : '-' }}
            </td>
          </tr>
        </tbody>
        <tfoot v-if="page === totalPages - 1">
          <tr class="bg-zinc-200 font-bold border-t-2 border-zinc-700">
            <td
              :colspan="isReceiveRefund ? 2 : 3"
              class="p-1.5">
              &nbsp;
            </td>
            <td
              v-if="showCol1"
              class="p-1.5 text-right">
              {{ col1FooterLabel }} {{ formatter.numberFormat2Decimal(totalCol1) }}
            </td>
            <td
              v-if="showCol2"
              class="p-1.5 text-right">
              {{ col2FooterLabel }} {{ formatter.numberFormat2Decimal(totalCol2) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </template>
  </BasePrintPage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { TBranchIncomeExpenseCategoryFilter } from '@/models/modules/report/branch-income-expense/Filter.model'
import type { IBranchIncomeExpenseItem } from '@/models/response/report/branch-income-expense/BranchIncomeExpenseRes.model'
import {
  formatTitle,
  REPORT_TYPE_COL1_FOOTER_LABEL,
  REPORT_TYPE_COL1_LABEL,
  REPORT_TYPE_COL1_TYPES,
  REPORT_TYPE_COL2_FOOTER_LABEL,
  REPORT_TYPE_COL2_LABEL,
  REPORT_TYPE_COL2_TYPES,
  ReportTypeEnum,
  type TReportType
} from '@/enums/modules/report/branch-income-expense/ReportType.enum'
import BasePrintPage from '@/components/base/BasePrintPage.vue'

interface IProps {
  items: IBranchIncomeExpenseItem[]
  reportType?: TReportType
  financeCategory?: TBranchIncomeExpenseCategoryFilter
}

const props = withDefaults(defineProps<IProps>(), {
  reportType: ReportTypeEnum.RECEIVE_REFUND,
  financeCategory: 'OVERALL'
})
const ROWS_PER_PAGE = 20

const dayjs = useDayjs()

const activeReportType = computed((): TReportType => props.reportType || ReportTypeEnum.RECEIVE_REFUND)
const isReceiveRefund = computed((): boolean => activeReportType.value === ReportTypeEnum.RECEIVE_REFUND)
const showCol1 = computed((): boolean => props.financeCategory !== 'COL2')
const showCol2 = computed((): boolean => props.financeCategory !== 'COL1')
const col1Types = computed((): string[] => REPORT_TYPE_COL1_TYPES[activeReportType.value] || [])
const col2Types = computed((): string[] => REPORT_TYPE_COL2_TYPES[activeReportType.value] || [])
const col1Label = computed((): string => REPORT_TYPE_COL1_LABEL[activeReportType.value])
const col2Label = computed((): string => REPORT_TYPE_COL2_LABEL[activeReportType.value])

const financeCategoryLabel = computed((): string => {
  if (props.financeCategory === 'COL1') return col1Label.value
  if (props.financeCategory === 'COL2') return col2Label.value
  return 'สรุปรวม'
})

const title = computed((): string =>
  `รายงานการรับ/จ่ายประจำสาขา (${formatTitle(activeReportType.value)} - ${financeCategoryLabel.value})`)
const col1FooterLabel = computed((): string => REPORT_TYPE_COL1_FOOTER_LABEL[activeReportType.value])
const col2FooterLabel = computed((): string => REPORT_TYPE_COL2_FOOTER_LABEL[activeReportType.value])

const totalCol1 = computed((): number =>
  props.items
    .filter((i: IBranchIncomeExpenseItem): boolean => col1Types.value.includes(i.type))
    .reduce((sum: number, i: IBranchIncomeExpenseItem): number => sum + (i.amount || 0), 0)
)

const totalCol2 = computed((): number =>
  props.items
    .filter((i: IBranchIncomeExpenseItem): boolean => col2Types.value.includes(i.type))
    .reduce((sum: number, i: IBranchIncomeExpenseItem): number => sum + (i.amount || 0), 0)
)

const totalPages = computed((): number => Math.ceil(props.items.length / ROWS_PER_PAGE))

const pages = computed((): IBranchIncomeExpenseItem[][] => {
  const result: IBranchIncomeExpenseItem[][] = []
  for (let i = 0; i < props.items.length; i += ROWS_PER_PAGE) {
    result.push(props.items.slice(i, i + ROWS_PER_PAGE))
  }
  return result
})
</script>

<style scoped></style>
