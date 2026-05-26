<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.action`]="{ item }">
      <ExpenseMenuAction
        class="flex justify-center"
        @delete="emits('delete', item)"
        @edit="emits('edit', item)"
        @read="emits('read', item)" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IContractExpenseList } from '@/models/response/contract-expense/ContractExpenseRes.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import ExpenseMenuAction from './ExpenseMenuAction.vue'

interface IProps {
  items: IContractExpenseList[]
}

const props = defineProps<IProps>()

interface IEmits {
  update: []
  read: [item: IContractExpenseList]
  edit: [item: IContractExpenseList]
  delete: [item: IContractExpenseList]
}

const emits = defineEmits<IEmits>()

const dayjs = useDayjs()
const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IContractExpenseList>[]>([
  { field: 'date', header: 'วันที่', style: { width: '120px', minWidth: '120px' }, value: (e: IContractExpenseList): string => dayjs.formatDate(e?.date || '') },
  { field: 'expenseCategory', header: 'ประเภทค่าใช้จ่าย', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IContractExpenseList): string => e?.expenseCategory?.name || '-' },
  { field: 'note', header: 'คำอธิบาย', style: { width: '220px', minWidth: '220px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, bodyClass: 'max-w-[200px]' },
  { field: 'amount', header: 'จำนวนเงิน', align: 'right', style: { width: '140px', minWidth: '140px' }, value: (e: IContractExpenseList): string => formatter.numberFormat2Decimal(e?.amount || 0) },
  { field: 'action', header: 'จัดการ', style: { width: '80px', minWidth: '80px' }, headerClass: 'text-center' }
])
</script>

<style scoped></style>
