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

const pagination = defineModel<IPagination>('pagination', {
  required: true
})
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<ILoanDisbursementSummaryList>[]>([
  { field: 'index', header: 'ลำดับ', style: { width: '70px', minWidth: '70px' } },
  { field: 'branchName', header: 'สาขา', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' } },
  {
    field: 'contractAmount',
    header: 'จำนวน',
    align: 'right',
    style: { width: '140px', minWidth: '140px' },
    value: (e: ILoanDisbursementSummaryList): string => formatter.numberFormat2Decimal(e?.contractAmount)
  },
  {
    field: 'principal',
    header: 'เงินต้น',
    align: 'right',
    style: { width: '140px', minWidth: '140px' },
    value: (e: ILoanDisbursementSummaryList): string => formatter.numberFormat2Decimal(e?.principal)
  },
  {
    field: 'interest',
    header: 'ดอกเบี้ย',
    align: 'right',
    style: { width: '140px', minWidth: '140px' },
    value: (e: ILoanDisbursementSummaryList): string => formatter.numberFormat2Decimal(e?.interest)
  },
  {
    field: 'principalAndInterest',
    header: 'เงินต้นรวมดอกเบี้ย',
    align: 'right',
    style: { width: '140px', minWidth: '140px' },
    value: (e: ILoanDisbursementSummaryList): string => formatter.numberFormat2Decimal(e?.principalAndInterest)
  },
  {
    field: 'monthlyInstallment',
    header: 'ค่างวด',
    align: 'right',
    style: { width: '140px', minWidth: '140px' },
    value: (e: ILoanDisbursementSummaryList): string => formatter.numberFormat2Decimal(e?.monthlyInstallment)
  }
])

const itemsFooter = computed((): IFooter[] => {
  const footerConfig: Partial<Record<keyof ILoanDisbursementSummaryList, IFooterColConfig<ILoanDisbursementSummarySummary>>> = {
    branchName: { value: `รวม ${props.summary?.numberOfBranches || 0} สาขา` },
    contractAmount: {
      format: (v: number): string => formatter.numberFormat2Decimal(v || 0),
      footerClass: 'text-right'
    },
    principal: {
      format: (v: number): string => formatter.numberFormat2Decimal(v || 0),
      footerClass: 'text-right'
    },
    interest: {
      format: (v: number): string => formatter.numberFormat2Decimal(v || 0),
      footerClass: 'text-right'
    },
    principalAndInterest: {
      format: (v: number): string => formatter.numberFormat2Decimal(v || 0),
      footerClass: 'text-right'
    },
    monthlyInstallment: {
      format: (v: number): string => formatter.numberFormat2Decimal(v || 0),
      footerClass: 'text-right'
    }
  }
  return generateTableFooter(columns.value, props.summary, footerConfig)
})
</script>

<style scoped></style>
