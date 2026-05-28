<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.index`]="{ index }">
      {{ index + 1 }}
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { ISummaryStockList } from '@/models/response/report/summary-stock/SummaryStockRes.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: ISummaryStockList[]
}

const props = defineProps<IProps>()

interface IEmits {
  update: []
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', { required: true })
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<ISummaryStockList>[]>([
  { field: 'index', header: 'ลำดับ', align: 'left', style: { width: '70px', minWidth: '70px' }, width: 60 },
  { field: 'branchName', header: 'สาขา', align: 'left', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, width: 150 },
  { field: 'headOfficeStock', header: 'สต็อกสำนักงานใหญ่', align: 'center', style: { width: '160px', minWidth: '160px' }, width: 140, value: (e: ISummaryStockList): string => formatter.numberFormat2Decimal(e.headOfficeStock) },
  { field: 'branchStock', header: 'สต็อกสาขา', align: 'center', style: { width: '140px', minWidth: '140px' }, width: 120, value: (e: ISummaryStockList): string => formatter.numberFormat2Decimal(e.branchStock) },
  { field: 'stockInOtherBranch', header: 'สต็อกสาขาอื่น', align: 'center', style: { width: '140px', minWidth: '140px' }, width: 120, value: (e: ISummaryStockList): string => formatter.numberFormat2Decimal(e.stockInOtherBranch) },
  { field: 'stockReceivedFromOtherBranches', header: 'รับจากสาขาอื่น', align: 'center', style: { width: '150px', minWidth: '150px' }, width: 130, value: (e: ISummaryStockList): string => formatter.numberFormat2Decimal(e.stockReceivedFromOtherBranches) },
  { field: 'legalExecutionStock', header: 'สต็อกบังคับคดี', align: 'center', style: { width: '150px', minWidth: '150px' }, width: 130, value: (e: ISummaryStockList): string => formatter.numberFormat2Decimal(e.legalExecutionStock) },
  { field: 'total', header: 'รวม', align: 'center', style: { width: '140px', minWidth: '140px' }, width: 120, value: (e: ISummaryStockList): string => formatter.numberFormat2Decimal(e.total) },
  { field: 'moving', header: 'กำลังโอนย้าย', align: 'center', style: { width: '140px', minWidth: '140px' }, width: 120, value: (e: ISummaryStockList): string => formatter.numberFormat2Decimal(e.moving) },
  { field: 'lastTotal', header: 'รวมทั้งหมด', align: 'center', style: { width: '140px', minWidth: '140px' }, width: 140, value: (e: ISummaryStockList): string => formatter.numberFormat2Decimal(e.lastTotal) }
])
</script>

<style scoped></style>
