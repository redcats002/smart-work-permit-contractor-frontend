<template>
  <section id="ranking-lending-list-page">
    <PageTitle />
    <BackButton />
    <BasePage>
      <RankingLendingFilter
        v-model:filters="filters"
        @clear="onClearFilters()"
        @search="onSearch()">
        <PrintButton
          icon="material-symbols:print-outline-rounded"
          label="พิมพ์"
          @click="onPrint()" />
      </RankingLendingFilter>
      <div>
        <RankingLendingTable :items="items" />
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
import RankingLendingFilter from '../components/RankingLendingFilter.vue'
import RankingLendingTable from '../components/RankingLendingTable.vue'
import useList from '../composables/useList'

const { filters, items, fetch, onClearFilters, onSearch, onPrint } = useList()

onMounted((): void => {
  fetch()
})
</script>

<style scoped></style>
