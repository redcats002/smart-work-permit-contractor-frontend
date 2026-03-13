<template>
  <div class="grid gap-2.5">
    <ContractFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="fetch()">
      <CreateButton
        :to="{}"
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
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetCustomerContractList, IGetCustomerList } from '@/models/request/customer/CustomerReq.model'
import type { ICustomerContractList } from '@/models/response/customer/CustomerRes.model'
import CustomerProvider, { type ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import CreateButton from '@/components/button/CreateButton.vue'
import usePagination from '@/composables/usePagination'
import ContractFilter from './ContractFilter.vue'
import ContractTable from './ContractTable.vue'

const CustomerService: ICustomerProvider = new CustomerProvider()

const route = useRoute()
const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

const filters = ref<IGetCustomerContractList>({})
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
  const mock = true // TODO: remove mock when api ready
  if (mock) {
    items.value = []
    return
  }
  const response = await CustomerService.getCustomerContracts(customerId.value, paginateQuery.value)
  items.value = response?.data || []
  pagination.value = extractPagination(response)
  syncQuery({ ...normalizeFilters(filters.value) })
}


function normalizeFilters (value: IGetCustomerList): Partial<IGetCustomerList> {
  return {
    ...value
  }
}

function fetch (): void {
  handleLoading(useFetch)
}

function onClearFilters (): void {}

</script>

<style scoped>

</style>
