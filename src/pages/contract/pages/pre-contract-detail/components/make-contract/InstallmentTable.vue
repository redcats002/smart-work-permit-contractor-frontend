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
import type { IInstallmentRow } from '../../composables/make-contract/useInstallment'

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
  { field: 'installmentNumber', header: 'งวดที่', style: { width: '70px', minWidth: '70px' }, value: (e: IInstallmentRow): number => e.order },
  { field: 'dueDate', header: 'วันที่กำหนดชำระ', style: { width: '120px', minWidth: '120px' }, value: (e: IInstallmentRow): string => formatDate(e.dueDate) },
  { field: 'interest', header: 'ดอกเบี้ย', style: { width: '140px', minWidth: '140px' }, value: (e: IInstallmentRow): string => formatter.numberFormat2Decimal(e.interest) },
  { field: 'principalPayment', header: 'เงินต้นชำระ', style: { width: '140px', minWidth: '140px' }, value: (e: IInstallmentRow): string => formatter.numberFormat2Decimal(e.principal) },
  { field: 'installmentAmount', header: 'ค่างวด', style: { width: '140px', minWidth: '140px' }, value: (e: IInstallmentRow): string => formatter.numberFormat2Decimal(e.installment) },
  { field: 'remainingPrincipal', header: 'เงินต้นคงเหลือ', style: { width: '140px', minWidth: '140px' }, value: (e: IInstallmentRow): string => formatter.numberFormat2Decimal(e.remainingPrincipal) }
])
</script>
