<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.contractNo`]="{ item }">
      <LinkText :to="{}">
        {{ item.contractNo }}
      </LinkText>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import type { INewWorkList } from '@/models/response/work/WorkRes.model'
import { formatTitle as formatTitleAssetCategory } from '@/enums/modules/work/AssetCategoryStatus.enum'

interface IProps {
  items: INewWorkList[]
}
const props = defineProps<IProps>()

interface IEmits {
  update: []
}
const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', { required: true })
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })


const columns = ref<IColumn<INewWorkList>[]>([
  {
    field: 'contractNo',
    header: 'เลขที่สัญญา',
    sortable: true,
    align: 'left',
    value: (e: INewWorkList): string => e.contractNo ?? ''
  },
  {
    field: 'customerName',
    header: 'ชื่อลูกค้า',
    sortable: true,
    align: 'left',
    value: (e: INewWorkList): string => e.customerName ?? ''
  },
  {
    field: 'assetCategory',
    header: 'หมวดหมู่หลักทรัพย์',
    align: 'left',
    value: (e: INewWorkList): string => formatTitleAssetCategory(e.assetCategory) || '-'
  }
])
</script>
