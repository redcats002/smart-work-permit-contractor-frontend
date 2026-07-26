<template>
  <section id="branch-head-summary-print-page">
    <BranchHeadSummaryPrint
      id="print-area"
      :items="items" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { EReportPeriod } from '@/models/request/leader-branch-report/LeaderBranchReportReq.model'
import type { IBranchHeadSummaryList } from '@/models/response/report/branch-head-summary/BranchHeadSummaryRes.model'
import LeaderBranchReportProvider, { type ILeaderBranchReportProvider } from '@/resources/provider/report/LeaderBranchReport.provider'
import BranchHeadSummaryPrint from '../components/BranchHeadSummaryPrint.vue'

const route = useRoute()
const LeaderBranchReportService: ILeaderBranchReportProvider = new LeaderBranchReportProvider()

const items = ref<IBranchHeadSummaryList[]>([])

async function fetchAll (): Promise<void> {
  const response = await LeaderBranchReportService.getLeaderBranchReportPaginate({
    limit: 9999,
    search: route.query.search as string || undefined,
    branchId: route.query.branchId as string || undefined,
    period: route.query.period as EReportPeriod || undefined,
    date: route.query.date as string || undefined
  })
  items.value = response?.data || []
}

onMounted(async (): Promise<void> => {
  await handleLoading(fetchAll)
  await window.print()
})
</script>

<style scoped></style>
