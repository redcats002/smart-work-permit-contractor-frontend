<template>
  <BaseTable
    :columns="columns"
    :items="items"
    disable-auto-left-padding
    hide-pagination
    @update="emits('update')" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IInstallmentRow } from '../schema/installment.schema'

interface IProps {
  items: IInstallmentRow[]
}
defineProps<IProps>()

interface IEmits {
  update: []
}
const emits = defineEmits<IEmits>()


const { formatDate } = useDayjs()

const columns = ref<IColumn<IInstallmentRow>[]>([
  { field: 'installmentNumber', header: 'งวดที่', value: (e: IInstallmentRow): number => e.period },
  { field: 'dueDate', header: 'วันที่กำหนดชำระ', value: (e: IInstallmentRow): string => formatDate(e.dueDate) },
  { field: 'interest', header: 'ดอกเบี้ย', value: (e: IInstallmentRow): string => formatter.numberFormat2Decimal(e.interest) },
  { field: 'principalPayment', header: 'เงินต้นชำระ', value: (e: IInstallmentRow): string => formatter.numberFormat2Decimal(e.principal) },
  { field: 'installmentAmount', header: 'ค่างวด', value: (e: IInstallmentRow): string => formatter.numberFormat2Decimal(e.payment) },
  { field: 'remainingPrincipal', header: 'เงินต้นคงเหลือ', value: (e: IInstallmentRow): string => formatter.numberFormat2Decimal(e.balance) }
])
</script>
