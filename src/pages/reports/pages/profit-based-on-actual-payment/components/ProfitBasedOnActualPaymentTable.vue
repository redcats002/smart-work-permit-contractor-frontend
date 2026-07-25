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
    <template #[`item.receiptNo`]="{ item }">
      <LinkText
        :id="item.receipt?.id"
        :to="{ name: 'ReceiptDetailPage', params: { id: item.receipt?.id } }">
        {{ item.receipt?.idNo || '-' }}
      </LinkText>
    </template>
    <template #[`item.contractNo`]="{ item }">
      <LinkText
        :id="item.contract?.id"
        :to="{ name: 'ContractDetailPage', params: { id: item.contract?.id } }">
        {{ item.contract?.idNo || '-' }}
      </LinkText>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
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
  update: []
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const dayjs = useDayjs()

const columns = ref<IColumn<IProfitBasedOnActualPaymentList>[]>([
  { field: 'index', header: 'ลำดับ', style: { width: '70px', minWidth: '70px' }, width: 60 },
  { field: 'receiptNo', header: 'เลขที่ใบเสร็จ', sortable: true, style: { width: '150px', minWidth: '150px' }, width: 100, value: (e: IProfitBasedOnActualPaymentList): string => e.receipt?.idNo || '-' },
  { field: 'date', header: 'วันที่', sortable: true, style: { width: '120px', minWidth: '120px' }, width: 100, value: (e: IProfitBasedOnActualPaymentList): string => dayjs.formatDate(e.date) || '-' },
  { field: 'contractNo', header: 'เลขที่สัญญา', sortable: true, style: { width: '150px', minWidth: '150px' }, width: 100, value: (e: IProfitBasedOnActualPaymentList): string => e.contract?.idNo || '-' },
  { field: 'contractYear', header: 'จำนวนปีสัญญา', style: { width: '140px', minWidth: '140px' }, width: 100, value: (e: IProfitBasedOnActualPaymentList): string => `${formatter.numberFormatNoDecimal(e.contractYear)}`, align: 'right' },
  { field: 'customerName', header: 'ชื่อลูกค้า', style: { width: '180px', minWidth: '180px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, width: 100, value: (e: IProfitBasedOnActualPaymentList): string => e.customerName || '-' },
  { field: 'paidAtPattern', header: 'ชำระงวดที่', style: { width: '110px', minWidth: '110px' }, width: 100, value: (e: IProfitBasedOnActualPaymentList): string => `${e?.paidAtPattern || '-'}` },
  { field: 'allPrincipal', header: 'เงินต้นทั้งหมด', style: { width: '150px', minWidth: '150px' }, width: 100, value: (e: IProfitBasedOnActualPaymentList): string => `${formatter.numberFormat2Decimal(e.allPrincipal)}`, align: 'right' },
  { field: 'allInterest', header: 'ดอกเบี้ยทั้งหมด', style: { width: '150px', minWidth: '150px' }, width: 100, value: (e: IProfitBasedOnActualPaymentList): string => `${formatter.numberFormat2Decimal(e.allInterest)}`, align: 'right' },
  { field: 'receiveInstallmentAmount', header: 'ค่างวดที่รับชำระ', style: { width: '150px', minWidth: '150px' }, width: 100, value: (e: IProfitBasedOnActualPaymentList): string => `${formatter.numberFormat2Decimal(e.receiveInstallmentAmount)}`, align: 'right' },
  { field: 'principal', header: 'เงินต้นงวดนี้', style: { width: '140px', minWidth: '140px' }, width: 100, value: (e: IProfitBasedOnActualPaymentList): string => `${formatter.numberFormat2Decimal(e.principal)}`, align: 'right' },
  { field: 'interest', header: 'ดอกเบี้ยงวดนี้', style: { width: '140px', minWidth: '140px' }, width: 100, value: (e: IProfitBasedOnActualPaymentList): string => `${formatter.numberFormat2Decimal(e.interest)}`, align: 'right' }
])

const itemsFooter = computed((): IFooter[] => {
  const footerConfig: Partial<Record<keyof IProfitBasedOnActualPaymentList, IFooterColConfig<IProfitBasedOnActualPaymentSummary>>> = {
    customerName: { value: 'รวมทั้งสิ้น' },
    allPrincipal: { value: formatter.numberFormat2Decimal(props.summary?.allPrincipal || 0), footerClass: 'text-right' },
    allInterest: { value: formatter.numberFormat2Decimal(props.summary?.allInterest || 0), footerClass: 'text-right' },
    receiveInstallmentAmount: { value: formatter.numberFormat2Decimal(props.summary?.receiveInstallmentAmount || 0), footerClass: 'text-right' },
    principal: { value: formatter.numberFormat2Decimal(props.summary?.principal || 0), footerClass: 'text-right' },
    interest: { value: formatter.numberFormat2Decimal(props.summary?.interest || 0), footerClass: 'text-right' }
  }
  return generateTableFooter(columns.value, props.summary, footerConfig)
})
</script>

<style scoped></style>
