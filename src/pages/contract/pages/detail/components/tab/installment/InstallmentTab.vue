<template>
  <div class="grid gap-2.5">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5">
      <CardIndicator
        v-for="(card, i) in cards"
        :key="`card-${i}`"
        v-bind="card" />
    </div>
    <div class="flex justify-between">
      <span>ตารางการชำระ</span>
      <span><ConfirmButton label="ชำระเงิน" /></span>
    </div>
    <InstallmentTable
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
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetInstallmentList } from '@/models/request/contract/ContractReq.model'
import type { IContractInstallmentList } from '@/models/response/contract/ContractRes.model'
import ContractProvider, { type IContractProvider } from '@/resources/provider/contract/Contract.provider'
import CardIndicator, { type ICardIndicator } from '@/components/card/CardIndicator.vue'
import usePagination from '@/composables/usePagination'
import InstallmentTable from './InstallmentTable.vue'

const ContractService: IContractProvider = new ContractProvider()

const route = useRoute()
const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

const filters = ref<IGetInstallmentList>({})
const items = ref<IContractInstallmentList[]>([])
const contractId = computed((): number => route?.params?.id ? Number(route.params.id) : 0)

const paginateQuery = computed((): IGetInstallmentList => {
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

const cards = computed((): ICardIndicator[] => [
  { label: 'ยอดหนี้คงเหลือ', value: formatter.numberFormat2Decimal(100), valueClass: 'text-orange-400' },
  { label: 'เงินต้นคงเหลือ', value: formatter.numberFormat2Decimal(100), valueClass: 'text-blue-400' },
  { label: 'ดอกเบี้ยคงเหลือ', value: formatter.numberFormat2Decimal(100), valueClass: 'text-blue-400' }
])

async function useFetch (): Promise<void> {
  const mock = true // TODO: remove mock when api ready
  if (mock) {
    items.value = []
    return
  }
  const response = await ContractService.getInstallmentList(contractId.value, paginateQuery.value)
  items.value = response?.data || []
  pagination.value = extractPagination(response)
  syncQuery({ ...normalizeFilters(filters.value) })
}


function normalizeFilters (value: IGetInstallmentList): Partial<IGetInstallmentList> {
  return {
    ...value
  }
}

function fetch (): void {
  handleLoading(useFetch)
}


</script>

<style scoped>

</style>
