<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:selection="selection"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="items"
    disable-auto-left-padding
    selectable
    @update="emits('update')">
    <template #[`item.idNo`]="{ item }">
      <LinkText :to="{ name: 'AssetDetailPage', params: { id: item?.id }}">
        {{ item?.idNo }}
      </LinkText>
    </template>
    <template #[`item.contract.idNo`]="{ item }">
      <LinkText :to="{ name: 'ContractDetailPage', params: { id: item?.contract?.id }}">
        {{ item?.contract.idNo }}
      </LinkText>
    </template>
    <template #[`item.action`]="{ item }">
      <Icon
        class="size-5 text-[#BD0102] cursor-pointer"
        icon="mdi:trash-can"
        @click="emits('delete', Number(item.id))" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IDocumentAssetList } from '@/models/response/document-storage/DocumentStorageRes.model'
import type { IColumn } from '@/models/Table.model'
import { formatTitle } from '@/enums/modules/contract/AssetType.enum'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import { Icon } from '@iconify/vue'

interface IProps {
  items: IDocumentAssetList[]
}

defineProps<IProps>()

interface IEmits {
  delete: [id: number]
  update: []
}

const emits = defineEmits<IEmits>()

const selection = defineModel<IDocumentAssetList[]>('selection', { default: (): IDocumentAssetList[] => [] })
const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IDocumentAssetList>[]>([
  { field: 'idNo', header: 'เลขที่หลักทรัพย์', sortable: true },
  { field: 'contract.idNo', header: 'เลขที่สัญญา', sortable: true },
  { field: 'customerName', header: 'ชื่อลูกค้า', value: (e: IDocumentAssetList): string => formatter.fullName(e?.contract?.customer) },
  { field: 'type', header: 'ประเภท', value: (e: IDocumentAssetList): string => formatTitle(e.type) || '' },
  { field: 'warehouse', header: 'คลัง', value: (e: IDocumentAssetList): string => e.location?.warehouse?.name || '' },
  { field: 'location', header: 'จุดจัดเก็บ', value: (e: IDocumentAssetList): string => e.location?.name || '' }
])

</script>

<style scoped></style>
