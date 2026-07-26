<template>
  <BasePrintPage
    :page-count="totalPages || 1"
    title="รายงานสรุปสต็อกสินค้ารวม">
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
            <th class="p-1.5 text-center text-[9px]">
              สต็อกสำนักงานใหญ่
            </th>
            <th class="p-1.5 text-center text-[9px]">
              สต็อกสาขา
            </th>
            <th class="p-1.5 text-center text-[9px]">
              สต็อกสาขาอื่น
            </th>
            <th class="p-1.5 text-center text-[9px]">
              รับจากสาขาอื่น
            </th>
            <th class="p-1.5 text-center text-[9px]">
              สต็อกบังคับคดี
            </th>
            <th class="p-1.5 text-center text-[9px]">
              รวม
            </th>
            <th class="p-1.5 text-center text-[9px]">
              กำลังโอนย้าย
            </th>
            <th class="p-1.5 text-center text-[9px]">
              รวมทั้งหมด
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
            <td class="p-1.5 text-center">
              {{ formatter.numberFormat2Decimal(item.headOfficeStock) }}
            </td>
            <td class="p-1.5 text-center">
              {{ formatter.numberFormat2Decimal(item.branchStock) }}
            </td>
            <td class="p-1.5 text-center">
              {{ formatter.numberFormat2Decimal(item.stockInOtherBranch) }}
            </td>
            <td class="p-1.5 text-center">
              {{ formatter.numberFormat2Decimal(item.stockReceivedFromOtherBranches) }}
            </td>
            <td class="p-1.5 text-center">
              {{ formatter.numberFormat2Decimal(item.legalExecutionStock) }}
            </td>
            <td class="p-1.5 text-center">
              {{ formatter.numberFormat2Decimal(item.total) }}
            </td>
            <td class="p-1.5 text-center">
              {{ formatter.numberFormat2Decimal(item.moving) }}
            </td>
            <td class="p-1.5 text-center">
              {{ formatter.numberFormat2Decimal(item.lastTotal) }}
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
import type { ISummaryStockList } from '@/models/response/report/summary-stock/SummaryStockRes.model'
import BasePrintPage from '@/components/base/BasePrintPage.vue'

interface IProps {
  items: ISummaryStockList[]
}

const props = defineProps<IProps>()
const ROWS_PER_PAGE = 20

const totalPages = computed((): number => Math.ceil(props.items.length / ROWS_PER_PAGE))

const pages = computed((): ISummaryStockList[][] => {
  const result: ISummaryStockList[][] = []
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
