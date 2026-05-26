<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.image`]="{ item }">
      <a
        v-if="item.image"
        :href="item.image"
        class="text-blue-500 underline text-sm"
        rel="noopener noreferrer"
        target="_blank">
        {{ item.fileName || 'ดูไฟล์' }}
      </a>
      <span
        v-else
        class="text-surface-400">-</span>
    </template>
    <template #[`item.action`]="{ item }">
      <PrivateDocumentMenuAction
        @delete="emits('delete', item)"
        @edit="emits('edit', item)"
        @read="emits('read', item)" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ICustomerDocumentById } from '@/models/response/customer/CustomerRes.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import PrivateDocumentMenuAction from './PrivateDocumentMenuAction.vue'

interface IProps {
  items: ICustomerDocumentById[]
}

const props = defineProps<IProps>()

interface IEmits {
  update: []
  read: [item: ICustomerDocumentById]
  edit: [item: ICustomerDocumentById]
  delete: [item: ICustomerDocumentById]
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', { required: true })
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<ICustomerDocumentById>[]>([
  { field: 'name', header: 'ประเภทเอกสาร', align: 'left', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' } },
  { field: 'location', header: 'จุดจัดเก็บ', align: 'left', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: ICustomerDocumentById): string => e?.location?.name || '-' },
  { field: 'action', header: 'จัดการ', align: 'right', style: { width: '80px', minWidth: '80px' } }
])
</script>

<style scoped></style>
