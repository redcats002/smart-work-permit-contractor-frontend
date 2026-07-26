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
          label="พิมพ์"
          @click="onPrint()" />
      </RankingLoanFilter>
      <div>
        <RankingLoanTable
          :items="items"
          :type="filters.type" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BasePage from '@/components/base/BasePage.vue'
import BackButton from '@/components/button/BackButton.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import RankingLoanFilter from '../components/RankingLoanFilter.vue'
import RankingLoanTable from '../components/RankingLoanTable.vue'
import useList from '../composables/useList'

const router = useRouter()
const { filters, items, fetch, onClearFilters, onSearch } = useList()

function onPrint (): void {
  router.push({
    name: 'RankingLoanPrintPage',
    query: {
      startDate: filters.value.startDate || undefined,
      endDate: filters.value.endDate || undefined,
      type: filters.value.type || undefined
    }
  })
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped></style>
