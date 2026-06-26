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
      <ModalManagementStructureZoneManagerAction
        v-model="form"
        type="CREATE"
        @create="emits('create')"
        @delete="emits('delete',$event)"
        @update="emits('edit',$event)" />
    </template>
    <template #[`item.action`]="{ item }">
      <ManagementStructureZoneManagerMenuAction
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
import type { IManagementStructureZoneManagerList } from '@/models/response/management-structure-zone-manager/ManagementStructureZoneManagerRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import ManagementStructureZoneManagerMenuAction from './ManagementStructureZoneManagerMenuAction.vue'
import ModalManagementStructureZoneManagerAction from './ModalManagementStructureZoneManagerAction.vue'

interface IProps {
  items: IManagementStructureZoneManagerList[]
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

const columns = ref<IColumn<IManagementStructureZoneManagerList>[]>([
  { field: 'name', header: 'ผู้จัดการเขต', align: 'left', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IManagementStructureZoneManagerList): string => e?.name || '' },
  { field: 'action', header: '', align: 'right', style: { width: '80px', minWidth: '80px' } }
])

function rowClass (item: IManagementStructureZoneManagerList): string {
  const baseClass = (className: string): string => `cursor-pointer ${className}`
  if (!props.selectZoneManagerId) return baseClass('')
  return item?.id === props.selectZoneManagerId ? baseClass('is-active-row') : baseClass('')
}
</script>

<style scoped>
:deep(tr.is-active-row td) {
  background: var(--color-primary-50) !important;
}
</style>
