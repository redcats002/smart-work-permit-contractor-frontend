<template>
  <div class="grid gap-2.5">
    <PaymentHistoryFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="fetch()" />
    <PaymentHistoryTable
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
import type { IGetCustomerPaymentHistoryList } from '@/models/request/customer/CustomerReq.model'
import type { ICustomerPaymentHistoryList } from '@/models/response/customer/CustomerRes.model'
import CustomerProvider, { type ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import usePagination from '@/composables/usePagination'
import PaymentHistoryFilter from './PaymentHistoryFilter.vue'
import PaymentHistoryTable from './PaymentHistoryTable.vue'

const CustomerService: ICustomerProvider = new CustomerProvider()

const route = useRoute()
const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

const filters = ref<IGetCustomerPaymentHistoryList>({})
const items = ref<ICustomerPaymentHistoryList[]>([])

const customerId = computed((): number => route.params.id ? Number(route.params.id) : 0)
const paginateQuery = computed((): IGetCustomerPaymentHistoryList => {
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
  const response = await CustomerService.getCustomerPaymentHistory(customerId.value, paginateQuery.value)
  items.value = response?.data || []
  pagination.value = extractPagination(response)
  syncQuery({ ...normalizeFilters(filters.value) })
}

function normalizeFilters (value: IGetCustomerPaymentHistoryList): Partial<IGetCustomerPaymentHistoryList> {
  return {
    ...value
  }
}

function fetch (): void {
  handleLoading(useFetch)
}

function onClearFilters (): void {
  filters.value = {
    paymentMethod: undefined
  }
  reset()
}

</script>

<style scoped>

</style>
