<template>
  <section id="percent-installment-list-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
    </BaseTop>
    <PercentInstallmentFilter
      v-model="search"
      v-model:filters="filters"
      @clear="onClearFilters()"
      @search="onSearch()">
      <Spacer />
      <PrintButton
        icon="material-symbols:print-outline-rounded"
        label="พิมพ์"
        @click="onPrint()" />
    </PercentInstallmentFilter>
    <BasePage>
      <PercentInstallmentTable
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
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import PercentInstallmentFilter from '../components/PercentInstallmentFilter.vue'
import PercentInstallmentTable from '../components/PercentInstallmentTable.vue'
import useList from '../composables/useList'

const router = useRouter()
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
    name: 'PercentInstallmentPrintPage',
    query: {
      search: search.value || undefined,
      branchId: filters.value.branchId || undefined
    }
  })
}

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
