<template>
  <section id="profit-based-on-actual-payment-print-page">
    <ProfitBasedOnActualPaymentPrint
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
  IProfitBasedOnActualPaymentList,
  IProfitBasedOnActualPaymentSummary
} from '@/models/response/report/profit-based-on-actual-payment/ProfitBasedOnActualPaymentRes.model'
import ProfitBasedOnActualPaymentProvider, { type IProfitBasedOnActualPaymentProvider } from '@/resources/provider/report/ProfitBasedOnActualPayment.provider'
import ProfitBasedOnActualPaymentPrint from '../components/ProfitBasedOnActualPaymentPrint.vue'

const route = useRoute()
const ProfitBasedOnActualPaymentService: IProfitBasedOnActualPaymentProvider = new ProfitBasedOnActualPaymentProvider()

const items = ref<IProfitBasedOnActualPaymentList[]>([])
const summary = ref<IProfitBasedOnActualPaymentSummary>({
  allPrincipal: 0,
  allInterest: 0,
  receiveInstallmentAmount: 0,
  principal: 0,
  interest: 0
})

async function fetchAll (): Promise<void> {
  const response = await ProfitBasedOnActualPaymentService.getProfitBasedOnActualPaymentPaginate({
    limit: 9999,
    search: route.query.search as string || undefined,
    branchId: route.query.branchId as string || undefined,
    startDate: route.query.startDate as string || undefined,
    endDate: route.query.endDate as string || undefined
  })
  items.value = response?.data || []
  summary.value = {
    allPrincipal: response?.summary?.allPrincipal || 0,
    allInterest: response?.summary?.allInterest || 0,
    receiveInstallmentAmount: response?.summary?.receiveInstallmentAmount || 0,
    principal: response?.summary?.principal || 0,
    interest: response?.summary?.interest || 0
  }
}

onMounted(async (): Promise<void> => {
  await handleLoading(fetchAll)
  await window.print()
})
</script>

<style scoped></style>
