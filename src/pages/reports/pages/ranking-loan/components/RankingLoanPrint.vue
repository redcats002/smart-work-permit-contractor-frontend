<template>
  <BasePrintPage
    :page-count="totalPages || 1"
    title="รายงานอันดับ 1-25 การปล่อยสินเชื่อ">
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
            <th class="p-1.5 text-left text-[9px]">
              เลขที่สาขา
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ยอดรับ
            </th>
            <th class="p-1.5 text-center text-[9px]">
              ติด TOP ครั้งที่
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in pages[page]"
            :key="`${item.branch?.id}-${i}`"
            class="border-b border-zinc-200">
            <td class="p-1.5 text-center">
              {{ startIndex(page) + i + 1 }}
            </td>
            <td class="p-1.5">
              {{ item.branch?.name || '-' }}
            </td>
            <td class="p-1.5">
              {{ item.branch?.idNo || '-' }}
            </td>
            <td class="p-1.5 text-right">
              {{ isPercent ? `${formatter.numberFormat(item.percent)}%` : formatter.numberFormat(item.paidAmount) }}
            </td>
            <td class="p-1.5 text-center">
              {{ formatter.numberFormat(item.topCount) }}
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </BasePrintPage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IRankLoanItem } from '@/models/response/report/rank-loan/RankLoanRes.model'
import { RankingLoanTypeEnum } from '@/enums/modules/report/RankingLoan.enum'
import BasePrintPage from '@/components/base/BasePrintPage.vue'

interface IProps {
  items: IRankLoanItem[]
  type?: string
}

const props = defineProps<IProps>()
const ROWS_PER_PAGE = 20

const isPercent = computed((): boolean => props.type === RankingLoanTypeEnum.PERCENTAGE)

const totalPages = computed((): number => Math.ceil(props.items.length / ROWS_PER_PAGE))

const pages = computed((): IRankLoanItem[][] => {
  const result: IRankLoanItem[][] = []
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
