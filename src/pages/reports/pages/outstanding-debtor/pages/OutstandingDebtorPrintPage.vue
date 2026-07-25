<template>
  <A4Paper>
    <DebtorPrintDocument
      :filters="filters"
      :generated-at="generatedAt"
      :items="items"
      :summary="summary"
      title="รายงานลูกหนี้คงเหลือ" />
  </A4Paper>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { IOutstandingDebtorFilter } from '@/models/modules/report/outstanding-debtor/Filter.model'
import A4Paper from '@/components/paper/A4Paper.vue'
import usePrint from '@/composables/usePrint'
import DebtorPrintDocument from '../components/DebtorPrintDocument.vue'
import { useOutstandingDebtorPrint } from '../composables/useList'

const route = useRoute()
// ponytail: axios sends query params as plain strings regardless of declared type, so
// route.query (already the exact filter shape synced by the list page) can be cast
// straight through instead of parsing each field back to its declared type.
const filters = route.query as unknown as IOutstandingDebtorFilter
const generatedAt = new Date().toISOString()

const { items, summary, fetch } = useOutstandingDebtorPrint()

usePrint({ print: true, init: (): Promise<void> => fetch(filters) })
</script>
