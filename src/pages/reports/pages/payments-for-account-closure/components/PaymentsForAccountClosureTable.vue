<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.receipt.idNo`]="{ item }">
      <a
        class="link"
        href="javascript:void(0)">
        {{ item.receipt.idNo }}
      </a>
    </template>
    <template #[`item.contract.idNo`]="{ item }">
      <a
        class="link"
        href="javascript:void(0)">
        {{ item.contract.idNo }}
      </a>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import { useDayjs } from '@/utils/Dayjs'
import type { IAccountClosureList } from '@/models/response/report/account-closure/AccountClosureRes.model'
import type { IColumn } from '@/models/Table.model'
import type { IPagination } from '@/composables/usePagination'
import BaseTable from '@/components/table/BaseTable.vue'

interface IProps {
  items: IAccountClosureList[]
}

defineProps<IProps>()

interface IEmits {
  update: []
}

const emits = defineEmits<IEmits>()

const dayjs = useDayjs()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IAccountClosureList>[]>([
  {
    field: 'date',
    header: 'วันที่ใบชำระเงิน',
    sortable: true,
    align: 'left',
    value: (e: IAccountClosureList): string => dayjs.formatDate(e.date)
  },
  {
    field: 'receipt.idNo',
    header: 'เลขที่ใบเสร็จ',
    sortable: true,
    align: 'left'
  },
  {
    field: 'contract.idNo',
    header: 'เลขที่สัญญา',
    sortable: true,
    align: 'left'
  },
  {
    field: 'customer',
    header: 'ชื่อลูกค้า',
    align: 'left',
    value: (e: IAccountClosureList): string => formatter.fullName(e.customer)
  },
  {
    field: 'principal',
    header: 'เงินต้น',
    align: 'right',
    value: (e: IAccountClosureList): string => formatter.numberFormat(e.principal)
  },
  {
    field: 'interest',
    header: 'ดอกเบี้ย',
    align: 'right',
    value: (e: IAccountClosureList): string => formatter.numberFormat(e.interest)
  },
  {
    field: 'otherExpenses',
    header: 'ค่าใช้จ่ายอื่นๆ',
    align: 'right',
    value: (e: IAccountClosureList): string => formatter.numberFormat(e.otherExpenses)
  },
  {
    field: 'interestDiscount',
    header: 'ส่วนลดดอกเบี้ย',
    align: 'right',
    value: (e: IAccountClosureList): string => formatter.numberFormat(e.interestDiscount)
  },
  {
    field: 'otherDiscount',
    header: 'ส่วนลดอื่นๆ',
    align: 'right',
    value: (e: IAccountClosureList): string => formatter.numberFormat(e.otherDiscount)
  },
  {
    field: 'totalPayment',
    header: 'ยอดชำระรวม',
    align: 'right',
    value: (e: IAccountClosureList): string => formatter.numberFormat(e.totalPayment)
  },
  {
    field: 'otherDiscount2',
    header: 'ส่วนลดอื่นๆ',
    align: 'right',
    value: (e: IAccountClosureList): string => formatter.numberFormat(e.otherDiscount)
  },
  {
    field: 'assetCategory',
    header: 'หมวดหมู่หลักทรัพย์',
    align: 'left'
  },
  {
    field: 'debtorType',
    header: 'ประเภทลูกหนี้ปิดบัญชี',
    align: 'left'
  }
])
</script>

<style scoped>
.link {
  color: #BD0102;
  cursor: pointer;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>
