<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.index`]="{ index }">
      {{ index + 1 }}
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import type { IPercentInstallmentList } from '@/models/response/report/percent-installment/PercentInstallmentRes.model'

interface IProps {
  items: IPercentInstallmentList[]
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

const columns = ref<IColumn<IPercentInstallmentList>[]>([
  {
    field: 'index' as any,
    header: 'ลำดับ',
    align: 'left',
    width: 60
  },
  {
    field: 'branchName',
    header: 'สาขา',
    align: 'left',
    width: 150
  },
  {
    field: 'installmentAmount',
    header: 'ค่างวด/งวด',
    align: 'left',
    width: 120,
    value: (e: IPercentInstallmentList): string => formatter.numberFormat(e.installmentAmount)
  },
  {
    field: 'receivedInstallment',
    header: 'รับค่างวด',
    align: 'left',
    width: 120,
    value: (e: IPercentInstallmentList): string => formatter.numberFormat(e.receivedInstallment)
  },
  {
    field: 'salesAmount',
    header: 'ขาย',
    align: 'left',
    width: 120,
    value: (e: IPercentInstallmentList): string => formatter.numberFormat(e.salesAmount)
  },
  {
    field: 'receivedPenalty',
    header: 'รับค่าปรับ',
    align: 'left',
    width: 120,
    value: (e: IPercentInstallmentList): string => formatter.numberFormat(e.receivedPenalty)
  },
  {
    field: 'trackingFee',
    header: 'ค่าติดตาม',
    align: 'left',
    width: 120,
    value: (e: IPercentInstallmentList): string => formatter.numberFormat(e.trackingFee)
  },
  {
    field: 'totalAmount',
    header: 'รวม',
    align: 'left',
    width: 140,
    value: (e: IPercentInstallmentList): string => formatter.numberFormat(e.totalAmount)
  },
  {
    field: 'percentage',
    header: '%',
    align: 'right',
    width: 100,
    value: (e: IPercentInstallmentList): string => `${formatter.numberFormat(e.percentage)} %`
  }
])
</script>

<style scoped></style>
