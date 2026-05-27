<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="displayItems"
    :selectable="!isPreview"
    disable-auto-left-padding
    disable-virtual-scroll
    @update="updatePagination()">
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
import { computed, ref, watch, type Ref } from 'vue'
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

const props = withDefaults(defineProps<IProps>(), {
  isPreview: false
})

interface IEmits {
  delete: [id: number]
}

const emits = defineEmits<IEmits>()

const pagination = ref<IPagination>({ page: 1, totalPage: 1, count: 0, limit: 10 })
const sortBy = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('desc')
const localItems = ref<DocumentAssetFormValues[]>([]) as Ref<DocumentAssetFormValues[]>
const displayItems = ref<DocumentAssetFormValues[]>([]) as Ref<DocumentAssetFormValues[]>

function updatePagination (): void {
  const startItem = ((pagination.value.page ?? 1) - 1) * (pagination.value.limit ?? 10)
  const endItem = (pagination.value.page ?? 1) * (pagination.value.limit ?? 10)
  displayItems.value = localItems.value.slice(startItem, endItem)
}

function syncItems (newItems: DocumentAssetFormValues[]): void {
  localItems.value = [...newItems]
  pagination.value.count = newItems.length
  pagination.value.totalPage = Math.ceil(pagination.value.count / (pagination.value.limit ?? 10)) || 1
  pagination.value.page = 1
  updatePagination()
}

watch(
  (): DocumentAssetFormValues[] => props.items, (items: DocumentAssetFormValues[]): void => {
    syncItems(items)
  }, { immediate: true, deep: true }
)

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
