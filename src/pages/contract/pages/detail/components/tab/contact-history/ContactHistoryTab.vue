<template>
  <div class="grid gap-2.5">
    <Title
      title="ประวัติการติดต่อ">
      <ModalContractHistory
        @submit="fetch()" />
    </Title>
    <ContactHistoryTable
      v-model:pagination="pagination"
      v-model:sort-by="sortBy"
      v-model:sort-order="sortOrder"
      :items="items"
      @update="fetch()" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetContactHistoryList } from '@/models/request/contract/ContractReq.model'
import type { IContractContactHistoryList } from '@/models/response/contract/ContractRes.model'
import type { IContractProvider } from '@/resources/provider/contract/Contract.provider'
import ContractProvider from '@/resources/provider/contract/Contract.provider'
import usePagination from '@/composables/usePagination'
import Title from '../Title.vue'
import ContactHistoryTable from './ContactHistoryTable.vue'
import ModalContractHistory from './ModalContractHistory.vue'

const ContractService: IContractProvider = new ContractProvider()

const route = useRoute()
const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

const filters = ref<IGetContactHistoryList>({})
const items = ref<IContractContactHistoryList[]>([])
const contractId = computed((): number => route?.params?.id ? Number(route.params.id) : 0)

const paginateQuery = computed((): IGetContactHistoryList => {
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
  const response = await ContractService.getContractHistoryList(contractId.value, paginateQuery.value)
  items.value = response?.data || []
  pagination.value = extractPagination(response)
  syncQuery({ ...normalizeFilters(filters.value) })
}


function normalizeFilters (value: IGetContactHistoryList): Partial<IGetContactHistoryList> {
  return {
    ...value
  }
}

function fetch (): void {
  handleLoading(useFetch)
}

onMounted((): void => {
  fetch()
})

</script>

<style scoped>

</style>
