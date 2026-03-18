<template>
  <div class="grid gap-2.5">
    <Title
      title="ผู้ค้ำประกัน" />
    <GuarantorTable
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
import type { IGetGuarantorContractList } from '@/models/request/contract/ContractReq.model'
import type { IContractGuarantorList } from '@/models/response/contract/ContractRes.model'
import ContractProvider, { type IContractProvider } from '@/resources/provider/contract/Contract.provider'
import usePagination from '@/composables/usePagination'
import Title from '../Title.vue'
import GuarantorTable from './GuarantorTable.vue'

const ContractService: IContractProvider = new ContractProvider()

const route = useRoute()
const { pagination, sortBy, sortOrder, syncQuery } = usePagination()

const filters = ref<IGetGuarantorContractList>({})
const allItems = ref<IContractGuarantorList[]>([])
const items = computed((): IContractGuarantorList[] => {
  const start = ((pagination.value.page || 1) - 1) * (pagination.value.limit || 25)
  const end = start + (pagination.value.limit || 25)

  return allItems.value.slice(start, end)
})
const customerId = computed((): number => route?.params?.id ? Number(route.params.id) : 0)

async function useFetch (): Promise<void> {
  const response = await ContractService.getContractFindOne(customerId.value)
  allItems.value = response?.data.guarantors || []
  pagination.value.count = allItems.value.length
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

onMounted((): void => {
  fetch()
})
</script>

<style scoped>

</style>
