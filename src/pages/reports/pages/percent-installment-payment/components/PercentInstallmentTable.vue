<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    :items-footer="itemsFooter"
    disable-auto-left-padding
    show-footer
    @update="emits('update')">
    <template #[`item.index`]="{ index }">
      {{ index + 1 }}
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import { generateTableFooter, type IFooterColConfig } from '@/utils/TableFooter'
import type {
  IPercentInstallmentList,
  IPercentInstallmentSummary
} from '@/models/response/report/percent-installment/PercentInstallmentRes.model'
import type { IColumn, IFooter } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IPercentInstallmentList[]
  summary?: IPercentInstallmentSummary
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

const columns = ref<IColumn<IPercentInstallmentList>[]>([
  { field: 'index', header: 'ลำดับ', align: 'left', width: 60 },
  { field: 'branchName', header: 'สาขา', align: 'left', width: 150 },
  {
    field: 'monthlyInstallment',
    header: 'ค่างวด/งวด',
    align: 'right',
    width: 120,
    value: (e: IPercentInstallmentList): string => formatter.numberFormat(e.monthlyInstallment)
  },
  {
    field: 'amountPaid',
    header: 'รับค่างวด',
    align: 'right',
    width: 120,
    value: (e: IPercentInstallmentList): string => formatter.numberFormat(e.amountPaid)
  },
  {
    field: 'salePrice',
    header: 'ขาย',
    align: 'right',
    width: 120,
    value: (e: IPercentInstallmentList): string => formatter.numberFormat(e.salePrice)
  },
  {
    field: 'totalPenaltyFee',
    header: 'รับค่าปรับ',
    align: 'right',
    width: 120,
    value: (e: IPercentInstallmentList): string => formatter.numberFormat(e.totalPenaltyFee)
  },
  {
    field: 'totalCollectionFee',
    header: 'ค่าติดตาม',
    align: 'right',
    width: 120,
    value: (e: IPercentInstallmentList): string => formatter.numberFormat(e.totalCollectionFee)
  },
  {
    field: 'summary',
    header: 'รวม',
    align: 'right',
    width: 140,
    value: (e: IPercentInstallmentList): string => formatter.numberFormat(e.summary)
  },
  {
    field: 'percent',
    header: '%',
    align: 'right',
    width: 100,
    value: (e: IPercentInstallmentList): string => `${formatter.numberFormat(e.percent)} %`
  }
])

const itemsFooter = computed((): IFooter[] => {
  type TConfig = Partial<Record<keyof IPercentInstallmentList, IFooterColConfig<IPercentInstallmentSummary>>>
  const footerConfig: TConfig = {
    branchName: { value: 'รวม' },
    monthlyInstallment: {
      format: (v: number): string => formatter.numberFormat(v ?? 0),
      footerClass: 'text-right'
    },
    amountPaid: {
      format: (v: number): string => formatter.numberFormat(v ?? 0),
      footerClass: 'text-right'
    },
    salePrice: {
      format: (v: number): string => formatter.numberFormat(v ?? 0),
      footerClass: 'text-right'
    },
    totalPenaltyFee: {
      format: (v: number): string => formatter.numberFormat(v ?? 0),
      footerClass: 'text-right'
    },
    totalCollectionFee: {
      format: (v: number): string => formatter.numberFormat(v ?? 0),
      footerClass: 'text-right'
    },
    summary: {
      format: (v: number): string => formatter.numberFormat(v ?? 0),
      footerClass: 'text-right'
    },
    percent: {
      format: (v: number): string => `${formatter.numberFormat(v ?? 0)} %`,
      footerClass: 'text-right'
    }
  }
  return generateTableFooter(columns.value, props.summary, footerConfig)
})
</script>

<style scoped></style>
