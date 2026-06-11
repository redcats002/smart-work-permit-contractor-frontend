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
      <LinkText
        :to="
          item?.status === 'DRAFT'
            ? { name: 'PreContractEditPage', params: { id: item.id } }
            : { name: 'PreContractDetailPage', params: { id: item.id } }
        ">
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
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IPreContractList } from '@/models/response/pre-contract/PreContractRes.model'
import type { IColumn } from '@/models/Table.model'
import type { TTitleName } from '@/enums/TitleName.enum'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import ChipPreContractStatus from './ChipPreContractStatus.vue'

interface IProps {
  items: IPreContractList[]
}
defineProps<IProps>()

interface IEmits {
  update: []
}
const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', { required: true })
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const { formatDate } = useDayjs()

const columns = ref<IColumn<IPreContractList>[]>([
  { field: 'idNo', header: 'เลขที่สัญญา', sortable: true, align: 'left', style: { width: '130px', minWidth: '130px' } },
  {
    field: 'createdAt',
    header: 'วันที่เริ่มทำสัญญา',
    sortable: true,
    align: 'left',
    style: { width: '120px', minWidth: '120px' },
    value: (e: IPreContractList): string => formatDate(e.createdAt ?? undefined)
  },
  {
    field: 'customer',
    header: 'ชื่อลูกค้า',
    align: 'left',
    style: { width: '180px', minWidth: '180px' },
    bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' },
    value: (e: IPreContractList): string =>
      formatter.fullName({
        titleName: (e.customer?.titleName ?? undefined) as TTitleName | undefined,
        firstName: e.customer?.firstName ?? undefined,
        lastName: e.customer?.lastName ?? undefined
      })
  },
  { field: 'branch', header: 'สาขา', align: 'left', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IPreContractList): string => e?.branch?.name || 'ไม่ระบุ' },
  { field: 'status', header: 'สถานะ', sortable: true, align: 'left', style: { width: '120px', minWidth: '120px' } }
])
</script>
