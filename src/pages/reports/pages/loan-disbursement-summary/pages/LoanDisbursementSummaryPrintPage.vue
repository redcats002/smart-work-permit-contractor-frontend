<template>
  <section id="loan-disbursement-summary-print-page">
    <LoanDisbursementSummaryPrint
      id="print-area"
      :items="items"
      :summary="summary" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type {
  ILoanDisbursementSummaryList,
  ILoanDisbursementSummarySummary
} from '@/models/response/report/loan-disbursement-summary/LoanDisbursementSummaryRes.model'
import LoanDisbursementSummaryProvider, { type ILoanDisbursementSummaryProvider } from '@/resources/provider/report/LoanDisbursementSummary.provider'
import LoanDisbursementSummaryPrint from '../components/LoanDisbursementSummaryPrint.vue'

const route = useRoute()
const LoanDisbursementSummaryService: ILoanDisbursementSummaryProvider = new LoanDisbursementSummaryProvider()

const items = ref<ILoanDisbursementSummaryList[]>([])
const summary = ref<ILoanDisbursementSummarySummary>()

async function fetchAll (): Promise<void> {
  const response = await LoanDisbursementSummaryService.getLoanDisbursementSummaryPaginate({
    limit: 9999,
    search: route.query.search as string || undefined,
    branchId: route.query.branchId ? Number(route.query.branchId) : undefined,
    startDate: route.query.startDate as string || undefined,
    endDate: route.query.endDate as string || undefined
  })
  items.value = response?.data || []
  summary.value = {
    numberOfBranches: response?.count || 0,
    contractAmount: response?.summary?.contractAmount || 0,
    principal: response?.summary?.principal || 0,
    interest: response?.summary?.interest || 0,
    principalAndInterest: response?.summary?.principalAndInterest || 0,
    monthlyInstallment: response?.summary?.monthlyInstallment || 0
  }
}

onMounted(async (): Promise<void> => {
  await handleLoading(fetchAll)
  await window.print()
})
</script>

<style scoped></style>
