<template>
  <A4Paper>
    <DebtorPrintDocument
      :filters="filters"
      :generated-at="generatedAt"
      :items="items"
      :summary="summary"
      title="รายงานลูกหนี้ทั้งหมด" />
  </A4Paper>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { IOutstandingDebtorFilter } from '@/models/modules/report/outstanding-debtor/Filter.model'
import A4Paper from '@/components/paper/A4Paper.vue'
import usePrint from '@/composables/usePrint'
import DebtorPrintDocument from '@/pages/reports/pages/outstanding-debtor/components/DebtorPrintDocument.vue'
import { useAllDebtorPrint } from '@/pages/reports/pages/outstanding-debtor/composables/useList'

const route = useRoute()
// ponytail: see OutstandingDebtorPrintPage.vue — query params serialize fine as-is.
const filters = route.query as unknown as IOutstandingDebtorFilter
const generatedAt = new Date().toISOString()

const { items, summary, fetch } = useAllDebtorPrint()

usePrint({ print: true, init: (): Promise<void> => fetch(filters) })
</script>
