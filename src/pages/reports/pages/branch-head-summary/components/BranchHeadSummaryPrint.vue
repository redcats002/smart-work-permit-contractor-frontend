<template>
  <BasePrintPage
    :page-count="totalPages || 1"
    title="รายงานหัวหน้าสาขา">
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
              ค่างวดต่องวด
            </th>
            <th class="p-1.5 text-left text-[9px]">
              การคิด%ยอดเก็บ
            </th>
            <th class="p-1.5 text-left text-[9px]">
              ยอดเก็บ
            </th>
            <th class="p-1.5 text-left text-[9px]">
              ยอดปล่อย
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
            <td class="p-1.5">
              {{ formatter.numberFormat(item.monthlyInstallment) }}
            </td>
            <td class="p-1.5">
              {{ item.percentReceive ? formatter.numberFormat(item.percentReceive) : 'ไม่นับยอดเก็บ' }}
            </td>
            <td class="p-1.5">
              {{ formatter.numberFormat(item.receiveAmount) }}
            </td>
            <td class="p-1.5">
              {{ formatter.numberFormat(item.principal) }}
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
import type { IBranchHeadSummaryList } from '@/models/response/report/branch-head-summary/BranchHeadSummaryRes.model'
import BasePrintPage from '@/components/base/BasePrintPage.vue'

interface IProps {
  items: IBranchHeadSummaryList[]
}

const props = defineProps<IProps>()
const ROWS_PER_PAGE = 20

const totalPages = computed((): number => Math.ceil(props.items.length / ROWS_PER_PAGE))

const pages = computed((): IBranchHeadSummaryList[][] => {
  const result: IBranchHeadSummaryList[][] = []
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
