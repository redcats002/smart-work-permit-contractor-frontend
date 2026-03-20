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
  </BaseTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import { generateTableFooter, type IFooterColConfig } from '@/utils/TableFooter'
import type { IOverdueCustomerList, IOverdueCustomerSummary } from '@/models/response/report/overdue-customer/OverdueCustomerRes.model'
import type { IColumn, IFooter } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IOverdueCustomerList[]
  summary?: IOverdueCustomerSummary
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

const columns = ref<IColumn<IOverdueCustomerList>[]>([
  { field: 'createdAt', header: 'วันที่', align: 'left', width: 120, value: (e: IOverdueCustomerList): string => dayjs.formatDate(e.createdAt) },
  { field: 'dueDate', header: 'วันที่ทำสัญญา', align: 'left', width: 120, value: (e: IOverdueCustomerList): string => dayjs.formatDate(e.dueDate) },
  { field: 'contractNo', header: 'เลขที่สัญญา', align: 'left', width: 60 },
  { field: 'customer', header: 'ชื่อลูกค้า', align: 'left', width: 150, value: (e: IOverdueCustomerList): string => formatter.fullName(e.customer) },
  { field: 'totalAmount', header: 'ยอดจัด', align: 'right', width: 120, value: (e: IOverdueCustomerList): string => formatter.numberFormat(e.totalAmount) },
  { field: 'totalAmountNet', header: 'ยอดจัดรวมดอกเบี้ย', align: 'right', width: 120, value: (e: IOverdueCustomerList): string => formatter.numberFormat(e.totalAmountNet) },
  { field: 'paidAmount', header: 'ชำระแล้ว', align: 'right', width: 140, value: (e: IOverdueCustomerList): string => formatter.numberFormat(e.paidAmount) },
  { field: 'remainAmount', header: 'คงเหลือ', align: 'right', width: 100, value: (e: IOverdueCustomerList): string => formatter.numberFormat(e.remainAmount) },
  { field: 'lastPaymentDate', header: 'วันที่ชำระล่าสุด', align: 'left', width: 100, value: (e: IOverdueCustomerList): string => dayjs.formatDate(e.latestPaymentDate) },
  { field: 'outstanding', header: 'ค้างชำระ', align: 'right', width: 100, value: (e: IOverdueCustomerList): string => formatter.numberFormat(e.outstanding) },
  { field: 'installmentAmount', header: 'งวดค้าง', align: 'right', width: 100, value: (e: IOverdueCustomerList): string => formatter.numberFormat(e.installmentAmount) }
])


const itemsFooter = computed((): IFooter[] => {
  const footerConfig: Partial<Record<keyof IOverdueCustomerSummary, IFooterColConfig<IOverdueCustomerSummary>>> = {
    customer: { value: `รวม ${props.summary?.customer || 0} สาขา` },
    totalAmount: { value: formatter.numberFormat2Decimal(props.summary?.totalAmount || 0), footerClass: 'text-end' },
    totalAmountNet: { value: formatter.numberFormat2Decimal(props.summary?.totalAmountNet || 0), footerClass: 'text-end' },
    paidAmount: { value: formatter.numberFormat2Decimal(props.summary?.paidAmount || 0), footerClass: 'text-end' },
    outstanding: { value: formatter.numberFormat2Decimal(props.summary?.outstanding || 0), footerClass: 'text-end' }
  }
  return generateTableFooter(columns.value, props.summary, footerConfig)
})
</script>

<style scoped></style>
