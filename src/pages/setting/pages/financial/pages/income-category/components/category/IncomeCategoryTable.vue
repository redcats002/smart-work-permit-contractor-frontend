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
      <ModalIncomeCategoryAction
        v-model="form"
        type="CREATE"
        @create="emits('create')"
        @delete="emits('delete',$event)"
        @update="emits('edit',$event)" />
    </template>
    <template #[`item.action`]="{ item }">
      <IncomeCategoryMenuAction
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
import type { IActionFinanceIncomeCategoryPayload } from '@/models/request/finance-income-type/FinanceIncomeTypeReq.model'
import type { IFinanceIncomeCategoryList } from '@/models/response/finance-income-category/FinanceIncomeCategoryRes.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import IncomeCategoryMenuAction from './IncomeCategoryMenuAction.vue'
import ModalIncomeCategoryAction from './ModalIncomeCategoryAction.vue'

interface IProps {
  items: IFinanceIncomeCategoryList[]
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

const form = defineModel<IActionFinanceIncomeCategoryPayload>('form', { required: true })
const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IFinanceIncomeCategoryList>[]>([
  { field: 'name', header: 'หมวดหมู่รายได้', align: 'left', value: (e: IFinanceIncomeCategoryList): string => e?.name || '' },
  { field: 'action', header: '', align: 'right' }
])

function rowClass (item: IFinanceIncomeCategoryList): string {
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
