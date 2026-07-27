<template>
  <BasePrintPage
    :page-count="totalPages || 1"
    title="รายงานรับชำระค่างวดคิดเป็นเปอร์เซ็นต์">
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
            <th class="p-1.5 text-center text-[9px] border border-zinc-300">
              ลำดับ
            </th>
            <th class="p-1.5 text-left text-[9px] border border-zinc-300">
              สาขา
            </th>
            <th class="p-1.5 text-right text-[9px] border border-zinc-300">
              ค่างวด/งวด
            </th>
            <th class="p-1.5 text-right text-[9px] border border-zinc-300">
              รับค่างวด
            </th>
            <th class="p-1.5 text-right text-[9px] border border-zinc-300">
              ขาย
            </th>
            <th class="p-1.5 text-right text-[9px] border border-zinc-300">
              รับค่าปรับ
            </th>
            <th class="p-1.5 text-right text-[9px] border border-zinc-300">
              ค่าติดตาม
            </th>
            <th class="p-1.5 text-right text-[9px] border border-zinc-300">
              รวม
            </th>
            <th class="p-1.5 text-right text-[9px] border border-zinc-300">
              %
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in pages[page]"
            :key="`${item.id}-${i}`"
            class="border-b border-zinc-200">
            <td class="p-1.5 text-center border border-zinc-300">
              {{ page * ROWS_PER_PAGE + i + 1 }}
            </td>
            <td class="p-1.5 border border-zinc-300">
              {{ item.branchName }}
            </td>
            <td class="p-1.5 text-right border border-zinc-300">
              {{ formatter.numberFormat2Decimal(item.monthlyInstallment) }}
            </td>
            <td class="p-1.5 text-right border border-zinc-300">
              {{ formatter.numberFormat2Decimal(item.amountPaid) }}
            </td>
            <td class="p-1.5 text-right border border-zinc-300">
              {{ formatter.numberFormat2Decimal(item.salePrice) }}
            </td>
            <td class="p-1.5 text-right border border-zinc-300">
              {{ formatter.numberFormat2Decimal(item.totalPenaltyFee) }}
            </td>
            <td class="p-1.5 text-right border border-zinc-300">
              {{ formatter.numberFormat2Decimal(item.totalCollectionFee) }}
            </td>
            <td class="p-1.5 text-right border border-zinc-300">
              {{ formatter.numberFormat2Decimal(item.summary) }}
            </td>
            <td class="p-1.5 text-right border border-zinc-300">
              {{ formatter.numberFormat2Decimal(item.percent) }} %
            </td>
          </tr>
        </tbody>
        <tfoot v-if="page === totalPages - 1 && summary">
          <tr class="bg-zinc-200 font-bold border-t-2 border-zinc-700">
            <td
              class="p-1.5 border border-zinc-300"
              colspan="2">
              รวม
            </td>
            <td class="p-1.5 text-right border border-zinc-300">
              {{ formatter.numberFormat2Decimal(summary.monthlyInstallment) }}
            </td>
            <td class="p-1.5 text-right border border-zinc-300">
              {{ formatter.numberFormat2Decimal(summary.amountPaid) }}
            </td>
            <td class="p-1.5 text-right border border-zinc-300">
              {{ formatter.numberFormat2Decimal(summary.salePrice) }}
            </td>
            <td class="p-1.5 text-right border border-zinc-300">
              {{ formatter.numberFormat2Decimal(summary.totalPenaltyFee) }}
            </td>
            <td class="p-1.5 text-right border border-zinc-300">
              {{ formatter.numberFormat2Decimal(summary.totalCollectionFee) }}
            </td>
            <td class="p-1.5 text-right border border-zinc-300">
              {{ formatter.numberFormat2Decimal(summary.summary) }}
            </td>
            <td class="p-1.5 text-right border border-zinc-300">
              {{ formatter.numberFormat2Decimal(summary.percent) }} %
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
import type { IPercentInstallmentList, IPercentInstallmentSummary } from '@/models/response/report/percent-installment/PercentInstallmentRes.model'
import BasePrintPage from '@/components/base/BasePrintPage.vue'

interface IProps {
  items: IPercentInstallmentList[]
  summary?: IPercentInstallmentSummary
}

const props = withDefaults(defineProps<IProps>(), {
  summary: undefined
})

const ROWS_PER_PAGE = 20

const totalPages = computed((): number =>
  Math.ceil(props.items.length / ROWS_PER_PAGE)
)

const pages = computed((): IPercentInstallmentList[][] => {
  const result: IPercentInstallmentList[][] = []
  for (let i = 0; i < props.items.length; i += ROWS_PER_PAGE) {
    result.push(props.items.slice(i, i + ROWS_PER_PAGE))
  }
  return result
})
</script>
