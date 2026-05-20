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
    @update="emits('update')" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import { generateTableFooter, type IFooterColConfig } from '@/utils/TableFooter'
import type { IOverdueCustomerList, IOverdueCustomerSummary } from '@/models/response/report/overdue-customer/OverdueCustomerRes.model'
import type { IColumn, IFooter } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IOverdueCustomerList[]
  summary?: IOverdueCustomerSummary
}

const props = defineProps<IProps>()

interface IEmits {
  update: []
}

const emits = defineEmits<IEmits>()
const dayjs = useDayjs()

const pagination = defineModel<IPagination>('pagination', { required: true })
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IOverdueCustomerList>[]>([
  { field: 'idNo', header: 'เลขที่สัญญา', align: 'left', width: 120 },
  { field: 'customerName', header: 'ชื่อลูกค้า', align: 'left', width: 160 },
  { field: 'createdAt', header: 'วันที่ทำสัญญา', align: 'left', width: 120, value: (e: IOverdueCustomerList): string => dayjs.formatDate(e.createdAt) },
  { field: 'finalInstallmentDate', header: 'วันที่งวดสุดท้าย', align: 'left', width: 130, value: (e: IOverdueCustomerList): string => dayjs.formatDate(e.finalInstallmentDate) },
  { field: 'principal', header: 'ยอดจัด', align: 'right', width: 110, value: (e: IOverdueCustomerList): string => formatter.numberFormat(e.principal) },
  { field: 'principalAndInterest', header: 'ยอดจัดรวมดอกเบี้ย', align: 'right', width: 140, value: (e: IOverdueCustomerList): string => formatter.numberFormat(e.principalAndInterest) },
  { field: 'amountPaid', header: 'ชำระแล้ว', align: 'right', width: 110, value: (e: IOverdueCustomerList): string => formatter.numberFormat(e.amountPaid) },
  { field: 'outstandingPrincipal', header: 'เงินต้นคงเหลือ', align: 'right', width: 120, value: (e: IOverdueCustomerList): string => formatter.numberFormat(e.outstandingPrincipal) },
  { field: 'lastPaidAt', header: 'วันที่ชำระล่าสุด', align: 'left', width: 130, value: (e: IOverdueCustomerList): string => dayjs.formatDate(e.lastPaidAt) },
  { field: 'overdueOutstandingAmount', header: 'ยอดค้างชำระ', align: 'right', width: 120, value: (e: IOverdueCustomerList): string => formatter.numberFormat(e.overdueOutstandingAmount) },
  { field: 'overdueOutstandingCount', header: 'งวดค้าง', align: 'right', width: 90, value: (e: IOverdueCustomerList): string => formatter.numberFormat(e.overdueOutstandingCount) }
])

const itemsFooter = computed((): IFooter[] => {
  const footerConfig: Partial<Record<keyof IOverdueCustomerList, IFooterColConfig<IOverdueCustomerSummary>>> = {
    idNo: { value: `รวม ${pagination.value.count || 0} รายการ` },
    principal: { value: formatter.numberFormat(props.summary?.principal || 0), footerClass: 'text-right' },
    principalAndInterest: { value: formatter.numberFormat(props.summary?.principalAndInterest || 0), footerClass: 'text-right' },
    amountPaid: { value: formatter.numberFormat(props.summary?.amountPaid || 0), footerClass: 'text-right' },
    outstandingPrincipal: { value: formatter.numberFormat(props.summary?.outstandingPrincipal || 0), footerClass: 'text-right' },
    overdueOutstandingAmount: { value: formatter.numberFormat(props.summary?.overdueOutstandingAmount || 0), footerClass: 'text-right' },
    overdueOutstandingCount: { value: formatter.numberFormat(props.summary?.overdueOutstandingCount || 0), footerClass: 'text-right' }
  }
  return generateTableFooter(columns.value, props.summary, footerConfig)
})
</script>

<style scoped></style>
