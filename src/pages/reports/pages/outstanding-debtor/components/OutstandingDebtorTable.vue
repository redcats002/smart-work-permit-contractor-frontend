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
    <template #[`item.index`]="{ index }">
      {{ index + 1 }}
    </template>
    <template #[`item.idNo`]="{ item }">
      <LinkText :to="{ name: 'ContractDetailPage', params: { id: item.id } }">
        {{ item.idNo }}
      </LinkText>
    </template>
    <template #[`item.principal`]="{ item }">
      <div>{{ formatter.numberFormat(item.principal) }}</div>
      <div>
        {{ formatter.numberFormat(item.installmentCount) }}
      </div>
    </template>
    <template #[`item.principalAndInterest`]="{ item }">
      <div>{{ formatter.numberFormat(item.principalAndInterest) }}</div>
      <div>
        {{ formatter.numberFormat(item.monthlyInstallment) }}
      </div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import { generateTableFooter, type IFooterColConfig } from '@/utils/TableFooter'
import type { IOutstandingDebtorList, IOutStandingDebtorSummary } from '@/models/response/report/outstanding-debtor/OutstandingDebtorRes.model'
import type { IColumn, IFooter } from '@/models/Table.model'
import { formatTitle } from '@/enums/modules/contract/InterestType.enum'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IOutstandingDebtorList[]
  summary?: IOutStandingDebtorSummary
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

const columns = ref<IColumn<IOutstandingDebtorList>[]>([
  { field: 'index', header: 'ลำดับ', align: 'center', style: { width: '70px', minWidth: '70px' }, width: 60 },
  { field: 'idNo', header: 'เลขที่สัญญา', align: 'left', style: { width: '130px', minWidth: '130px' }, width: 120 },
  { field: 'customerName', header: 'ชื่อลูกค้า', align: 'left', style: { width: '180px', minWidth: '180px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, width: 160 },
  {
    field: 'interestType',
    header: 'ประเภทเงินกู้',
    align: 'left',
    style: { width: '160px', minWidth: '160px' },
    bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' },
    width: 120,
    value: (e: IOutstandingDebtorList): string => formatTitle(e.interestType)
  },
  {
    field: 'startContractDate',
    header: 'วันที่ทำสัญญา',
    align: 'left',
    style: { width: '120px', minWidth: '120px' },
    width: 120,
    sortable: true,
    value: (e: IOutstandingDebtorList): string => dayjs.formatDate(e.startContractDate)
  },
  {
    field: 'endContractDate',
    header: 'วันที่ครบสัญญา',
    align: 'left',
    style: { width: '120px', minWidth: '120px' },
    width: 120,
    sortable: true,
    value: (e: IOutstandingDebtorList): string => dayjs.formatDate(e.endContractDate)
  },
  { field: 'principal', header: 'ยอดจัด/งวด', align: 'right', style: { width: '140px', minWidth: '140px' }, width: 130 },
  { field: 'principalAndInterest', header: 'ยอดจัดรวมดอกเบี้ย/งวด', align: 'right', style: { width: '140px', minWidth: '140px' }, width: 160 },
  {
    field: 'amountPaid',
    header: 'ชำระแล้ว',
    align: 'right',
    style: { width: '140px', minWidth: '140px' },
    width: 120,
    value: (e: IOutstandingDebtorList): string => formatter.numberFormat(e.amountPaid)
  },
  {
    field: 'outstanding',
    header: 'ลูกหนี้คงเหลือ',
    align: 'right',
    style: { width: '140px', minWidth: '140px' },
    width: 130,
    value: (e: IOutstandingDebtorList): string => formatter.numberFormat(e.outstanding)
  },
  {
    field: 'lastUpdated',
    header: 'วันที่ชำระล่าสุด',
    align: 'left',
    style: { width: '120px', minWidth: '120px' },
    width: 120,
    value: (e: IOutstandingDebtorList): string => dayjs.formatDate(e.lastUpdated)
  },
  {
    field: 'latestPaymentAmount',
    header: 'ยอดชำระล่าสุด',
    align: 'right',
    style: { width: '140px', minWidth: '140px' },
    width: 120,
    value: (e: IOutstandingDebtorList): string => formatter.numberFormat(e.latestPaymentAmount)
  }
])

const itemsFooter = computed((): IFooter[] => {
  type TConfig = Partial<Record<keyof IOutstandingDebtorList, IFooterColConfig<IOutStandingDebtorSummary>>>
  const footerConfig: TConfig = {
    idNo: { value: `รวม ${pagination.value.count || 0} รายการ` },
    customerName: { value: '' },
    principal: {
      format: (v: number): string => formatter.numberFormat(v ?? 0),
      footerClass: 'text-right'
    },
    principalAndInterest: {
      format: (v: number): string => formatter.numberFormat(v ?? 0),
      footerClass: 'text-right'
    },
    amountPaid: {
      format: (v: number): string => formatter.numberFormat(v ?? 0),
      footerClass: 'text-right'
    },
    outstanding: {
      format: (v: number): string => formatter.numberFormat(v ?? 0),
      footerClass: 'text-right'
    },
    latestPaymentAmount: {
      format: (v: number): string => formatter.numberFormat(v ?? 0),
      footerClass: 'text-right'
    }
  }
  return generateTableFooter(columns.value, props.summary, footerConfig)
})
</script>

<style scoped></style>
