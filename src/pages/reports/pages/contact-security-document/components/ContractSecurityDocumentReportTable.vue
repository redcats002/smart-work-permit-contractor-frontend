<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding>
    <template #[`item.index`]="{ index }">
      {{ index + 1 }}
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

import type { IContractSecurityDocumentReportList } from '@/models/response/report/contract-security-document/ContractSecurityDocumentRes.model'

interface IProps {
  items: IContractSecurityDocumentReportList[]
}

const props = defineProps<IProps>()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IContractSecurityDocumentReportList>[]>([
  { field: 'index', header: 'ลำดับ', align: 'left', width: 60 },
  { field: 'branchName', header: 'สาขา', align: 'left', width: 150 },
  { field: 'contractAmount', header: 'จำนวนสัญญา', align: 'center', width: 120, value: (e: IContractSecurityDocumentReportList): number => e.contractAmount },
  { field: 'accountClosedAmount', header: 'จำนวนปิดบัญชี', align: 'center', width: 120, value: (e: IContractSecurityDocumentReportList): number => e.accountClosedAmount },
  { field: 'remainingAmount', header: 'คงเหลือ', align: 'center', width: 120, value: (e: IContractSecurityDocumentReportList): number => e.remainingAmount },
  { field: 'landTitleDeedAmount', header: 'จำนวนโฉนดที่ดิน', align: 'center', width: 120, value: (e: IContractSecurityDocumentReportList): number => e.landTitleDeedAmount },
  { field: 'ns3gor', header: 'นส3.ก ', align: 'center', width: 120, value: (e: IContractSecurityDocumentReportList): number => e.ns3gor },
  { field: 'ns3', header: 'น.ส. 3', align: 'center', width: 120, value: (e: IContractSecurityDocumentReportList): number => e.ns3 },
  { field: 'car', header: 'รถยนต์', align: 'center', width: 120, value: (e: IContractSecurityDocumentReportList): number => e.car },
  { field: 'motorcycle', header: 'รถมอเตอร์ไซค์', align: 'center', width: 120, value: (e: IContractSecurityDocumentReportList): number => e.motorcycle }
])
</script>

<style scoped></style>
