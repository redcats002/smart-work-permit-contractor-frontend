<template>
  <section id="daily-branch-summary-print-page">
    <DailyBranchSummaryPrint
      id="print-area"
      :items="items"
      :summary="summary" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IDailyBranchSummaryList, TGetDailyBranchSummaryListResponse } from '@/models/response/report/daily-branch-summary/DailyBranchSummaryRes.model'
import DailyBranchSummaryProvider, { type IDailyBranchSummaryProvider } from '@/resources/provider/report/DailyBranchSummary.provider'
import DailyBranchSummaryPrint from '../components/DailyBranchSummaryPrint.vue'

const route = useRoute()
const DailyBranchSummaryService: IDailyBranchSummaryProvider = new DailyBranchSummaryProvider()

const items = ref<IDailyBranchSummaryList[]>([])
const summary = ref<TGetDailyBranchSummaryListResponse['summary'] | undefined>(undefined)

async function fetchAll (): Promise<void> {
  const response = await DailyBranchSummaryService.getDailyBranchSummaryPaginate({
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
