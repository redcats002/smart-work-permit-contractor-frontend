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
      <LinkText :to="{ name: 'ContractDetailPage', params: { id: item.id } }">
        {{ item.idNo }}
      </LinkText>
    </template>
    <template #[`item.collateralStatus`]="{ item }">
      <ChipCollateralStatus :value="item.collateralStatus ?? undefined" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IContractList } from '@/models/response/contract/ContractRes.model'
import type { IColumn } from '@/models/Table.model'
import type { TTitleName } from '@/enums/TitleName.enum'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import ChipCollateralStatus from './ChipCollateralStatus.vue'

interface IProps {
  items: IContractList[]
}
const props = defineProps<IProps>()

interface IEmits {
  update: []
}
const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', { required: true })
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const { formatDate } = useDayjs()

const columns = ref<IColumn<IContractList>[]>([
  { field: 'idNo', header: 'เลขที่สัญญา', sortable: true, align: 'left' },
  {
    field: 'startDate',
    header: 'วันที่เริ่มทำสัญญา',
    sortable: true,
    align: 'left',
    value: (e: IContractList): string => formatDate(e.startDate ?? undefined)
  },
  {
    field: 'customer',
    header: 'ชื่อลูกค้า',
    align: 'left',
    value: (e: IContractList): string => formatter.fullName({
      titleName: (e.customer?.titleName ?? undefined) as TTitleName | undefined,
      firstName: e.customer?.firstName ?? undefined,
      lastName: e.customer?.lastName ?? undefined
    })
  },
  { field: 'collateralStatus', header: 'สถานะ', sortable: true, align: 'left' }
])
</script>
