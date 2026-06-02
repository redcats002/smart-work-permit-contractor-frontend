<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="items"
    :items-footer="itemsFooter"
    disable-auto-left-padding
    show-footer
    @update="emits('update')">
    <template #[`item.contractStatus`]="{ item }">
      <ChipContractStatus :value="item.contractStatus" />
    </template>
    <template #[`item.contract.idNo`]="{item}">
      <LinkText
        :id="item.contract?.id"
        :to="{ name: 'ContractDetailPage', params: { id: item.contract.id}}">
        {{ item?.contract.idNo ?? '-' }}
      </LinkText>
    </template>
    <template #[`item.receipt.idNo`]="{item}">
      <LinkText
        :id="item.receipt?.id"
        :to="{ name: 'ReceiptDetailPage', params: { id: item.receipt.id}}">
        {{ item?.receipt.idNo ?? '-' }}
      </LinkText>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import { generateTableFooter, type IFooterColConfig } from '@/utils/TableFooter'
import { formatTitle as formatPaymentType } from '@/models/response/receipt/PaymentMethod.enum'
import type {
  IDailyInstallmentPaymentList,
  IDailyInstallmentPaymentSummary
} from '@/models/response/report/daily-installment-payment/DailyInstallmentPaymentRes'
import type { IColumn, IFooter } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import ChipContractStatus from '@/pages/contract/pages/list/components/ChipContractStatus.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IDailyInstallmentPaymentList[]
  summary?: IDailyInstallmentPaymentSummary
}

const props = withDefaults(defineProps<IProps>(), {
  summary: undefined
})

interface IEmits {
  update: []
}

const emits = defineEmits<IEmits>()

const dayjs = useDayjs()

const pagination = defineModel<IPagination>('pagination', { required: true })
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IDailyInstallmentPaymentList>[]>([
  { field: 'date', header: 'วันที่', sortable: true, style: { width: '120px', minWidth: '120px' }, value: (e: IDailyInstallmentPaymentList): string => dayjs.formatDate(e?.date ?? undefined) },
  { field: 'receipt.idNo', header: 'เลขที่ใบเสร็จ', sortable: true, style: { width: '140px', minWidth: '140px' }, value: (e: IDailyInstallmentPaymentList): string => e?.receipt?.idNo ?? '-' },
  { field: 'contract.idNo', header: 'เลขที่สัญญา', sortable: true, style: { width: '140px', minWidth: '140px' }, value: (e: IDailyInstallmentPaymentList): string => e?.contract?.idNo ?? '-' },
  { field: 'customer', header: 'ชื่อลูกค้า', style: { width: '180px', minWidth: '180px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IDailyInstallmentPaymentList): string => e?.customer?.fullName ?? '-' },
  { field: 'paymentType', header: 'ชำระโดย', style: { width: '130px', minWidth: '130px' }, value: (e: IDailyInstallmentPaymentList): string => formatPaymentType(e?.paymentType as any) },
  { field: 'paymentReason', header: 'รับชำระค่า', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' } },
  { field: 'debtorCutAmount', header: 'ยอดตัดลูกหนี้', align: 'right', style: { width: '140px', minWidth: '140px' }, value: (e: IDailyInstallmentPaymentList): string => formatter.numberFormat2Decimal(e?.debtorCutAmount) },
  { field: 'discountAmount', header: 'ส่วนลด', align: 'right', style: { width: '120px', minWidth: '120px' }, value: (e: IDailyInstallmentPaymentList): string => formatter.numberFormat2Decimal(e?.discountAmount) },
  { field: 'netReceiveAmount', header: 'ยอดรับสุทธิ', align: 'right', style: { width: '130px', minWidth: '130px' }, value: (e: IDailyInstallmentPaymentList): string => formatter.numberFormat2Decimal(e?.netReceiveAmount) },
  { field: 'allPrincipalAmount', header: 'เงินต้นทั้งหมด', align: 'right', style: { width: '140px', minWidth: '140px' }, value: (e: IDailyInstallmentPaymentList): string => formatter.numberFormat2Decimal(e?.allPrincipalAmount) },
  { field: 'principalAmount', header: 'เงินต้น', align: 'right', style: { width: '120px', minWidth: '120px' }, value: (e: IDailyInstallmentPaymentList): string => formatter.numberFormat2Decimal(e?.principalAmount) },
  { field: 'interestAmount', header: 'ดอกเบี้ย', align: 'right', style: { width: '120px', minWidth: '120px' }, value: (e: IDailyInstallmentPaymentList): string => formatter.numberFormat2Decimal(e?.interestAmount) },
  { field: 'employee', header: 'พนักงาน', style: { width: '180px', minWidth: '180px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IDailyInstallmentPaymentList): string => e?.employee?.fullName ?? '-' },
  { field: 'contractStatus', header: 'สถานะ', style: { width: '130px', minWidth: '130px' } }
])

const itemsFooter = computed((): IFooter[] => {
  const footerConfig: Partial<Record<keyof IDailyInstallmentPaymentList, IFooterColConfig<IDailyInstallmentPaymentSummary>>> = {
    customer: { value: 'รวมทั้งสิ้น' },
    debtorCutAmount: { value: formatter.numberFormat2Decimal(props.summary?.debtorCutAmount || 0), footerClass: 'text-right' },
    discountAmount: { value: formatter.numberFormat2Decimal(props.summary?.discountAmount || 0), footerClass: 'text-right' },
    netReceiveAmount: { value: formatter.numberFormat2Decimal(props.summary?.netReceiveAmount || 0), footerClass: 'text-right' },
    allPrincipalAmount: { value: formatter.numberFormat2Decimal(props.summary?.allPrincipalAmount || 0), footerClass: 'text-right' },
    principalAmount: { value: formatter.numberFormat2Decimal(props.summary?.principalAmount || 0), footerClass: 'text-right' },
    interestAmount: { value: formatter.numberFormat2Decimal(props.summary?.interestAmount || 0), footerClass: 'text-right' }
  }
  return generateTableFooter(columns.value, props.summary, footerConfig)
})
</script>

<style scoped></style>
