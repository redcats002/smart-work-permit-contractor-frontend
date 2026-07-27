<template>
  <BasePrintPage
    :page-count="totalPages || 1"
    title="รายงานลูกค้าค้างชำระ">
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
              เลขที่สัญญา
            </th>
            <th class="p-1.5 text-left text-[9px]">
              ชื่อลูกค้า
            </th>
            <th class="p-1.5 text-left text-[9px]">
              วันที่ทำสัญญา
            </th>
            <th class="p-1.5 text-left text-[9px]">
              วันที่งวดสุดท้าย
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ยอดจัด
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ยอดจัดรวมดอกเบี้ย
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ชำระแล้ว
            </th>
            <th class="p-1.5 text-right text-[9px]">
              เงินต้นคงเหลือ
            </th>
            <th class="p-1.5 text-left text-[9px]">
              วันที่ชำระล่าสุด
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ยอดค้างชำระ
            </th>
            <th class="p-1.5 text-right text-[9px]">
              งวดค้าง
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
              {{ item.customerName }}
            </td>
            <td class="p-1.5">
              {{ dayjs.formatDate(item.createdAt) }}
            </td>
            <td class="p-1.5">
              {{ dayjs.formatDate(item.finalInstallmentDate) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.principal) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.principalAndInterest) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.amountPaid) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.outstandingPrincipal) }}
            </td>
            <td class="p-1.5">
              {{ dayjs.formatDate(item.lastPaidAt) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.overdueOutstandingAmount) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.overdueOutstandingCount) }}
            </td>
          </tr>
        </tbody>
        <tfoot v-if="page === totalPages - 1">
          <tr class="bg-zinc-200 font-bold border-t-2 border-zinc-700">
            <td
              class="p-1.5"
              colspan="4">
              รวม {{ items.length }} รายการ
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary?.principal || 0) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary?.principalAndInterest || 0) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary?.amountPaid || 0) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary?.outstandingPrincipal || 0) }}
            </td>
            <td class="p-1.5" />
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary?.overdueOutstandingAmount || 0) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary?.overdueOutstandingCount || 0) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </template>
  </BasePrintPage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IOverdueCustomerList, IOverdueCustomerSummary } from '@/models/response/report/overdue-customer/OverdueCustomerRes.model'
import BasePrintPage from '@/components/base/BasePrintPage.vue'

interface IProps {
  items: IOverdueCustomerList[]
  summary?: IOverdueCustomerSummary
}

const props = defineProps<IProps>()
const ROWS_PER_PAGE = 20

const dayjs = useDayjs()

const totalPages = computed((): number => Math.ceil(props.items.length / ROWS_PER_PAGE))

const pages = computed((): IOverdueCustomerList[][] => {
  const result: IOverdueCustomerList[][] = []
  for (let i = 0; i < props.items.length; i += ROWS_PER_PAGE) {
    result.push(props.items.slice(i, i + ROWS_PER_PAGE))
  }
  return result
})
</script>

<style scoped></style>
