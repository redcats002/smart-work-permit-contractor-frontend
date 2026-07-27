<template>
  <section id="ranking-lending-print-page">
    <RankingLendingPrint
      id="print-area"
      :items="items" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IRankLendingItem } from '@/models/response/report/rank-lending/RankLendingRes.model'
import RankingLendingProvider, { type IRankingLendingProvider } from '@/resources/provider/report/RankingLending.provider'
import RankingLendingPrint from '../components/RankingLendingPrint.vue'

const route = useRoute()
const RankingLendingService: IRankingLendingProvider = new RankingLendingProvider()

const items = ref<IRankLendingItem[]>([])

async function fetchAll (): Promise<void> {
  const response = await RankingLendingService.getRankingLendingList({
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
