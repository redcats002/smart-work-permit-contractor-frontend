<template>
  <div class="grid gap-2.5">
    <PrivateDocumentFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="fetch()">
      <CreateButton
        label="เพิ่มเอกสาร"
        @click="openModal('CREATE')" />
    </PrivateDocumentFilter>
    <PrivateDocumentTable
      v-model:pagination="pagination"
      v-model:sort-by="sortBy"
      v-model:sort-order="sortOrder"
      :items="items"
      @delete="openModal('DELETE', $event)"
      @edit="openModal('UPDATE', $event)"
      @read="openModal('READ', $event)"
      @update="fetch()" />
    <ModalPrivateDocument
      v-model:visible="modalVisible"
      :customer-id="customerId"
      :item="selectedItem"
      :mode="modalMode"
      @update="fetch()" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { TActionMode } from '@/models/Global.model'
import type { ICustomerDocumentFilter } from '@/models/modules/customer/document/Filter.model'
import type { IGetCustomerDocumentList } from '@/models/request/customer/CustomerReq.model'
import type { ICustomerDocumentById } from '@/models/response/customer/CustomerRes.model'
import CustomerProvider, { type ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import CreateButton from '@/components/button/CreateButton.vue'
import usePagination from '@/composables/usePagination'
import ModalPrivateDocument from './ModalPrivateDocument.vue'
import PrivateDocumentFilter from './PrivateDocumentFilter.vue'
import PrivateDocumentTable from './PrivateDocumentTable.vue'

const CustomerService: ICustomerProvider = new CustomerProvider()

const route = useRoute()
const { pagination, sortBy, sortOrder, search, extractPagination, syncQuery } = usePagination()

const filters = ref<ICustomerDocumentFilter>({})
const items = ref<ICustomerDocumentById[]>([])
const customerId = computed((): number => Number(route?.params?.id as string ?? ''))

const paginateQuery = computed((): IGetCustomerDocumentList => ({
  page: pagination.value.page,
  limit: pagination.value.limit,
  search: search.value || undefined,
  sortBy: sortBy.value || undefined,
  sortOrder: sortOrder.value,
  customerId: customerId.value,
  ...filters.value
}))

const modalVisible = ref<boolean>(false)
const modalMode = ref<TActionMode>('CREATE')
const selectedItem = ref<ICustomerDocumentById | undefined>(undefined)

function openModal (mode: TActionMode, item?: ICustomerDocumentById): void {
  modalMode.value = mode
  selectedItem.value = item
  if (mode !== 'DELETE') modalVisible.value = true
}

function normalizeFilters (value?: IGetCustomerDocumentList): Partial<IGetCustomerDocumentList> {
  return {
    ...value
  }
}

async function useFetch (): Promise<void> {
  const response = await CustomerService.getCustomerDocumentPaginate(paginateQuery.value)
  items.value = response.data || []
  pagination.value = extractPagination(response)
  syncQuery({ ...normalizeFilters(filters.value) })
}

function fetch (): void {
  handleLoading(useFetch)
}

function onClearFilters (): void {
  filters.value = {}
  search.value = ''
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped></style>
