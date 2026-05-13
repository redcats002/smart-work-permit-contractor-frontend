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
      <ChipEstateStatus :value="item?.status" />
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
import ChipEstateStatus from './ChipEstateStatus.vue'

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
  { field: 'createdAt', header: 'วันที่', align: 'left', value: (e: ICustomerAssetList): string => dayjs.formatDate(e?.createdAt || '') },
  { field: 'idNo', header: 'เลขที่หลักทรัพย์', align: 'left' },
  { field: 'contract.idNo', header: 'เลขที่สัญญาที่เกี่ยวข้อง', align: 'left' },
  { field: 'type', header: 'หมวดหมู่หลักทรัพย์', align: 'left', value: (e: ICustomerAssetList): string => formatTitle(e?.type) || '-' },
  { field: 'detail', header: 'รายละเอียดหลักทรัพย์', align: 'left' },
  { field: 'location.name', header: 'จุดจัดเก็บเอกสาร', align: 'left', value: (e: ICustomerAssetList): string => e?.location?.name || '-' },
  { field: 'status', header: 'สถานะ', align: 'left' }
])
</script>

<style scoped></style>
