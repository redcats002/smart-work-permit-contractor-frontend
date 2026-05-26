<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.action`]="{ item }">
      <ContractLoanPurposeMenuAction
        v-if="item?.id"
        v-model="form"
        :item="item"
        @delete="emits('delete', $event)"
        @edit="emits('edit', $event)" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IActionContractLoanPurposePayload } from '@/models/request/contract-loan-purpose/ContractLoanPurposeReq.model'
import type { IContractLoanPurposeList } from '@/models/response/contract-loan-purpose/ContractLoanPurposeRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import ContractLoanPurposeMenuAction from './ContractLoanPurposeMenuAction.vue'

interface IProps {
  items: IContractLoanPurposeList[]
}

const props = defineProps<IProps>()

interface IEmits {
  delete: [id: TBaseParamsId]
  edit: [id: TBaseParamsId]
  update: []
}

const emits = defineEmits<IEmits>()

const form = defineModel<IActionContractLoanPurposePayload>('form', { required: true })
const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IContractLoanPurposeList>[]>([
  { field: 'name', header: 'วัตถุประสงค์การกู้', align: 'left', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IContractLoanPurposeList): string => e?.name || '' },
  { field: 'action', header: 'จัดการ', align: 'right', style: { width: '80px', minWidth: '80px' } }
])
</script>

<style scoped></style>
