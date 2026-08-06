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
        @click="router.push(`/finance/receipt/detail/${item.receipt.id}`)">
        {{ item.receipt.idNo }}
      </a>
    </template>
    <template #[`item.contract.idNo`]="{ item }">
      <a
        class="link"
        @click="router.push(`/contract/detail/${item.contract.id}`)">
        {{ item.contract.idNo }}
      </a>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IAccountClosureList } from '@/models/response/report/account-closure/AccountClosureRes.model'
import type { IColumn } from '@/models/Table.model'
import { formatTitle as formatAssetType } from '@/enums/modules/asset/AssetType.enum'
import { formatTitle as formatReceiptType } from '@/enums/modules/finance/receipt/ReceiptType.enum'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IAccountClosureList[]
}

defineProps<IProps>()

interface IEmits {
  update: []
}

const emits = defineEmits<IEmits>()

const router = useRouter()

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
    value: (e: IAccountClosureList): string => e.customer.fullName || '-'
  },
  {
    field: 'principal',
    header: 'เงินต้น',
    align: 'right',
    value: (e: IAccountClosureList): string => formatter.numberFormat2Decimal(e.principal)
  },
  {
    field: 'interest',
    header: 'ดอกเบี้ย',
    align: 'right',
    value: (e: IAccountClosureList): string => formatter.numberFormat2Decimal(e.interest)
  },
  {
    field: 'otherExpense',
    header: 'ค่าใช้จ่ายอื่นๆ',
    align: 'right',
    value: (e: IAccountClosureList): string => formatter.numberFormat2Decimal(e.otherExpense)
  },
  {
    field: 'discountInterest',
    header: 'ส่วนลดดอกเบี้ย',
    align: 'right',
    value: (e: IAccountClosureList): string => formatter.numberFormat2Decimal(e.discountInterest)
  },
  {
    field: 'discountOther',
    header: 'ส่วนลดอื่นๆ',
    align: 'right',
    value: (e: IAccountClosureList): string => formatter.numberFormat2Decimal(e.discountOther)
  },
  {
    field: 'totalAmount',
    header: 'ยอดชำระรวม',
    align: 'right',
    value: (e: IAccountClosureList): string => formatter.numberFormat2Decimal(e.totalAmount)
  },
  {
    field: 'assets',
    header: 'หมวดหมู่หลักทรัพย์',
    align: 'left',
    value: (e: IAccountClosureList): string => formatAssetType(e.assets?.[0] as any)
  },
  {
    field: 'receipt.receiptType',
    header: 'ประเภทลูกหนี้ปิดบัญชี',
    align: 'left',
    value: (e: IAccountClosureList): string => formatReceiptType(e.receipt.receiptType as any)
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
