<template>
  <div class="grid gap-2.5">
    <BaseContainer
      v-for="(item, index) in displayItems"
      :key="index">
      <DisplayList :items="item" />
    </BaseContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetCustomerDocumentList } from '@/models/request/customer/CustomerReq.model'
import type { ICustomerDocumentById } from '@/models/response/customer/CustomerRes.model'
import CustomerProvider, { type ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import usePagination from '@/composables/usePagination'

const route = useRoute()

const CustomerService: ICustomerProvider = new CustomerProvider()
const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()
const filters = ref<IGetCustomerDocumentList>({})

const customerId = computed((): number => Number(route?.params?.id as string ?? ''))
const customerDoc = ref<ICustomerDocumentById[]>([])

const displayItems = computed((): IDisplayList[][] => {
  const items = customerDoc.value.map((i: ICustomerDocumentById): IDisplayList[] => (
    [
      {
        label: i.name,
        key: i.name,
        value: i.fileName,
        extUrl: i.image
      },
      {
        label: 'จุดจัดเก็บเอกสาร',
        key: i.location?.name,
        value: i.location?.name
      }
    ]
  ))
  return items
})

const paginateQuery = computed((): IGetCustomerDocumentList => {
  const normalizedFilters = normalizeFilters(filters.value)
  return {
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit, // TODO
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value,
    customerId: customerId.value,
    ...normalizedFilters
  }
})

async function useFetch (): Promise<void> {
  const response = await CustomerService.getCustomerDocumentPaginate(paginateQuery.value)
  customerDoc.value = response.data || []
  pagination.value = extractPagination(response)
  syncQuery({ ...normalizeFilters(filters.value) })
}

function normalizeFilters (value: IGetCustomerDocumentList): Partial<IGetCustomerDocumentList> {
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
