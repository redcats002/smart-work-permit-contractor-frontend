<template>
  <section id="success-debtor-print-page">
    <SuccessDebtorPrint
      id="print-area"
      :items="items"
      :summary="summary" />
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IOutstandingDebtorFilter } from '@/models/modules/report/outstanding-debtor/Filter.model'
import { useSuccessDebtorPrint } from '@/pages/reports/pages/outstanding-debtor/composables/useList'
import SuccessDebtorPrint from '../components/SuccessDebtorPrint.vue'

const route = useRoute()
// ponytail: axios sends query params as plain strings regardless of declared type, so
// route.query (already the exact filter shape synced by the list page) can be cast
// straight through instead of parsing each field back to its declared type.
const filters = route.query as unknown as IOutstandingDebtorFilter

const { items, summary, fetch } = useSuccessDebtorPrint()

onMounted(async (): Promise<void> => {
  await handleLoading((): Promise<void> => fetch(filters))
  await window.print()
})
</script>

<style scoped></style>
