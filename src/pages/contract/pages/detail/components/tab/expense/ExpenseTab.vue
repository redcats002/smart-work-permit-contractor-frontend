<template>
  <div class="grid gap-2.5">
    <div class="flex items-center justify-between flex-wrap gap-2">
      <Title title="รายการค่าใช้จ่าย" />
      <CreateButton
        label="บันทึกค่าใช้จ่าย"
        @click="openModal('CREATE')" />
    </div>
    <ExpenseTable
      v-model:pagination="pagination"
      v-model:sort-by="sortBy"
      v-model:sort-order="sortOrder"
      :items="items"
      @delete="onDelete($event)"
      @edit="openModal('UPDATE', $event)"
      @read="openModal('READ', $event)"
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
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { TActionMode } from '@/models/Global.model'
import type { IGetExpenseList } from '@/models/request/contract-expense/ContractExpenseReq.model'
import type { IContractExpenseList } from '@/models/response/contract-expense/ContractExpenseRes.model'
import ContractExpenseProvider, { type IContractExpenseProvider } from '@/resources/provider/contract-expense/ContractExpense.provider'
import CreateButton from '@/components/button/CreateButton.vue'
import usePagination from '@/composables/usePagination'
import Title from '../Title.vue'
import ExpenseTable from './ExpenseTable.vue'
import ModalExpense from './ModalExpense.vue'

defineOptions({
  inheritAttrs: false
})

const ContractExpenseService: IContractExpenseProvider = new ContractExpenseProvider()

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
  const response = await ContractExpenseService.getExpenseList(contractId.value, paginateQuery.value)
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
const modalMode = ref<TActionMode>('CREATE')
const selectedItem = ref<IContractExpenseList | undefined>(undefined)

function openModal (mode: TActionMode, item?: IContractExpenseList): void {
  modalMode.value = mode
  selectedItem.value = item
  modalVisible.value = true
}

function onDelete (item: IContractExpenseList): void {
  handleLoading(async (): Promise<void> => {
    await ContractExpenseService.deleteExpense(item.id)
    toast.success('ลบค่าใช้จ่ายสำเร็จ')
    fetch()
  })
}

onMounted((): void => {
  fetch()
})

</script>

<style scoped>

</style>
