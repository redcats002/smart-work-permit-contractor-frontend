<template>
  <div class="grid gap-2.5">
    <ContractFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="onSearch()">
      <CreateButton
        :to="{ name: 'PreContractCreatePage', query: { customerId: customerId } }"
        label="สร้างสัญญาใหม่" />
    </ContractFilter>
    <ContractTable
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
import type { ICustomerContractFilter } from '@/models/modules/customer/contract/Filter.model'
import type { IGetCustomerContractList } from '@/models/request/customer/CustomerReq.model'
import type { ICustomerContractList } from '@/models/response/customer/CustomerRes.model'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import CustomerProvider, { type ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import CreateButton from '@/components/button/CreateButton.vue'
import usePagination from '@/composables/usePagination'
import ContractFilter from './ContractFilter.vue'
import ContractTable from './ContractTable.vue'

const CustomerService: ICustomerProvider = new CustomerProvider()

const route = useRoute()
const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

const filters = ref<ICustomerContractFilter>({
  status: route?.query?.status ? route.query.status as TContractStatus : undefined
})
const items = ref<ICustomerContractList[]>([])

const customerId = computed((): number => route?.params?.id ? Number(route.params.id) : 0)
const paginateQuery = computed((): IGetCustomerContractList => {
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
  const response = await CustomerService.getCustomerContracts(customerId.value, paginateQuery.value)
  items.value = response?.data || []
  pagination.value = extractPagination(response)
  syncQuery({ ...normalizeFilters(filters.value) })
}


function normalizeFilters (value: ICustomerContractFilter): Partial<IGetCustomerContractList> {
  return {
    ...value
  }
}

function onSearch (): void {
  resetPagination()
  fetch()
}

function fetch (): void {
  handleLoading(useFetch)
}

function onClearFilters (): void {
  reset()
  filters.value = {
    status: undefined
  }
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped>

</style>
