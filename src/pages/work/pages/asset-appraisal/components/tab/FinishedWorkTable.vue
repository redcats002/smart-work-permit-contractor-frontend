<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.idNo`]="{ item }">
      <LinkText :to="{ name: 'PreContractDetailPage', params: { id: item.id } }">
        {{ item.idNo }}
      </LinkText>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IAssetAppraisalCompleteWorkList } from '@/models/response/work/WorkRes.model'
import type { IColumn } from '@/models/Table.model'
import { formatTitle } from '@/enums/modules/asset/AssetType.enum'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IAssetAppraisalCompleteWorkList[]
}
defineProps<IProps>()

interface IEmits {
  update: []
}
const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', { required: true })
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })


const columns = ref<IColumn<IAssetAppraisalCompleteWorkList>[]>([
  { field: 'idNo', header: 'เลขที่สัญญา', sortable: true, align: 'left', value: (e: IAssetAppraisalCompleteWorkList): string => e.idNo ?? '' },
  { field: 'customer', header: 'ชื่อลูกค้า', align: 'left', value: (e: IAssetAppraisalCompleteWorkList): string => formatter.fullName(e.customer) ?? '' },
  { field: 'types', header: 'หมวดหมู่หลักทรัพย์', align: 'left', value: (e: IAssetAppraisalCompleteWorkList): string => e?.types?.map(formatTitle).join(', ') || '-', style: { maxWidth: '200px', whiteSpace: 'inherit' } }
])
</script>
