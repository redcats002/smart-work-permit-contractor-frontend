<template>
  <section id="daily-installment-payment-print-page">
    <DailyInstallmentPaymentPrint
      id="print-area"
      :items="items"
      :summary="summary" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IDailyInstallmentPaymentList, IDailyInstallmentPaymentSummary } from '@/models/response/report/daily-installment-payment/DailyInstallmentPaymentRes'
import DailyInstallmentPaymentProvider, { type IDailyInstallmentPaymentProvider } from '@/resources/provider/report/DailyInstallmentPayment.provider'
import DailyInstallmentPaymentPrint from '../components/DailyInstallmentPaymentPrint.vue'

const route = useRoute()
const DailyInstallmentPaymentService: IDailyInstallmentPaymentProvider = new DailyInstallmentPaymentProvider()

const items = ref<IDailyInstallmentPaymentList[]>([])
const summary = ref<IDailyInstallmentPaymentSummary>()

async function fetchAll (): Promise<void> {
  const response = await DailyInstallmentPaymentService.getDailyInstallmentPaymentPaginate({
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
