<template>
  <section id="branch-summary-report-print-page">
    <BranchSummaryReportPrint
      id="print-area"
      :items="items" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IBranchSummaryReportList } from '@/models/response/report/branch-summary/BranchSummaryRes.model'
import ReportBranchesProvider, { type IReportBranchesProvider } from '@/resources/provider/report/Branches.provider'
import BranchSummaryReportPrint from '../components/BranchSummaryReportPrint.vue'

const route = useRoute()
const ReportBranchesService: IReportBranchesProvider = new ReportBranchesProvider()

const items = ref<IBranchSummaryReportList[]>([])

async function fetchAll (): Promise<void> {
  const response = await ReportBranchesService.getReportBranchesPaginate({
    limit: 9999,
    search: route.query.search as string || undefined,
    branchId: route.query.branchId as string || undefined
  })
  items.value = response?.data || []
}

onMounted(async (): Promise<void> => {
  await handleLoading(fetchAll)
  await window.print()
})
</script>

<style scoped></style>
