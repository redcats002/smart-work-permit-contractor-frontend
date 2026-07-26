<template>
  <section id="overdue-customer-print-page">
    <OverdueCustomerPrint
      id="print-area"
      :items="items"
      :summary="summary" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IOverdueCustomerList, IOverdueCustomerSummary } from '@/models/response/report/overdue-customer/OverdueCustomerRes.model'
import OverdueCustomerProvider, { type IOverdueCustomerProvider } from '@/resources/provider/report/OverdueCustomer.provider'
import OverdueCustomerPrint from '../components/OverdueCustomerPrint.vue'

const route = useRoute()
const OverdueCustomerService: IOverdueCustomerProvider = new OverdueCustomerProvider()

const items = ref<IOverdueCustomerList[]>([])
const summary = ref<IOverdueCustomerSummary>()

async function fetchAll (): Promise<void> {
  const response = await OverdueCustomerService.getOverdueCustomerPaginate({
    limit: 9999,
    branchId: route.query.branchId ? Number(route.query.branchId) : undefined
  })
  items.value = response?.data || []
  summary.value = response?.summary
}

onMounted(async (): Promise<void> => {
  await handleLoading(fetchAll)
  await window.print()
})
</script>

<style scoped></style>
