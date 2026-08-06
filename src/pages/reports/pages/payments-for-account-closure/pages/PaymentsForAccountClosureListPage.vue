<template>
  <section id="percent-installment-list-page">
    <PageTitle />
    <BackButton />
    <BasePage>
      <PaymentsForAccountClosureFilter
        v-model="search"
        v-model:filters="filters"
        @clear="onClearFilters()"
        @search="onSearch()">
        <PrintButton
          icon="material-symbols:print-outline-rounded"
          label="พิมพ์"
          @click="onPrint()" />
      </PaymentsForAccountClosureFilter>
      <div>
        <PaymentsForAccountClosureTable
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
import { useRouter } from 'vue-router'
import BasePage from '@/components/base/BasePage.vue'
import BackButton from '@/components/button/BackButton.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import PaymentsForAccountClosureFilter from '../components/PaymentsForAccountClosureFilter.vue'
import PaymentsForAccountClosureTable from '../components/PaymentsForAccountClosureTable.vue'
import useList from '../composables/useList.ts'

const router = useRouter()
const {
  items,
  filters,
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
    name: 'PaymentsForAccountClosurePrintPage',
    query: {
      search: search.value || undefined,
      receiptType: filters.value.receiptType || undefined,
      assetType: filters.value.assetType || undefined
    }
  })
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped></style>
