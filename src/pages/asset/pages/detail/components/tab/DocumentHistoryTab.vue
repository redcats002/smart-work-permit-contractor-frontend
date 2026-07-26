<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="items"
    disable-auto-left-padding
    @update="fetch()">
    <template #[`item.status`]="{ item }">
      <div class="flex justify-end">
        <ChipMovementStatus :value="item?.status" />
      </div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IDocumentMovementItem } from '@/models/response/contract-asset/ContractAssetRes.model'
import type { IColumn } from '@/models/Table.model'
import type { IContractAssetProvider } from '@/resources/provider/contract-asset/ContractAsset.provider'
import ContractAssetProvider from '@/resources/provider/contract-asset/ContractAsset.provider'
import BaseTable from '@/components/table/BaseTable.vue'
import ChipMovementStatus from '@/pages/stock/pages/list/components/ChipMovementStatus.vue'
import usePagination from '@/composables/usePagination'

interface IProps {
  assetId: number
}

const props = defineProps<IProps>()
defineOptions({ inheritAttrs: false })

const ContractAssetService: IContractAssetProvider = new ContractAssetProvider()

const { pagination, sortBy, sortOrder, extractPagination } = usePagination({ inheritQuery: false })

const items = ref<IDocumentMovementItem[]>([])

const columns = ref<IColumn<IDocumentMovementItem>[]>([
  { field: 'date', header: 'วันที่', align: 'left', style: { maxWidth: '100px' } },
  { field: 'origin', header: 'ต้นทาง', align: 'left', style: { maxWidth: '220px' } },
  { field: 'destination', header: 'ปลายทาง', align: 'left', style: { maxWidth: '220px' } },
  { field: 'createdBy', header: 'ย้ายโดย', align: 'left', style: { maxWidth: '200px' } },
  { field: 'receivedBy', header: 'รับโดย', align: 'left', style: { maxWidth: '160px' } },
  { field: 'status', header: 'สถานะ', align: 'right', style: { maxWidth: '110px' } }
])

async function useFetch (): Promise<void> {
  const res = await ContractAssetService.getDocumentMovement(props.assetId, {
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value
  })
  items.value = res.data ?? []
  pagination.value = extractPagination(res)
}

function fetch (): void {
  handleLoading(useFetch)
}

onMounted((): void => {
  fetch()
})
</script>
