<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    :row-class="rowClass"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`header.action`]>
      <ModalExpenseCategoryAction
        v-model="form"
        type="CREATE"
        @create="emits('create')"
        @delete="emits('delete',$event)"
        @update="emits('edit',$event)" />
    </template>
    <template #[`item.action`]="{ item }">
      <ExpenseCategoryMenuAction
        v-if="item?.id"
        v-model="form"
        :item="item"
        @delete="emits('delete', $event)"
        @edit="emits('edit', $event)" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IActionFinanceExpenseCategoryPayload } from '@/models/request/finance-expense-category/FinanceExpenseCategoryReq.model'
import type { IFinanceExpenseCategoryList } from '@/models/response/finance-expense-category/FinanceExpenseCategoryRes.model'
import type { IColumn } from '@/models/Table.model'
import { formatTitle } from '@/enums/modules/finance/ExternalInternalExpense.enum'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import ExpenseCategoryMenuAction from './ExpenseCategoryMenuAction.vue'
import ModalExpenseCategoryAction from './ModalExpenseCategoryAction.vue'

interface IProps {
  items: IFinanceExpenseCategoryList[]
  selectCategoryId?: number | null
}

const props = defineProps<IProps>()

interface IEmits {
  create: []
  update: []
  delete: [id: number]
  edit: [id: number]
}

const emits = defineEmits<IEmits>()

const form = defineModel<IActionFinanceExpenseCategoryPayload>('form', { required: true })
const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IFinanceExpenseCategoryList>[]>([
  { field: 'name', header: 'หมวดหมู่รายจ่าย', align: 'left', value: (e: IFinanceExpenseCategoryList): string => e?.name || '' },
  { field: 'externalInternalExpense', header: 'ค่าใช้จ่าย ภายนอก/ภายใน', align: 'left', value: (e: IFinanceExpenseCategoryList): string => formatTitle(e?.externalInternalExpense) },
  { field: 'action', header: '', align: 'right' }
])

function rowClass (item: IFinanceExpenseCategoryList): string {
  const baseClass = (className: string): string => `cursor-pointer ${className}`
  if (!props.selectCategoryId) return baseClass('')
  return item?.id === props.selectCategoryId ? baseClass('is-active-row') : baseClass('')
}
</script>

<style scoped>
:deep(tr.is-active-row td) {
  background: var(--color-primary-50) !important;
}
</style>
