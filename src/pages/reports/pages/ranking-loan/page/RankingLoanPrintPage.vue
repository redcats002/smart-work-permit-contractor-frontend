<template>
  <section id="ranking-loan-print-page">
    <RankingLoanPrint
      id="print-area"
      :items="items"
      :type="type" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IRankLoanItem } from '@/models/response/report/rank-loan/RankLoanRes.model'
import RankingLoanProvider, { type IRankingLoanProvider } from '@/resources/provider/report/RankingLoan.provider'
import RankingLoanPrint from '../components/RankingLoanPrint.vue'

const route = useRoute()
const RankingLoanService: IRankingLoanProvider = new RankingLoanProvider()

const items = ref<IRankLoanItem[]>([])
const type = ref<string>((route.query.type as string) || 'RECEIPT_AMOUNT')

async function fetchAll (): Promise<void> {
  const response = await RankingLoanService.getRankingLoanList({
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
