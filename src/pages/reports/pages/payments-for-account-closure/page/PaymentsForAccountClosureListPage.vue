<template>
  <section id="percent-installment-list-page">
    <PageTitle />
    <BackButton />
    <BasePage>
      <PaymentsForAccountClosureFilter
        v-model:search="search"
        @clear="onClearFilters()"
        @search="onSearch()">
        <PrintButton
          icon="material-symbols:print-outline-rounded"
          label="พิมพ์" />
      </PaymentsForAccountClosureFilter>
      <div class="mt-5">
        <div class="font-bold mb-5">
          ปิดบัญชีก่อนกำหนด
        </div>
        <PaymentsForAccountClosureTable
          v-model:pagination="pagination"
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          :items="items"
          @update="fetch()" />
      </div>

      <div class="mt-5">
        <div class="font-bold mb-5">
          ปิดปรับ (รีไฟแนนซ์)
        </div>
        <PaymentsForAccountClosureTable
          v-model:pagination="pagination"
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          :items="itemsFinance"
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
import PaymentsForAccountClosureFilter from '../components/PaymentsForAccountClosureFilter.vue'
import PaymentsForAccountClosureTable from '../components/PaymentsForAccountClosureTable.vue'
import useList from '../composables/useList'

const {
  items,
  itemsFinance,
  pagination,
  sortBy,
  sortOrder,
  search,
  fetch,
  onClearFilters,
  onSearch
} = useList()

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
