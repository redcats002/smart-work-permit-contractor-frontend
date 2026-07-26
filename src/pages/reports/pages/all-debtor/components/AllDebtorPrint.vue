<template>
  <BasePrintPage
    :page-count="totalPages || 1"
    title="รายงานลูกหนี้ทั้งหมด">
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
              เลขที่สัญญา
            </th>
            <th class="p-1.5 text-left text-[9px]">
              ชื่อลูกค้า
            </th>
            <th class="p-1.5 text-left text-[9px]">
              ประเภทเงินกู้
            </th>
            <th class="p-1.5 text-left text-[9px]">
              วันที่ทำสัญญา
            </th>
            <th class="p-1.5 text-left text-[9px]">
              วันที่ครบสัญญา
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ยอดจัด/งวด
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ยอดจัดรวมดอกเบี้ย/งวด
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ชำระแล้ว
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ลูกหนี้คงเหลือ
            </th>
            <th class="p-1.5 text-left text-[9px]">
              วันที่ชำระล่าสุด
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ยอดชำระล่าสุด
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
              {{ item.idNo }}
            </td>
            <td class="p-1.5">
              {{ item.customerName }}
            </td>
            <td class="p-1.5">
              {{ formatTitle(item.interestType) }}
            </td>
            <td class="p-1.5">
              {{ dayjs.formatDate(item.startContractDate) }}
            </td>
            <td class="p-1.5">
              {{ dayjs.formatDate(item.endContractDate) }}
            </td>
            <td class="p-1.5 text-right">
              <div>{{ formatter.numberFormat(item.principal) }}</div>
              <div>{{ formatter.numberFormat(item.installmentCount) }}</div>
            </td>
            <td class="p-1.5 text-right">
              <div>{{ formatter.numberFormat(item.principalAndInterest) }}</div>
              <div>{{ formatter.numberFormat(item.monthlyInstallment) }}</div>
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(item.amountPaid) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(item.outstanding) }}
            </td>
            <td class="p-1.5">
              {{ dayjs.formatDate(item.lastUpdated) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(item.latestPaymentAmount) }}
            </td>
          </tr>
        </tbody>
        <tfoot v-if="page === totalPages - 1">
          <tr class="bg-zinc-200 font-bold border-t-2 border-zinc-700">
            <td
              class="p-1.5"
              colspan="6">
              รวม {{ items.length }} รายการ
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(summary?.principal || 0) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(summary?.principalAndInterest || 0) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(summary?.amountPaid || 0) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(summary?.outstanding || 0) }}
            </td>
            <td class="p-1.5" />
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(summary?.latestPaymentAmount || 0) }}
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
import type { IOutstandingDebtorList, IOutStandingDebtorSummary } from '@/models/response/report/outstanding-debtor/OutstandingDebtorRes.model'
import { formatTitle } from '@/enums/modules/contract/InterestType.enum'
import BasePrintPage from '@/components/base/BasePrintPage.vue'

interface IProps {
  items: IOutstandingDebtorList[]
  summary?: IOutStandingDebtorSummary
}

const props = defineProps<IProps>()
const ROWS_PER_PAGE = 20

const dayjs = useDayjs()

const totalPages = computed((): number => Math.ceil(props.items.length / ROWS_PER_PAGE))

const pages = computed((): IOutstandingDebtorList[][] => {
  const result: IOutstandingDebtorList[][] = []
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
