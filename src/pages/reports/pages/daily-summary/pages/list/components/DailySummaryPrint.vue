<template>
  <BasePrintPage
    :page-count="totalPages || 1"
    title="รายงานสรุปประจำวัน">
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
              สรุปประจำวันที่
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ยอดคงเหลือยกมา
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ยอดคงเหลือยกไป
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in pages[page]"
            :key="`${item.id}-${i}`"
            class="border-b border-zinc-200">
            <td class="p-1.5">
              {{ item.date }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormatNoDecimal(item.openBalance) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormatNoDecimal(item.closingBalance) }}
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
import type { IDailySummaryListItem } from '@/models/response/report/daily-summary/DailySummaryRes'
import BasePrintPage from '@/components/base/BasePrintPage.vue'

interface IProps {
  items: IDailySummaryListItem[]
}

const props = defineProps<IProps>()
const ROWS_PER_PAGE = 20

const totalPages = computed((): number => Math.ceil(props.items.length / ROWS_PER_PAGE))

const pages = computed((): IDailySummaryListItem[][] => {
  const result: IDailySummaryListItem[][] = []
  for (let i = 0; i < props.items.length; i += ROWS_PER_PAGE) {
    result.push(props.items.slice(i, i + ROWS_PER_PAGE))
  }
  return result
})
</script>

<style scoped></style>
