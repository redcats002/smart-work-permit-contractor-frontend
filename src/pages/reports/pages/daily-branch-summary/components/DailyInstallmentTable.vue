<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    @update="emits('update')">
    <template #[`item.idNo`]="{ item }">
      <LinkText :to="{ name: 'EmployeeDetailPage', params: { id: item.id }}">
        {{ item?.idNo }}
      </LinkText>
    </template>
    <template #[`item.status`]="{ item }">
      <ChipEmployeeStatus :value="item.status" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
  { field: 'date', header: 'วันที่', sortable: true, align: 'left' },
  { field: 'receiptNo', header: 'เลขที่ใบเสร็จ', sortable: true, align: 'left', class: 'red--text font-weight-bold' },
  { field: 'contractNo', header: 'เลขที่สัญญา', sortable: true, align: 'left', class: 'red--text font-weight-bold' },
  { field: 'customerName', header: 'ชื่อลูกค้า', align: 'left' },
  { field: 'paymentMethod', header: 'ชำระโดย', align: 'left' },
  { field: 'paymentType', header: 'รับชำระค่า', align: 'left' },
  { field: 'debtAmount', header: 'ยอดตัดลูกหนี้', align: 'left' },
  { field: 'discount', header: 'ส่วนลด', align: 'left' },
  { field: 'netAmount', header: 'ยอดรับสุทธิ', align: 'left' },
  { field: 'totalPrincipal', header: 'เงินต้นทั้งหมด', align: 'left' },
  { field: 'principal', header: 'เงินต้น', align: 'left' },
  { field: 'interest', header: 'ดอกเบี้ย', align: 'left' },
  { field: 'staffName', header: 'พนักงาน', align: 'left' },
  { field: 'status', header: 'สถานะ', sortable: true, align: 'left' }
])

</script>

<style scoped></style>
