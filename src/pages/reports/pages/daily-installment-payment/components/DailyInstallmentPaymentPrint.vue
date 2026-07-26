<template>
  <BasePrintPage
    :page-count="totalPages || 1"
    title="รายงานรับชำระค่างวดประจำวัน">
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
              วันที่
            </th>
            <th class="p-1.5 text-left text-[9px]">
              เลขที่ใบเสร็จ
            </th>
            <th class="p-1.5 text-left text-[9px]">
              เลขที่สัญญา
            </th>
            <th class="p-1.5 text-left text-[9px]">
              ชื่อลูกค้า
            </th>
            <th class="p-1.5 text-left text-[9px]">
              ชำระโดย
            </th>
            <th class="p-1.5 text-left text-[9px]">
              รับชำระค่า
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ยอดตัดลูกหนี้
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ส่วนลด
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ยอดรับสุทธิ
            </th>
            <th class="p-1.5 text-right text-[9px]">
              เงินต้นทั้งหมด
            </th>
            <th class="p-1.5 text-right text-[9px]">
              เงินต้น
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ดอกเบี้ย
            </th>
            <th class="p-1.5 text-left text-[9px]">
              พนักงาน
            </th>
            <th class="p-1.5 text-left text-[9px]">
              สถานะ
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in pages[page]"
            :key="`${item.receipt?.id}-${i}`"
            class="border-b border-zinc-200">
            <td class="p-1.5">
              {{ dayjs.formatDate(item.date ?? undefined) }}
            </td>
            <td class="p-1.5">
              {{ item.receipt?.idNo ?? '-' }}
            </td>
            <td class="p-1.5">
              {{ item.contract?.idNo ?? '-' }}
            </td>
            <td class="p-1.5">
              {{ item.customer?.fullName ?? '-' }}
            </td>
            <td class="p-1.5">
              {{ formatPaymentType(item.paymentType as TReceiptPaymentMethod) }}
            </td>
            <td class="p-1.5">
              {{ item.paymentReason }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.debtorCutAmount) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.discountAmount) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.netReceiveAmount) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.allPrincipalAmount) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.principalAmount) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(item.interestAmount) }}
            </td>
            <td class="p-1.5">
              {{ item.employee?.fullName ?? '-' }}
            </td>
            <td class="p-1.5">
              {{ formatContractStatus(item.contractStatus) }}
            </td>
          </tr>
        </tbody>
        <tfoot v-if="page === totalPages - 1">
          <tr class="bg-zinc-200 font-bold border-t-2 border-zinc-700">
            <td
              class="p-1.5"
              colspan="6">
              รวมทั้งสิ้น
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary?.debtorCutAmount || 0) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary?.discountAmount || 0) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary?.netReceiveAmount || 0) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary?.allPrincipalAmount || 0) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary?.principalAmount || 0) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat2Decimal(summary?.interestAmount || 0) }}
            </td>
            <td
              class="p-1.5"
              colspan="2" />
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
import type { IDailyInstallmentPaymentList, IDailyInstallmentPaymentSummary } from '@/models/response/report/daily-installment-payment/DailyInstallmentPaymentRes'
import { formatTitle as formatPaymentType, type TReceiptPaymentMethod } from '@/models/response/receipt/PaymentMethod.enum'
import { formatTitle as formatContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import BasePrintPage from '@/components/base/BasePrintPage.vue'

interface IProps {
  items: IDailyInstallmentPaymentList[]
  summary?: IDailyInstallmentPaymentSummary
}

const props = defineProps<IProps>()
const ROWS_PER_PAGE = 20

const dayjs = useDayjs()

const totalPages = computed((): number => Math.ceil(props.items.length / ROWS_PER_PAGE))

const pages = computed((): IDailyInstallmentPaymentList[][] => {
  const result: IDailyInstallmentPaymentList[][] = []
  for (let i = 0; i < props.items.length; i += ROWS_PER_PAGE) {
    result.push(props.items.slice(i, i + ROWS_PER_PAGE))
  }
  return result
})
</script>

<style scoped></style>
