<template>
  <BasePrintPage
    :page-count="totalPages || 1"
    title="รายงานกำไรตามการรับชำระจริง">
    <template #default="{ page }">
      <div
        v-if="!items.length"
        class="text-center py-16 text-zinc-500">
        ไม่มีข้อมูล
      </div>
      <table
        v-else
        class="w-full border-collapse border rounded-sm overflow-hidden">
        <thead>
          <tr class="bg-zinc-700 text-white">
            <th class="p-1.5 text-center text-[9px]">
              ลำดับ
            </th>
            <th class="p-1.5 text-left text-[9px]">
              เลขที่ใบเสร็จ
            </th>
            <th class="p-1.5 text-left text-[9px]">
              วันที่
            </th>
            <th class="p-1.5 text-left text-[9px]">
              เลขที่สัญญา
            </th>
            <th class="p-1.5 text-right text-[9px]">
              จำนวนปีสัญญา
            </th>
            <th class="p-1.5 text-left text-[9px]">
              ชื่อลูกค้า
            </th>
            <th class="p-1.5 text-center text-[9px]">
              ชำระงวดที่
            </th>
            <th class="p-1.5 text-right text-[9px]">
              เงินต้นทั้งหมด
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ดอกเบี้ยทั้งหมด
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ค่างวดที่รับชำระ
            </th>
            <th class="p-1.5 text-right text-[9px]">
              เงินต้นงวดนี้
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ดอกเบี้ยงวดนี้
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in pages[page]"
            :key="`${item.id}-${i}`"
            class="border-b border-zinc-200">
            <td class="p-1.5 text-center">
              {{ page * ROWS_PER_PAGE + i + 1 }}
            </td>
            <td class="p-1.5">
              {{ item.receipt?.idNo || '-' }}
            </td>
            <td class="p-1.5">
              {{ dayjs.formatDate(item.date) || '-' }}
            </td>
            <td class="p-1.5">
              {{ item.contract?.idNo || '-' }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormatNoDecimal(item.contractYear) }}
            </td>
            <td class="p-1.5">
              {{ item.customerName || '-' }}
            </td>
            <td class="p-1.5 text-center">
              {{ item.paidAtPattern || '-' }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.allPrincipal) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.allInterest) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.receiveInstallmentAmount) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.principal) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.interest) }}
            </td>
          </tr>
        </tbody>
        <tfoot v-if="page === totalPages - 1 && summary">
          <tr class="bg-zinc-200 font-bold border-t-2 border-zinc-700">
            <td
              class="p-1.5"
              colspan="5" />
            <td class="p-1.5">
              รวมทั้งสิ้น
            </td>
            <td class="p-1.5" />
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary.allPrincipal) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary.allInterest) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary.receiveInstallmentAmount) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary.principal) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary.interest) }}
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
import type {
  IProfitBasedOnActualPaymentList,
  IProfitBasedOnActualPaymentSummary
} from '@/models/response/report/profit-based-on-actual-payment/ProfitBasedOnActualPaymentRes.model'
import BasePrintPage from '@/components/base/BasePrintPage.vue'

interface IProps {
  items: IProfitBasedOnActualPaymentList[]
  summary?: IProfitBasedOnActualPaymentSummary
}

const props = defineProps<IProps>()
const dayjs = useDayjs()
const ROWS_PER_PAGE = 20

const totalPages = computed((): number =>
  Math.ceil(props.items.length / ROWS_PER_PAGE)
)

const pages = computed((): IProfitBasedOnActualPaymentList[][] => {
  const result: IProfitBasedOnActualPaymentList[][] = []
  for (let i = 0; i < props.items.length; i += ROWS_PER_PAGE) {
    result.push(props.items.slice(i, i + ROWS_PER_PAGE))
  }
  return result
})
</script>
