<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.action`]="{ item, index }">
      <ContractLoanTypeMenuAction
        v-if="item?.id"
        v-model="form"
        :index="index"
        :item="item"
        @delete="emits('delete', $event)"
        @edit="emits('edit', $event)" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IActionContractLoanTypePayload } from '@/models/request/contract-loan-type/ContractLoanTypeReq.model'
import type { IContractLoanTypeList } from '@/models/response/contract-loan-type/ContractLoanTypeRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import ContractLoanTypeMenuAction from './ContractLoanTypeMenuAction.vue'

interface IProps {
  items: IContractLoanTypeList[]
}

defineProps<IProps>()

interface IEmits {
  delete: [id: TBaseParamsId]
  edit: [id: TBaseParamsId]
  update: []
}

const emits = defineEmits<IEmits>()

const form = defineModel<IActionContractLoanTypePayload>('form', { required: true })
const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IContractLoanTypeList>[]>([
  { field: 'name', header: 'ประเภทเงินกู้', align: 'left', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IContractLoanTypeList): string => e?.name || '' },
  { field: 'action', header: 'จัดการ', align: 'right', style: { width: '80px', minWidth: '80px' } }
])
</script>

<style scoped></style>
