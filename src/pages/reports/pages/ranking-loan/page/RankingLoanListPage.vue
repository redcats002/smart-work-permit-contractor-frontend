<template>
  <section id="ranking-loan-list-page">
    <PageTitle />
    <BackButton />
    <BasePage>
      <RankingLoanFilter
        v-model:filters="filters"
        @clear="onClearFilters()"
        @search="onSearch()">
        <PrintButton
          icon="material-symbols:print-outline-rounded"
          label="พิมพ์" />
      </RankingLoanFilter>
      <div class="mt-5">
        <RankingLoanTable
          :items="items"
          :type="filters.type" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BasePage from '@/components/base/BasePage.vue'
import BackButton from '@/components/button/BackButton.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import RankingLoanFilter from '../components/RankingLoanFilter.vue'
import RankingLoanTable from '../components/RankingLoanTable.vue'
import useList from '../composables/useList'

const { filters, items, fetch, onClearFilters, onSearch } = useList()

onMounted((): void => {
  fetch()
})
</script>

<style scoped></style>
