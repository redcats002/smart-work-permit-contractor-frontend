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
      <LinkText :to="{ name: 'ContractDetailPage', params: { id: item?.contract?.id as number } }">
        {{ item?.contract?.idNo }}
      </LinkText>
    </template>
    <template #[`item.status`]="{ item }">
      <ChipAssetStatus :value="item?.status" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import type { ICustomerAssetList } from '@/models/response/customer/CustomerRes.model'
import type { IColumn } from '@/models/Table.model'
import { formatTitle } from '@/enums/modules/asset/AssetType.enum'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import ChipAssetStatus from '@/pages/stock/pages/list/components/asset/ChipAssetStatus.vue'

interface IProps {
  items: ICustomerAssetList[]
}

const props = defineProps<IProps>()

interface IEmits {
  update: []
}

const emits = defineEmits<IEmits>()

const dayjs = useDayjs()
const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<ICustomerAssetList>[]>([
  { field: 'createdAt', header: 'วันที่', align: 'left', style: { width: '120px', minWidth: '120px' }, value: (e: ICustomerAssetList): string => dayjs.formatDate(e?.createdAt || '') },
  { field: 'idNo', header: 'เลขที่หลักทรัพย์', align: 'left', style: { width: '130px', minWidth: '130px' } },
  { field: 'contract.idNo', header: 'เลขที่สัญญาที่เกี่ยวข้อง', align: 'left', style: { width: '130px', minWidth: '130px' } },
  { field: 'type', header: 'หมวดหมู่หลักทรัพย์', align: 'left', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: ICustomerAssetList): string => formatTitle(e?.type) || '-' },
  { field: 'detail', header: 'รายละเอียดหลักทรัพย์', align: 'left', style: { width: '220px', minWidth: '220px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' } },
  { field: 'location.name', header: 'จุดจัดเก็บเอกสาร', align: 'left', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: ICustomerAssetList): string => e?.location?.name || '-' },
  { field: 'status', header: 'สถานะ', align: 'left', style: { width: '120px', minWidth: '120px' } }
])
</script>

<style scoped></style>
