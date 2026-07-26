<template>
  <section id="comparative-print-page">
    <ComparativePrint
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
  ICurrentComparativeAccountList,
  ICurrentComparativeAccountSummary
} from '@/models/response/report/current-comparative-account/CurrentComparativeAccountRes.model'
import CurrentComparativeAccountProvider, {
  type ICurrentComparativeAccountProvider
} from '@/resources/provider/report/CurrentComparativeAccount.provider'
import ComparativePrint from '../components/ComparativePrint.vue'

const route = useRoute()
const CurrentComparativeAccountService: ICurrentComparativeAccountProvider = new CurrentComparativeAccountProvider()

const items = ref<ICurrentComparativeAccountList[]>([])
const summary = ref<ICurrentComparativeAccountSummary>()

async function fetchAll (): Promise<void> {
  const response = await CurrentComparativeAccountService.getCurrentComparativeAccountPaginate({
    limit: 9999,
    search: route.query.search as string || undefined,
    branchId: route.query.branchId ? Number(route.query.branchId) : undefined,
    date: route.query.date as string || undefined
  })
  items.value = response?.data || []
  summary.value = {
    numberOfBranches: response?.count || 0,
    contractAmount: response?.summary?.contractAmount || 0,
    principal: response?.summary?.principal || 0,
    principalAndInterest: response?.summary?.principalAndInterest || 0,
    amountPaid: response?.summary?.amountPaid || 0,
    settlementDiscount: response?.summary?.settlementDiscount || 0,
    remainingAmount: response?.summary?.remainingAmount || 0
  }
}

onMounted(async (): Promise<void> => {
  await handleLoading(fetchAll)
  await window.print()
})
</script>

<style scoped></style>
