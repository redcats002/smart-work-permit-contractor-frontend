<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.asset.idNo`]="{ item }">
      <LinkText :to="{}">
        <!-- TODO: complete asset.idNo and route -->
        {{ item.asset.idNo }}
      </LinkText>
    </template>
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
import type { IFollowUpBaseWorkList } from '@/models/response/work/WorkRes.model'
import type { IColumn } from '@/models/Table.model'
import { formatTitle } from '@/enums/modules/asset/AssetType.enum'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IFollowUpBaseWorkList[]
}
const props = defineProps<IProps>()

interface IEmits {
  update: []
}
const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', { required: true })
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })


const columns = ref<IColumn<IFollowUpBaseWorkList>[]>([
  { field: 'asset.idNo', header: 'เลขที่หลักทรัพย์', sortable: true },
  { field: 'idNo', header: 'เลขที่สัญญา', sortable: true, value: (e: IFollowUpBaseWorkList): string => e.idNo ?? '' },
  { field: 'customer', header: 'ชื่อลูกค้า', value: (e: IFollowUpBaseWorkList): string => formatter.fullAddress(e.customer?.mainAddress) ?? '' },
  { field: 'phoneNumber', header: 'เบอร์โทรศัพท์', value: (e: IFollowUpBaseWorkList): string => formatter.fullPhoneNumber(e?.customer) ?? '' },
  { field: 'types', header: 'หมวดหมู่หลักทรัพย์', value: (e: IFollowUpBaseWorkList): string => e?.types?.map(formatTitle).join(', ') || '-' }
])
</script>
