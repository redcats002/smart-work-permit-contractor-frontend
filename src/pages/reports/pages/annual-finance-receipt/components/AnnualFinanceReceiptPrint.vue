<template>
  <BasePrintPage
    :page-count="totalPages || 1"
    title="รายงานสรุปรับไฟแนนซ์ประจำปี">
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
              v-for="col in monthColumns"
              :key="col.field"
              class="p-1.5 text-right text-[9px]">
              {{ col.header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in pages[page]"
            :key="`${item.id}-${i}`"
            class="border-b border-zinc-200">
            <td class="p-1.5">
              {{ item.branchName }}
            </td>
            <td
              v-for="col in monthColumns"
              :key="col.field"
              class="p-1.5 text-right">
              <div>{{ formatter.numberFormat2Decimal(item[col.field].principalAndInterest) }}</div>
              <div>{{ formatter.numberFormat2Decimal(item[col.field].percent) }} %</div>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="page === totalPages - 1">
          <tr class="bg-zinc-200 font-bold border-t-2 border-zinc-700">
            <td class="p-1.5">
              รวม {{ items.length }} สาขา
            </td>
            <td
              v-for="col in monthColumns"
              :key="col.field"
              class="p-1.5 text-right">
              <div>{{ formatter.numberFormat2Decimal(summary?.[col.field]?.principalAndInterest || 0) }}</div>
              <div>{{ formatter.numberFormat2Decimal(summary?.[col.field]?.percent || 0) }} %</div>
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
import type { IAnnualFinanceReceiptList, IAnnualFinanceReceiptSummary } from '@/models/response/report/annual-finance-receipt/AnnualFinanceReceiptRes.model'
import BasePrintPage from '@/components/base/BasePrintPage.vue'

interface IMonthColumn {
  field: 'month1' | 'month2' | 'month3' | 'month4' | 'month5' | 'month6' | 'month7' | 'month8' | 'month9' | 'month10' | 'month11' | 'month12' | 'sumMonth'
  header: string
}

interface IProps {
  items: IAnnualFinanceReceiptList[]
  summary?: IAnnualFinanceReceiptSummary
}

const props = defineProps<IProps>()
const ROWS_PER_PAGE = 20

const monthColumns: IMonthColumn[] = [
  { field: 'month1', header: 'ม.ค.' },
  { field: 'month2', header: 'ก.พ.' },
  { field: 'month3', header: 'มี.ค.' },
  { field: 'month4', header: 'เม.ย.' },
  { field: 'month5', header: 'พ.ค.' },
  { field: 'month6', header: 'มิ.ย.' },
  { field: 'month7', header: 'ก.ค.' },
  { field: 'month8', header: 'ส.ค.' },
  { field: 'month9', header: 'ก.ย.' },
  { field: 'month10', header: 'ต.ค.' },
  { field: 'month11', header: 'พ.ย.' },
  { field: 'month12', header: 'ธ.ค.' },
  { field: 'sumMonth', header: 'รวมทั้งสิ้น' }
]

const totalPages = computed((): number => Math.ceil(props.items.length / ROWS_PER_PAGE))

const pages = computed((): IAnnualFinanceReceiptList[][] => {
  const result: IAnnualFinanceReceiptList[][] = []
  for (let i = 0; i < props.items.length; i += ROWS_PER_PAGE) {
    result.push(props.items.slice(i, i + ROWS_PER_PAGE))
  }
  return result
})
</script>

<style scoped></style>
