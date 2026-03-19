<template>
  <section id="percent-installment-list-page">
    <PageTitle />
    <BackButton />
    <BasePage>
      <RankingLendingFilter
        v-model:search="search"
        @clear="onClearFilters()"
        @search="fetch()">
        <PrintButton
          icon="material-symbols:print-outline-rounded"
          label="พิมพ์" />
      </RankingLendingFilter>
      <div class="mt-5">
        <RankingLendingTable
          v-model:pagination="pagination"
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          :items="items"
          @update="fetch()" />
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

const {
  items,
  pagination,
  sortBy,
  sortOrder,
  search,
  fetch,
  onClearFilters
} = useList()

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
