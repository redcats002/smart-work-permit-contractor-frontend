<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    @update="emits('update')">
    <template #[`item.index`]="{ index }">
      {{ index + 1 }}
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import type { IDailySummaryDetailItem } from '@/models/response/report/daily-summary/DailySummaryDetailRes'
import { formatter } from '@/utils/Formatter'

interface IProps {
  items: IDailySummaryDetailItem[] | undefined
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

const columns = ref<IColumn<IDailySummaryDetailItem>[]>([
  {
    field: 'index',
    header: 'ลำดับ',
    align: 'center'
  },
  {
    field: 'paymentCode',
    header: 'รหัสการชำระ',
    sortable: true,
    align: 'left'
  },
  {
    field: 'categoryName',
    header: 'หมวดหมู่',
    sortable: true,
    align: 'left'
  },
  {
    field: 'transactionType',
    header: 'ประเภท',
    align: 'center'
  },
  {
    field: 'amount',
    header: 'มูลค่า',
    align: 'right',
    value: (e: IDailySummaryDetailItem): string => formatter.numberFormat(e.amount ?? 0)
  },
  {
    field: 'totalAmount',
    header: 'ยอดจัด',
    align: 'right',
    value: (e: IDailySummaryDetailItem): string => formatter.numberFormat(e.totalAmount ?? 0)
  },
  {
    field: 'installmentAmount',
    header: 'ค่างวด',
    align: 'right',
    value: (e: IDailySummaryDetailItem): string => formatter.numberFormat(e.installmentAmount ?? 0)
  },
  {
    field: 'totalInterest',
    header: 'ดอกเบี้ยรวม',
    align: 'right',
    value: (e: IDailySummaryDetailItem): string => formatter.numberFormat(e.totalInterest ?? 0)
  }
])

</script>
