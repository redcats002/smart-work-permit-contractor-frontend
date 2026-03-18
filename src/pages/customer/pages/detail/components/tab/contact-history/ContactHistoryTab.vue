<template>
  <div class="grid gap-2.5">
    <ContactHistoryFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="fetch()" />
    <ContactHistoryTable
      v-model:pagination="pagination"
      v-model:sort-by="sortBy"
      v-model:sort-order="sortOrder"
      :items="items"
      @delete="onDelete($event)"
      @update="fetch()" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetCustomerContactHistoryList, IGetCustomerList } from '@/models/request/customer/CustomerReq.model'
import type { ICustomerContactHistoryList } from '@/models/response/customer/CustomerRes.model'
import CustomerProvider, { type ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import usePagination from '@/composables/usePagination'
import ContactHistoryFilter from './ContactHistoryFilter.vue'
import ContactHistoryTable from './ContactHistoryTable.vue'

const CustomerService: ICustomerProvider = new CustomerProvider()

const route = useRoute()
const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

const filters = ref<IGetCustomerContactHistoryList>({})
const items = ref<ICustomerContactHistoryList[]>([])

const customerId = computed((): number => route?.params?.id ? Number(route.params.id) : 0)
const paginateQuery = computed((): IGetCustomerContactHistoryList => {
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
  const response = await CustomerService.getCustomerContactHistory(customerId.value, paginateQuery.value)
  items.value = response?.data || []
  pagination.value = extractPagination(response)
  syncQuery({ ...normalizeFilters(filters.value) })
}

async function useDelete (id: number): Promise<void> {
  await CustomerService.deleteCustomer(id)
  fetch()
  toast.success('ลบลูกค้าสําเร็จ')
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

function onDelete (id: number): void {
  handleLoading((): Promise<void> => useDelete(id))
}

</script>

<style scoped>

</style>
