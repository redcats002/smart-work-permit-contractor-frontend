<template>
  <section id="daily-loan-disbursement-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
    </BaseTop>
    <AnnualFinanceReceiptFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="onSearch()">
      <Spacer />
      <PrintButton
        icon="material-symbols:print-outline-rounded"
        label="พิมพ์"
        @click="onPrint()" />
    </AnnualFinanceReceiptFilter>
    <BasePage>
      <AnnualFinanceReceiptTable
        v-model:pagination="pagination"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
        :items="items"
        :summary="summary"
        @update="fetch()" />
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDayjs } from '@/utils/Dayjs'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import AnnualFinanceReceiptFilter from '../components/AnnualFinanceReceiptFilter.vue'
import AnnualFinanceReceiptTable from '../components/AnnualFinanceReceiptTable.vue'
import useList from '../composables/useList'

const router = useRouter()
const dayjs = useDayjs()

const {
  filters,
  items,
  summary,
  pagination,
  sortBy,
  sortOrder,
  search,
  fetch,
  onClearFilters,
  onSearch
} = useList()

function onPrint (): void {
  router.push({
    name: 'AnnualFinanceReceiptPrintPage',
    query: {
      branchId: filters.value.branchId || undefined,
      year: filters.value.year ? dayjs(filters.value.year).format('YYYY') : undefined
    }
  })
}

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
