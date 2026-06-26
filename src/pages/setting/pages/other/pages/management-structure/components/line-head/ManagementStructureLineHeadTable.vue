<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :hide-pagination="!props.selectZoneManagerId"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`header.action`]>
      <ModalManagementStructureLineHeadAction
        v-model="form"
        :disabled="!props.selectZoneManagerId"
        type="CREATE"
        @create="emits('create')"
        @delete="emits('delete',$event)"
        @update="emits('edit',$event)" />
    </template>
    <template #[`item.action`]="{ item }">
      <ManagementStructureLineHeadMenuAction
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
import type { IActionManagementStructureZoneManagerPayload } from '@/models/request/management-structure-zone-manager/ManagementStructureZoneManagerReq.model'
import type { IManagementStructureLineHeadList } from '@/models/response/management-structure-line-head/ManagementStructureLineHeadRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import ManagementStructureLineHeadMenuAction from './ManagementStructureLineHeadMenuAction.vue'
import ModalManagementStructureLineHeadAction from './ModalManagementStructureLineHeadAction.vue'

interface IProps {
  items: IManagementStructureLineHeadList[]
  selectZoneManagerId?: TBaseParamsId | null
}

const props = defineProps<IProps>()

interface IEmits {
  create: []
  update: []
  delete: [id: TBaseParamsId]
  edit: [id: TBaseParamsId]
}

const emits = defineEmits<IEmits>()

const form = defineModel<IActionManagementStructureZoneManagerPayload>('form', { required: true })
const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IManagementStructureLineHeadList>[]>([
  { field: 'name', header: 'หัวหน้าสาย', align: 'left', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IManagementStructureLineHeadList): string => e?.name || '' },
  { field: 'action', header: '', align: 'right', style: { width: '80px', minWidth: '80px' } }
])
</script>

<style scoped>
:deep(tr.is-active-row td) {
  background: var(--color-primary-50) !important;
}
</style>
