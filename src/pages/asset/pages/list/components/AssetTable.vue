<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    :table-style="tableStyle"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.idNo`]="{ item }">
      <LinkText
        :to="{ name: 'AssetDetailPage', params: { id: item.id } }"
        class="no-underline hover:no-underline">
        {{ item.idNo }}
      </LinkText>
    </template>
    <template #[`item.status`]="{ item }">
      <div class="flex justify-end">
        <ChipAssetStatus :value="item.status" />
      </div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IContractAssetList } from '@/models/response/contract-asset/ContractAssetRes.model'
import type { IColumn } from '@/models/Table.model'
import { formatTitle as formatTypeTitle } from '@/enums/modules/asset/AssetType.enum'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import ChipAssetStatus from '@/pages/stock/pages/list/components/asset/ChipAssetStatus.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IContractAssetList[]
}

const props = defineProps<IProps>()

interface IEmits {
  update: []
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const tableStyle = 'min-width: 960px;'

const columns = ref<IColumn<IContractAssetList>[]>([
  { field: 'idNo', header: 'เลขที่หลักทรัพย์', sortable: true, align: 'left', style: { width: '130px', minWidth: '130px' } },
  { field: 'contract.customer.fullName', header: 'ชื่อลูกค้า', sortable: false, align: 'left', style: { width: '180px', minWidth: '180px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IContractAssetList): string => e.contract?.customer?.fullName ?? '-' },
  { field: 'type', header: 'หมวดหมู่หลักทรัพย์', sortable: false, align: 'left', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IContractAssetList): string => formatTypeTitle(e.type) },
  { field: 'detail', header: 'รายละเอียดหลักทรัพย์', sortable: false, align: 'left', style: { width: '220px', minWidth: '220px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IContractAssetList): string => e?.detail ?? '-' },
  { field: 'status', header: 'สถานะ', sortable: true, align: 'right', style: { width: '120px', minWidth: '120px' }, headerClass: 'pr-6', bodyClass: 'pr-6' }
])

</script>

<style scoped></style>
