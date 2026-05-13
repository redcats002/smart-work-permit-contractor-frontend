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
      <LinkText :to="{}">
        {{ item?.idNo }}
      </LinkText>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { ICustomerPaymentHistoryList } from '@/models/response/customer/CustomerRes.model'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: ICustomerPaymentHistoryList[]
}

const props = defineProps<IProps>()

interface IEmits {
  delete: [id: number]
  update: []
}

const emits = defineEmits<IEmits>()

const dayjs = useDayjs()
const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<ICustomerPaymentHistoryList>[]>([
  { field: 'createdAt', header: 'วันที่ทำรายการ', sortable: true, align: 'left', value: (e: ICustomerPaymentHistoryList): string => dayjs.formatDate(e?.createdAt || '') },
  { field: 'idNo', header: 'เลขที่สัญญา', sortable: true, align: 'left' },
  { field: 'paymentAmount', header: 'ยอดชำระ (บาท)', align: 'right', value: (e: ICustomerPaymentHistoryList): string => formatter.numberFormat2Decimal(e?.paymentAmount || 0) },
  { field: 'paymentMethod', header: 'วิธีการชำระ', align: 'left', value: (e: ICustomerPaymentHistoryList): string => e?.paymentMethod?.name || '' }
])
</script>

<style scoped></style>
