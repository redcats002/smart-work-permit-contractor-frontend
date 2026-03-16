<template>
  <div class="grid gap-2.5">
    <div class="flex items-center justify-between flex-wrap gap-2">
      <Title title="รายการค่าใช้จ่าย" />
      <CreateButton
        label="บันทึกค่าใช้จ่าย"
        @click="openModal('create')" />
    </div>
    <ExpenseTable
      v-model:pagination="pagination"
      v-model:sort-by="sortBy"
      v-model:sort-order="sortOrder"
      :items="items"
      @delete="openModal('delete', $event)"
      @edit="openModal('edit', $event)"
      @read="openModal('read', $event)"
      @update="fetch()" />
    <ModalExpense
      v-model:visible="modalVisible"
      :contract-id="contractId"
      :item="selectedItem"
      :mode="modalMode"
      @update="fetch()" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetExpenseList } from '@/models/request/contract/ContractReq.model'
import type { IContractExpenseList } from '@/models/response/contract/ContractRes.model'
import ContractProvider, { type IContractProvider } from '@/resources/provider/contract/Contract.provider'
import CreateButton from '@/components/button/CreateButton.vue'
import usePagination from '@/composables/usePagination'
import Title from '../Title.vue'
import ExpenseTable from './ExpenseTable.vue'
import ModalExpense from './ModalExpense.vue'

type TExpenseModalMode = 'create' | 'read' | 'edit' | 'delete'

const ContractService: IContractProvider = new ContractProvider()

const route = useRoute()
const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

const filters = ref<IGetExpenseList>({})
const items = ref<IContractExpenseList[]>([])
const contractId = computed((): number => route?.params?.id ? Number(route.params.id) : 0)

const paginateQuery = computed((): IGetExpenseList => {
  const normalizedFilters = normalizeFilters(filters.value)
  return {
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value,
    ...normalizedFilters
  }
})

async function useFetch (): Promise<void> {
  const mock = true // TODO: remove mock when api ready
  if (mock) {
    items.value = []
    return
  }
  const response = await ContractService.getExpenseList(contractId.value, paginateQuery.value)
  items.value = response?.data || []
  pagination.value = extractPagination(response)
  syncQuery({ ...normalizeFilters(filters.value) })
}


function normalizeFilters (value: IGetExpenseList): Partial<IGetExpenseList> {
  return {
    ...value
  }
}

function fetch (): void {
  handleLoading(useFetch)
}

const modalVisible = ref<boolean>(false)
const modalMode = ref<TExpenseModalMode>('create')
const selectedItem = ref<IContractExpenseList | undefined>(undefined)

function openModal (mode: TExpenseModalMode, item?: IContractExpenseList): void {
  modalMode.value = mode
  selectedItem.value = item
  modalVisible.value = true
}

</script>

<style scoped>

</style>
