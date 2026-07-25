<template>
  <BasePrintPage
    :page-count="totalPages || 1"
    title="รายงานการรับชำระเงินลูกหนี้ปิดบัญชี">
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
              วันที่ใบชำระเงิน
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
            <th class="p-1.5 text-right text-[9px]">
              เงินต้น
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ดอกเบี้ย
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ค่าใช้จ่ายอื่นๆ
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ส่วนลดดอกเบี้ย
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ส่วนลดอื่นๆ
            </th>
            <th class="p-1.5 text-right text-[9px]">
              ยอดชำระรวม
            </th>
            <th class="p-1.5 text-left text-[9px]">
              หมวดหมู่หลักทรัพย์
            </th>
            <th class="p-1.5 text-left text-[9px]">
              ประเภทลูกหนี้ปิดบัญชี
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in pages[page]"
            :key="`${item.id}-${i}`"
            class="border-b border-zinc-200">
            <td class="p-1.5">
              {{ dayjs.formatDate(item.date) }}
            </td>
            <td class="p-1.5">
              {{ item.receipt.idNo }}
            </td>
            <td class="p-1.5">
              {{ item.contract.idNo }}
            </td>
            <td class="p-1.5">
              {{ item.customer.fullName || '-' }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(item.principal) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(item.interest) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(item.otherExpense) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(item.discountInterest) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(item.discountOther) }}
            </td>
            <td class="p-1.5 text-right font-semibold">
              {{ formatter.numberFormat(item.totalAmount) }}
            </td>
            <td class="p-1.5">
              {{ formatAssetType(item.assets?.[0] as any) }}
            </td>
            <td class="p-1.5">
              {{ formatReceiptType(item.receipt.receiptType as any) }}
            </td>
          </tr>
        </tbody>
        <tfoot v-if="page === totalPages - 1">
          <tr class="bg-zinc-200 font-bold border-t-2 border-zinc-700">
            <td
              class="p-1.5"
              colspan="4">
              รวมทั้งสิ้น
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(totalPrincipal) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(totalInterest) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(totalOtherExpense) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(totalDiscountInterest) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(totalDiscountOther) }}
            </td>
            <td class="p-1.5 text-right">
              {{ formatter.numberFormat(totalAmount) }}
            </td>
            <td class="p-1.5" />
            <td class="p-1.5" />
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
import type { IAccountClosureList } from '@/models/response/report/account-closure/AccountClosureRes.model'
import { formatTitle as formatAssetType } from '@/enums/modules/asset/AssetType.enum'
import { formatTitle as formatReceiptType } from '@/enums/modules/finance/receipt/ReceiptType.enum'
import BasePrintPage from '@/components/base/BasePrintPage.vue'

interface IProps {
  items: IAccountClosureList[]
}

const props = defineProps<IProps>()
const dayjs = useDayjs()
const ROWS_PER_PAGE = 20

const totalPages = computed((): number =>
  Math.ceil(props.items.length / ROWS_PER_PAGE)
)

const pages = computed((): IAccountClosureList[][] => {
  const result: IAccountClosureList[][] = []
  for (let i = 0; i < props.items.length; i += ROWS_PER_PAGE) {
    result.push(props.items.slice(i, i + ROWS_PER_PAGE))
  }
  return result
})

const totalPrincipal = computed((): number =>
  props.items.reduce((sum: number, item: IAccountClosureList): number => sum + item.principal, 0)
)

const totalInterest = computed((): number =>
  props.items.reduce((sum: number, item: IAccountClosureList): number => sum + item.interest, 0)
)

const totalOtherExpense = computed((): number =>
  props.items.reduce((sum: number, item: IAccountClosureList): number => sum + item.otherExpense, 0)
)

const totalDiscountInterest = computed((): number =>
  props.items.reduce((sum: number, item: IAccountClosureList): number => sum + item.discountInterest, 0)
)

const totalDiscountOther = computed((): number =>
  props.items.reduce((sum: number, item: IAccountClosureList): number => sum + item.discountOther, 0)
)

const totalAmount = computed((): number =>
  props.items.reduce((sum: number, item: IAccountClosureList): number => sum + item.totalAmount, 0)
)
</script>
