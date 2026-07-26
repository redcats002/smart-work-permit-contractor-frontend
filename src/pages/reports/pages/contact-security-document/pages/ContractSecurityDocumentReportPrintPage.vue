<template>
  <section id="contract-security-document-report-print-page">
    <ContractSecurityDocumentReportPrint
      id="print-area"
      :items="items" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IContractSecurityDocumentReportList } from '@/models/response/report/contract-security-document/ContractSecurityDocumentRes.model'
import ContractSecurityDocumentProvider, { type IContractSecurityDocumentProvider } from '@/resources/provider/report/ContractSecurityDocument.provider'
import ContractSecurityDocumentReportPrint from '../components/ContractSecurityDocumentReportPrint.vue'

const route = useRoute()
const ContractSecurityDocumentService: IContractSecurityDocumentProvider = new ContractSecurityDocumentProvider()

const items = ref<IContractSecurityDocumentReportList[]>([])

async function fetchAll (): Promise<void> {
  const response = await ContractSecurityDocumentService.getContractSecurityDocumentPaginate({
    limit: 9999,
    branchId: route.query.branchId ? Number(route.query.branchId) : undefined,
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
