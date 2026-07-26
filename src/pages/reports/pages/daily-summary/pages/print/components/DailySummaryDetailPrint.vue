<template>
  <BasePrintPage
    :page-count="totalPages || 1"
    title="รายงานสรุปประจำวัน">
    <template #default="{ page }">
      <div
        v-if="page === 0"
        class="grid grid-cols-2 gap-2.5 text-[10px] mb-3">
        <div
          v-for="row in infoRows"
          :key="row.label"
          class="grid grid-cols-2 gap-2.5">
          <span class="font-bold">{{ row.label }}</span>
          <span>: {{ row.value }}</span>
        </div>
      </div>

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
              รหัสการชำระ
            </th>
            <th class="p-1.5 text-left text-[9px]">
              หมวดหมู่
            </th>
            <th class="p-1.5 text-left text-[9px]">
              ประเภท
            </th>
            <th class="p-1.5 text-right text-[9px]">
              มูลค่า
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in pages[page]"
            :key="`${item.id}-${i}`"
            class="border-b border-zinc-200">
            <td class="p-1.5 text-center">
              {{ startIndex(page) + i + 1 }}
            </td>
            <td class="p-1.5">
              {{ item.code }}
            </td>
            <td class="p-1.5">
              {{ item.category }}
            </td>
            <td class="p-1.5">
              {{ item.type === 'RECEIVE' ? 'รับ' : 'จ่าย' }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormatNoDecimal(item.amount) }}
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="page === totalPages - 1"
        class="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p class="text-[10px] font-bold mb-1">
            หมายเหตุ
          </p>
          <p class="text-[10px] whitespace-pre-line">
            {{ data?.reason || '-' }}
          </p>
        </div>
        <div class="flex flex-col gap-1">
          <template
            v-for="(row, i) in summaryRows"
            :key="i">
            <hr
              v-if="row.divider"
              class="border-zinc-400">
            <div
              v-else
              class="grid grid-cols-2 gap-2.5 text-[10px]">
              <span class="font-bold">{{ row.label }}</span>
              <span>: {{ row.value }}</span>
            </div>
          </template>
        </div>
      </div>
    </template>
  </BasePrintPage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IDailySummaryById, IDailySummaryDetailItemWithId } from '@/models/response/report/daily-summary/DailySummaryRes'
import BasePrintPage from '@/components/base/BasePrintPage.vue'

interface IProps {
  data?: IDailySummaryById
}

interface IRow {
  label: string
  value: string
}

interface ISummaryRow {
  label?: string
  value?: string
  divider?: boolean
}

const props = defineProps<IProps>()
const ROWS_PER_PAGE = 20

const items = computed((): IDailySummaryDetailItemWithId[] => props.data?.items || [])

const infoRows = computed((): IRow[] => [
  { label: 'สาขา', value: props.data?.branchName || '-' },
  { label: 'เลขที่เอกสาร', value: props.data?.idNo || '-' },
  { label: 'วันที่', value: props.data?.date || '-' },
  { label: 'โดย', value: props.data?.createdBy || '-' }
])

const summaryRows = computed((): ISummaryRow[] => {
  const fmt = (v: number): string => formatter.numberFormatNoDecimal(v)
  const d = props.data
  return [
    { label: 'ยอดคงเหลือยกมา', value: fmt(d?.openBalance ?? 0) },
    { divider: true },
    { label: 'รับค่างวด', value: fmt(d?.installmentReceive ?? 0) },
    { label: 'รับค่าดำเนินการ', value: fmt(d?.continuedReceive ?? 0) },
    { label: 'รับค่าอื่นๆ', value: fmt(d?.otherReceive ?? 0) },
    { divider: true },
    { label: 'ยอดเงินกู้', value: fmt(d?.loanAmount ?? 0) },
    { divider: true },
    { label: 'ยอดรับรวม', value: fmt(d?.sumReceive ?? 0) },
    { label: 'ยอดจ่ายรวม', value: fmt(d?.sumPay ?? 0) },
    { divider: true },
    { label: 'ยอดคงเหลือยกไป', value: fmt(d?.closingBalance ?? 0) }
  ]
})

const totalPages = computed((): number => Math.ceil(items.value.length / ROWS_PER_PAGE) || 1)

const pages = computed((): IDailySummaryDetailItemWithId[][] => {
  const result: IDailySummaryDetailItemWithId[][] = []
  for (let i = 0; i < items.value.length; i += ROWS_PER_PAGE) {
    result.push(items.value.slice(i, i + ROWS_PER_PAGE))
  }
  return result
})

function startIndex (page: number): number {
  return page * ROWS_PER_PAGE
}
</script>

<style scoped></style>
