<template>
  <section id="branch-income-expense-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
    </BaseTop>
    <BaseTab
      :items="tabItems"
      :model-value="tab"
      full
      @update:model-value="onTabChange($event)" />
    <BasePage>
      <BranchIncomeExpenseFilter
        v-model:filters="filters"
        v-model:search="search"
        :report-type="filters.filter"
        @clear="onClearFilters()"
        @search="onSearch()">
        <Spacer />
        <PrintButton
          icon="material-symbols:print-outline-rounded"
          label="พิมพ์" />
      </BranchIncomeExpenseFilter>
      <BranchIncomeExpenseTable
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
        :finance-category="filters.financeCategory"
        :items="filteredItems"
        :report-type="filters.filter"
        :summary="summary"
        @update="fetch()" />
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ReportTypeEnum, type TReportType } from '@/enums/modules/report/branch-income-expense/ReportType.enum'
import BasePage from '@/components/base/BasePage.vue'
import type { ITabItem } from '@/components/base/BaseTab.vue'
import BaseTab from '@/components/base/BaseTab.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import BranchIncomeExpenseFilter from '../components/BranchIncomeExpenseFilter.vue'
import BranchIncomeExpenseTable from '../components/BranchIncomeExpenseTable.vue'
import useList from '../composables/useList'

const route = useRoute()

const {
  filters,
  filteredItems,
  summary,
  sortBy,
  sortOrder,
  search,
  fetch,
  onClearFilters,
  onSearch
} = useList()

const tabItems: ITabItem[] = [
  { label: 'รับทุน-คืนทุน', value: ReportTypeEnum.RECEIVE_REFUND },
  { label: 'เพิ่มทุน-ชำระทุน', value: ReportTypeEnum.INCREASE_PAYMENT },
  { label: 'รับทุน-จ่ายทุน (ศูนย์การเงิน)', value: ReportTypeEnum.FUND_IN_FUND_OUT }
]

function getInitialTab (): TReportType {
  const q = route.query.tab as TReportType | undefined
  const initial = q && Object.values(ReportTypeEnum).includes(q as ReportTypeEnum) ? q : ReportTypeEnum.RECEIVE_REFUND
  filters.value.filter = initial
  return initial
}

const tab = ref<TReportType>(getInitialTab())

function onTabChange (value: string): void {
  tab.value = value as TReportType
  filters.value.filter = value as TReportType
  filters.value.financeCategory = 'OVERALL'
  onSearch()
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped></style>
