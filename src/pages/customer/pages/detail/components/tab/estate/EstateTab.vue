<template>
  <div class="grid gap-2.5">
    <EstateFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="onSearch()" />
    <EstateTable
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
import type { ICustomerEstateFilter } from '@/models/modules/customer/estate/Filter.model'
import type { IGetCustomerEstateList } from '@/models/request/customer/CustomerReq.model'
import type { ICustomerAssetList } from '@/models/response/customer/CustomerRes.model'
import type { TAssetStatus } from '@/enums/modules/asset/AssetStatus.enum'
import type { TAssetType } from '@/enums/modules/asset/AssetType.enum'
import CustomerProvider, { type ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import usePagination from '@/composables/usePagination'
import EstateFilter from './EstateFilter.vue'
import EstateTable from './EstateTable.vue'

const CustomerService: ICustomerProvider = new CustomerProvider()

const route = useRoute()
const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

const filters = ref<ICustomerEstateFilter>({
  type: route?.query?.type ? route?.query?.type as TAssetType : undefined,
  status: route?.query?.status ? route?.query?.status as TAssetStatus : undefined
})
const items = ref<ICustomerAssetList[]>([])
const customerId = computed((): number => route?.params?.id ? Number(route.params.id) : 0)

const paginateQuery = computed((): IGetCustomerEstateList => {
  const normalizedFilters = normalizeFilters(filters.value)
  return {
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value,
    status: normalizedFilters.status,
    type: normalizedFilters.type,
    ...normalizedFilters
  }
})

async function useFetch (): Promise<void> {
  const response = await CustomerService.getCustomerEstates(customerId.value, paginateQuery.value)
  items.value = response?.data || []
  pagination.value = extractPagination(response)
  syncQuery({ ...normalizeFilters(filters.value) })
}


function normalizeFilters (value: ICustomerEstateFilter): Partial<IGetCustomerEstateList> {
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
  filters.value = {
    type: undefined,
    status: undefined
  }
  reset()
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped>

</style>
