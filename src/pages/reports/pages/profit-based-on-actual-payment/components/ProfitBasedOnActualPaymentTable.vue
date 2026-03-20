<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    :items-footer="itemsFooter"
    disable-auto-left-padding
    show-footer
    @update="emits('update')">
    <template #[`item.index`]="{ index }">
      {{ index + 1 }}
    </template>
    <template #[`customer.idNo`]="{ item }">
      <LinkText :to="{}">
        {{ item.customer?.idNo }}
      </LinkText>
    </template>
    <template #[`receipt.idNo`]="{ item }">
      <LinkText :to="{}">
        {{ item.receipt?.idNo }}
      </LinkText>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import { generateTableFooter, type IFooterColConfig } from '@/utils/TableFooter'
import type {
  IProfitBasedOnActualPaymentList,
  IProfitBasedOnActualPaymentSummary
} from '@/models/response/report/profit-based-on-actual-payment/ProfitBasedOnActualPaymentRes.model'
import type { IColumn, IFooter } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IProfitBasedOnActualPaymentList[]
  summary?: IProfitBasedOnActualPaymentSummary
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

const columns = ref<IColumn<IProfitBasedOnActualPaymentList>[]>([
  { field: 'index', header: 'ลำดับ', width: 60 },
  { field: 'receipt.idNo', header: 'เลขที่ใบเสร็จ', width: 100, value: (e: IProfitBasedOnActualPaymentList): string => e.receipt?.idNo || '-' },
  { field: 'contract.idNo', header: 'เลขที่สัญญา', width: 100, value: (e: IProfitBasedOnActualPaymentList): string => e.contract?.idNo || '-' },
  { field: 'numberOfContractYear', header: 'จำนวนปีสัญญา', width: 100, value: (e: IProfitBasedOnActualPaymentList): string => `${formatter.numberFormat2Decimal(e.numberOfContractYear)}` },
  { field: 'customer', header: 'ชื่อลูกค้า', width: 100, value: (e: IProfitBasedOnActualPaymentList): string => formatter.fullName(e.customer) || '-' },
  { field: 'installmentPaymentNumber', header: 'ชำระงวดที่', width: 100, value: (e: IProfitBasedOnActualPaymentList): string => `${formatter.numberFormat2Decimal(e.installmentPaymentNumber)}` },
  { field: 'totalPrincipal', header: 'เงินต้นทั้งหมด', width: 100, value: (e: IProfitBasedOnActualPaymentList): string => `${formatter.numberFormat2Decimal(e.totalPrincipal)}` },
  { field: 'totalInterest', header: 'ดอกเบี้ยทั้งหมด', width: 100, value: (e: IProfitBasedOnActualPaymentList): string => `${formatter.numberFormat2Decimal(e.totalInterest)}` },
  { field: 'installmentPaymentAmount', header: 'ค่างวดที่รับชำระ', width: 100, value: (e: IProfitBasedOnActualPaymentList): string => `${formatter.numberFormat2Decimal(e.installmentPaymentAmount)}` },
  { field: 'currentPrincipal', header: 'เงินต้นงวดนี้', width: 100, value: (e: IProfitBasedOnActualPaymentList): string => `${formatter.numberFormat2Decimal(e.currentPrincipal)}` },
  { field: 'currentInterest', header: 'ดอกเบี้ยงวดนี้', width: 100, value: (e: IProfitBasedOnActualPaymentList): string => `${formatter.numberFormat2Decimal(e.currentInterest)}` }
])

const itemsFooter = computed((): IFooter[] => {
  const footerConfig: Partial<Record<keyof IProfitBasedOnActualPaymentList, IFooterColConfig<IProfitBasedOnActualPaymentSummary>>> = {
    customer: { value: `รวมทั้งสิ้น ${props.summary?.numberOfCustomer || 0} รายการ` },
    totalPrincipal: { value: formatter.numberFormat2Decimal(props.summary?.totalPrincipal || 0) },
    totalInterest: { value: formatter.numberFormat2Decimal(props.summary?.totalInterest || 0) },
    installmentPaymentAmount: { value: formatter.numberFormat2Decimal(props.summary?.installmentPaymentAmount || 0) },
    currentPrincipal: { value: formatter.numberFormat2Decimal(props.summary?.currentPrincipal || 0) },
    currentInterest: { value: formatter.numberFormat2Decimal(props.summary?.currentInterest || 0) }
  }
  return generateTableFooter(columns.value, props.summary, footerConfig)
})

</script>

<style scoped></style>
