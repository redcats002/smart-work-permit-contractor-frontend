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
    <template #[`item.idNo`]="{ item }">
      <LinkText :to="{}">
        {{ item.idNo }}
      </LinkText>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import { generateTableFooter, type IFooterColConfig } from '@/utils/TableFooter'
import type { IDailyLoanDisbursementList, IDailyLoanDisbursementSummary } from '@/models/response/report/daily-loan-disbursement/DailyLoanDisbursementRes.model'
import type { IColumn, IFooter } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IDailyLoanDisbursementList[]
  summary?: IDailyLoanDisbursementSummary
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

const columns = ref<IColumn<IDailyLoanDisbursementList>[]>([
  { field: 'createdAt', header: 'วันที่', value: (e: IDailyLoanDisbursementList): string => dayjs.formatDate(e?.createdAt) },
  { field: 'idNo', header: 'เลขที่สัญญา' },
  { field: 'customerName', header: 'ชื่อลูกค้า' },
  { field: 'principalAndInterest', header: 'ยอดจัดรวมดอกเบี้ย', align: 'right', value: (e: IDailyLoanDisbursementList): string => formatter.numberFormat2Decimal(e?.principalAndInterest) },
  { field: 'principal', header: 'ยอดจัด', align: 'right', value: (e: IDailyLoanDisbursementList): string => formatter.numberFormat2Decimal(e?.principal) },
  { field: 'administrativeCost', header: 'ค่าดำเนินการ', align: 'right', value: (e: IDailyLoanDisbursementList): string => formatter.numberFormat2Decimal(e?.administrativeCost) },
  { field: 'interest', header: 'ดอกเบี้ย', align: 'right', value: (e: IDailyLoanDisbursementList): string => formatter.numberFormat2Decimal(e?.interest) },
  { field: 'monthlyInstallment', header: 'ชำระต่องวด', align: 'right', value: (e: IDailyLoanDisbursementList): string => formatter.numberFormat2Decimal(e?.monthlyInstallment) },
  { field: 'installmentCount', header: 'จำนวนงวด', align: 'right', value: (e: IDailyLoanDisbursementList): string => formatter.numberFormatNoDecimal(e?.installmentCount) }
])

const itemsFooter = computed((): IFooter[] => {
  const footerConfig: Partial<Record<keyof IDailyLoanDisbursementList, IFooterColConfig<IDailyLoanDisbursementSummary>>> = {
    customerName: { value: 'รวมทั้งสิ้น' },
    principalAndInterest: { value: formatter.numberFormat2Decimal(props.summary?.principalAndInterest || 0), footerClass: 'text-right' },
    principal: { value: formatter.numberFormat2Decimal(props.summary?.principal || 0), footerClass: 'text-right' },
    administrativeCost: { value: formatter.numberFormat2Decimal(props.summary?.administrativeCost || 0), footerClass: 'text-right' },
    interest: { value: formatter.numberFormat2Decimal(props.summary?.interest || 0), footerClass: 'text-right' },
    monthlyInstallment: { value: formatter.numberFormat2Decimal(props.summary?.monthlyInstallment || 0), footerClass: 'text-right' },
    installmentCount: { value: formatter.numberFormatNoDecimal(props.summary?.installmentCount || 0), footerClass: 'text-right' }
  }
  return generateTableFooter(columns.value, props.summary, footerConfig)
})

</script>

<style scoped></style>
