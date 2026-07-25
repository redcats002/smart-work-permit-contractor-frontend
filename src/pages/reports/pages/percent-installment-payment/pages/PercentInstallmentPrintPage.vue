<template>
  <section id="percent-installment-print-page">
    <PercentInstallmentPrint
      id="print-area"
      :items="items"
      :summary="summary" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IPercentInstallmentList, IPercentInstallmentSummary } from '@/models/response/report/percent-installment/PercentInstallmentRes.model'
import PercentInstallmentPaymentProvider, { type IPercentInstallmentPaymentProvider } from '@/resources/provider/report/PercentInstallmentPayment.provider'
import PercentInstallmentPrint from '../components/PercentInstallmentPrint.vue'

const route = useRoute()
const PercentInstallmentPaymentService: IPercentInstallmentPaymentProvider = new PercentInstallmentPaymentProvider()

const items = ref<IPercentInstallmentList[]>([])
const summary = ref<IPercentInstallmentSummary>({
  monthlyInstallment: 0,
  amountPaid: 0,
  salePrice: 0,
  totalPenaltyFee: 0,
  totalCollectionFee: 0,
  summary: 0,
  percent: 0
})

async function fetchAll (): Promise<void> {
  const response = await PercentInstallmentPaymentService.getPercentInstallmentPaymentPaginate({
    limit: 9999,
    search: route.query.search as string || undefined,
    branchId: route.query.branchId ? Number(route.query.branchId) : undefined
  })
  items.value = response?.data || []
  summary.value = {
    monthlyInstallment: response?.summary?.monthlyInstallment || 0,
    amountPaid: response?.summary?.amountPaid || 0,
    salePrice: response?.summary?.salePrice || 0,
    totalPenaltyFee: response?.summary?.totalPenaltyFee || 0,
    totalCollectionFee: response?.summary?.totalCollectionFee || 0,
    summary: response?.summary?.summary || 0,
    percent: response?.summary?.percent || 0
  }
}

onMounted(async (): Promise<void> => {
  await handleLoading(fetchAll)
  await window.print()
})
</script>

<style scoped></style>
