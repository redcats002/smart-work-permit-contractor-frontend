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
      <LinkText :to="{ name: 'EmployeeDetailPage', params: { id: item.id }}">
        {{ item?.idNo }}
      </LinkText>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: any[]
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

const columns = ref<IColumn<any>[]>([
  { field: 'index', header: 'ลำดับ', align: 'center' },
  { field: 'branchName', header: 'สาขา', align: 'left' },
  { field: 'contractCount', header: 'จำนวนสัญญา', align: 'left', value: (e: any): string => formatter.numberFormat(e.contractCount ?? 0) },
  { field: 'principalAmount', header: 'เงินต้น (บาท)', align: 'left', value: (e: any): string => formatter.numberFormat(e.principalAmount ?? 0) },
  { field: 'principalWithInterest', header: 'เงินต้นรวมดอกเบี้ย (บาท)', align: 'left', value: (e: any): string => formatter.numberFormat(e.principalWithInterest ?? 0) },
  { field: 'debtCutOff', header: 'ยอดตัดลูกหนี้ (บาท)', align: 'left', value: (e: any): string => formatter.numberFormat(e.debtCutOff ?? 0) },
  { field: 'discount', header: 'ส่วนลด (บาท)', align: 'left', value: (e: any): string => formatter.numberFormat(e.discount ?? 0) },
  { field: 'currentBalance', header: 'บัญชีเทียบปัจจุบัน (บาท)', align: 'right', value: (e: any): string => formatter.numberFormat(e.currentBalance ?? 0) }
])
</script>

<style scoped></style>
