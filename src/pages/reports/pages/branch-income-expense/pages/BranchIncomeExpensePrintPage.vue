<template>
  <section id="branch-income-expense-print-page">
    <BranchIncomeExpensePrint
      id="print-area"
      :finance-category="financeCategory"
      :items="filteredItems"
      :report-type="reportType" />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBranchIncomeExpenseCategoryFilter } from '@/models/modules/report/branch-income-expense/Filter.model'
import type { IBranchIncomeExpenseItem } from '@/models/response/report/branch-income-expense/BranchIncomeExpenseRes.model'
import { REPORT_TYPE_COL1_TYPES, REPORT_TYPE_COL2_TYPES, ReportTypeEnum, type TReportType } from '@/enums/modules/report/branch-income-expense/ReportType.enum'
import BranchIncomeExpenseProvider, { type IBranchIncomeExpenseProvider } from '@/resources/provider/report/BranchIncomeExpense.provider'
import BranchIncomeExpensePrint from '../components/BranchIncomeExpensePrint.vue'

const route = useRoute()
const BranchIncomeExpenseService: IBranchIncomeExpenseProvider = new BranchIncomeExpenseProvider()

const items = ref<IBranchIncomeExpenseItem[]>([])
const reportType = ref<TReportType>((route.query.filter as TReportType) || ReportTypeEnum.RECEIVE_REFUND)
const financeCategory = ref<TBranchIncomeExpenseCategoryFilter>((route.query.financeCategory as TBranchIncomeExpenseCategoryFilter) || 'OVERALL')

const filteredItems = computed((): IBranchIncomeExpenseItem[] => {
  if (financeCategory.value === 'OVERALL') return items.value
  const types = financeCategory.value === 'COL1' ? REPORT_TYPE_COL1_TYPES[reportType.value] : REPORT_TYPE_COL2_TYPES[reportType.value]
  return items.value.filter((i: IBranchIncomeExpenseItem): boolean => types.includes(i.type))
})

async function fetchAll (): Promise<void> {
  const response = await BranchIncomeExpenseService.getBranchIncomeExpensePaginate({
    limit: 9999,
    filter: reportType.value
  })
  items.value = response?.data || []
}

onMounted(async (): Promise<void> => {
  await handleLoading(fetchAll)
  await window.print()
})
</script>

<style scoped></style>
