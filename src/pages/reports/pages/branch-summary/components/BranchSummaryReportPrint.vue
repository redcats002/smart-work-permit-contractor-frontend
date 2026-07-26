<template>
  <BasePrintPage
    :page-count="totalPages || 1"
    title="รายงานสาขา">
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
              เลขที่สาขา
            </th>
            <th class="p-1.5 text-left text-[9px]">
              สาขา
            </th>
            <th class="p-1.5 text-left text-[9px]">
              วันที่เปิดสาขา
            </th>
            <th class="p-1.5 text-left text-[9px]">
              เปิดทำการมาแล้ว
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in pages[page]"
            :key="`${item.idNo}-${i}`"
            class="border-b border-zinc-200">
            <td class="p-1.5">
              {{ item.idNo }}
            </td>
            <td class="p-1.5">
              {{ item.name }}
            </td>
            <td class="p-1.5">
              {{ dayjs.formatDate(item.openAt) }}
            </td>
            <td class="p-1.5">
              {{ dayjs.formatAge(item.openAt) }}
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </BasePrintPage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import type { IBranchSummaryReportList } from '@/models/response/report/branch-summary/BranchSummaryRes.model'
import BasePrintPage from '@/components/base/BasePrintPage.vue'

interface IProps {
  items: IBranchSummaryReportList[]
}

const props = defineProps<IProps>()
const ROWS_PER_PAGE = 20

const dayjs = useDayjs()

const totalPages = computed((): number => Math.ceil(props.items.length / ROWS_PER_PAGE))

const pages = computed((): IBranchSummaryReportList[][] => {
  const result: IBranchSummaryReportList[][] = []
  for (let i = 0; i < props.items.length; i += ROWS_PER_PAGE) {
    result.push(props.items.slice(i, i + ROWS_PER_PAGE))
  }
  return result
})
</script>

<style scoped></style>
