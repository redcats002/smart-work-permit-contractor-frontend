<template>
  <section id="payments-for-account-closure-print-page">
    <PaymentsForAccountClosurePrint
      id="print-area"
      :items="items" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IAccountClosureList } from '@/models/response/report/account-closure/AccountClosureRes.model'
import DebtCollectionPaymentClosureProvider, {
  type IDebtCollectionPaymentClosureProvider
} from '@/resources/provider/report/DebtCollectionPaymentClosure.provider'
import PaymentsForAccountClosurePrint from '../components/PaymentsForAccountClosurePrint.vue'

const route = useRoute()
const DebtCollectionPaymentClosureService: IDebtCollectionPaymentClosureProvider = new DebtCollectionPaymentClosureProvider()

const items = ref<IAccountClosureList[]>([])

async function fetchAll (): Promise<void> {
  const response = await DebtCollectionPaymentClosureService.getDebtCollectionPaymentClosurePaginate({
    limit: 9999,
    search: route.query.search as string || undefined,
    receiptType: route.query.receiptType as any || undefined,
    assetType: route.query.assetType as any || undefined
  })
  items.value = response?.data || []
}

onMounted(async (): Promise<void> => {
  await handleLoading(fetchAll)
  await window.print()
})
</script>

<style scoped></style>
