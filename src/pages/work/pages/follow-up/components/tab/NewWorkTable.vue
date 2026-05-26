<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.contract.idNo`]="{ item }">
      <LinkText :to="{ name: 'ContractDetailPage', params: { id: item.contract.id } }">
        {{ item.contract.idNo }}
      </LinkText>
    </template>
    <template #[`item.actions`]="{ item }">
      <FollowUpMenuAction
        :customer-id="item.customer.id"
        :debt-collection-id="Number(item.id)"
        @defer="emits('update')" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IDebtCollectionList } from '@/models/response/work/WorkRes.model'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import FollowUpMenuAction from './FollowUpMenuAction.vue'

interface IProps {
  items: IDebtCollectionList[]
}

defineProps<IProps>()

interface IEmits {
  update: []
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', { required: true })
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IDebtCollectionList>[]>([
  { field: 'contract.idNo', header: 'เลขที่สัญญา', sortable: true, style: { width: '130px', minWidth: '130px' } },
  { field: 'order', header: 'งวดที่', sortable: true, style: { width: '70px', minWidth: '70px' }, value: (e: IDebtCollectionList): string => `งวดที่ ${formatter.numberFormatNoDecimal(e.order || 0)}` },
  { field: 'customer', header: 'ชื่อลูกค้า', style: { width: '180px', minWidth: '180px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IDebtCollectionList): string => e.customer.fullName },
  { field: 'customer.phoneNumber', header: 'เบอร์โทรศัพท์', style: { width: '130px', minWidth: '130px' }, value: (e: IDebtCollectionList): string => formatter.phoneNumberFormat(e.customer.phoneNumber) },
  { field: 'actions', header: 'จัดการ', align: 'right', style: { width: '80px', minWidth: '80px' } }
])
</script>
