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
      <DocumentMenuAction
        @delete="emits('delete', item)"
        @edit="emits('edit', item)"
        @read="emits('read', item)" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import type { IContractDocumentList } from '@/models/response/contract/ContractRes.model'
import type { IColumn } from '@/models/Table.model'
import { formatTitle } from '@/enums/modules/contract/DocumentType.enum'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import DocumentMenuAction from './DocumentMenuAction.vue'

interface IProps {
  items: IContractDocumentList[]
}

const props = defineProps<IProps>()

interface IEmits {
  update: []
  read: [item: IContractDocumentList]
  edit: [item: IContractDocumentList]
  delete: [item: IContractDocumentList]
}

const emits = defineEmits<IEmits>()

const dayjs = useDayjs()
const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IContractDocumentList>[]>([
  { field: 'createdAt', header: 'วันที่', value: (e: IContractDocumentList): string => dayjs.formatDate(e?.createdAt || '') },
  { field: 'documentType', header: 'ประเภทเอกสาร', value: (e: IContractDocumentList): string => formatTitle(e?.documentType) },
  { field: 'detail', header: 'คำอธิบาย', bodyClass: 'max-w-[200px]' },
  { field: 'warehouse', header: 'จุดจัดเก็บ', align: 'right', value: (e: IContractDocumentList): string => e?.warehouse?.name || '-' },
  { field: 'action', header: 'จัดการ' }
])
</script>

<style scoped></style>
