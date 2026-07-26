<template>
  <section id="annual-finance-receipt-print-page">
    <AnnualFinanceReceiptPrint
      id="print-area"
      :items="items"
      :summary="summary" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IAnnualFinanceReceiptList, IAnnualFinanceReceiptSummary } from '@/models/response/report/annual-finance-receipt/AnnualFinanceReceiptRes.model'
import AnnualFinanceReceiptProvider, { type IAnnualFinanceReceiptProvider } from '@/resources/provider/report/AnnualFinanceReceipt.provider'
import AnnualFinanceReceiptPrint from '../components/AnnualFinanceReceiptPrint.vue'

const route = useRoute()
const AnnualFinanceReceiptService: IAnnualFinanceReceiptProvider = new AnnualFinanceReceiptProvider()

const items = ref<IAnnualFinanceReceiptList[]>([])
const summary = ref<IAnnualFinanceReceiptSummary>()

async function fetchAll (): Promise<void> {
  const response = await AnnualFinanceReceiptService.getAnnualFinanceReceiptPaginate({
    limit: 9999,
    branchId: route.query.branchId ? Number(route.query.branchId) : undefined,
    year: route.query.year as string || undefined
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
