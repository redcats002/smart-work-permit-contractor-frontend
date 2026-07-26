<template>
  <BasePrintPage
    :page-count="totalPages || 1"
    title="รายงานสรุปประจำวันรวมทุกสาขา">
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
            <th class="p-1.5 text-right text-[9px]">
              รับไฟแนนซ์
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ปล่อยไฟแนนซ์
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ค่าดำเนินการ
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ขาย
            </th>
            <th class="p-1.5 text-right text-[9px]">
              เงินประกัน
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ยกเลิกสัญญา
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ค่าทนาย
            </th>
            <th class="p-1.5 text-right text-[9px]">
              เปลี่ยนสัญญา
            </th>
            <th class="p-1.5 text-right text-[9px]">
              เงินคงเหลือ
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in pages[page]"
            :key="`${item.branchId}-${i}`"
            class="border-b border-zinc-200">
            <td class="p-1.5">
              {{ item.branchName }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(item.financeReceive) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(item.financeRelease) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(item.processingFee) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(item.salePrice) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(item.depositFee) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(item.cancelContractFee) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(item.lawyerFee) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(item.contractReplacementFee) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(item.outstanding) }}
            </td>
          </tr>
        </tbody>
        <tfoot v-if="page === totalPages - 1">
          <tr class="bg-zinc-200 font-bold border-t-2 border-zinc-700">
            <td class="p-1.5">
              รวมสุทธิ
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(summary.financeReceive) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(summary.financeRelease) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(summary.processingFee) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(summary.salePrice) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(summary.depositFee) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(summary.cancelContractFee) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(summary.lawyerFee) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(summary.contractReplacementFee) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(summary.outstanding) }}
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
import type { IDailyBranchSummaryList } from '@/models/response/report/daily-branch-summary/DailyBranchSummaryRes.model'
import BasePrintPage from '@/components/base/BasePrintPage.vue'

interface IProps {
  items: IDailyBranchSummaryList[]
}

const props = defineProps<IProps>()
const ROWS_PER_PAGE = 20

type TSummary = Record<keyof Omit<IDailyBranchSummaryList, 'branchId' | 'branchName'>, number>

const summary = computed((): TSummary => ({
  financeReceive: props.items.reduce((acc: number, e: IDailyBranchSummaryList): number => acc + (e.financeReceive ?? 0), 0),
  financeRelease: props.items.reduce((acc: number, e: IDailyBranchSummaryList): number => acc + (e.financeRelease ?? 0), 0),
  processingFee: props.items.reduce((acc: number, e: IDailyBranchSummaryList): number => acc + (e.processingFee ?? 0), 0),
  salePrice: props.items.reduce((acc: number, e: IDailyBranchSummaryList): number => acc + (e.salePrice ?? 0), 0),
  depositFee: props.items.reduce((acc: number, e: IDailyBranchSummaryList): number => acc + (e.depositFee ?? 0), 0),
  cancelContractFee: props.items.reduce((acc: number, e: IDailyBranchSummaryList): number => acc + (e.cancelContractFee ?? 0), 0),
  lawyerFee: props.items.reduce((acc: number, e: IDailyBranchSummaryList): number => acc + (e.lawyerFee ?? 0), 0),
  contractReplacementFee: props.items.reduce((acc: number, e: IDailyBranchSummaryList): number => acc + (e.contractReplacementFee ?? 0), 0),
  outstanding: props.items.reduce((acc: number, e: IDailyBranchSummaryList): number => acc + (e.outstanding ?? 0), 0)
}))

const totalPages = computed((): number => Math.ceil(props.items.length / ROWS_PER_PAGE))

const pages = computed((): IDailyBranchSummaryList[][] => {
  const result: IDailyBranchSummaryList[][] = []
  for (let i = 0; i < props.items.length; i += ROWS_PER_PAGE) {
    result.push(props.items.slice(i, i + ROWS_PER_PAGE))
  }
  return result
})
</script>

<style scoped></style>
