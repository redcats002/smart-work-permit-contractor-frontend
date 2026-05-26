<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.idNo`]="{ item }">
      <LinkText :to="{ name: 'AssetDetailPage', params: { id: item?.id } }">
        {{ item?.idNo }}
      </LinkText>
    </template>
    <template #[`item.contract.idNo`]="{ item }">
      <LinkText :to="{ name: 'ContractDetailPage', params: { id: item?.contract?.id } }">
        {{ item?.contract?.idNo }}
      </LinkText>
    </template>
    <template #[`item.status`]="{ item }">
      <ChipAssetStatus :value="item.status" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IDocumentAssetList } from '@/models/response/document-storage/DocumentStorageRes.model'
import type { IColumn } from '@/models/Table.model'
import { formatTitle } from '@/enums/modules/asset/AssetType.enum'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import ChipAssetStatus from './ChipAssetStatus.vue'

interface IProps {
  items: IDocumentAssetList[]
}

const props = defineProps<IProps>()

interface IEmits {
  delete: [id: number]
  update: []
}

const emits = defineEmits<IEmits>()
const { formatDate } = useDayjs()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IDocumentAssetList>[]>([
  { field: 'idNo', header: 'เลขที่หลักทรัพย์', sortable: true, style: { width: '130px', minWidth: '130px' } },
  { field: 'contract.idNo', header: 'เลขที่สัญญา', sortable: true, style: { width: '130px', minWidth: '130px' } },
  { field: 'createdAt', header: 'วันที่รับเข้า', style: { width: '120px', minWidth: '120px' }, value: (e: IDocumentAssetList): string => formatDate(e?.createdAt) || '' },
  { field: 'customerName', header: 'ชื่อลูกค้า', style: { width: '180px', minWidth: '180px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IDocumentAssetList): string => formatter.fullName(e?.contract?.customer) },
  { field: 'type', header: 'หมวดหมู่', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IDocumentAssetList): string => formatTitle(e?.type) },
  { field: 'warehouse', header: 'คลัง', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IDocumentAssetList): string => e?.location?.warehouse?.name },
  { field: 'storageLocation', header: 'จุดจัดเก็บ', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IDocumentAssetList): string => e?.location?.name },
  { field: 'status', header: 'สถานะ', sortable: true, style: { width: '120px', minWidth: '120px' } }
])
</script>

<style scoped></style>
