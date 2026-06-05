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
import type { IDailyBranchSummaryList } from '@/models/response/report/daily-branch-summary/DailyBranchSummaryRes.model'
import type { IColumn, IFooter } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IDailyBranchSummaryList[]
}

interface IEmits {
  update: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', { required: true })
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IDailyBranchSummaryList>[]>([
  { field: 'index', header: 'ลำดับ', align: 'left', style: { width: '70px', minWidth: '70px' }, width: 60 },
  { field: 'branchName', header: 'สาขา', align: 'left', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, width: 150 },
  { field: 'financeReceive', header: 'รับไฟแนนซ์', align: 'right', style: { width: '140px', minWidth: '140px' }, width: 120, value: (e: IDailyBranchSummaryList): string => formatter.numberFormat(e.financeReceive) },
  { field: 'financeRelease', header: 'ปล่อยไฟแนนซ์', align: 'right', style: { width: '140px', minWidth: '140px' }, width: 120, value: (e: IDailyBranchSummaryList): string => formatter.numberFormat(e.financeRelease) },
  { field: 'processingFee', header: 'ค่าดำเนินการ', align: 'right', style: { width: '140px', minWidth: '140px' }, width: 120, value: (e: IDailyBranchSummaryList): string => formatter.numberFormat(e.processingFee) },
  { field: 'salePrice', header: 'ขาย', align: 'right', style: { width: '140px', minWidth: '140px' }, width: 120, value: (e: IDailyBranchSummaryList): string => formatter.numberFormat(e.salePrice) },
  { field: 'depositFee', header: 'เงินประกัน', align: 'right', style: { width: '140px', minWidth: '140px' }, width: 120, value: (e: IDailyBranchSummaryList): string => formatter.numberFormat(e.depositFee) },
  { field: 'cancelContractFee', header: 'ยกเลิกสัญญา', align: 'right', style: { width: '140px', minWidth: '140px' }, width: 140, value: (e: IDailyBranchSummaryList): string => formatter.numberFormat(e.cancelContractFee) },
  { field: 'lawyerFee', header: 'ค่าทนาย', align: 'right', style: { width: '140px', minWidth: '140px' }, width: 100, value: (e: IDailyBranchSummaryList): string => formatter.numberFormat(e.lawyerFee) },
  { field: 'contractReplacementFee', header: 'เปลี่ยนสัญญา', align: 'right', style: { width: '140px', minWidth: '140px' }, width: 100, value: (e: IDailyBranchSummaryList): string => formatter.numberFormat(e.contractReplacementFee) },
  { field: 'outstanding', header: 'เงินคงเหลือ', align: 'right', style: { width: '140px', minWidth: '140px' }, width: 100, value: (e: IDailyBranchSummaryList): string => formatter.numberFormat(e.outstanding) }
])

type TSummary = Record<keyof Omit<IDailyBranchSummaryList, 'branchId' | 'branchName'>, number>

const summary = computed((): TSummary => ({
  financeReceive: props.items.reduce((acc: number, e: IDailyBranchSummaryList): number => acc + (e.financeReceive ?? 0), 0),
  financeRelease: props.items.reduce((acc: number, e: IDailyBranchSummaryList): number => acc + (e.financeRelease ?? 0), 0),
  processingFee: props.items.reduce((acc: number, e: IDailyBranchSummaryList): number => acc + (e.processingFee ?? 0), 0),
  salePrice: props.items.reduce((acc: number, e: IDailyBranchSummaryList): number => acc + (e.salePrice ?? 0), 0),
  depositFee: props.items.reduce((acc: number, e: IDailyBranchSummaryList): number => acc + (e.depositFee ?? 0), 0),
  cancelContractFee: props.items.reduce((acc: number, e: IDailyBranchSummaryList): number => acc + (e.cancelContractFee ?? 0), 0),
  lawyerFee: props.items.reduce((acc: number, e: IDailyBranchSummaryList): number => acc + (e.lawyerFee ?? 0), 0),
  contractReplacementFee: props.items.reduce((acc: number, e: IDailyBranchSummaryList): number => acc + (e.contractReplacementFee ?? 0), 0),
  outstanding: props.items.reduce((acc: number, e: IDailyBranchSummaryList): number => acc + (e.outstanding ?? 0), 0)
}))

const itemsFooter = computed((): IFooter[] => {
  const config: Partial<Record<keyof IDailyBranchSummaryList, IFooterColConfig<TSummary>>> = {
    branchName: { value: 'รวมสุทธิ' },
    financeReceive: { format: formatter.numberFormat, footerClass: 'text-right' },
    financeRelease: { format: formatter.numberFormat, footerClass: 'text-right' },
    processingFee: { format: formatter.numberFormat, footerClass: 'text-right' },
    salePrice: { format: formatter.numberFormat, footerClass: 'text-right' },
    depositFee: { format: formatter.numberFormat, footerClass: 'text-right' },
    cancelContractFee: { format: formatter.numberFormat, footerClass: 'text-right' },
    lawyerFee: { format: formatter.numberFormat, footerClass: 'text-right' },
    contractReplacementFee: { format: formatter.numberFormat, footerClass: 'text-right' },
    outstanding: { format: formatter.numberFormat, footerClass: 'text-right' }
  }
  return generateTableFooter(columns.value, summary.value, config)
})
</script>

<style scoped></style>
