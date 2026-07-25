<template>
  <div class="mx-auto w-[210mm] px-[12mm] py-[10mm] text-[11px] text-black">
    <div class="flex items-center justify-between mb-1">
      <div class="font-semibold">
        {{ branch.name }}
      </div>
      <div class="text-[10px]">
        พิมพ์เมื่อ {{ dayjs.formatDateTime(generatedAt) }}
      </div>
    </div>
    <div class="text-center text-[14px] font-semibold mb-1">
      {{ title }}
    </div>
    <div
      v-if="criteria"
      class="text-[10px] mb-3">
      {{ criteria }}
    </div>

    <table class="w-full border-collapse">
      <thead>
        <tr class="border border-black">
          <th class="border border-black px-1 py-1 text-center">
            ลำดับ
          </th>
          <th class="border border-black px-1 py-1 text-left">
            เลขที่สัญญา
          </th>
          <th class="border border-black px-1 py-1 text-left">
            ชื่อลูกค้า
          </th>
          <th class="border border-black px-1 py-1 text-left">
            ประเภทเงินกู้
          </th>
          <th class="border border-black px-1 py-1 text-left">
            วันที่ทำสัญญา
          </th>
          <th class="border border-black px-1 py-1 text-left">
            วันที่ครบสัญญา
          </th>
          <th class="border border-black px-1 py-1 text-right">
            ยอดจัด/งวด
          </th>
          <th class="border border-black px-1 py-1 text-right">
            ยอดจัดรวมดอกเบี้ย/งวด
          </th>
          <th class="border border-black px-1 py-1 text-right">
            ชำระแล้ว
          </th>
          <th class="border border-black px-1 py-1 text-right">
            ลูกหนี้คงเหลือ
          </th>
          <th class="border border-black px-1 py-1 text-left">
            วันที่ชำระล่าสุด
          </th>
          <th class="border border-black px-1 py-1 text-right">
            ยอดชำระล่าสุด
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in items"
          :key="item.id">
          <td class="border border-black px-1 py-1 text-center">
            {{ index + 1 }}
          </td>
          <td class="border border-black px-1 py-1">
            {{ item.idNo }}
          </td>
          <td class="border border-black px-1 py-1">
            {{ item.customerName }}
          </td>
          <td class="border border-black px-1 py-1">
            {{ formatTitle(item.interestType) }}
          </td>
          <td class="border border-black px-1 py-1">
            {{ dayjs.formatDate(item.startContractDate) }}
          </td>
          <td class="border border-black px-1 py-1">
            {{ dayjs.formatDate(item.endContractDate) }}
          </td>
          <td class="border border-black px-1 py-1 text-right">
            <div>{{ formatter.numberFormat(item.principal) }}</div>
            <div>{{ formatter.numberFormat(item.installmentCount) }}</div>
          </td>
          <td class="border border-black px-1 py-1 text-right">
            <div>{{ formatter.numberFormat(item.principalAndInterest) }}</div>
            <div>{{ formatter.numberFormat(item.monthlyInstallment) }}</div>
          </td>
          <td class="border border-black px-1 py-1 text-right">
            {{ formatter.numberFormat(item.amountPaid) }}
          </td>
          <td class="border border-black px-1 py-1 text-right">
            {{ formatter.numberFormat(item.outstanding) }}
          </td>
          <td class="border border-black px-1 py-1">
            {{ dayjs.formatDate(item.lastUpdated) }}
          </td>
          <td class="border border-black px-1 py-1 text-right">
            {{ formatter.numberFormat(item.latestPaymentAmount) }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="border border-black font-semibold">
          <td
            class="border border-black px-1 py-1"
            colspan="6">
            รวม {{ items.length }} รายการ
          </td>
          <td class="border border-black px-1 py-1 text-right">
            {{ formatter.numberFormat(summary.principal) }}
          </td>
          <td class="border border-black px-1 py-1 text-right">
            {{ formatter.numberFormat(summary.principalAndInterest) }}
          </td>
          <td class="border border-black px-1 py-1 text-right">
            {{ formatter.numberFormat(summary.amountPaid) }}
          </td>
          <td class="border border-black px-1 py-1 text-right">
            {{ formatter.numberFormat(summary.outstanding) }}
          </td>
          <td class="border border-black px-1 py-1" />
          <td class="border border-black px-1 py-1 text-right">
            {{ formatter.numberFormat(summary.latestPaymentAmount) }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/Auth'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IOutstandingDebtorFilter } from '@/models/modules/report/outstanding-debtor/Filter.model'
import type { IOutstandingDebtorList, IOutStandingDebtorSummary } from '@/models/response/report/outstanding-debtor/OutstandingDebtorRes.model'
import { formatTitle } from '@/enums/modules/contract/InterestType.enum'

interface IProps {
  title: string
  items: IOutstandingDebtorList[]
  summary: IOutStandingDebtorSummary
  filters: IOutstandingDebtorFilter
  generatedAt: string
}

const props = defineProps<IProps>()

const dayjs = useDayjs()
const { branch } = storeToRefs(useAuthStore())

// ponytail: branchId filter is only an id (no name in the filter model) — resolving it
// to a label would need an extra lookup call. Criteria line skips it; add a branch fetch
// here if the printed criteria ever need to show the filtered branch's name.
const criteria = computed((): string => {
  const parts: string[] = []
  if (props.filters.search) parts.push(`คำค้นหา: ${props.filters.search}`)
  if (props.filters.interestType) parts.push(`ประเภทดอกเบี้ย: ${formatTitle(props.filters.interestType)}`)
  if (props.filters.startDateOfCreatedAt || props.filters.endDateOfCreatedAt) {
    parts.push(`วันที่ทำสัญญา: ${props.filters.startDateOfCreatedAt ? dayjs.formatDate(props.filters.startDateOfCreatedAt) : 'ทั้งหมด'} - ${props.filters.endDateOfCreatedAt ? dayjs.formatDate(props.filters.endDateOfCreatedAt) : 'ทั้งหมด'}`)
  }
  if (props.filters.startDateOfFinalInstallmentDate || props.filters.endDateOfFinalInstallmentDate) {
    parts.push(`วันที่ครบสัญญา: ${props.filters.startDateOfFinalInstallmentDate ? dayjs.formatDate(props.filters.startDateOfFinalInstallmentDate) : 'ทั้งหมด'} - ${props.filters.endDateOfFinalInstallmentDate ? dayjs.formatDate(props.filters.endDateOfFinalInstallmentDate) : 'ทั้งหมด'}`)
  }
  return parts.join(' | ')
})
</script>

<style>
thead {
  display: table-header-group;
}
tr {
  break-inside: avoid;
}
</style>
