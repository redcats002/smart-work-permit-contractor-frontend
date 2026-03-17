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
      <IncomeMenuAction
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
import type { IContractIncomeList } from '@/models/response/contract/ContractRes.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import IncomeMenuAction from './IncomeMenuAction.vue'

interface IProps {
  items: IContractIncomeList[]
}

const props = defineProps<IProps>()

interface IEmits {
  update: []
  read: [item: IContractIncomeList]
  edit: [item: IContractIncomeList]
  delete: [item: IContractIncomeList]
}

const emits = defineEmits<IEmits>()

const dayjs = useDayjs()
const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IContractIncomeList>[]>([
  { field: 'date', header: 'วันที่', value: (e: IContractIncomeList): string => dayjs.formatDate(e?.date || '') },
  { field: 'incomeCategory', header: 'ประเภทรายได้', value: (e: IContractIncomeList): string => e?.incomeCategory?.name || '-' },
  { field: 'note', header: 'คำอธิบาย', bodyClass: 'max-w-[200px]' },
  { field: 'amount', header: 'จำนวนเงิน', align: 'right', value: (e: IContractIncomeList): string => formatter.numberFormat2Decimal(e?.amount || 0) },
  { field: 'action', header: 'จัดการ', headerClass: 'text-center' }
])
</script>

<style scoped></style>
