<template>
  <div class="grid gap-2.5">
    <div class="flex items-center justify-between flex-wrap gap-2">
      <Title title="รายการรายได้" />
      <CreateButton
        label="บันทึกรายได้"
        @click="openModal('create')" />
    </div>
    <IncomeTable
      v-model:pagination="pagination"
      v-model:sort-by="sortBy"
      v-model:sort-order="sortOrder"
      :items="items"
      @delete="openModal('delete', $event)"
      @edit="openModal('edit', $event)"
      @read="openModal('read', $event)"
      @update="fetch()" />
    <ModalIncome
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
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetIncomeList } from '@/models/request/contract-income/ContractIncomeReq.model'
import type { IContractIncomeList } from '@/models/response/contract-income/ContractIncomeRes.model'
import ContractIncomeProvider, { type IContractIncomeProvider } from '@/resources/provider/contract-income/ContractIncome.provider'
import CreateButton from '@/components/button/CreateButton.vue'
import usePagination from '@/composables/usePagination'
import Title from '../Title.vue'
import IncomeTable from './IncomeTable.vue'
import ModalIncome from './ModalIncome.vue'

type TIncomeModalMode = 'create' | 'read' | 'edit' | 'delete'

const ContractIncomeService: IContractIncomeProvider = new ContractIncomeProvider()

const route = useRoute()
const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

const filters = ref<IGetIncomeList>({})
const items = ref<IContractIncomeList[]>([])
const contractId = computed((): number => route?.params?.id ? Number(route.params.id) : 0)

const paginateQuery = computed((): IGetIncomeList => {
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
  const response = await ContractIncomeService.getIncomeList(contractId.value, paginateQuery.value)
  items.value = response?.data || []
  pagination.value = extractPagination(response)
  syncQuery({ ...normalizeFilters(filters.value) })
}


function normalizeFilters (value: IGetIncomeList): Partial<IGetIncomeList> {
  return {
    ...value
  }
}

function fetch (): void {
  handleLoading(useFetch)
}

const modalVisible = ref<boolean>(false)
const modalMode = ref<TIncomeModalMode>('create')
const selectedItem = ref<IContractIncomeList | undefined>(undefined)

function openModal (mode: TIncomeModalMode, item?: IContractIncomeList): void {
  modalMode.value = mode
  selectedItem.value = item
  modalVisible.value = true
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped>

</style>
