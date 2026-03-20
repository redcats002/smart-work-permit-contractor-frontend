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
    <template #[`item.index`]="{ index }">
      {{ generator.generateOrder(index, pagination) }}
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import { generator } from '@/utils/Generator'
import { generateTableFooter, type IFooterColConfig } from '@/utils/TableFooter'
import type {
  ILoanDisbursementSummaryList,
  ILoanDisbursementSummarySummary
} from '@/models/response/report/loan-disbursement-summary/LoanDisbursementSummaryRes.model'
import type { IColumn, IFooter } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: ILoanDisbursementSummaryList[]
  summary?: ILoanDisbursementSummarySummary
}

const props = withDefaults(defineProps<IProps>(), {
  summary: undefined
})

interface IEmits {
  update: []
}

const emits = defineEmits<IEmits>()

const dayjs = useDayjs()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<ILoanDisbursementSummaryList>[]>([
  { field: 'index', header: 'ลำดับ', value: (e: ILoanDisbursementSummaryList): string => dayjs.formatDate(e?.createdAt) },
  { field: 'branch', header: 'สาขา', value: (e: ILoanDisbursementSummaryList): string => e.branch?.name || '' },
  { field: 'amount', header: 'จำนวน', value: (e: ILoanDisbursementSummaryList): string => formatter.numberFormat2Decimal(e?.amount) },
  { field: 'principal', header: 'เงินต้น', value: (e: ILoanDisbursementSummaryList): string => formatter.numberFormat2Decimal(e?.principal) },
  { field: 'interest', header: 'ดอกเบี้ย', value: (e: ILoanDisbursementSummaryList): string => formatter.numberFormat2Decimal(e?.interest) },
  { field: 'principalWithInterest', header: 'เงินต้นรวมดอกเบี้ย', value: (e: ILoanDisbursementSummaryList): string => formatter.numberFormat2Decimal(e?.principalWithInterest) },
  { field: 'installment', header: 'ค่างวด', value: (e: ILoanDisbursementSummaryList): string => formatter.numberFormat2Decimal(e?.installment) }
])

const itemsFooter = computed((): IFooter[] => {
  const footerConfig: Partial<Record<keyof ILoanDisbursementSummaryList, IFooterColConfig<ILoanDisbursementSummarySummary>>> = {
    branch: { value: `รวม ${props.summary?.numberOfBranches || 0} สาขา` },
    amount: { value: formatter.numberFormat2Decimal(props.summary?.amount || 0) },
    principal: { value: formatter.numberFormat2Decimal(props.summary?.principal || 0) },
    interest: { value: formatter.numberFormat2Decimal(props.summary?.interest || 0) },
    principalWithInterest: { value: formatter.numberFormat2Decimal(props.summary?.principalWithInterest || 0) },
    installment: { value: formatter.numberFormat2Decimal(props.summary?.installment || 0) }
  }
  return generateTableFooter(columns.value, props.summary, footerConfig)
})
</script>

<style scoped></style>
