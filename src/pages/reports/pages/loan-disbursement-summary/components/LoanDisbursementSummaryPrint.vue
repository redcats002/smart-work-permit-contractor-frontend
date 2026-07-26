<template>
  <BasePrintPage
    :page-count="totalPages || 1"
    title="รายงานสรุปการปล่อยสินเชื่อ">
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
            <th class="p-1.5 text-center text-[9px]">
              ลำดับ
            </th>
            <th class="p-1.5 text-left text-[9px]">
              สาขา
            </th>
            <th class="p-1.5 text-right text-[9px]">
              จำนวน
            </th>
            <th class="p-1.5 text-right text-[9px]">
              เงินต้น
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ดอกเบี้ย
            </th>
            <th class="p-1.5 text-right text-[9px]">
              เงินต้นรวมดอกเบี้ย
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ค่างวด
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in pages[page]"
            :key="`${item.branchName}-${i}`"
            class="border-b border-zinc-200">
            <td class="p-1.5 text-center">
              {{ startIndex(page) + i + 1 }}
            </td>
            <td class="p-1.5">
              {{ item.branchName }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.contractAmount) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.principal) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.interest) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.principalAndInterest) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.monthlyInstallment) }}
            </td>
          </tr>
        </tbody>
        <tfoot v-if="page === totalPages - 1">
          <tr class="bg-zinc-200 font-bold border-t-2 border-zinc-700">
            <td
              class="p-1.5"
              colspan="2">
              รวม {{ summary?.numberOfBranches || 0 }} สาขา
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary?.contractAmount || 0) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary?.principal || 0) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary?.interest || 0) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary?.principalAndInterest || 0) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary?.monthlyInstallment || 0) }}
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
import type {
  ILoanDisbursementSummaryList,
  ILoanDisbursementSummarySummary
} from '@/models/response/report/loan-disbursement-summary/LoanDisbursementSummaryRes.model'
import BasePrintPage from '@/components/base/BasePrintPage.vue'

interface IProps {
  items: ILoanDisbursementSummaryList[]
  summary?: ILoanDisbursementSummarySummary
}

const props = defineProps<IProps>()
const ROWS_PER_PAGE = 20

const totalPages = computed((): number => Math.ceil(props.items.length / ROWS_PER_PAGE))

const pages = computed((): ILoanDisbursementSummaryList[][] => {
  const result: ILoanDisbursementSummaryList[][] = []
  for (let i = 0; i < props.items.length; i += ROWS_PER_PAGE) {
    result.push(props.items.slice(i, i + ROWS_PER_PAGE))
  }
  return result
})

function startIndex (page: number): number {
  return page * ROWS_PER_PAGE
}
</script>

<style scoped></style>
