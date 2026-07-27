<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    :items-footer="itemsFooter"
    footer-bg-class="bg-(--p-gray-4)"
    disable-auto-left-padding
    show-footer
    @update="emits('update')">
    <template #[`item.no`]="{ index }">
      {{ index + 1 }}
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import { generateTableFooter, type IFooterColConfig } from '@/utils/TableFooter'
import type {
  ICurrentComparativeAccountList,
  ICurrentComparativeAccountSummary
} from '@/models/response/report/current-comparative-account/CurrentComparativeAccountRes.model'
import type { IColumn, IFooter } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: ICurrentComparativeAccountList[]
  summary?: ICurrentComparativeAccountSummary
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

const columns = ref<IColumn<ICurrentComparativeAccountList>[]>([
  {
    field: 'no',
    header: 'ลำดับ',
    align: 'center',
    style: { width: '70px', minWidth: '70px' }
  },
  { field: 'branchName', header: 'สาขา', align: 'left', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' } },
  {
    field: 'contractAmount',
    header: 'จำนวนสัญญา',
    align: 'left',
    style: { width: '140px', minWidth: '140px' },
    value: (e: ICurrentComparativeAccountList): string => formatter.numberFormat(e.contractAmount ?? 0)
  },
  {
    field: 'principal',
    header: 'เงินต้น (บาท)',
    align: 'right',
    style: { width: '140px', minWidth: '140px' },
    value: (e: ICurrentComparativeAccountList): string => formatter.numberFormat2Decimal(e.principal ?? 0)
  },
  {
    field: 'principalAndInterest',
    header: 'เงินต้นรวมดอกเบี้ย (บาท)',
    align: 'right',
    style: { width: '140px', minWidth: '140px' },
    value: (e: ICurrentComparativeAccountList): string => formatter.numberFormat2Decimal(e.principalAndInterest ?? 0)
  },
  {
    field: 'amountPaid',
    header: 'ยอดตัดลูกหนี้ (บาท)',
    align: 'right',
    style: { width: '140px', minWidth: '140px' },
    value: (e: ICurrentComparativeAccountList): string => formatter.numberFormat2Decimal(e.amountPaid ?? 0)
  },
  {
    field: 'settlementDiscount',
    header: 'ส่วนลด (บาท)',
    align: 'right',
    style: { width: '140px', minWidth: '140px' },
    value: (e: ICurrentComparativeAccountList): string => formatter.numberFormat2Decimal(e.settlementDiscount ?? 0)
  },
  {
    field: 'remainingAmount',
    header: 'บัญชีเทียบปัจจุบัน (บาท)',
    align: 'right',
    style: { width: '140px', minWidth: '140px' },
    value: (e: ICurrentComparativeAccountList): string => formatter.numberFormat2Decimal(e.remainingAmount ?? 0)
  }
])

const itemsFooter = computed((): IFooter[] => {
  type TConfig = Partial<Record<keyof ICurrentComparativeAccountList, IFooterColConfig<ICurrentComparativeAccountSummary>>>
  const footerConfig: TConfig = {
    branchName: {
      value: (s: ICurrentComparativeAccountSummary): string => `รวม ${s.numberOfBranches || 0} สาขา`
    },
    contractAmount: {
      format: (v: number): string => formatter.numberFormat(v ?? 0)
    },
    principal: {
      format: (v: number): string => formatter.numberFormat2Decimal(v ?? 0),
      footerClass: 'text-right'
    },
    principalAndInterest: {
      format: (v: number): string => formatter.numberFormat2Decimal(v ?? 0),
      footerClass: 'text-right'
    },
    amountPaid: {
      format: (v: number): string => formatter.numberFormat2Decimal(v ?? 0),
      footerClass: 'text-right'
    },
    settlementDiscount: {
      format: (v: number): string => formatter.numberFormat2Decimal(v ?? 0),
      footerClass: 'text-right'
    },
    remainingAmount: {
      format: (v: number): string => formatter.numberFormat2Decimal(v ?? 0),
      footerClass: 'text-right'
    }
  }
  return generateTableFooter(columns.value, props.summary, footerConfig)
})
</script>

<style scoped></style>
