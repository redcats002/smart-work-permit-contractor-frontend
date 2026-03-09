<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    :show-footer="!!props.selectCategoryId"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`header.action`]>
      <ModalIncomeTypeAction
        v-model="form"
        :disabled="!props.selectCategoryId"
        type="CREATE"
        @create="emits('create')"
        @delete="emits('delete',$event)"
        @update="emits('edit',$event)" />
    </template>
    <template #[`item.action`]="{ item }">
      <IncomeTypeMenuAction
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
import type { IActionFinanceIncomeCategoryPayload } from '@/models/request/finance-income-category/FinanceIncomeCategoryReq.model'
import type { IFinanceIncomeTypeList } from '@/models/response/finance-income-type/FinanceIncomeTypeRes.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import IncomeTypeMenuAction from './IncomeTypeMenuAction.vue'
import ModalIncomeTypeAction from './ModalIncomeTypeAction.vue'

interface IProps {
  items: IFinanceIncomeTypeList[]
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

const columns = ref<IColumn<IFinanceIncomeTypeList>[]>([
  { field: 'name', header: 'ประเภทรายได้', align: 'left', value: (e: IFinanceIncomeTypeList): string => e?.name || '' },
  { field: 'action', header: '', align: 'right' }
])
</script>

<style scoped>
:deep(tr.is-active-row td) {
  background: var(--color-primary-50) !important;
}
</style>
