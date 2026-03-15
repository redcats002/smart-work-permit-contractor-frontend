<template>
  <div class="grid gap-2.5">
    <GuarantorFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="fetch()" />
    <GuarantorTable
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
import type { IGetGuarantorContractList } from '@/models/request/contract/ContractReq.model'
import type { IContractGuarantorList } from '@/models/response/contract/ContractRes.model'
import ContractProvider, { type IContractProvider } from '@/resources/provider/contract/Contract.provider'
import usePagination from '@/composables/usePagination'
import GuarantorFilter from './GuarantorFilter.vue'
import GuarantorTable from './GuarantorTable.vue'

const Service: IContractProvider = new ContractProvider()

const route = useRoute()
const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

const filters = ref<IGetGuarantorContractList>({})
const items = ref<IContractGuarantorList[]>([])
const customerId = computed((): number => route?.params?.id ? Number(route.params.id) : 0)

const paginateQuery = computed((): IGetGuarantorContractList => {
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
  const response = await Service.getGuarantorList(customerId.value, paginateQuery.value)
  items.value = response?.data || []
  pagination.value = extractPagination(response)
  syncQuery({ ...normalizeFilters(filters.value) })
}


function normalizeFilters (value: IGetGuarantorContractList): Partial<IGetGuarantorContractList> {
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
