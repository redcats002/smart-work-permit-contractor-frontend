<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.index`]="{ index }">
      {{ generator.generateOrder(index, pagination) }}
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { generator } from '@/utils/Generator'
import type { IContractSecurityDocumentReportList } from '@/models/response/report/contract-security-document/ContractSecurityDocumentRes.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IContractSecurityDocumentReportList[]
}

defineProps<IProps>()

interface IEmits {
  update: []
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', { required: true })
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IContractSecurityDocumentReportList>[]>([
  { field: 'index', header: 'ลำดับ', align: 'center', width: 60 },
  { field: 'branchName', header: 'สาขา', align: 'left', width: 160 },
  { field: 'contractAmount', header: 'จำนวนสัญญา', align: 'center', width: 120 },
  { field: 'contractCloseAmount', header: 'จำนวนปิดบัญชี', align: 'center', width: 120 },
  { field: 'contractPendingAmount', header: 'คงเหลือ', align: 'center', width: 120 },
  { field: 'assetLandAmount', header: 'จำนวนโฉนดที่ดิน', align: 'center', width: 130 },
  { field: 'ns3Amount', header: 'น.ส. 3', align: 'center', width: 100 },
  { field: 'ns3kAmount', header: 'น.ส. 3ก', align: 'center', width: 100 },
  { field: 'vehicle', header: 'รถยนต์', align: 'center', width: 100 },
  { field: 'motorcycle', header: 'รถมอเตอร์ไซค์', align: 'center', width: 120 }
])
</script>

<style scoped></style>
