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
      <LinkText :to="{ name: 'CustomerDetailPage', params: { id: item.id }}">
        {{ item?.idNo }}
      </LinkText>
    </template>
    <template #[`item.customerStatus`]="{ item }">
      <ChipCustomerStatus :value="item.customerStatus" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { ICustomerList } from '@/models/response/customer/CustomerRes.model'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import ChipCustomerStatus from './ChipCustomerStatus.vue'

interface IProps {
  items: ICustomerList[]
}

const props = defineProps<IProps>()

interface IEmits {
  delete: [id: number]
  update: []
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<ICustomerList>[]>([
  { field: 'idNo', header: 'เลขที่ลูกค้า', sortable: true, align: 'left' },
  { field: 'firstName', header: 'ชื่อลูกค้า', align: 'left', value: (e: ICustomerList): string => formatter.fullName(e) },
  { field: 'phoneNumber', header: 'เบอร์โทรศัพท์', align: 'left', value: (e: ICustomerList): string => formatter.fullPhoneNumber(e) },
  { field: 'customerGroup', header: 'กลุ่มลูกค้า', align: 'left', value: (e: ICustomerList): string => e?.customerGroup?.label || 'ไม่ระบุ' },
  { field: 'customerStatus', header: 'สถานะ', sortable: true, align: 'left' }
  // {
  //   field: 'action',
  //   header: 'จัดการ',
  //   frozen: true,
  //   alignFrozen: 'right',
  //   style: { minWidth: '70px', width: '70px' },
  //   headerStyle: { boxShadow: '-1px 0 0 #E5E7EB' },
  //   bodyStyle: { boxShadow: '-1px 0 0 #E5E7EB' }
  // }
])
</script>

<style scoped></style>
