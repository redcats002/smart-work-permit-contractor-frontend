<template>
  <div class="grid gap-2.5">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5">
      <CardIndicator
        v-for="(card, i) in cards"
        :key="`card-${i}`"
        v-bind="card" />
    </div>
    <div class="flex justify-between items-center">
      <span>ตารางการชำระ</span>
      <span><ConfirmButton
        :to="{}"
        label="ชำระเงิน" /></span>
      <!-- TODO: to document-and-finance detail -->
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
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetInstallmentList } from '@/models/request/contract/ContractReq.model'
import type { IContractInstallmentList } from '@/models/response/contract/ContractRes.model'
import type { TPaymentStatus } from '@/enums/modules/contract/PaymentStatus.enum'
import ContractProvider, { type IContractProvider } from '@/resources/provider/contract/Contract.provider'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
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
    // Generate 3 random mock installments
    items.value = Array.from({ length: 10 }, (_: unknown, i: number): IContractInstallmentList => {
      const base = 100 + Math.floor(Math.random() * 900)
      const principal = Math.floor(Math.random() * 1000)
      const interest = Math.floor(Math.random() * 500)
      const lateFee = Math.floor(Math.random() * 200)
      const payment = Math.floor(Math.random() * 1200)
      const paymentAmount = payment + lateFee
      const remainingPrincipal = Math.max(0, principal - payment)
      const trackingFee = Math.floor(Math.random() * 100)
      const dueDate = `2024-0${i + 1}-0${Math.floor(Math.random() * 9) + 1}`
      return {
        id: i + 1,
        installment: i,
        balance: base,
        principal,
        interest,
        dueDate,
        lateFee,
        payment,
        paymentAmount,
        paymentStatus: ['OVERDUE', 'COMING', 'PARTIAL', 'PAID'][Math.floor(Math.random() * 4)] as TPaymentStatus,
        period: i + 1,
        remainingPrincipal,
        trackingFee
      }
    })
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

onMounted((): void => {
  fetch()
})

</script>

<style scoped>

</style>
