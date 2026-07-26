<template>
  <section id="daily-summary-print-page">
    <DailySummaryPrint
      id="print-area"
      :items="items" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IDailySummaryListItem } from '@/models/response/report/daily-summary/DailySummaryRes'
import DailySummaryProvider, { type IDailySummaryProvider } from '@/resources/provider/report/DailySummary.provider'
import DailySummaryPrint from '../components/DailySummaryPrint.vue'

const route = useRoute()
const DailySummaryService: IDailySummaryProvider = new DailySummaryProvider()

const items = ref<IDailySummaryListItem[]>([])

async function fetchAll (): Promise<void> {
  const response = await DailySummaryService.getDailySummaryList({
    limit: 9999,
    startDate: route.query.startDate as string || undefined,
    endDate: route.query.endDate as string || undefined
  })
  items.value = response?.data || []
}

onMounted(async (): Promise<void> => {
  await handleLoading(fetchAll)
  await window.print()
})
</script>

<style scoped></style>
