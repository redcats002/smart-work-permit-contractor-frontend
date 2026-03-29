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
    <template #[`item.status`]="{ item }">
      <ChipPreContractStatus :value="item.status ?? undefined" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IAssetAppraisalNewWorkList } from '@/models/response/work/WorkRes.model'
import type { IColumn } from '@/models/Table.model'
import { formatTitle as formatTitleAssetType } from '@/enums/modules/asset/AssetType.enum'
import { formatTitle as formatTitlePreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import ChipPreContractStatus from '@/pages/contract/pages/list/components/ChipPreContractStatus.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IAssetAppraisalNewWorkList[]
}
defineProps<IProps>()

interface IEmits {
  update: []
}
const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', { required: true })
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })


const columns = ref<IColumn<IAssetAppraisalNewWorkList>[]>([
  { field: 'idNo', header: 'เลขที่สัญญา', sortable: true, align: 'left', value: (e: IAssetAppraisalNewWorkList): string => e.idNo ?? '' },
  { field: 'customer', header: 'ชื่อลูกค้า', sortable: true, align: 'left', value: (e: IAssetAppraisalNewWorkList): string => formatter.fullName(e.customer) ?? '' },
  { field: 'types', header: 'หมวดหมู่หลักทรัพย์', align: 'left', value: (e: IAssetAppraisalNewWorkList): string => e?.types?.map(formatTitleAssetType).join(', ') || '-' },
  { field: 'status', header: 'สถานะ', align: 'left', value: (e: IAssetAppraisalNewWorkList): string => formatTitlePreContractStatus(e.status) || '-' }
])
</script>
