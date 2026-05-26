<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="items"
    :selectable="!isPreview"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.idNo`]="{ item }">
      <LinkText :to="{ name: 'DocumentMovementDetailPage', params: { id: item?.id }}">
        {{ item?.idNo }}
      </LinkText>
    </template>
    <template #[`item.contract.idNo`]="{ item }">
      <LinkText :to="{ name: 'DocumentMovementDetailPage', params: { id: item?.contract?.id }}">
        {{ item?.contract.idNo }}
      </LinkText>
    </template>
    <template #[`item.location`]="{ item }">
      {{ item.location?.name }}
    </template>
    <template #[`item.action`]="{ item }">
      <div class="flex justify-end">
        <Icon
          class="size-5 text-[#BD0102] cursor-pointer"
          icon="mdi:trash-can"
          @click="emits('delete',Number(item.id))" />
      </div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IColumn } from '@/models/Table.model'
import { formatTitle } from '@/enums/modules/asset/AssetType.enum'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import { Icon } from '@iconify/vue'
import type { DocumentAssetFormValues } from '../schema/document-asset.schema'

interface IProps {
  items: DocumentAssetFormValues[]
  isPreview?: boolean
}

withDefaults(defineProps<IProps>(), {
  isPreview: false
})

interface IEmits {
  delete: [id: number]
  update: []
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination')

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = computed<IColumn<DocumentAssetFormValues>[]>((): IColumn<DocumentAssetFormValues>[] => {
  const baseColumns: IColumn<DocumentAssetFormValues>[] = [
    { field: 'idNo', header: 'เลขที่หลักทรัพย์', sortable: true, align: 'left', style: { width: '130px', minWidth: '130px' } },
    { field: 'contract.idNo', header: 'เลขที่สัญญา', sortable: true, align: 'left', style: { width: '130px', minWidth: '130px' } },
    { field: 'customerName', header: 'ชื่อลูกค้า', align: 'left', style: { width: '180px', minWidth: '180px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: DocumentAssetFormValues): string => formatter.fullName(e?.contract?.customer) },
    // { field: 'category', header: 'หมวดหมู่', align: 'left', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: DocumentAssetFormValues): string => formatTitle(e.type) || '' },
    { field: 'type', header: 'ประเภท', align: 'left', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: DocumentAssetFormValues): string => formatTitle(e.type) || '' },
    { field: 'location', header: 'จุดจัดเก็บ', sortable: false, align: 'left', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' } },
    {
      field: 'action',
      header: 'ลบ',
      align: 'right',
      style: { width: '80px', minWidth: '80px' }
    }
  ]
  return baseColumns
})

</script>

<style scoped></style>
