<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="items"
    :items-footer="itemsFooter"
    disable-auto-left-padding
    show-footer
    @update="emits('update')">
    <template #[`item.contractNo`]="{ item }">
      <LinkText :to="{}">
        {{ item.contract?.idNo }}
      </LinkText>
    </template>
    <template #[`item.totalAmount`]="{ item }">
      <div>{{ formatter.numberFormat(item.totalAmount) }}</div>
      <div>{{ formatter.numberFormat(item.period) }}</div>
    </template>
    <template #[`item.totalAmountNet`]="{ item }">
      <div>{{ formatter.numberFormat(item.totalAmountNet) }}</div>
      <div>{{ formatter.numberFormat(item.netPeriod) }}</div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import { generateTableFooter, type IFooterColConfig } from '@/utils/TableFooter'
import type { IOutstandingDebtorList, IOutStandingDebtorSummary } from '@/models/response/report/outstanding-debtor/OutstandingDebtorRes.model'
import type { IColumn, IFooter } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IOutstandingDebtorList[]
  summary?: IOutStandingDebtorSummary
}

const props = defineProps<IProps>()

interface IEmits {
  delete: [id: number]
  update: []
}

const emits = defineEmits<IEmits>()
const dayjs = useDayjs()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IOutstandingDebtorList>[]>([
  { field: 'contractNo', header: 'เลขที่สัญญา', align: 'left', width: 60 },
  { field: 'customer', header: 'ชื่อลูกค้า', align: 'left', width: 150, value: (e: IOutstandingDebtorList): string => formatter.fullName(e.customer) },
  { field: 'type', header: 'ประเภทเงินกู้', align: 'left', width: 120, value: (e: IOutstandingDebtorList): string => e.type },
  { field: 'createdAt', header: 'วันที่ทำสัญญา', align: 'left', width: 120, value: (e: IOutstandingDebtorList): string => dayjs.formatDate(e.createdAt) },
  { field: 'contractExpirationDate', header: 'วันที่ครบสัญญา', align: 'right', width: 120, value: (e: IOutstandingDebtorList): string => dayjs.formatDate(e.contractExpirationDate) },
  { field: 'totalAmount', header: 'ยอดจัด/งวด', align: 'right', width: 120 },
  { field: 'totalAmountNet', header: 'ยอดจัดรวมดอกเบี้ย/งวด', align: 'right', width: 120 },
  { field: 'paid', header: 'ชำระแล้ว', align: 'right', width: 140, value: (e: IOutstandingDebtorList): string => formatter.numberFormat(e.paid) },
  { field: 'outstanding', header: 'ลูกหนี้คงเหลือ', align: 'right', width: 100, value: (e: IOutstandingDebtorList): string => formatter.numberFormat(e.outstanding) },
  { field: 'lastPaymentDate', header: 'วันที่ชำระล่าสุด', align: 'left', width: 100, value: (e: IOutstandingDebtorList): string => dayjs.formatDate(e.lastPaymentDate) },
  { field: 'latestPaymentAmount', header: 'ยอดชำระล่าสุด', align: 'right', width: 100, value: (e: IOutstandingDebtorList): string => formatter.numberFormat(e.latestPaymentAmount) }
])


const itemsFooter = computed((): IFooter[] => {
  const footerConfig: Partial<Record<keyof IOutStandingDebtorSummary, IFooterColConfig<IOutStandingDebtorSummary>>> = {
    customer: { value: `รวม ${props.summary?.customer || 0} สาขา` },
    totalAmount: { value: formatter.numberFormat2Decimal(props.summary?.totalAmount || 0), footerClass: 'text-end' },
    totalAmountNet: { value: formatter.numberFormat2Decimal(props.summary?.totalAmountNet || 0), footerClass: 'text-end' },
    paid: { value: formatter.numberFormat2Decimal(props.summary?.paid || 0), footerClass: 'text-end' },
    outstanding: { value: formatter.numberFormat2Decimal(props.summary?.outstanding || 0), footerClass: 'text-end' },
    latestPaymentAmount: { value: formatter.numberFormat2Decimal(props.summary?.latestPaymentAmount || 0), footerClass: 'text-end' }
  }
  return generateTableFooter(columns.value, props.summary, footerConfig)
})
</script>

<style scoped></style>
