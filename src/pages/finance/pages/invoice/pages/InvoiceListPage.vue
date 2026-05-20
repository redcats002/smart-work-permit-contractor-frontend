<template>
  <section id="invoice-list-page">
    <PageTitle />
    <BasePage>
      <div class="mb-4">
        <SearchInput
          v-model="search"
          @search="onSearch()" />
      </div>
      <InvoiceTable
        v-model:pagination="pagination"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
        :items="items"
        @update="fetch()" />
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BasePage from '@/components/base/BasePage.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import InvoiceTable from '../components/InvoiceTable.vue'
import useList from '../composables/useList'

const { items, pagination, sortBy, sortOrder, search, fetch, onSearch } = useList()

onMounted((): void => {
  fetch()
})
</script>
