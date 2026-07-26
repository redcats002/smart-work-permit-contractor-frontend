<template>
  <section id="all-stock-print-page">
    <AllStockPrint
      id="print-area"
      :items="items" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { ISummaryStockList } from '@/models/response/report/summary-stock/SummaryStockRes.model'
import SummaryStockProvider, { type ISummaryStockProvider } from '@/resources/provider/report/SummaryStock.provider'
import AllStockPrint from '../components/AllStockPrint.vue'

const SummaryStockService: ISummaryStockProvider = new SummaryStockProvider()

const items = ref<ISummaryStockList[]>([])

async function fetchAll (): Promise<void> {
  const response = await SummaryStockService.getSummaryStock()
  items.value = response?.data || []
}

onMounted(async (): Promise<void> => {
  await handleLoading(fetchAll)
  await window.print()
})
</script>

<style scoped></style>
