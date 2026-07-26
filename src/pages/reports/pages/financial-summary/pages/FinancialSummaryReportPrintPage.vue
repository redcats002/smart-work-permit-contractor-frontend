<template>
  <section id="financial-summary-report-print-page">
    <FinancialSummaryReportPrint
      id="print-area"
      :items="items"
      :summary="summary"
      :type="type" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IFinancialSummaryReportList, IFinancialSummaryReportSummary } from '@/models/response/report/financial-summary/FinancialSummaryRes.model'
import { FinancialSummaryTypeEnum, type TFinancialSummaryType } from '@/enums/modules/report/financial-summary/FinancialSummaryType.enum'
import FinancialSummaryProvider, { type IFinancialSummaryProvider } from '@/resources/provider/report/FinancialSummary.provider'
import FinancialSummaryReportPrint from '../components/FinancialSummaryReportPrint.vue'

const route = useRoute()
const FinancialSummaryService: IFinancialSummaryProvider = new FinancialSummaryProvider()

const items = ref<IFinancialSummaryReportList[]>([])
const summary = ref<IFinancialSummaryReportSummary>()
const type = ref<TFinancialSummaryType>((route.query.type as TFinancialSummaryType) || FinancialSummaryTypeEnum.SUMMARY)

async function fetchAll (): Promise<void> {
  const response = await FinancialSummaryService.getFinancialSummaryPaginate({
    limit: 9999,
    branchId: route.query.branchId as string || undefined
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
