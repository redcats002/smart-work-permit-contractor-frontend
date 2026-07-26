<template>
  <section id="daily-summary-detail-print-page">
    <DailySummaryDetailPrint
      id="print-area"
      :data="itemData" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IDailySummaryById } from '@/models/response/report/daily-summary/DailySummaryRes'
import DailySummaryProvider, { type IDailySummaryProvider } from '@/resources/provider/report/DailySummary.provider'
import DailySummaryDetailPrint from '../components/DailySummaryDetailPrint.vue'

const route = useRoute()
const DailySummaryService: IDailySummaryProvider = new DailySummaryProvider()

const itemData = ref<IDailySummaryById>()

async function fetchOne (): Promise<void> {
  const id = Number(route.params.id)
  const response = await DailySummaryService.getDailySummaryById(id)
  itemData.value = response?.data
}

onMounted(async (): Promise<void> => {
  await handleLoading(fetchOne)
  await window.print()
})
</script>

<style scoped></style>
