<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.contract.idNo`]="{ item }">
      <LinkText :to="{ name: 'ContractDetailPage', params: { id: item.contract.id } }">
        {{ item.contract.idNo }}
      </LinkText>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IDebtCollectionList } from '@/models/response/work/WorkRes.model'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IDebtCollectionList[]
}

const props = defineProps<IProps>()

interface IEmits {
  update: []
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', { required: true })
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IDebtCollectionList>[]>([
  { field: 'contract.idNo', header: 'เลขที่สัญญา', sortable: true },
  { field: 'order', header: 'งวดที่', sortable: true },
  { field: 'customer', header: 'ชื่อลูกค้า', value: (e: IDebtCollectionList): string => e.customer.fullName },
  { field: 'customer.phoneNumber', header: 'เบอร์โทรศัพท์', value: (e: IDebtCollectionList): string => e.customer.phoneNumber }
])
</script>
