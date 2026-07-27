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
              สาขา
            </th>
            <th
              v-if="showIncome"
              class="p-1.5 text-right text-[9px]">
              รายรับ
            </th>
            <th
              v-if="showPrincipal"
              class="p-1.5 text-right text-[9px]">
              ปล่อยสินเชื่อ
            </th>
            <th
              v-if="showExpenses"
              class="p-1.5 text-right text-[9px]">
              รายจ่าย
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in pages[page]"
            :key="`${item.branchName}-${i}`"
            class="border-b border-zinc-200">
            <td class="p-1.5">
              {{ item.branchName }}
            </td>
            <td
              v-if="showIncome"
              class="p-1.5 text-right">
              {{ item.income ? formatter.numberFormat2Decimal(item.income) : '-' }}
            </td>
            <td
              v-if="showPrincipal"
              class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.principal) }}
            </td>
            <td
              v-if="showExpenses"
              class="p-1.5 text-right">
              {{ item.expenses ? formatter.numberFormat2Decimal(item.expenses) : '-' }}
            </td>
          </tr>
        </tbody>
        <tfoot v-if="page === totalPages - 1">
          <tr class="bg-zinc-200 font-bold border-t-2 border-zinc-700">
            <td class="p-1.5">
              รวมทั้งสิ้น
            </td>
            <td
              v-if="showIncome"
              class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary?.income || 0) }}
            </td>
            <td
              v-if="showPrincipal"
              class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary?.principal || 0) }}
            </td>
            <td
              v-if="showExpenses"
              class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary?.expenses || 0) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </template>
  </BasePrintPage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IFinancialSummaryReportList, IFinancialSummaryReportSummary } from '@/models/response/report/financial-summary/FinancialSummaryRes.model'
import {
  FinancialSummaryTypeEnum,
  formatFinancialSummaryType,
  type TFinancialSummaryType
} from '@/enums/modules/report/financial-summary/FinancialSummaryType.enum'
import BasePrintPage from '@/components/base/BasePrintPage.vue'

interface IProps {
  items: IFinancialSummaryReportList[]
  summary?: IFinancialSummaryReportSummary
  type?: TFinancialSummaryType
}

const props = withDefaults(defineProps<IProps>(), {
  summary: undefined,
  type: FinancialSummaryTypeEnum.SUMMARY
})
const ROWS_PER_PAGE = 20

const title = computed((): string => {
  return `รายงานสรุปรับ / ปล่อยสินเชื่อ / ค่าใช้จ่าย (${formatFinancialSummaryType(props.type)})`
})
const showIncome = computed((): boolean => props.type === FinancialSummaryTypeEnum.SUMMARY || props.type === FinancialSummaryTypeEnum.INCOME)
const showPrincipal = computed((): boolean => props.type === FinancialSummaryTypeEnum.SUMMARY || props.type === FinancialSummaryTypeEnum.PRINCIPAL)
const showExpenses = computed((): boolean => props.type === FinancialSummaryTypeEnum.SUMMARY || props.type === FinancialSummaryTypeEnum.EXPENSES)

const totalPages = computed((): number => Math.ceil(props.items.length / ROWS_PER_PAGE))

const pages = computed((): IFinancialSummaryReportList[][] => {
  const result: IFinancialSummaryReportList[][] = []
  for (let i = 0; i < props.items.length; i += ROWS_PER_PAGE) {
    result.push(props.items.slice(i, i + ROWS_PER_PAGE))
  }
  return result
})
</script>

<style scoped></style>
