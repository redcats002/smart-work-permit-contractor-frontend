<template>
  <div class="grid gap-2.5">
    <div class="flex items-center justify-between flex-wrap gap-2">
      <Title title="รายการค่าใช้จ่าย" />
      <CreateButton
        label="บันทึกค่าใช้จ่าย"
        @click="openModal('create')" />
    </div>
    <DocumentTable
      v-model:pagination="pagination"
      v-model:sort-by="sortBy"
      v-model:sort-order="sortOrder"
      :items="items"
      @delete="openModal('delete', $event)"
      @edit="openModal('edit', $event)"
      @read="openModal('read', $event)"
      @update="fetch()" />
    <ModalDocument
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
import type { IGetDocumentList } from '@/models/request/contract-document/ContractDocumentReq.model'
import type { IContractDocumentList } from '@/models/response/contract-document/ContractDocumentRes.model'
import ContractDocumentProvider, { type IContractDocumentProvider } from '@/resources/provider/contract-document/ContractDocument.provider'
import CreateButton from '@/components/button/CreateButton.vue'
import usePagination from '@/composables/usePagination'
import Title from '../Title.vue'
import DocumentTable from './DocumentTable.vue'
import ModalDocument from './ModalDocument.vue'

type TDocumentModalMode = 'create' | 'read' | 'edit' | 'delete'

const ContractDocumentService: IContractDocumentProvider = new ContractDocumentProvider()

const route = useRoute()
const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

const filters = ref<IGetDocumentList>({})
const items = ref<IContractDocumentList[]>([])
const contractId = computed((): number => route?.params?.id ? Number(route.params.id) : 0)

const paginateQuery = computed((): IGetDocumentList => {
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
  const response = await ContractDocumentService.getDocumentList(contractId.value, paginateQuery.value)
  items.value = response?.data || []
  pagination.value = extractPagination(response)
  syncQuery({ ...normalizeFilters(filters.value) })
}


function normalizeFilters (value: IGetDocumentList): Partial<IGetDocumentList> {
  return {
    ...value
  }
}

function fetch (): void {
  handleLoading(useFetch)
}

const modalVisible = ref<boolean>(false)
const modalMode = ref<TDocumentModalMode>('create')
const selectedItem = ref<IContractDocumentList | undefined>(undefined)

function openModal (mode: TDocumentModalMode, item?: IContractDocumentList): void {
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
