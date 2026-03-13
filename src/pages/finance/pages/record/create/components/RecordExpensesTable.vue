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
      <LinkText :to="{ name: 'ExpensesDetailPage', params: { id: item.id } }">
        {{ item.idNo }}
      </LinkText>
    </template>
    <template #[`item.contractIdNo`]="{ item }">
      <LinkText :to="{ name: 'ContractDetailPage', params: { id: item.contractId } }">
        {{ item.contractIdNo }}
      </LinkText>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IExpensesList } from '@/models/response/expenses/ExpensesRes.model'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IExpensesList[]
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

const columns = ref<IColumn<IExpensesList>[]>([
  { field: 'idNo', header: 'เลขที่ใบเสร็จ', sortable: true, align: 'left' },
  { field: 'expensesDate', header: 'วันที่', align: 'left', value: (e: IExpensesList): string => formatDate(e.expensesDate ?? undefined) },
  { field: 'expensesType', header: 'รับ/จ่าย', align: 'left' },
  { field: 'type', header: 'ประเภท', align: 'left' },
  { field: 'category', header: 'หมวดหมู่ค่าใช้จ่าย', align: 'left' },
  { field: 'totalValue', header: 'มูลค่า (บาท)', sortable: true, align: 'right', value: (e: IExpensesList): string => formatter.numberFormat(e.totalValue ?? 0) }
])
</script>
