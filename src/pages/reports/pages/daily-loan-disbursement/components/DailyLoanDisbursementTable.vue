<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.receipt.idNo`]="{item}">
      <LinkText :to="{}">
        {{ item.receipt?.idNo }}
      </LinkText>
    </template>
    <template #[`item.contract.idNo`]="{item}">
      <LinkText :to="{}">
        {{ item.contract?.idNo }}
      </LinkText>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IDailyLoanDisbursementDisplay } from '@/models/modules/report/daily-loan-disbursement/Summary.model'
import type { IDailyLoanDisbursementList, IDailyLoanDisbursementSummary } from '@/models/response/report/daily-loan-disbursement/DailyLoanDisbursementRes.model'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IDailyLoanDisbursementList[]
  summary?: IDailyLoanDisbursementSummary
}

withDefaults(defineProps<IProps>(), {
  summary: undefined
})

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

const columns = ref<IColumn<IDailyLoanDisbursementList>[]>([
  { field: 'createdAt', header: 'วันที่ใบชำระเงิน', value: (e: IDailyLoanDisbursementList): string => dayjs.formatDate(e?.createdAt) },
  { field: 'receipt.idNo', header: 'เลขที่ใบเสร็จ' },
  { field: 'contract.idNo', header: 'เลขที่สัญญา' },
  { field: 'customer', header: 'ชื่อลูกค้า', value: (e: IDailyLoanDisbursementList): string => formatter.fullName(e?.customer) },
  { field: 'totalWithInterest', header: 'ยอดจัดรวดอกเบี้ย', value: (e: IDailyLoanDisbursementList): string => formatter.numberFormat2Decimal(e?.totalWithInterest) },
  { field: 'total', header: 'ยอดจัด', value: (e: IDailyLoanDisbursementList): string => formatter.numberFormat2Decimal(e?.total) },
  { field: 'operation', header: 'ค่าดำเนินการ', value: (e: IDailyLoanDisbursementList): string => formatter.numberFormat2Decimal(e?.operation) },
  { field: 'interest', header: 'ดอกเบี้ย', value: (e: IDailyLoanDisbursementList): string => formatter.numberFormat2Decimal(e?.interest) },
  { field: 'installment', header: 'ชำระต่องวด', value: (e: IDailyLoanDisbursementList): string => formatter.numberFormat2Decimal(e?.installment) },
  { field: 'numberOfInstallments', header: 'จำนวนงวด', value: (e: IDailyLoanDisbursementList): string => formatter.numberFormatNoDecimal(e?.numberOfInstallments) }
])

// TODO: Summary
computed((): Partial<IDailyLoanDisbursementDisplay> => ({}))
</script>

<style scoped></style>
