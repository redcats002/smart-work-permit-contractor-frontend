<template>
  <section id="daily-loan-disbursement-print-page">
    <DailyLoanDisbursementPrint
      id="print-area"
      :items="items"
      :summary="summary" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IDailyLoanDisbursementList, IDailyLoanDisbursementSummary } from '@/models/response/report/daily-loan-disbursement/DailyLoanDisbursementRes.model'
import DailyLoanDisbursementProvider, { type IDailyLoanDisbursementProvider } from '@/resources/provider/report/DailyLoanDisbursement.provider'
import DailyLoanDisbursementPrint from '../components/DailyLoanDisbursementPrint.vue'

const route = useRoute()
const DailyLoanDisbursementService: IDailyLoanDisbursementProvider = new DailyLoanDisbursementProvider()

const items = ref<IDailyLoanDisbursementList[]>([])
const summary = ref<IDailyLoanDisbursementSummary>()

async function fetchAll (): Promise<void> {
  const response = await DailyLoanDisbursementService.getDailyLoanDisbursementPaginate({
    limit: 9999,
    search: route.query.search as string || undefined,
    branchId: route.query.branchId as string || undefined,
    startDate: route.query.startDate as string || undefined,
    endDate: route.query.endDate as string || undefined
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
