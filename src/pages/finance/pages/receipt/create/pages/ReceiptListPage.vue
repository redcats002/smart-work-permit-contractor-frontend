<template>
  <section id="invoice-list-page">
    <PageTitle />
    <BasePage>
      <div class="mb-4">
        <SearchInput
          v-model="search"
          @search="fetch()" />
      </div>
      <ReceiptTable
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
import ReceiptTable from '../components/ReceiptTable.vue'
import useList from '../composables/useList'

const { items, pagination, sortBy, sortOrder, search, fetch } = useList()

onMounted((): void => {
  fetch()
})
</script>
