<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :hide-pagination="!props.selectCategoryId"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`header.action`]>
      <ModalExpenseTypeAction
        v-model="form"
        :disabled="!props.selectCategoryId"
        type="CREATE"
        @create="emits('create')"
        @delete="emits('delete',$event)"
        @update="emits('edit',$event)" />
    </template>
    <template #[`item.action`]="{ item }">
      <ExpenseTypeMenuAction
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
import type { IActionFinanceExpenseTypePayload } from '@/models/request/finance-expense-type/FinanceExpenseTypeReq.model'
import type { IFinanceExpenseTypeList } from '@/models/response/finance-expense-type/FinanceExpenseTypeRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import ExpenseTypeMenuAction from './ExpenseTypeMenuAction.vue'
import ModalExpenseTypeAction from './ModalExpenseTypeAction.vue'

interface IProps {
  items: IFinanceExpenseTypeList[]
  selectCategoryId?: TBaseParamsId | null
}

const props = defineProps<IProps>()

interface IEmits {
  create: []
  update: []
  delete: [id: TBaseParamsId]
  edit: [id: TBaseParamsId]
}

const emits = defineEmits<IEmits>()

const form = defineModel<IActionFinanceExpenseTypePayload>('form', { required: true })
const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IFinanceExpenseTypeList>[]>([
  { field: 'name', header: 'ประเภทรายจ่าย', align: 'left', value: (e: IFinanceExpenseTypeList): string => e?.name || '' },
  { field: 'action', header: '', align: 'right' }
])
</script>

<style scoped>
:deep(tr.is-active-row td) {
  background: var(--color-primary-50) !important;
}
</style>
